import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import AIAssistant from './components/ai/aiassistant';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <NotificationProvider>
            <AppRoutes />
            <AIAssistant />
          </NotificationProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
