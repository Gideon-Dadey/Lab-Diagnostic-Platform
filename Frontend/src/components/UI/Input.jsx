import React from 'react';

const Input = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  error,
  register,
  icon,
  className = '',
  ...props
}) => {
  const hasError = !!error;
  
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        placeholder={placeholder || ' '}
        {...register?.(name)}
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-lg border ${
          hasError ? 'border-red-500 focus:ring-red-300' : 'border-gray-200 focus:ring-primary/30'
        } bg-white focus:outline-none focus:ring-2 transition text-sm`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id || name}-error` : undefined}
        {...props}
      />
      {label && (
        <label
          htmlFor={id || name}
          className={`absolute left-${icon ? '10' : '4'} -top-2.5 px-1 text-xs bg-white transition-all ${
            hasError ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {label}
        </label>
      )}
      {hasError && (
        <p id={`${id || name}-error`} className="text-red-600 text-xs mt-1" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;
