import { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiInfo, 
  FiX 
} from 'react-icons/fi';

const ToastContext = createContext();

const ToastMessage = ({ message, type = 'info', onDismiss }) => {
    const getToastStyles = () => {
        const baseClasses = "flex items-center p-4 mb-4 rounded-lg shadow-lg border";

     switch(type) {
    case 'error':
        return {
            className: `${baseClasses} text-red-800 bg-red-50 border-red-200`,
            icon: <FiAlertCircle className="shrink-0 w-5 h-5 text-red-600" />,
            buttonClass: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800"
        };
    case 'success':
        return {
            className: `${baseClasses} text-green-800 bg-green-50 border-green-200`,
            icon: <FiCheckCircle className="shrink-0 w-5 h-5 text-green-600" />,
            buttonClass: "bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-800"
        };
    case 'warning':
        return {
            className: `${baseClasses} text-yellow-800 bg-yellow-50 border-yellow-200`,
            icon: <FiAlertTriangle className="shrink-0 w-5 h-5 text-yellow-600" />,
            buttonClass: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-800"
        };
    default: 
        return {
            className: `${baseClasses} text-blue-800 bg-blue-50 border-blue-200`,
            icon: <FiInfo className="shrink-0 w-5 h-5 text-blue-600" />,
            buttonClass: "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
        };
}
    };

    const styles = getToastStyles();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={styles.className}
            role="alert"
        >
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                    {styles.icon}
                    <div className="text-sm font-medium text-gray-800">
                        {message}
                    </div>
                </div>
                <button
                    type="button"
                    className={`ml-4 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-7 w-7 transition-colors duration-200 ${styles.buttonClass}`}
                    onClick={onDismiss}
                    aria-label="Close"
                >
                    <FiX className="w-3 h-3" />
                </button>
            </div>
        </motion.div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info', duration = 5000) => {
        const id = Date.now().toString();

        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => dismissToast(id), duration);
        }
    };

    const dismissToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const toast = {
        success: (message, duration) => showToast(message, 'success', duration),
        error: (message, duration) => showToast(message, 'error', duration),
        warning: (message, duration) => showToast(message, 'warning', duration),
        info: (message, duration) => showToast(message, 'info', duration),
    };

    return (
        <ToastContext.Provider value={{ showToast, dismissToast, toast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <ToastMessage
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onDismiss={() => dismissToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};