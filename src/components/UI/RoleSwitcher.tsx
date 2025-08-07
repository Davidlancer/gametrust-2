import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  ArrowPathIcon,
  ShoppingCartIcon,
  BriefcaseIcon,
  UserIcon,
  WalletIcon,
  GiftIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useToast } from './ToastProvider';
import { notificationService } from '../../services/notificationService';

interface RoleSwitcherProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  currentPage: string;
  mobileOnly?: boolean;
}

type UserRole = 'buyer' | 'seller';

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onNavigate, onLogout, currentPage, mobileOnly = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('buyer');
  const [hasMultipleRoles, setHasMultipleRoles] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { } = useToast();

  // Check if component should be visible (not on auth/onboarding pages)
  const shouldShowSwitcher = () => {
    const hiddenPages = ['auth', 'onboarding', 'login'];
    return !hiddenPages.includes(currentPage);
  };

  // Initialize role state from localStorage
  useEffect(() => {
    const initializeRoles = () => {
      try {
        const userRoles = localStorage.getItem('userRoles');
        const currentUserRole = localStorage.getItem('userRole');
        
        if (userRoles) {
          const roles = JSON.parse(userRoles);
          if (Array.isArray(roles) && roles.length === 2 && 
              roles.includes('buyer') && roles.includes('seller')) {
            setHasMultipleRoles(true);
          }
        }
        
        if (currentUserRole && (currentUserRole === 'buyer' || currentUserRole === 'seller')) {
          setCurrentRole(currentUserRole as UserRole);
        } else {
          // Default to buyer if no role is set
          localStorage.setItem('userRole', 'buyer');
          setCurrentRole('buyer');
        }
      } catch {
        // Reset roles if localStorage is malformed
        localStorage.removeItem('userRoles');
        localStorage.removeItem('userRole');
        onNavigate('onboarding');
      }
    };

    initializeRoles();
  }, [onNavigate]);

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchRole = (newRole: UserRole) => {
    if (newRole === currentRole) return;
    
    setCurrentRole(newRole);
    localStorage.setItem('userRole', newRole);
    
    // Navigate to appropriate dashboard
    const dashboardRoute = newRole === 'buyer' ? '/dashboard/buyer' : '/dashboard/seller';
    window.location.href = dashboardRoute;
    
    // Show success toast using notification service
    const roleText = newRole === 'buyer' ? 'Buyer' : 'Seller';
    notificationService.roleSwitched(
      roleText.toLowerCase(),
      {
        toastTitle: `Switched to ${roleText} Mode`,
        toastMessage: `You are now in ${roleText.toLowerCase()} mode. Dashboard updated!`
      }
    );
    
    setIsDropdownOpen(false);
  };

  const getRoleIcon = (role: UserRole) => {
    return role === 'buyer' ? 
      <ShoppingCartIcon className="w-4 h-4" /> : 
      <BriefcaseIcon className="w-4 h-4" />;
  };

  const getRoleText = (role: UserRole) => {
    return role === 'buyer' ? 'Buyer' : 'Seller';
  };

  const getUsername = () => {
    try {
      const mockUser = localStorage.getItem('mockUser');
      if (mockUser) {
        const userData = JSON.parse(mockUser);
        return userData.username || '@User';
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return '@User';
  };

  const getUserAvatar = () => {
    // Generate a consistent avatar based on username
    const username = getUsername();
    const avatarId = Math.abs(username.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % 100;
    return `https://images.unsplash.com/photo-${1500000000000 + avatarId}?w=40&h=40&fit=crop&crop=face`;
  };

  if (!shouldShowSwitcher()) {
    return null;
  }

  // Mobile sticky bottom switcher
  if (mobileOnly) {
    if (isMobile && hasMultipleRoles) {
      return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 p-4">
          <div className="flex space-x-2 max-w-sm mx-auto">
            <button
              onClick={() => switchRole('buyer')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                currentRole === 'buyer'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Buyer Mode</span>
            </button>
            <button
              onClick={() => switchRole('seller')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                currentRole === 'seller'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <BriefcaseIcon className="w-5 h-5" />
              <span>Seller Mode</span>
            </button>
          </div>
        </div>
      );
    }
    return null; // Don't render anything if not mobile or no multiple roles
  }

  // Desktop dropdown (only show when not mobileOnly)
  if (!isMobile) {
    return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <img
          src={getUserAvatar()}
          alt="User Avatar"
          className="w-8 h-8 rounded-full border-2 border-gray-600"
        />
        <span className="text-white font-medium hidden sm:block">{getUsername()}</span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${
          isDropdownOpen ? 'rotate-180' : ''
        }`} />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-300/30 dark:border-gray-700/50 rounded-xl shadow-xl z-[9999]"
          >
            <div className="p-4 border-b border-gray-300/30 dark:border-gray-700/50">
              <div className="flex items-center space-x-3">
                <img
                  src={getUserAvatar()}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-gray-600"
                />
                <div>
                  <p className="text-white font-medium">{getUsername()}</p>
                  <p className="text-gray-400 text-sm flex items-center space-x-1">
                    {getRoleIcon(currentRole)}
                    <span>{getRoleText(currentRole)} Mode</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2 space-y-1">
              <button
                onClick={() => {
                  onNavigate(currentRole === 'buyer' ? 'buyer-dashboard' : 'seller-dashboard');
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  onNavigate('wallet');
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
              >
                <WalletIcon className="w-4 h-4" />
                <span>Wallet</span>
              </button>
              
              <button
                onClick={() => {
                  onNavigate('referral-program');
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
              >
                <GiftIcon className="w-4 h-4" />
                <span>Referral</span>
              </button>
            </div>

            {hasMultipleRoles && (
              <>
                <div className="border-t border-gray-300/30 dark:border-gray-700/50 p-2 space-y-1">
                  <div className="px-3 py-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                      Current Role: {getRoleText(currentRole)}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => switchRole(currentRole === 'buyer' ? 'seller' : 'buyer')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-gray-700/50 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg transition-colors"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>Switch to {getRoleText(currentRole === 'buyer' ? 'seller' : 'buyer')}</span>
                    {getRoleIcon(currentRole === 'buyer' ? 'seller' : 'buyer')}
                  </button>
                </div>
              </>
            )}

            <div className="border-t border-gray-300/30 dark:border-gray-700/50 p-2">
              <button
                onClick={() => {
                  onLogout();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-gray-700/50 hover:text-red-700 dark:hover:text-red-300 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    );
  }
  
  return null; // Fallback
};

export default RoleSwitcher;