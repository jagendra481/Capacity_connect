import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
