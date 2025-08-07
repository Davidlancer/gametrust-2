import React, { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../hooks/useNotifications';
import MobileNotificationModal from './MobileNotificationModal';
import NotificationModal from './NotificationModal';

interface NotificationBellProps {
  className?: string;
  onNavigate?: (page: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = '', onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileModalRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearAllNotifications,
    initializeMockData,
    modalNotification,
    isModalOpen,
    openNotificationModal,
    closeNotificationModal
  } = useNotifications();

  // Initialize mock data on mount if in dev mode
  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown/modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      
      if (
        mobileModalRef.current &&
        !mobileModalRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsMobileModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'wallet': return '💸';
      case 'referral': return '🎯';
      case 'escrow': return '🛡️';
      case 'dispute': return '⚠️';
      case 'order': return '🛍️';
      case 'message': return '💬';
      default: return '🔔';
    }
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setIsOpen(false);
  };

  const handleBellClick = () => {
    if (isMobile) {
      setIsMobileModalOpen(true);
    } else {
      setIsOpen(!isOpen);
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

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        ref={bellRef}
        onClick={handleBellClick}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-white/20 dark:hover:bg-gray-800/60 hover:backdrop-blur-lg hover:shadow-lg hover:border hover:border-white/30 dark:hover:border-gray-600/50 rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className="h-5 w-5" />
        ) : (
          <BellIcon className="h-5 w-5" />
        )}
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg border-2 border-white dark:border-gray-800 animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Desktop Notification Dropdown */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-300/30 dark:border-gray-700/50 rounded-xl shadow-xl z-[9999] max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-300/30 dark:border-gray-700/50 flex items-center justify-between">
              <h3 className="text-gray-900 dark:text-white font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <BellIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`px-4 py-3 border-b border-gray-300/20 dark:border-gray-700/50 last:border-b-0 cursor-pointer transition-colors ${
                      notification.read 
                        ? 'bg-transparent hover:bg-gray-200/30 dark:hover:bg-gray-700/30' 
                        : 'bg-gray-100/20 dark:bg-gray-700/20 hover:bg-gray-200/40 dark:hover:bg-gray-700/40'
                    }`}
                    onClick={() => {
                      openNotificationModal(notification);
                      setIsOpen(false); // Close dropdown when opening modal
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg mt-0.5 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            notification.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                          }`}>
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${
                          notification.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.body}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-300/30 dark:border-gray-700/50 bg-gray-100/20 dark:bg-gray-800/20">
                <button
                  onClick={handleClearAll}
                  className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  Clear All Notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Notification Modal */}
      {isMobile && (
        <MobileNotificationModal 
          ref={mobileModalRef}
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
        />
      )}

      {/* Notification Detail Modal */}
      <NotificationModal
        isOpen={isModalOpen}
        notification={modalNotification}
        onClose={closeNotificationModal}
        onCTAClick={(route) => {
          if (onNavigate) {
            // Handle chat routes
            if (route.includes('/chat')) {
              const orderId = route.split('/')[2]; // Extract order ID from /orders/GTX1234/chat
              const event = new CustomEvent('openOrderChat', { detail: { orderId } });
              window.dispatchEvent(event);
              return;
            }
            
            // Map notification routes to dashboard pages
            const routeMapping: { [key: string]: string } = {
              '/wallet': 'buyer-dashboard',
              '/referrals': 'buyer-dashboard', 
              '/orders': 'buyer-dashboard',
              '/disputes': 'buyer-dashboard'
            };
            
            // Navigate to dashboard and trigger specific page
            const dashboardPage = routeMapping[route] || 'buyer-dashboard';
            onNavigate(dashboardPage);
            
            // Dispatch custom event to navigate to specific dashboard section
            setTimeout(() => {
              const eventMap: { [key: string]: string } = {
                '/wallet': 'navigateToWallet',
                '/referrals': 'navigateToReferral',
                '/orders': 'navigateToOrders',
                '/disputes': 'navigateToDisputes'
              };
              
              const eventName = eventMap[route];
              if (eventName) {
                const event = new CustomEvent(eventName);
                window.dispatchEvent(event);
              }
            }, 100);
          }
        }}
      />
    </div>
  );
};

export default NotificationBell;