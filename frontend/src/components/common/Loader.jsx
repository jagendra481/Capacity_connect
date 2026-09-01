import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.medium} text-brand-500 animate-spin`} />
      {message && <p className="text-sm text-slate-400 font-medium">{message}</p>}
    </div>
  );
};

export default Loader;
