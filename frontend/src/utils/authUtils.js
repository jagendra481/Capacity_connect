export const getToken = () => localStorage.getItem('capacity_connect_token');

export const getStoredUser = () => {
  const user = localStorage.getItem('capacity_connect_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};
