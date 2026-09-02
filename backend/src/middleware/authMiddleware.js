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

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return response.error(res, 'Forbidden: User identity missing.', 403);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return response.error(
        res,
        `Forbidden: Access restricted to ${allowedRoles.join(', ')} roles. Your role is '${req.user.role}'.`,
        403
      );
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireRole,
};
