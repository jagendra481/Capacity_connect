const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

// In-memory OTP datastore for 6-digit verification codes
const otpStore = new Map();

class AuthService {
  async register({ email, password, full_name, role = 'trainee', department_id = 1 }) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      const err = new Error('Email address is already registered.');
      err.statusCode = 400;
      throw err;
    }

    const password_hash = await hashPassword(password);
    const user = await User.create({
      email,
      password_hash,
      role,
      department_id: parseInt(department_id),
      full_name,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    });

    const profile = await UserProfile.getByUserId(user.id);

    return {
      user: {
        ...user,
        profile,
      },
      token,
    };
  }

  async login({ email, password }) {
    const user = await User.findByEmail(email);
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
    if (!email) {
      const err = new Error('Email address is required.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findByEmail(cleanEmail);
    if (!user) {
      const err = new Error('No account found with this email address. Please sign up first.');
      err.statusCode = 404;
      throw err;
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(cleanEmail, { code: otpCode, expiresAt });

    console.log(`\n========================================`);
    console.log(`[OTP SERVICE] Generated 6-Digit OTP for ${cleanEmail}: ${otpCode}`);
    console.log(`========================================\n`);

    return {
      success: true,
      message: `OTP sent successfully to ${cleanEmail}`,
      otpDemo: otpCode, // Demo convenience field for instant UI auto-fill or testing
      expiresMinutes: 10,
    };
  }

  async verifyOTP({ email, otp }) {
    if (!email || !otp) {
      const err = new Error('Email and 6-digit OTP code are required.');
      err.statusCode = 400;
      throw err;
    }

    const cleanEmail = email.trim().toLowerCase();
    const record = otpStore.get(cleanEmail);

    if (!record || Date.now() > record.expiresAt) {
      const err = new Error('OTP code has expired or is invalid. Please request a new one.');
      err.statusCode = 400;
      throw err;
    }

    if (record.code !== String(otp).trim()) {
      const err = new Error('Invalid 6-digit OTP code. Please check and try again.');
      err.statusCode = 400;
      throw err;
    }

    // Consume OTP
    otpStore.delete(cleanEmail);

    const user = await User.findByEmail(cleanEmail);
    if (!user) {
      const err = new Error('User account not found.');
      err.statusCode = 404;
      throw err;
    }

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

    let user = (googleId && (await User.findByGoogleId(googleId))) || (await User.findByEmail(email));

    if (!user) {
      user = await User.create({
        email,
        full_name: name || email.split('@')[0],
        google_id: googleId || `google_${Date.now()}`,
        role: 'trainee',
        department_id: 1,
      });

      if (picture) {
        await UserProfile.update(user.id, { avatar_url: picture });
      }
    }

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
