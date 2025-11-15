import React from 'react';
import { FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';

export default function FormAlert({ 
  message, 
  type = 'success', 
  onClose,
  className = '' 
}) {
  if (!message) return null;

  const alertConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: FiCheckCircle,
      iconColor: 'text-green-500'
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: FiXCircle,
      iconColor: 'text-red-500'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: FiXCircle,
      iconColor: 'text-yellow-500'
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: FiCheckCircle,
      iconColor: 'text-blue-500'
    }
  };

  const config = alertConfig[type] || alertConfig.success;
  const IconComponent = config.icon;

  return (
    <div 
      className={`
        ${config.bgColor} 
        ${config.borderColor} 
        ${config.textColor}
        border rounded-lg p-4 mb-4 transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className={`
              flex-shrink-0 ml-4 
              hover:opacity-70 
              transition-opacity 
              duration-200
              ${config.textColor}
            `}
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}