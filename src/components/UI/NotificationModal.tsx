import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Notification } from '../../hooks/useNotifications';

interface NotificationModalProps {
  isOpen: boolean;
  notification: Notification | null;
  onClose: () => void;
  onCTAClick?: (route: string) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  notification,
  onClose,
  onCTAClick
}) => {
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

  const handleCTAClick = () => {
    if (notification?.ctaRoute && onCTAClick) {
      onCTAClick(notification.ctaRoute);
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!notification) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-md"
          onClick={handleBackdropClick}
        >
          <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-lg h-auto mx-auto my-auto bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border border-gray-600 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Centered modal for all screen sizes */}
          <div className="w-full h-auto flex flex-col">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-6 border-b border-gray-600 bg-gradient-to-r from-gray-700/50 to-gray-800/50">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <span className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white truncate bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {notification.title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-all duration-200 rounded-xl hover:bg-gray-700/50 hover:scale-110"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-gray-200 leading-relaxed mb-8 text-base">
                  {notification.body}
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {notification.ctaLabel && notification.ctaRoute && (
                    <button
                      onClick={handleCTAClick}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      {notification.ctaLabel}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-700/80 hover:bg-gray-600/80 text-gray-200 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 border border-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Time stamp */}
              <div className="px-8 pb-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                <p className="text-sm text-gray-400 font-medium">
                  {notification.time}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;