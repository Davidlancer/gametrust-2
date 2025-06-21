import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationDevToolsProps {
  className?: string;
}

const NotificationDevTools: React.FC<NotificationDevToolsProps> = ({ className = '' }) => {
  const {
    generateRandomNotification,
    clearAllNotifications,
    markAllAsRead,
    notifications,
    unreadCount,
    openNotificationModal
  } = useNotifications();

  // Only show in dev mode
  const devMode = localStorage.getItem('devMode') === 'true';
  if (!devMode) return null;

  const handleAddRandom = () => {
    const notification = generateRandomNotification();
    console.log('Added notification:', notification);
  };

  const handleClearAll = () => {
    clearAllNotifications();
    console.log('Cleared all notifications');
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    console.log('Marked all notifications as read');
  };

  const handleOpenLastModal = () => {
    const lastNotification = notifications[0]; // Most recent notification
    if (lastNotification) {
      openNotificationModal(lastNotification);
      console.log('Opened modal for:', lastNotification.title);
    }
  };

  const enableDevMode = () => {
    localStorage.setItem('devMode', 'true');
    window.location.reload();
  };

  return (
    <div className={`fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg z-50 ${className}`}>
      <div className="text-white text-sm font-semibold mb-3 flex items-center">
        🧪 Notification Dev Tools
        <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded">
          {notifications.length} total, {unreadCount} unread
        </span>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={handleAddRandom}
          className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
        >
          ➕ Add Random Notification
        </button>
        
        <button
          onClick={handleOpenLastModal}
          className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
          disabled={notifications.length === 0}
        >
          🔍 Open Last Notification Modal
        </button>
        
        <button
          onClick={handleMarkAllRead}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          disabled={unreadCount === 0}
        >
          ✅ Mark All as Read ({unreadCount})
        </button>
        
        <button
          onClick={handleClearAll}
          className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
          disabled={notifications.length === 0}
        >
          🗑️ Clear All ({notifications.length})
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-600">
        <button
          onClick={() => localStorage.setItem('devMode', 'false')}
          className="w-full px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
        >
          Disable Dev Mode
        </button>
      </div>
    </div>
  );
};

// Component to enable dev mode if not already enabled
export const DevModeToggle: React.FC = () => {
  const devMode = localStorage.getItem('devMode') === 'true';
  
  if (devMode) return null;
  
  return (
    <button
      onClick={() => {
        localStorage.setItem('devMode', 'true');
        window.location.reload();
      }}
      className="fixed bottom-4 right-4 bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-2 rounded shadow-lg z-50 transition-colors"
    >
      🧪 Enable Dev Mode
    </button>
  );
};

export default NotificationDevTools;