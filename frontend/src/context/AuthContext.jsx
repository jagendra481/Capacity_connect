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

  const login = async (credentials, password) => {
    const payload = typeof credentials === 'object' ? credentials : { email: credentials, password };
    const res = await authService.login(payload);
    if (res.data?.user) {
      setUser(res.data.user);
    }
    return res.data?.user || res.data;
  };

  const signup = async (userData) => {
    return authService.signup(userData);
  };

  const verifyEmailOTP = async (email, otp) => {
    const res = await authService.verifyEmailOTP(email, otp);
    if (res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const resendOTP = async (email) => {
    return authService.resendOTP(email);
  };

  const sendOTP = async (email) => {
    return authService.sendOTP(email);
  };

  const verifyOTP = async (email, otp) => {
    const res = await authService.verifyOTP(email, otp);
    if (res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const loginWithGoogle = async (googleData, mode = 'login') => {
    const payload = typeof googleData === 'string' ? { credential: googleData } : googleData;
    const res = await authService.googleAuth(payload, mode);
    if (res.data?.user) {
      setUser(res.data.user);
    }
    return res.data?.user || res.data;
  };

  const signupWithGoogle = async (googleData, mode = 'signup') => {
    const payload = typeof googleData === 'string' ? { credential: googleData } : googleData;
    const res = await authService.googleAuth(payload, mode);
    if (res.data?.user) {
      setUser(res.data.user);
    }
    return res.data?.user || res.data;
  };

  const forgotPassword = async (email) => {
    return authService.forgotPassword(email);
  };

  const resetPassword = async (email, otp, newPassword) => {
    return authService.resetPassword(email, otp, newPassword);
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
        signup,
        register: signup,
        verifyEmailOTP,
        resendOTP,
        sendOTP,
        verifyOTP,
        loginWithGoogle,
        signupWithGoogle,
        googleLogin: loginWithGoogle,
        forgotPassword,
        resetPassword,
        logout,
        updateUserProfileState,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
