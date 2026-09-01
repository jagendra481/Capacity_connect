import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTheme, setActiveTheme] = useState('dark');

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar: () => setSidebarOpen(prev => !prev),
        activeTheme,
        setActiveTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
