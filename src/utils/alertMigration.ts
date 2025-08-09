/**
 * Migration utility to replace native alert() calls with SimpleToast alerts
 * This provides a drop-in replacement for existing alert() usage
 */

interface ToastOptions {
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastManager {
  addToast: (toast: ToastOptions) => string;
}

// Global toast manager instance
let globalToastManager: ToastManager | null = null;

// Function to set the global toast manager
export const setGlobalToastManager = (toastManager: ToastManager) => {
  globalToastManager = toastManager;
};

// Helper function to add toast
const addGlobalToast = (toast: ToastOptions) => {
  if (globalToastManager) {
    return globalToastManager.addToast(toast);
  } else {
    console.warn('Global toast manager not initialized, falling back to console.log:', toast.title, toast.description);
  }
};

// Override the global alert function
if (typeof window !== 'undefined') {
  // Store original alert as fallback
  const originalAlert = window.alert;
  
  // Replace with SimpleToast system
  window.alert = (message: string) => {
    try {
      addGlobalToast({
        title: 'Alert',
        description: message,
        type: 'info'
      });
    } catch (error) {
      // Fallback to original alert if our system fails
      console.warn('Toast system fallback:', error);
      originalAlert(message);
    }
  };
}

/**
 * Enhanced alert functions that can be used as direct replacements
 */
export const alertUtils = {
  // Success alerts using SimpleToast
  success: (message: string) => {
    addGlobalToast({
      title: 'Success',
      description: message,
      type: 'success'
    });
  },
  
  // Error alerts using SimpleToast
  error: (message: string) => {
    addGlobalToast({
      title: 'Error',
      description: message,
      type: 'error'
    });
  },
  
  // Warning alerts using SimpleToast
  warning: (message: string) => {
    addGlobalToast({
      title: 'Warning',
      description: message,
      type: 'warning'
    });
  },
  
  // Info alerts using SimpleToast
  info: (message: string) => {
    addGlobalToast({
      title: 'Info',
      description: message,
      type: 'info'
    });
  },
  
  // Default alerts using SimpleToast
  default: (message: string) => {
    addGlobalToast({
      title: 'Alert',
      description: message,
      type: 'info'
    });
  }
};

/**
 * Shorthand toast functions for common use cases
 */
export const toast = {
  success: (message: string) => {
    addGlobalToast({
      title: 'Success',
      description: message,
      type: 'success'
    });
  },

  error: (message: string) => {
    addGlobalToast({
      title: 'Error',
      description: message,
      type: 'error'
    });
  },

  info: (message: string) => {
    addGlobalToast({
      title: 'Info',
      description: message,
      type: 'info'
    });
  },

  warning: (message: string) => {
    addGlobalToast({
      title: 'Warning',
      description: message,
      type: 'warning'
    });
  }
};

export default alertUtils;