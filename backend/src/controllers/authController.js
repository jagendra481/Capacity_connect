const authService = require('../services/authService');
const response = require('../utils/response');
const { validateSignupInput, validateLoginInput } = require('../utils/validators');

const signup = async (req, res, next) => {
  try {
    const { isValid, errors } = validateSignupInput(req.body);
    if (!isValid) {
      return response.error(res, errors.join(' '), 400, errors);
    }

    const data = await authService.register(req.body);
    return response.success(res, data, data.message, 201);
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
    if (error.requiresEmailVerification) {
      return res.status(403).json({
        success: false,
        requiresEmailVerification: true,
        email: error.email,
        message: error.message,
      });
    }
    next(error);
  }
};

const verifyEmailOTP = async (req, res, next) => {
  try {
    const data = await authService.verifyEmailOTP(req.body);
    return response.success(res, data, data.message, 200);
  } catch (error) {
    next(error);
  }
};

const resendOTP = async (req, res, next) => {
  try {
    const data = await authService.resendOTP(req.body);
    return response.success(res, data, data.message, 200);
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
    const data = await authService.forgotPassword(req.body);
    return response.success(res, data, data.message, 200);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const data = await authService.resetPassword(req.body);
    return response.success(res, data, data.message, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  register: signup,
  login,
  verifyEmailOTP,
  resendOTP,
  sendOTP,
  verifyOTP,
  googleAuth,
  me,
  forgotPassword,
  resetPassword,
};
