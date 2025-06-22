import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  CheckCircleIcon,
  WalletIcon,
  UserGroupIcon,
  EyeIcon,
  PlusIcon,
  GiftIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import { BuyerDashboardPage } from '../../types/dashboard';
import { useToast } from '../UI/ToastProvider';
import { useEscrow } from '../../hooks/useEscrow';
import EscrowStatusCard from '../UI/EscrowStatusCard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div
    whileHover={{ 
      scale: 1.02,
      y: -2,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-5 lg:p-7 hover:border-indigo-400/40 transition-all duration-500 group overflow-hidden"
  >
    {/* Background glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Animated border gradient */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`relative w-12 h-12 lg:w-14 lg:h-14 ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
          <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white drop-shadow-sm" />
          {/* Icon glow effect */}
          <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {trend && (
          <motion.span 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs lg:text-sm bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-semibold px-2 py-1 bg-green-400/10 rounded-lg border border-green-400/20 ml-3"
          >
            {trend}
          </motion.span>
        )}
      </div>
      
      <div className="space-y-2">
        <motion.h3 
          className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {value}
        </motion.h3>
        <p className="text-sm lg:text-base text-gray-300 font-medium tracking-wide">{title}</p>
      </div>
      
      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
    </div>
  </motion.div>
);

interface RecentActivityItem {
  id: string;
  type: 'order' | 'payment' | 'dispute' | 'referral';
  title: string;
  description: string;
  time: string;
  status: 'success' | 'pending' | 'warning';
}

const recentActivity: RecentActivityItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'CODM Legendary Account',
    description: 'Order delivered - Confirm access (₦70,000)',
    time: '2 hours ago',
    status: 'pending'
  },
  {
    id: '2',
    type: 'order',
    title: 'PUBG Elite Account',
    description: 'Order completed successfully (₦50,000)',
    time: '1 day ago',
    status: 'success'
  },
  {
    id: '3',
    type: 'dispute',
    title: 'Free Fire God Mode',
    description: 'Dispute opened - Under review (₦30,000)',
    time: '2 days ago',
    status: 'warning'
  },
  {
    id: '4',
    type: 'referral',
    title: 'Referral Bonus',
    description: '₦500 earned from new user',
    time: '3 days ago',
    status: 'success'
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'order':
      return ShoppingBagIcon;
    case 'payment':
      return WalletIcon;
    case 'dispute':
      return ExclamationTriangleIcon;
    case 'referral':
      return UserGroupIcon;
    default:
      return ShoppingBagIcon;
  }
};

interface BuyerDashboardOverviewProps {
  handlePageChange: (page: BuyerDashboardPage) => void;
  onNavigate?: (page: string) => void;
}

const BuyerDashboardOverview: React.FC<BuyerDashboardOverviewProps> = ({ handlePageChange, onNavigate }) => {
  const { showSuccess, showInfo, showError } = useToast();
  
  // Safe escrow data handling
  let escrowData = null;
  let updateEscrowStatusFn = null;
  let clearEscrowFn = null;
  
  try {
    const { escrow, updateEscrowStatus, clearEscrow } = useEscrow();
    escrowData = escrow;
    updateEscrowStatusFn = updateEscrowStatus;
    clearEscrowFn = clearEscrow;
  } catch (error) {
    console.error('Error loading escrow data in BuyerDashboardOverview:', error);
  }
  
  // Safe fallbacks
  const escrowAmount = escrowData?.amount || 0;
  const escrowStatus = escrowData?.status || 'none';
  
  console.log('BuyerDashboardOverview - Escrow Status:', escrowData);

  const handleMarketplaceClick = () => {
    showInfo('Marketplace', 'This would redirect to marketplace in a real app');
  };

  const handleFundWallet = () => {
    showSuccess('Wallet Funding', 'Mock funding modal would open here');
    handlePageChange('wallet');
  };

  const handleReferralClick = () => {
    showInfo('Referral Program', 'Opening referral dashboard...');
    handlePageChange('referral');
  };

  const handleConfirmDelivery = () => {
    try {
      if (escrowData && updateEscrowStatusFn) {
        updateEscrowStatusFn('released');
        showSuccess(
          'Payment Released',
          `₦${escrowAmount.toLocaleString()} has been released to the seller. Thank you for your purchase!`
        );
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      showError('Error', 'Failed to confirm delivery. Please try again.');
    }
  };

  const handleRaiseDispute = () => {
    try {
      if (escrowData && updateEscrowStatusFn) {
        updateEscrowStatusFn('disputed');
        showError(
          'Dispute Raised',
          'Your dispute has been submitted. Our support team will review it within 24 hours.'
        );
      }
    } catch (error) {
      console.error('Error raising dispute:', error);
      showError('Error', 'Failed to raise dispute. Please try again.');
    }
  };
  return (
    <div className="h-full flex flex-col space-y-4 lg:space-y-6 overflow-y-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 lg:p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">Welcome back, BuyerUser 👋</h1>
            <p className="text-sm lg:text-base text-gray-300">Ready to find your next gaming account?</p>
          </div>
          <div className="hidden lg:block">
            <Button
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              onClick={handleMarketplaceClick}
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 flex-shrink-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatCard
            title="Active Escrows"
            value={escrow ? 1 : 0}
            icon={ShoppingBagIcon}
            color="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500"
            trend={escrow ? "Pending Confirmation" : "No Active Escrows"}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatCard
            title="Completed Orders"
            value={1}
            icon={CheckCircleIcon}
            color="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500"
            trend="PUBG Elite"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StatCard
            title="Wallet Balance"
            value="₦100,000"
            icon={WalletIcon}
            color="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StatCard
            title="Referral Earnings"
            value="₦3,000"
            icon={UserGroupIcon}
            color="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"
            trend="6 Converted"
          />
        </motion.div>
      </motion.div>

      {/* Active Escrow Section */}
      {escrowData && escrowStatus === 'in_escrow' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 lg:p-6 flex-shrink-0"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <ShieldCheckIcon className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Active Escrow Transaction</h3>
                <EscrowStatusCard status={escrowStatus} />
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium">{escrowData.accountTitle || 'N/A'}</p>
                <p className="text-gray-300">Amount: ₦{escrowAmount.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">
                  Transaction ID: {escrowData.id || 'N/A'}
                </p>
                <p className="text-yellow-300 text-sm">
                  ⚠️ Please confirm delivery once you receive and verify the account details
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmDelivery}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Confirm Delivery
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRaiseDispute}
                className="border-red-500 text-red-400 hover:bg-red-500/10 hover:border-red-400"
              >
                <ExclamationCircleIcon className="w-4 h-4 mr-2" />
                Raise Dispute
              </Button>
            </div>
          </div>
          {import.meta.env.MODE === 'development' && (
            <div className="mt-4 pt-4 border-t border-yellow-500/20">
              <p className="text-yellow-400 text-xs font-medium mb-1">🧪 Development Mode</p>
              <p className="text-yellow-300 text-xs">
                This is a simulated escrow transaction using localStorage
              </p>
            </div>
          )}
        </motion.div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 min-h-0">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 lg:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 lg:mb-6 flex-shrink-0">
            <h2 className="text-lg lg:text-xl font-semibold text-white">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="text-indigo-400 hover:bg-indigo-500/10">
              View All
            </Button>
          </div>
          
          <div className="flex-1 space-y-3 lg:space-y-4 overflow-y-auto">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <motion.div
                  key={activity.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
                >
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-green-500/20 text-green-400' :
                    activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm lg:text-base font-medium text-white truncate">{activity.title}</p>
                    <p className="text-xs lg:text-sm text-gray-400 truncate">{activity.description}</p>
                  </div>
                  <span className="text-xs lg:text-sm text-gray-500 flex-shrink-0">{activity.time}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 lg:p-6 flex flex-col">
          <h2 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex-shrink-0">Quick Actions</h2>
          
          <div className="flex-1 space-y-3 lg:space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 hover:border-indigo-400 hover:bg-indigo-500/10 text-sm lg:text-base py-2 lg:py-3"
              onClick={() => handlePageChange('orders')}
            >
              <EyeIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
              View All Orders
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 hover:border-purple-400 hover:bg-purple-500/10 text-sm lg:text-base py-2 lg:py-3"
              onClick={handleFundWallet}
            >
              <PlusIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
              Fund Wallet
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 hover:border-orange-400 hover:bg-orange-500/10 text-sm lg:text-base py-2 lg:py-3"
              onClick={handleReferralClick}
            >
              <GiftIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
              Refer & Earn ₦500
            </Button>
            
            <div className="pt-2 lg:pt-4">
              <Button
                variant="primary"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-sm lg:text-base py-2 lg:py-3"
                onClick={handleMarketplaceClick}
              >
                <EyeIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                Browse Marketplace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardOverview;