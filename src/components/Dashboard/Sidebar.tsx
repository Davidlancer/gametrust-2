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
      className="fixed top-0 bottom-0 left-0 z-[60] w-56 lg:w-60 bg-white/[0.02] backdrop-blur-xl border-r border-white/[0.08] lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col lg:top-12 lg:z-40"
    >
      {/* Mobile Close Button */}
      <div className="flex items-center justify-end h-12 px-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors duration-200"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const showSeparator = index === 2 || index === 4; // Add subtle separators
            
            return (
              <React.Fragment key={item.id}>
                {showSeparator && (
                  <div className="h-px bg-white/[0.06] mx-2 my-3" />
                )}
                <motion.button
                  onClick={() => handlePageChange(item.id)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-white/[0.08] backdrop-blur-sm border border-white/[0.12]'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-all duration-200 ${
                      isActive ? 'scale-105' : 'group-hover:scale-105'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.id === 'orders' && (
                    <span className="bg-red-500/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded-md min-w-[18px] text-center">
                      3
                    </span>
                  )}
                </motion.button>
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="flex-shrink-0 p-3 border-t border-white/[0.06]">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 cursor-pointer group"
        >
          <div className="relative flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
              alt="User"
              className="w-8 h-8 rounded-full ring-1 ring-white/[0.12] group-hover:ring-white/[0.2] transition-all duration-200"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-gray-900"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Blunt</p>
            <p className="text-xs opacity-60 truncate">Verified Seller</p>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;