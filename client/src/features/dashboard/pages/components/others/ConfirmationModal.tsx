// ui/modals/ConfirmationModal.jsx
import { useEffect } from "react";
import { FiAlertTriangle, FiInfo, FiCheckCircle, FiX } from "react-icons/fi";

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
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantStyles = {
    default: {
      icon: FiInfo,
      iconColor: "text-blue-400",
      confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
      borderColor: "border-blue-500/20",
    },
    danger: {
      icon: FiAlertTriangle,
      iconColor: "text-red-400",
      confirmButton: "bg-red-600 hover:bg-red-700 text-white",
      borderColor: "border-red-500/20",
    },
    warning: {
      icon: FiAlertTriangle,
      iconColor: "text-yellow-400",
      confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
      borderColor: "border-yellow-500/20",
    },
    success: {
      icon: FiCheckCircle,
      iconColor: "text-green-400",
      confirmButton: "bg-green-600 hover:bg-green-700 text-white",
      borderColor: "border-green-500/20",
    },
  };

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  const { icon: Icon, iconColor, confirmButton, borderColor } = variantStyles[variant];
  const sizeClass = sizeStyles[size];

  return (

    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative w-full ${sizeClass} transform overflow-hidden rounded-xl bg-gray-900 border border-gray-800 shadow-xl transition-all`}>
          {/* Simple Header */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`${iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <p className="text-gray-300 text-sm">{message}</p>
          </div>

          {/* Simple Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-800">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${confirmButton}`}
            >
              {isLoading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;