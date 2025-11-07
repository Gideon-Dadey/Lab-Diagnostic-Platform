import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">{description}</p>}
      {(actionLabel && actionLink) && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
        >
          {actionLabel}
        </Link>
      )}
      {(actionLabel && onAction) && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
