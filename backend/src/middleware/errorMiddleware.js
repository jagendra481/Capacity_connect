const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error on ${req.method} ${req.originalUrl}: ${err.message}`, err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    retryAfter: err.retryAfter || 0,
    accountNotFound: Boolean(err.accountNotFound),
    accountExists: Boolean(err.accountExists),
    requiresEmailVerification: Boolean(err.requiresEmailVerification),
    email: err.email || null,
    errors: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

const notFoundHandler = (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
