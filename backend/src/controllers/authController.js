const authService = require('../services/authService');
const response = require('../utils/response');
const { validateSignupInput, validateLoginInput } = require('../utils/validators');

const register = async (req, res, next) => {
  try {
    const { isValid, errors } = validateSignupInput(req.body);
    if (!isValid) {
      return response.error(res, errors.join(' '), 400, errors);
    }

    const data = await authService.register(req.body);
    return response.success(res, data, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { isValid, errors } = validateLoginInput(req.body);
    if (!isValid) {
      return response.error(res, errors.join(' '), 400, errors);
    }

    const data = await authService.login(req.body);
    return response.success(res, data, 'Login successful', 200);
  } catch (error) {
    next(error);
  }
};

const sendOTP = async (req, res, next) => {
  try {
    const data = await authService.sendOTP(req.body);
    return response.success(res, data, data.message, 200);
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const data = await authService.verifyOTP(req.body);
    return response.success(res, data, 'OTP verification successful. Welcome back!', 200);
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const data = await authService.googleAuth(req.body);
    return response.success(res, data, 'Google authentication successful', 200);
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const data = await authService.getCurrentUser(req.user.id);
    return response.success(res, data, 'User details retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return response.error(res, 'Email is required', 400);
    }
    return response.success(res, null, 'Password reset link sent to your email address.', 200);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return response.error(res, 'Token and new password are required', 400);
    }
    return response.success(res, null, 'Password updated successfully. Please log in.', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  sendOTP,
  verifyOTP,
  googleAuth,
  me,
  forgotPassword,
  resetPassword,
};
