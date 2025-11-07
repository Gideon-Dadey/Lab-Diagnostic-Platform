import React from 'react';
import { FaExclamationCircle, FaTimes } from 'react-icons/fa';

const ErrorDisplay = ({ 
  message, 
  onDismiss, 
  variant = 'error', 
  className = '' 
}) => {
  const variants = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div 
      className={`flex items-center gap-3 p-4 rounded-lg border ${variants[variant]} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <FaExclamationCircle className="flex-shrink-0" />
      <p className="flex-1 font-medium">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-opacity-20 transition"
          aria-label="Dismiss error"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
