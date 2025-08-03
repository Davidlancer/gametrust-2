import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface AdminTopbarProps {
  setSidebarOpen: (open: boolean) => void;
  isDesktop: boolean;
  onLogout: () => void;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ setSidebarOpen, isDesktop, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, type: 'dispute', message: 'New dispute raised for Order #12345', time: '2 min ago', unread: true },
    { id: 2, type: 'verification', message: 'Verification request from user @gamer123', time: '5 min ago', unread: true },
    { id: 3, type: 'revenue', message: 'Daily revenue report is ready', time: '1 hour ago', unread: false },
    { id: 4, type: 'user', message: 'New user registration: john@example.com', time: '2 hours ago', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    onLogout();
  };

  return (
    <header className="bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          {!isDesktop && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
          )}

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, listings, disputes..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 sm:w-64 lg:w-80"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                >
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                          notification.unread ? 'bg-red-500/5' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? 'bg-red-500' : 'bg-gray-600'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-white">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-700">
                    <button className="text-sm text-red-400 hover:text-red-300 font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AD</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-white">Admin</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                >
                  <div className="p-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <p className="text-xs text-gray-400">admin@gametrust.com</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors">
                      <UserIcon className="w-4 h-4 mr-3" />
                      Profile
                    </button>
                    <button className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors">
                      <Cog6ToothIcon className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                  </div>
                  <div className="py-2 border-t border-gray-700">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfileDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfileDropdown(false);
          }}
        />
      )}
    </header>
  );
};

export default AdminTopbar;