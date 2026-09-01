const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const isStrongPassword = (password) => {
  // At least 6 chars
  return typeof password === 'string' && password.length >= 6;
};

const validateSignupInput = ({ email, password, full_name, role }) => {
  const errors = [];
  if (!email || !isValidEmail(email)) {
    errors.push('A valid email address is required.');
  }
  if (!password || !isStrongPassword(password)) {
    errors.push('Password must be at least 6 characters long.');
  }
  if (!full_name || full_name.trim().length === 0) {
    errors.push('Full name is required.');
  }
  const validRoles = ['trainee', 'trainer', 'administrator'];
  if (role && !validRoles.includes(role)) {
    errors.push('Role must be one of: trainee, trainer, administrator.');
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateLoginInput = ({ email, password }) => {
  const errors = [];
  if (!email || !isValidEmail(email)) {
    errors.push('A valid email address is required.');
  }
  if (!password) {
    errors.push('Password is required.');
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  validateSignupInput,
  validateLoginInput,
};
