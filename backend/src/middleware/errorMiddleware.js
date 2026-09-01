const logger = require('../utils/logger');
const response = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error on ${req.method} ${req.originalUrl}: ${err.message}`, err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  return response.error(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
};

const notFoundHandler = (req, res, next) => {
  return response.error(res, `Route not found: ${req.originalUrl}`, 404);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
