const crypto = require('crypto');
const db = require('../config/database');

class OTPModel {
  static hashOTP(code) {
    return crypto.createHash('sha256').update(String(code).trim()).digest('hex');
  }

  static async checkCooldown({ email, purpose = 'email_verification' }) {
    const cleanEmail = String(email).trim().toLowerCase();

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT created_at FROM email_verification_otps 
         WHERE LOWER(email) = LOWER($1) AND purpose = $2 
         ORDER BY id DESC LIMIT 1`,
        [cleanEmail, purpose]
      );
      const record = res.rows[0];
      if (!record) return { canResend: true, retryAfter: 0 };

      const elapsedSeconds = (Date.now() - new Date(record.created_at).getTime()) / 1000;
      if (elapsedSeconds < 30) {
        const retryAfter = Math.ceil(30 - elapsedSeconds);
        return {
          canResend: false,
          retryAfter,
          message: 'Please wait before requesting another code.',
        };
      }
      return { canResend: true, retryAfter: 0 };
    }

    if (!db.memoryStore.otps) db.memoryStore.otps = [];
    const record = db.memoryStore.otps
      .filter(o => o.email === cleanEmail && o.purpose === purpose)
      .pop();

    if (!record) return { canResend: true, retryAfter: 0 };

    const elapsedSeconds = (Date.now() - record.created_at) / 1000;
    if (elapsedSeconds < 30) {
      const retryAfter = Math.ceil(30 - elapsedSeconds);
      return {
        canResend: false,
        retryAfter,
        message: 'Please wait before requesting another code.',
      };
    }
    return { canResend: true, retryAfter: 0 };
  }

  static async createOTP({ userId = null, email, purpose = 'email_verification' }) {
    const cleanEmail = String(email).trim().toLowerCase();
    
    // Enforce 30-Second Backend Resend Cooldown
    const cooldownCheck = await this.checkCooldown({ email: cleanEmail, purpose });
    if (!cooldownCheck.canResend) {
      const err = new Error(cooldownCheck.message);
      err.statusCode = 429;
      err.retryAfter = cooldownCheck.retryAfter;
      throw err;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = this.hashOTP(otpCode);
    const createdAt = new Date();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (db.getIsPgConnected()) {
      // Invalidate previous active OTPs for this email and purpose
      await db.query(
        'DELETE FROM email_verification_otps WHERE LOWER(email) = LOWER($1) AND purpose = $2',
        [cleanEmail, purpose]
      );

      await db.query(
        `INSERT INTO email_verification_otps (user_id, email, otp_hash, purpose, expires_at, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, cleanEmail, otpHash, purpose, expiresAt, createdAt]
      );
    } else {
      // Memory Store fallback for OTPs
      if (!db.memoryStore.otps) {
        db.memoryStore.otps = [];
      }

      // Remove existing active OTPs for this email & purpose
      db.memoryStore.otps = db.memoryStore.otps.filter(
        o => !(o.email === cleanEmail && o.purpose === purpose)
      );

      db.memoryStore.otps.push({
        id: db.memoryStore.otps.length + 1,
        user_id: userId,
        email: cleanEmail,
        otp_code: otpCode,
        otp_hash: otpHash,
        purpose,
        attempts: 0,
        expires_at: expiresAt.getTime(),
        created_at: createdAt.getTime(),
      });
    }

    return {
      otpCode,
      cleanEmail,
      createdAt: createdAt.getTime(),
      expiresAt: expiresAt.getTime(),
    };
  }

  static async verifyOTP({ email, otp, purpose = 'email_verification' }) {
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOTP = String(otp).trim();
    const inputHash = this.hashOTP(cleanOTP);

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT * FROM email_verification_otps 
         WHERE LOWER(email) = LOWER($1) AND purpose = $2 AND verified_at IS NULL
         ORDER BY id DESC LIMIT 1`,
        [cleanEmail, purpose]
      );

      const record = res.rows[0];
      if (!record) {
        return { isValid: false, message: 'No active verification code found. Please request a new one.' };
      }

      if (new Date() > new Date(record.expires_at)) {
        await db.query('DELETE FROM email_verification_otps WHERE id = $1', [record.id]);
        return { isValid: false, message: 'This verification code has expired. Please request a new one.' };
      }

      if (record.attempts >= 5) {
        await db.query('DELETE FROM email_verification_otps WHERE id = $1', [record.id]);
        return { isValid: false, message: 'Too many attempts. Please request a new verification code.' };
      }

      if (record.otp_hash !== inputHash) {
        await db.query('UPDATE email_verification_otps SET attempts = attempts + 1 WHERE id = $1', [record.id]);
        return { isValid: false, message: 'Invalid verification code. Please try again.' };
      }

      // Mark as verified and delete to ensure single-use
      await db.query('UPDATE email_verification_otps SET verified_at = CURRENT_TIMESTAMP WHERE id = $1', [record.id]);
      await db.query('DELETE FROM email_verification_otps WHERE id = $1', [record.id]);

      return { isValid: true, userId: record.user_id };
    }

    // Memory Store fallback matching
    if (!db.memoryStore.otps) db.memoryStore.otps = [];
    const index = db.memoryStore.otps.findIndex(
      o => o.email === cleanEmail && o.purpose === purpose && !o.verified_at
    );

    if (index === -1) {
      return { isValid: false, message: 'No active verification code found. Please request a new one.' };
    }

    const record = db.memoryStore.otps[index];
    if (Date.now() > record.expires_at) {
      db.memoryStore.otps.splice(index, 1);
      return { isValid: false, message: 'This verification code has expired. Please request a new one.' };
    }

    if (record.attempts >= 5) {
      db.memoryStore.otps.splice(index, 1);
      return { isValid: false, message: 'Too many attempts. Please request a new verification code.' };
    }

    if (record.otp_code !== cleanOTP && record.otp_hash !== inputHash) {
      record.attempts += 1;
      return { isValid: false, message: 'Invalid verification code. Please try again.' };
    }

    // Mark as verified & consume
    db.memoryStore.otps.splice(index, 1);
    return { isValid: true, userId: record.user_id };
  }
}

module.exports = OTPModel;
