import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BellIcon } from 'lucide-react';
import { useNotifications, Notification } from '../../hooks/useNotifications';

interface MobileNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNotificationModal: React.FC<MobileNotificationModalProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    openNotificationModal
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'wallet': return '💸';
      case 'referral': return '🎯';
      case 'escrow': return '🛡️';
      case 'dispute': return '⚠️';
      case 'order': return '🛍️';
      default: return '🔔';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleClearAll = () => {
    clearAllNotifications();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-2xl z-50 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Action Buttons */}
            {notifications.length > 0 && (
              <div className="flex space-x-2 p-4 border-b border-gray-700">
                <button
                  onClick={markAllAsRead}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  disabled={unreadCount === 0}
                >
                  Mark All Read
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <BellIcon className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No notifications yet</p>
                  <p className="text-sm text-center mt-2 px-4">
                    You'll see important updates about your orders, wallet, and referrals here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 cursor-pointer transition-colors ${
                        notification.read 
                          ? 'bg-gray-800 hover:bg-gray-750' 
                          : 'bg-gray-750 hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        openNotificationModal(notification);
                        onClose(); // Close mobile modal when opening detail modal
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-xl mt-0.5 flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`text-sm font-medium ${
                              notification.read ? 'text-gray-300' : 'text-white'
                            }`}>
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className={`text-sm ${
                            notification.read ? 'text-gray-400' : 'text-gray-300'
                          }`}>
                            {notification.body}
                          </p>
                          {!notification.read && (
                            <div className="flex items-center mt-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-xs text-blue-400 ml-2">New</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Safe area for iPhone home indicator */}
            <div className="h-safe-area-inset-bottom bg-gray-800"></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNotificationModal;