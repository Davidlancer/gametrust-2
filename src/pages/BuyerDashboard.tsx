import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ShoppingBagIcon,
  WalletIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  BookmarkIcon,
  CogIcon
} from '@heroicons/react/24/outline';

// Dashboard components
import BuyerDashboardOverview from '../components/Dashboard/BuyerDashboardOverview';
import BuyerOrders from '../components/Dashboard/BuyerOrders';
import BuyerWallet from '../components/Dashboard/BuyerWallet';
import BuyerReferral from '../components/Dashboard/BuyerReferral';
import BuyerDisputes from '../components/Dashboard/BuyerDisputes';
import BuyerSavedListings from '../components/Dashboard/BuyerSavedListings';
import BuyerSettings from '../components/Dashboard/BuyerSettings';

// Layout components
import TestingBanner from '../components/Dashboard/TestingBanner';
import Sidebar from '../components/Dashboard/Sidebar';
import MobileHeader from '../components/Dashboard/MobileHeader';

// Types
import { BuyerDashboardPage, DashboardPage, NavigationItem } from '../types/dashboard';

const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Dashboard Overview', icon: HomeIcon, route: '/dashboard/buyer' },
  { id: 'orders', label: 'My Orders', icon: ShoppingBagIcon, route: '/dashboard/buyer/orders' },
  { id: 'wallet', label: 'Wallet', icon: WalletIcon, route: '/dashboard/buyer/wallet' },
  { id: 'referral', label: 'Referral Program', icon: UsersIcon, route: '/dashboard/buyer/referral' },
  { id: 'disputes', label: 'Disputes', icon: ExclamationTriangleIcon, route: '/dashboard/buyer/disputes' },
  { id: 'saved', label: 'Saved Listings', icon: BookmarkIcon, route: '/dashboard/buyer/saved' },
  { id: 'settings', label: 'Settings', icon: CogIcon, route: '/dashboard/buyer/settings' },
];

interface BuyerDashboardProps {
  onNavigate?: (page: string) => void;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onNavigate }) => {
  // Fresh reload trigger
  const [currentPage, setCurrentPage] = useState<BuyerDashboardPage>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (sidebarOpen && !isDesktop) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen, isDesktop]);

  // Listen for navigation events from notifications
  useEffect(() => {
    const handleWalletNavigation = () => {
      setCurrentPage('wallet');
    };
    
    const handleReferralNavigation = () => {
      setCurrentPage('referral');
    };
    
    const handleOrdersNavigation = () => {
      setCurrentPage('orders');
    };
    
    const handleDisputesNavigation = () => {
      setCurrentPage('disputes');
    };

    window.addEventListener('navigateToWallet', handleWalletNavigation);
    window.addEventListener('navigateToReferral', handleReferralNavigation);
    window.addEventListener('navigateToOrders', handleOrdersNavigation);
    window.addEventListener('navigateToDisputes', handleDisputesNavigation);
    
    return () => {
      window.removeEventListener('navigateToWallet', handleWalletNavigation);
      window.removeEventListener('navigateToReferral', handleReferralNavigation);
      window.removeEventListener('navigateToOrders', handleOrdersNavigation);
      window.removeEventListener('navigateToDisputes', handleDisputesNavigation);
    };
  }, []);

  const handlePageChange = (page: BuyerDashboardPage | DashboardPage) => {
    // Check if the page is a valid BuyerDashboardPage
    const validBuyerPages: BuyerDashboardPage[] = ['overview', 'orders', 'wallet', 'referral', 'disputes', 'saved', 'settings'];
    if (validBuyerPages.includes(page as BuyerDashboardPage)) {
      setCurrentPage(page as BuyerDashboardPage);
    }
    setSidebarOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return <BuyerDashboardOverview handlePageChange={handlePageChange} onNavigate={onNavigate} />;
      case 'orders':
        return <BuyerOrders />;
      case 'wallet':
        return <BuyerWallet />;
      case 'referral':
        return <BuyerReferral onNavigate={onNavigate} />;
      case 'disputes':
        return <BuyerDisputes />;
      case 'saved':
        return <BuyerSavedListings />;
      case 'settings':
        return <BuyerSettings />;
      default:
        return <BuyerDashboardOverview handlePageChange={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Testing Mode Banner */}
      <TestingBanner />
      
      {/* Mobile Header */}
      <MobileHeader 
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isDesktop={isDesktop}
          navigationItems={navigationItems}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />

        {/* Overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && !isDesktop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden bg-gray-900 w-full min-w-0">
          <div className="h-full p-2 sm:p-4 lg:p-6 xl:p-8 overflow-x-hidden">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              {renderCurrentPage()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuyerDashboard;