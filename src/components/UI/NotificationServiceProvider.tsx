import React, { useEffect } from 'react';
import { useToast } from './ToastProvider';
import { notificationService } from '../../services/notificationService';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationServiceProviderProps {
  children: React.ReactNode;
}

const NotificationServiceProvider: React.FC<NotificationServiceProviderProps> = ({ children }) => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Initialize the notification service with toast callbacks
    const showToast = (type: string, title: string, message: string) => {
      switch (type) {
        case 'success':
          showSuccess(title, message);
          break;
        case 'error':
          showError(title, message);
          break;
        case 'warning':
          showWarning(title, message);
          break;
        case 'info':
          showInfo(title, message);
          break;
        default:
          showInfo(title, message);
      }
    };

    notificationService.setCallbacks(addNotification, showToast);
  }, [addNotification, showSuccess, showError, showWarning, showInfo]);

  return <>{children}</>;
};

export default NotificationServiceProvider;