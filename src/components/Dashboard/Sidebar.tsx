import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { NavigationItem, DashboardPage, BuyerDashboardPage } from '../../types/dashboard';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isDesktop: boolean;
  navigationItems: NavigationItem[];
  currentPage: DashboardPage | BuyerDashboardPage;
  handlePageChange: (page: DashboardPage | BuyerDashboardPage) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isDesktop,
  navigationItems,
  currentPage,
  handlePageChange
}) => {
  return (
    <motion.aside
      initial={false}
      animate={{
        x: isDesktop ? 0 : (sidebarOpen ? 0 : '-100%')
      }}
      className="fixed top-12 bottom-0 left-0 z-40 w-64 xl:w-72 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-700/50 lg:translate-x-0 lg:static lg:w-64 xl:w-72 lg:flex-shrink-0 flex flex-col shadow-2xl backdrop-blur-sm lg:x-0"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 lg:h-18 px-4 lg:px-6 border-b border-gray-700/50 flex-shrink-0 bg-gray-800/30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-black font-bold text-sm">GT</span>
          </div>
          <span className="text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            GameTrust
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 lg:py-6 px-3 lg:px-4">
        <div className="space-y-1 lg:space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm font-semibold rounded-lg lg:rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/25 to-purple-500/25 text-indigo-400 border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60 hover:shadow-md'
                }`}
              >
                <div className="flex items-center">
                  <Icon className={`w-4 h-4 lg:w-5 lg:h-5 mr-3 lg:mr-4 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                  <span className="tracking-normal lg:tracking-wide">{item.label}</span>
                </div>
                {item.id === 'orders' && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 lg:px-3 py-1 lg:py-1.5 rounded-full min-w-[20px] lg:min-w-[24px] text-center shadow-lg">
                    3
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="flex-shrink-0 p-3 lg:p-4 border-t border-gray-700/50 bg-gray-800/30">
        <div className="flex items-center space-x-3 p-2 lg:p-3 rounded-lg lg:rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
              alt="User"
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full ring-2 ring-indigo-500/30 group-hover:ring-indigo-500/50 transition-all duration-300"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 lg:w-3.5 lg:h-3.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
          <div className="flex-1">
            <p className="text-xs lg:text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors duration-300">Blunt</p>
            <p className="text-xs text-gray-400 font-medium">Verified Seller</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;