import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { getStoredUser } from '../utils/authUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('capacity_connect_token');
      if (token) {
        try {
          const res = await authService.getCurrentUser();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('capacity_connect_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session expired or invalid', err);
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    setUser(res.data.user);
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    setUser(res.data.user);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserProfileState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('capacity_connect_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserProfileState,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
