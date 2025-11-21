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
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700',
      textColor: 'text-green-300',
      icon: FiCheckCircle,
      iconColor: 'text-green-400'
    },
    error: {
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-700',
      textColor: 'text-red-300',
      icon: FiXCircle,
      iconColor: 'text-red-400'
    },
    warning: {
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-700',
      textColor: 'text-yellow-300',
      icon: FiXCircle,
      iconColor: 'text-yellow-400'
    },
    info: {
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700',
      textColor: 'text-blue-300',
      icon: FiCheckCircle,
      iconColor: 'text-blue-400'
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
        border rounded-lg p-4 mb-4
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