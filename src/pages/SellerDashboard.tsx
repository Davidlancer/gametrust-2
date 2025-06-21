import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  WalletIcon,
  ExclamationTriangleIcon,
  StarIcon,
  Cog6ToothIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Dashboard components
import DashboardOverview from '../components/Dashboard/DashboardOverview';
import MyListings from '../components/Dashboard/MyListings';
import AddNewListing from '../components/Dashboard/AddNewListing';
import Orders from '../components/Dashboard/Orders';
import Wallet from '../components/Dashboard/Wallet';
import Disputes from '../components/Dashboard/Disputes';
import Reviews from '../components/Dashboard/Reviews';
import Settings from '../components/Dashboard/Settings';
import PendingOrdersModal from '../components/Dashboard/PendingOrdersModal';

// Layout components
import TestingBanner from '../components/Dashboard/TestingBanner';
import Sidebar from '../components/Dashboard/Sidebar';
import MobileHeader from '../components/Dashboard/MobileHeader';
import MobileFloatingButton from '../components/Dashboard/MobileFloatingButton';

// Types
import { DashboardPage, NavigationItem } from '../types/dashboard';



const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Dashboard Overview', icon: HomeIcon, route: '/dashboard/seller' },
  { id: 'listings', label: 'My Listings', icon: ClipboardDocumentListIcon, route: '/dashboard/seller/listings' },
  { id: 'create', label: 'Add New Listing', icon: PlusIcon, route: '/dashboard/seller/create' },
  { id: 'orders', label: 'Pending Orders', icon: ShoppingBagIcon, route: '/dashboard/seller/orders' },
  { id: 'wallet', label: 'Wallet', icon: WalletIcon, route: '/dashboard/seller/wallet' },
  { id: 'disputes', label: 'Disputes', icon: ExclamationTriangleIcon, route: '/dashboard/seller/disputes' },
  { id: 'reviews', label: 'Reviews & Ratings', icon: StarIcon, route: '/dashboard/seller/reviews' },
  { id: 'settings', label: 'Settings', icon: Cog6ToothIcon, route: '/dashboard/seller/settings' },
];

interface SellerDashboardProps {
  onNavigate?: (page: string) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = () => {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingOrdersModalOpen, setPendingOrdersModalOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Listen for wallet navigation events
  useEffect(() => {
    const handleWalletNavigation = () => {
      setCurrentPage('wallet');
    };

    window.addEventListener('navigateToWallet', handleWalletNavigation);
    return () => window.removeEventListener('navigateToWallet', handleWalletNavigation);
  }, []);

  const handlePageChange = (page: DashboardPage) => {
    if (page === 'orders') {
      setPendingOrdersModalOpen(true);
      setSidebarOpen(false);
      return;
    }
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return <DashboardOverview handlePageChange={handlePageChange} />;
      case 'listings':
        return <MyListings />;
      case 'create':
        return <AddNewListing />;
      case 'orders':
        return <Orders />;
      case 'wallet':
        return <Wallet />;
      case 'disputes':
        return <Disputes />;
      case 'reviews':
        return <Reviews />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview handlePageChange={handlePageChange} />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white overflow-hidden flex flex-col">
      {/* Testing Mode Banner */}
      <TestingBanner />

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden mt-10">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isDesktop={isDesktop}
          navigationItems={navigationItems}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <MobileHeader
            setSidebarOpen={setSidebarOpen}
          />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-gradient-to-br from-[#0D0D0D] to-gray-900/50">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full max-w-7xl mx-auto"
            >
              {renderCurrentPage()}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile sticky add listing button */}
      <MobileFloatingButton handlePageChange={handlePageChange} />

      {/* Pending Orders Modal */}
      <PendingOrdersModal
        isOpen={pendingOrdersModalOpen}
        onClose={() => setPendingOrdersModalOpen(false)}
      />
    </div>
  );
};

export default SellerDashboard;