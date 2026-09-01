const jwt = require('../utils/jwt');
const response = require('../utils/response');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.error(res, 'Authentication required. No Bearer token provided.', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verifyToken(token);

  if (!decoded) {
    return response.error(res, 'Invalid or expired token. Please log in again.', 401);
  }

  req.user = decoded;
  next();
};

module.exports = {
  authenticate,
};
