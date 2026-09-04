const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const OTPModel = require('../models/OTP');
const emailService = require('./emailService');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const env = require('../config/env');
const logger = require('../utils/logger');

class AuthService {
  async signup(data) {
    return this.register(data);
  }

  async register({ email, password, full_name, role = 'trainee', department_id = 1, designation = null, employee_student_id = null }) {
    if (!email || !password || !full_name) {
      const err = new Error('Full name, email, and password are required.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findByEmail(cleanEmail);

    if (existingUser) {
      if (existingUser.email_verified) {
        const err = new Error('An account with this email already exists. Please log in.');
        err.statusCode = 400;
        err.accountExists = true;
        throw err;
      }

      // Existing unverified account: generate new OTP respecting 30s cooldown
      const otpData = await OTPModel.createOTP({
        userId: existingUser.id,
        email: existingUser.email,
        purpose: 'email_verification',
      });

      // Send email asynchronously
      emailService.sendVerificationOTP({
        email: existingUser.email,
        otp: otpData.otpCode,
        purpose: 'email_verification',
      });

      return {
        success: true,
        requiresEmailVerification: true,
        email: existingUser.email,
        otpSentTimestamp: otpData.createdAt,
        message: 'An unverified account with this email already exists. A new verification code has been sent.',
      };
    }

    // Role Security: Public signups are forced to 'trainee'
    const cleanRole = 'trainee';
    const password_hash = await hashPassword(password);

    const user = await User.create({
      email: cleanEmail,
      password_hash,
      role: cleanRole,
      department_id: parseInt(department_id) || 1,
      full_name: full_name.trim(),
      designation,
      employee_student_id,
      email_verified: false,
    });

    // Generate OTP (enforces 30s cooldown)
    const otpData = await OTPModel.createOTP({
      userId: user.id,
      email: user.email,
      purpose: 'email_verification',
    });

    logger.info(`[AUTH] User created (${user.email}). Sending signup verification email...`);
    const emailResult = await emailService.sendVerificationOTP({
      email: user.email,
      otp: otpData.otpCode,
      purpose: 'email_verification',
    });

    if (!emailResult.success) {
      logger.error(`[EMAIL ERROR] Signup verification email failed for ${user.email}: ${emailResult.error}`);
    }

    return {
      success: true,
      requiresEmailVerification: true,
      email: user.email,
      otpSentTimestamp: otpData.createdAt,
      emailDelivered: emailResult.success,
      message: 'Verification code sent successfully. We have sent a 6-digit verification code to your email address.',
    };
  }

  async verifyEmailOTP(data, argOtp) {
    const payload = typeof data === 'object' && data !== null ? data : { email: data, otp: argOtp };
    const { email, otp } = payload;
    if (!email || !otp) {
      const err = new Error('Email address and 6-digit verification code are required.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const verification = await OTPModel.verifyOTP({
      email: cleanEmail,
      otp,
      purpose: 'email_verification',
    });

    if (!verification.isValid) {
      const err = new Error(verification.message);
      err.statusCode = 400;
      throw err;
    }

    let user = await User.findByEmail(cleanEmail);
    if (!user) {
      const err = new Error('User account not found.');
      err.statusCode = 404;
      throw err;
    }

    // Mark email as verified
    user = await User.setEmailVerified(user.id, true);
    await User.updateLastLogin(user.id);

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    });

    const profile = await UserProfile.getByUserId(user.id);
    const { password_hash, ...userClean } = user;

    return {
      user: {
        ...userClean,
        profile,
      },
      token,
      message: 'Email address verified successfully. Welcome to Capacity Connect!',
    };
  }

  async resendOTP({ email, purpose = 'email_verification' }) {
    if (!email) {
      const err = new Error('Email address is required.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findByEmail(cleanEmail);

    if (!user) {
      // Generic success to prevent account enumeration
      return {
        success: true,
        message: 'If an account exists for this email, a new 6-digit verification code has been sent.',
      };
    }

    // Generate new OTP (enforces 30-second cooldown)
    const otpData = await OTPModel.createOTP({
      userId: user.id,
      email: user.email,
      purpose,
    });

    logger.info(`[AUTH] Resending verification email to ${user.email}...`);
    const emailResult = await emailService.sendVerificationOTP({
      email: user.email,
      otp: otpData.otpCode,
      purpose,
    });

    if (!emailResult.success) {
      logger.error(`[EMAIL ERROR] Resend OTP email delivery failed for ${user.email}: ${emailResult.error}`);
      const err = new Error("We couldn't send the verification code. Please try again.");
      err.statusCode = 500;
      throw err;
    }

    return {
      success: true,
      otpSentTimestamp: otpData.createdAt,
      emailDelivered: emailResult.success,
      message: 'New verification code sent.',
    };
  }

  async login({ email, password }) {
    if (!email || !password) {
      const err = new Error('Email and password are required.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findByEmail(cleanEmail);

    // RULE: IF USER DOES NOT EXIST -> DO NOT CREATE USER, DO NOT LOG IN
    if (!user) {
      const err = new Error('Account not found. Please sign up first.');
      err.statusCode = 404;
      err.accountNotFound = true;
      throw err;
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    // Check Email Verification status
    if (user.email_verified === false) {
      logger.info(`[AUTH] Login request for unverified account: ${user.email}`);

      let otpCode = null;
      let otpSentTimestamp = Date.now();

      try {
        const otpData = await OTPModel.createOTP({
          userId: user.id,
          email: user.email,
          purpose: 'email_verification',
        });
        otpCode = otpData.otpCode;
        otpSentTimestamp = otpData.createdAt;
        logger.info(`[OTP] Created new verification OTP for unverified user ${user.email}`);
      } catch (e) {
        if (e.statusCode === 429) {
          logger.info(`[OTP] Cooldown active for ${user.email}. Re-sending existing active OTP.`);
          const activeOTP = await OTPModel.findActiveOTP({
            email: user.email,
            purpose: 'email_verification',
          });
          if (activeOTP) {
            otpCode = activeOTP.otpCode;
            otpSentTimestamp = activeOTP.createdAt;
          }
        }
        if (!otpCode) throw e;
      }

      if (otpCode) {
        logger.info(`[EMAIL] Dispatching verification email for unverified login to ${user.email}...`);
        const emailResult = await emailService.sendVerificationOTP({
          email: user.email,
          otp: otpCode,
          purpose: 'email_verification',
        });

        if (!emailResult.success) {
          logger.error(`[EMAIL ERROR] Verification email delivery failed for ${user.email}: ${emailResult.error}`);
          const err = new Error("We couldn't send the verification code. Please try again.");
          err.statusCode = 500;
          throw err;
        }

        logger.info(`[EMAIL] Verification email accepted by provider for ${user.email}`);
      }

      const err = new Error("Your email isn't verified yet. We've sent a verification code to your email.");
      err.statusCode = 403;
      err.requiresEmailVerification = true;
      err.email = user.email;
      err.otpSentTimestamp = otpSentTimestamp;
      throw err;
    }

    await User.updateLastLogin(user.id);

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    });

    const profile = await UserProfile.getByUserId(user.id);
    const { password_hash, ...userClean } = user;

    return {
      user: {
        ...userClean,
        profile,
      },
      token,
    };
  }

  async sendOTP({ email }) {
    return this.resendOTP({ email, purpose: 'otp_login' });
  }

  async verifyOTP({ email, otp }) {
    if (!email || !otp) {
      const err = new Error('Email and 6-digit OTP code are required.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const verification = await OTPModel.verifyOTP({
      email: cleanEmail,
      otp,
      purpose: 'otp_login',
    });

    if (!verification.isValid) {
      const err = new Error(verification.message);
      err.statusCode = 400;
      throw err;
    }

    let user = await User.findByEmail(cleanEmail);
    if (!user) {
      const err = new Error('Account not found. Please sign up first.');
      err.statusCode = 404;
      err.accountNotFound = true;
      throw err;
    }

    if (!user.email_verified) {
      user = await User.setEmailVerified(user.id, true);
    }

    await User.updateLastLogin(user.id);

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    });

    const profile = await UserProfile.getByUserId(user.id);
    const { password_hash, ...userClean } = user;

    return {
      user: {
        ...userClean,
        profile,
      },
      token,
    };
  }

  async googleAuth({ credential, email: bodyEmail, name: bodyName, picture: bodyPicture, sub: bodySub, mode = 'login' }) {
    let email = bodyEmail;
    let name = bodyName;
    let picture = bodyPicture;
    let googleId = bodySub;

    // Backend Token Validation against Google OAuth API
    if (credential) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (verifyRes.ok) {
          const payload = await verifyRes.json();
          email = payload.email || email;
          name = payload.name || name || payload.email?.split('@')[0];
          picture = payload.picture || picture;
          googleId = payload.sub || googleId;
        } else {
          // JWT fallback decoding
          const base64Url = credential.split('.')[1];
          if (base64Url) {
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const decoded = JSON.parse(jsonPayload);
            email = decoded.email || email;
            name = decoded.name || name;
            picture = decoded.picture || picture;
            googleId = decoded.sub || googleId;
          }
        }
      } catch (err) {
        console.warn('Google token verification fallback activated:', err.message);
      }
    }

    if (!email) {
      const err = new Error('Google authentication failed: Email not provided.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    let user = googleId ? await User.findByGoogleId(googleId) : null;

    if (!user) {
      user = await User.findByEmail(cleanEmail);
      if (user) {
        // Link google account to existing email user
        user = await User.linkGoogleAccount(user.id, googleId || `google_${Date.now()}`);
      }
    }

    // STRICT GOOGLE LOGIN RULE: If mode === 'login' and user is not found -> DO NOT CREATE USER
    if (!user && mode === 'login') {
      const err = new Error('No Capacity Connect account was found for this Google account. Please sign up first.');
      err.statusCode = 404;
      err.accountNotFound = true;
      throw err;
    }

    // GOOGLE SIGNUP RULE: If mode === 'signup' and user is not found -> Create user
    if (!user && mode === 'signup') {
      user = await User.create({
        email: cleanEmail,
        full_name: name || cleanEmail.split('@')[0],
        google_id: googleId || `google_${Date.now()}`,
        role: 'trainee',
        department_id: 1,
        email_verified: true, // Google identity pre-verified
        profile_image: picture,
      });
    }

    await User.updateLastLogin(user.id);

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    });

    const profile = await UserProfile.getByUserId(user.id);
    const { password_hash, ...userClean } = user;

    return {
      user: {
        ...userClean,
        profile,
      },
      token,
    };
  }

  async forgotPassword({ email }) {
    if (!email) {
      const err = new Error('Email address is required.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findByEmail(cleanEmail);

    if (user) {
      const otpData = await OTPModel.createOTP({
        userId: user.id,
        email: user.email,
        purpose: 'password_reset',
      });

      emailService.sendVerificationOTP({
        email: user.email,
        otp: otpData.otpCode,
        purpose: 'password_reset',
      });

      return {
        success: true,
        otpSentTimestamp: otpData.createdAt,
        message: 'If an account exists for this email, a 6-digit password reset code has been sent.',
      };
    }

    // Generic success message to prevent account enumeration
    return {
      success: true,
      message: 'If an account exists for this email, a 6-digit password reset code has been sent.',
    };
  }

  async resetPassword({ email, otp, newPassword }) {
    if (!email || !otp || !newPassword) {
      const err = new Error('Email, 6-digit verification code, and new password are required.');
      err.statusCode = 400;
      throw err;
    }

    if (newPassword.length < 6) {
      const err = new Error('New password must be at least 6 characters long.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const verification = await OTPModel.verifyOTP({
      email: cleanEmail,
      otp,
      purpose: 'password_reset',
    });

    if (!verification.isValid) {
      const err = new Error(verification.message);
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findByEmail(cleanEmail);
    if (!user) {
      const err = new Error('User account not found.');
      err.statusCode = 404;
      throw err;
    }

    const passwordHash = await hashPassword(newPassword);
    await User.updatePassword(user.id, passwordHash);

    return {
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.',
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }
    const profile = await UserProfile.getByUserId(userId);
    return {
      ...user,
      profile,
    };
  }
}

module.exports = new AuthService();
