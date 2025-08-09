import React, { useEffect } from 'react';
import { alertUtils } from '../../utils/alertMigration';
import { notificationService } from '../../services/notificationService';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationServiceProviderProps {
  children: React.ReactNode;
}

const NotificationServiceProvider: React.FC<NotificationServiceProviderProps> = ({ children }) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Initialize the notification service with toast callbacks
    const showToast = (type: string, title: string, message: string) => {
      const fullMessage = message ? `${title}: ${message}` : title;
      switch (type) {
        case 'success':
          alertUtils.success(fullMessage);
          break;
        case 'error':
          alertUtils.error(fullMessage);
          break;
        case 'warning':
          alertUtils.warning(fullMessage);
          break;
        case 'info':
          alertUtils.info(fullMessage);
          break;
        default:
          alertUtils.info(fullMessage);
      }
    };

    notificationService.setCallbacks(addNotification, showToast);
  }, [addNotification]);

  return <>{children}</>;
};

export default NotificationServiceProvider;