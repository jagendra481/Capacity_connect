export const ROLES = {
  TRAINEE: 'trainee',
  TRAINER: 'trainer',
  ADMINISTRATOR: 'administrator',
};

export const isTrainee = (role) => role === ROLES.TRAINEE;
export const isTrainer = (role) => role === ROLES.TRAINER;
export const isAdmin = (role) => role === ROLES.ADMINISTRATOR;

export const getDashboardRoute = (role) => {
  switch (role) {
    case ROLES.ADMINISTRATOR:
      return '/admin/dashboard';
    case ROLES.TRAINER:
      return '/trainer/dashboard';
    case ROLES.TRAINEE:
    default:
      return '/trainee/dashboard';
  }
};
