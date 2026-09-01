const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

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
