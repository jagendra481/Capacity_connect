import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to Capacity Connect',
      message: 'Explore your personalized skill gap and start learning paths.',
      type: 'info',
      read: false,
      created_at: new Date().toISOString(),
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter(n => !n.read).length,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
