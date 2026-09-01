import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader size="large" message="Verifying authentication..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-300 mb-6">
            You do not have permission to access this page. Required role: {allowedRoles.join(', ')}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
