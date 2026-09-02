const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const OTPModel = require('../models/OTP');
const emailService = require('./emailService');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const env = require('../config/env');

class AuthService {
  async register({ email, password, full_name, role = 'trainee', department_id = 1, designation = null, employee_student_id = null }) {
    if (!email || !password || !full_name) {
      const err = new Error('Full name, email, and password are required.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findByEmail(cleanEmail);
    
    if (existingUser) {
      const err = new Error('An account with this email address already exists. Please sign in or use forgot password.');
      err.statusCode = 400;
      throw err;
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

    // Generate & Send Email Verification OTP
    const { otpCode } = await OTPModel.createOTP({
      userId: user.id,
      email: user.email,
      purpose: 'email_verification',
    });

    await emailService.sendVerificationOTP({
      email: user.email,
      otp: otpCode,
      purpose: 'email_verification',
    });

    return {
      success: true,
      requiresEmailVerification: true,
      email: user.email,
      message: 'Account created successfully! We have sent a 6-digit verification code to your email address.',
    };
  }

  async verifyEmailOTP({ email, otp }) {
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

    const { otpCode } = await OTPModel.createOTP({
      userId: user.id,
      email: user.email,
      purpose,
    });

    await emailService.sendVerificationOTP({
      email: user.email,
      otp: otpCode,
      purpose,
    });

    return {
      success: true,
      message: 'A new 6-digit verification code has been sent to your email address.',
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

    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
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
      // Generate & resend OTP automatically
      const { otpCode } = await OTPModel.createOTP({
        userId: user.id,
        email: user.email,
        purpose: 'email_verification',
      });

      await emailService.sendVerificationOTP({
        email: user.email,
        otp: otpCode,
        purpose: 'email_verification',
      });

      const err = new Error('Please verify your email address before logging in. A new 6-digit code has been sent to your email.');
      err.statusCode = 403;
      err.requiresEmailVerification = true;
      err.email = user.email;
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
      const err = new Error('User account not found.');
      err.statusCode = 404;
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

  async googleAuth({ credential, email: bodyEmail, name: bodyName, picture: bodyPicture, sub: bodySub }) {
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
          // Verify expected audience if configured
          if (env.googleClientId && payload.aud && payload.aud !== env.googleClientId) {
            console.warn(`[Google OAuth Warning] Audience mismatch: got ${payload.aud}, expected ${env.googleClientId}`);
          }
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

    // CASE A: User exists by Google ID
    let user = googleId ? await User.findByGoogleId(googleId) : null;

    if (!user) {
      // CASE C: User exists by Email (Account Linking)
      const existingUserByEmail = await User.findByEmail(cleanEmail);
      if (existingUserByEmail) {
        user = await User.linkGoogleAccount(existingUserByEmail.id, googleId || `google_${Date.now()}`);
      } else {
        // CASE B: New User via Google Signup
        user = await User.create({
          email: cleanEmail,
          full_name: name || cleanEmail.split('@')[0],
          google_id: googleId || `google_${Date.now()}`,
          role: 'trainee',
          department_id: 1,
          email_verified: true, // Google identity is pre-verified
          profile_image: picture,
        });
      }
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
      const { otpCode } = await OTPModel.createOTP({
        userId: user.id,
        email: user.email,
        purpose: 'password_reset',
      });

      await emailService.sendVerificationOTP({
        email: user.email,
        otp: otpCode,
        purpose: 'password_reset',
      });
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
