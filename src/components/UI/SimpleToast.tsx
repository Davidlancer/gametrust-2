import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface SimpleToastProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const SimpleToast: React.FC<SimpleToastProps> = ({ toasts, onRemove }) => {
  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
            className={`
              ${getToastStyles(toast.type)}
              text-white p-4 rounded-lg shadow-lg border-l-4 min-w-[300px] max-w-[400px]
              backdrop-blur-sm bg-opacity-90
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-lg font-bold">
                {getIcon(toast.type)}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{toast.title}</div>
                {toast.description && (
                  <div className="text-xs opacity-90 mt-1">{toast.description}</div>
                )}
              </div>
              <button
                onClick={() => onRemove(toast.id)}
                className="flex-shrink-0 text-white hover:text-gray-200 text-lg font-bold"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SimpleToast;

// Toast Manager Hook
export const useSimpleToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
    
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
    ToastContainer: () => <SimpleToast toasts={toasts} onRemove={removeToast} />
  };
};