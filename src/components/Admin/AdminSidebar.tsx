import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

type AdminPage = 'dashboard' | 'users' | 'listings' | 'disputes' | 'verifications' | 'revenue';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isDesktop: boolean;
  currentPage: AdminPage;
  setCurrentPage: (page: AdminPage) => void;
  onLogout: () => void;
}

interface NavigationItem {
  id: AdminPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isDesktop,
  currentPage,
  setCurrentPage,
  onLogout
}) => {
  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'listings', label: 'Listings', icon: ShoppingBagIcon },
    { id: 'disputes', label: 'Disputes', icon: ExclamationTriangleIcon, badge: 5 },
    { id: 'verifications', label: 'Verifications', icon: CheckBadgeIcon, badge: 12 },
    { id: 'revenue', label: 'Revenue', icon: CurrencyDollarIcon }
  ];

  const handleLogout = () => {
    onLogout();
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        x: isDesktop ? 0 : (sidebarOpen ? 0 : '-100%')
      }}
      className="fixed top-0 bottom-0 left-0 z-[60] w-64 xl:w-72 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-700/50 lg:translate-x-0 lg:static lg:w-64 xl:w-72 lg:flex-shrink-0 flex flex-col shadow-2xl backdrop-blur-sm lg:z-40"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 lg:h-18 px-4 lg:px-6 border-b border-gray-700/50 flex-shrink-0 bg-gray-800/30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <span className="text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Admin Panel
            </span>
            <p className="text-xs text-gray-400 font-medium">GameTrust</p>
          </div>
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
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm font-semibold rounded-lg lg:rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-red-500/25 to-orange-500/25 text-red-400 border border-red-500/40 shadow-lg shadow-red-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60 hover:shadow-md'
                }`}
              >
                <div className="flex items-center">
                  <Icon className={`w-4 h-4 lg:w-5 lg:h-5 mr-3 lg:mr-4 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                  <span className="tracking-normal lg:tracking-wide">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 lg:px-3 py-1 lg:py-1.5 rounded-full min-w-[20px] lg:min-w-[24px] text-center shadow-lg">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Admin Actions */}
        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <div className="space-y-1">
            <button className="w-full flex items-center px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm font-semibold rounded-lg lg:rounded-xl transition-all duration-300 text-gray-300 hover:text-white hover:bg-gray-800/60">
              <Cog6ToothIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-3 lg:mr-4" />
              <span>Settings</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm font-semibold rounded-lg lg:rounded-xl transition-all duration-300 text-gray-300 hover:text-red-400 hover:bg-red-500/10"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-3 lg:mr-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Admin Profile Section */}
      <div className="flex-shrink-0 p-3 lg:p-4 border-t border-gray-700/50 bg-gray-800/30">
        <div className="flex items-center space-x-3 p-2 lg:p-3 rounded-lg lg:rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group">
          <div className="relative">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center ring-2 ring-red-500/30 group-hover:ring-red-500/50 transition-all duration-300">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 lg:w-3.5 lg:h-3.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
          <div className="flex-1">
            <p className="text-xs lg:text-sm font-semibold text-white group-hover:text-red-400 transition-colors duration-300">Admin</p>
            <p className="text-xs text-gray-400 font-medium">Super User</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;