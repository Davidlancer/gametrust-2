import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BellIcon, Filter } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

interface MobileNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNotificationModal = forwardRef<HTMLDivElement, MobileNotificationModalProps>(({ isOpen, onClose }, ref) => {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearAllNotifications,
    openNotificationModal
  } = useNotifications();

  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

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

  const filteredNotifications = showUnreadOnly 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleClearAll = () => {
    clearAllNotifications();
    onClose();
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal - Positioned below notification bell */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute top-full mt-2 right-0 w-[90vw] max-w-md sm:w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto flex flex-col border border-gray-200/20 dark:border-gray-700/20"
          >


            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/30 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-800/20">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    showUnreadOnly 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                  title={showUnreadOnly ? 'Show all notifications' : 'Show unread only'}
                >
                  <Filter className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                  title="Close notifications"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            {filteredNotifications.length > 0 && (
              <div className="flex space-x-3 px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200/20 dark:border-gray-700/20">
                <button
                  onClick={markAllAsRead}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={unreadCount === 0}
                >
                  Mark All Read
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg transition-all duration-200"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 h-full min-h-[300px]">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-2xl mb-4">
                    <BellIcon className="h-12 w-12 text-blue-400 dark:text-blue-500 opacity-80" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {showUnreadOnly ? 'You\'re all caught up!' : 'No notifications yet'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center text-sm leading-relaxed mb-6">
                    {showUnreadOnly 
                      ? 'All your notifications have been read.' 
                      : 'You\'ll see important updates about your orders, wallet, and referrals here.'}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm"
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2 space-y-2">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.98] min-h-[80px] ${
                        notification.read 
                          ? 'bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/30' 
                          : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-l-4 border-blue-500 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 border border-blue-200/50 dark:border-blue-700/30'
                      }`}
                      onClick={() => {
                        openNotificationModal(notification);
                        onClose();
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                            notification.read 
                              ? 'bg-gray-200 dark:bg-gray-700/50' 
                              : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md'
                          }`}>
                            <span className={notification.read ? '' : 'filter brightness-0 invert'}>
                              {getNotificationIcon(notification.type)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className={`font-semibold text-sm leading-tight pr-2 ${
                              notification.read 
                                ? 'text-gray-700 dark:text-gray-300' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex-shrink-0">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed line-clamp-2 mb-2 ${
                            notification.read 
                              ? 'text-gray-600 dark:text-gray-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.body}
                          </p>
                          {!notification.read && (
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-blue-600 dark:text-blue-400 ml-1.5 font-semibold uppercase tracking-wide">New</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>


          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

MobileNotificationModal.displayName = 'MobileNotificationModal';

export default MobileNotificationModal;