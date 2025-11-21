// ui/modals/ConfirmationModal.jsx
import { useEffect } from 'react';
import { FiAlertTriangle, FiInfo, FiCheckCircle, FiX } from 'react-icons/fi';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "default", 
  size = "md",
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantStyles = {
    default: {
      icon: FiInfo,
      iconColor: "text-blue-400",
      confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    danger: {
      icon: FiAlertTriangle,
      iconColor: "text-red-400",
      confirmButton: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      icon: FiAlertTriangle,
      iconColor: "text-yellow-400",
      confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    success: {
      icon: FiCheckCircle,
      iconColor: "text-green-400",
      confirmButton: "bg-green-600 hover:bg-green-700 text-white",
    },
  };

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  const { icon: Icon, iconColor, confirmButton } = variantStyles[variant];
  const sizeClass = sizeStyles[size];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative w-full ${sizeClass} transform overflow-hidden rounded-xl bg-gray-800 shadow-xl transition-all`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 ${iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-300 whitespace-pre-wrap">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end p-6 border-t border-gray-700 bg-gray-750">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmButton}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;