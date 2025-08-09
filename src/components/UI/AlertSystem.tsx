import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '@heroui/react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AlertItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

interface AlertContextType {
  showAlert: (alert: Omit<AlertItem, 'id'>) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  dismissAlert: (id: string) => void;
  clearAll: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: React.ReactNode;
  maxAlerts?: number;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ 
  children, 
  maxAlerts = 5 
}) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showAlert = useCallback((alert: Omit<AlertItem, 'id'>) => {
    const id = generateId();
    const newAlert: AlertItem = {
      ...alert,
      id,
      duration: alert.duration ?? (alert.persistent ? undefined : 5000)
    };

    setAlerts(prev => {
      const updated = [newAlert, ...prev].slice(0, maxAlerts);
      return updated;
    });

    // Auto dismiss if not persistent
    if (!alert.persistent && newAlert.duration) {
      setTimeout(() => {
        dismissAlert(id);
      }, newAlert.duration);
    }
  }, [maxAlerts]);

  const showSuccess = useCallback((title: string, message?: string) => {
    showAlert({ type: 'success', title, message });
  }, [showAlert]);

  const showError = useCallback((title: string, message?: string) => {
    showAlert({ type: 'error', title, message });
  }, [showAlert]);

  const showWarning = useCallback((title: string, message?: string) => {
    showAlert({ type: 'warning', title, message });
  }, [showAlert]);

  const showInfo = useCallback((title: string, message?: string) => {
    showAlert({ type: 'info', title, message });
  }, [showAlert]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
  }, []);

  const getAlertColor = (type: AlertItem['type']) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5" />;
      default:
        return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  return (
    <AlertContext.Provider value={{
      showAlert,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      dismissAlert,
      clearAll
    }}>
      {children}
      
      {/* Alert Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                mass: 0.8
              }}
              className="pointer-events-auto"
            >
              <Alert
                color={getAlertColor(alert.type)}
                variant="faded"
                startContent={getAlertIcon(alert.type)}
                endContent={
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 rounded-full hover:bg-black/10 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                }
                className="shadow-lg backdrop-blur-sm border border-white/10"
              >
                <div className="flex flex-col">
                  <div className="font-semibold text-sm">{alert.title}</div>
                  {alert.message && (
                    <div className="text-xs opacity-80 mt-1">{alert.message}</div>
                  )}
                </div>
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
};

// Legacy alert replacement function
export const createLegacyAlert = (alertContext: AlertContextType) => {
  return {
    success: (message: string) => {
      console.log('✅ SUCCESS:', message);
      alertContext.showSuccess('Success', message);
    },
    error: (message: string) => {
      console.log('❌ ERROR:', message);
      alertContext.showError('Error', message);
    },
    info: (message: string) => {
      console.log('ℹ️ INFO:', message);
      alertContext.showInfo('Info', message);
    },
    warning: (message: string) => {
      console.log('⚠️ WARNING:', message);
      alertContext.showWarning('Warning', message);
    }
  };
};

// Simple alert function for direct replacement of alert()
export const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  // This will be replaced by the context version when properly integrated
  console.log(`${type.toUpperCase()}: ${message}`);
  
  // Fallback to browser alert if context is not available
  if (typeof window !== 'undefined') {
    const emoji = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }[type];
    alert(`${emoji} ${message}`);
  }
};