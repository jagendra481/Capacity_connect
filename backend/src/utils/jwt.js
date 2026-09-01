const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generate JWT token for user payload
 */
const generateToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

/**
 * Verify JWT token string
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
