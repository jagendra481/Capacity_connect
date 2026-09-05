const response = require('../utils/response');

const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return response.error(res, 'Unauthorized access', 401);
    }

    const rolesList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Super Admin has root access to all administrator endpoints
    if (req.user.role === 'super_admin') {
      return next();
    }

    if (!rolesList.includes(req.user.role)) {
      return response.error(
        res,
        `Access denied. Requires one of the following roles: ${rolesList.join(', ')}`,
        403
      );
    }

    next();
  };
};

module.exports = {
  requireRole,
};
