import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  CheckCircleIcon,
  WalletIcon,
  UserGroupIcon,
  EyeIcon,
  GiftIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  TrophyIcon,
  HeartIcon,
  BoltIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  FunnelIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import { BuyerDashboardPage } from '../../types/dashboard';
import { alertUtils } from '../../utils/alertMigration';
import { useEscrow } from '../../hooks/useEscrow';
import EscrowStatusCard from '../UI/EscrowStatusCard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div
    whileHover={{ 
      scale: 1.02,
      y: -2,
      boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)"
    }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="relative bg-gradient-to-br from-slate-50/[0.02] via-white/[0.03] to-slate-100/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 lg:p-6 hover:border-white/[0.12] transition-all duration-500 group overflow-hidden shadow-xl shadow-black/5 h-[140px] lg:h-[160px]"
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)'
    }}
  >
    {/* Ambient glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-purple-500/[0.02] to-pink-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    
    {/* Floating particles effect */}
    <div className="absolute inset-0 overflow-hidden rounded-3xl">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-pink-400/8 to-orange-400/8 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
    
    <div className="relative z-10 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className={`relative w-12 h-12 lg:w-14 lg:h-14 ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
          <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white drop-shadow-sm" />
          {/* Icon shimmer effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {trend && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-lg border border-emerald-400/20 shadow-sm"
          >
            <SparklesIcon className="w-3 h-3 text-emerald-400" />
            <span className="text-xs font-medium bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              {trend}
            </span>
          </motion.div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-center space-y-2">
        <motion.h3 
          className="text-xl lg:text-2xl font-bold bg-gradient-to-br from-white via-slate-100 to-slate-200 bg-clip-text text-transparent leading-tight tracking-tight"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {value}
        </motion.h3>
        <p className="text-sm text-slate-300 font-medium opacity-80">{title}</p>
      </div>
      
      {/* Animated bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  </motion.div>
);

interface RecentActivityItem {
  id: string;
  type: 'order' | 'payment' | 'dispute' | 'referral' | 'message' | 'access';
  title: string;
  description: string;
  time: string;
  timestamp: string;
  status: 'success' | 'pending' | 'warning';
  amount?: string;
}

const recentActivity: RecentActivityItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Placed',
    description: 'CODM Legendary Account - Awaiting delivery',
    time: '2 hours ago',
    timestamp: '03 Aug, 2025 – 2:30 PM',
    status: 'pending',
    amount: '₦70,000'
  },
  {
    id: '2',
    type: 'access',
    title: 'Access Confirmed',
    description: 'PUBG Elite Account - Payment released to seller',
    time: '1 day ago',
    timestamp: '02 Aug, 2025 – 4:15 PM',
    status: 'success',
    amount: '₦50,000'
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    description: 'Seller responded about Free Fire account details',
    time: '2 days ago',
    timestamp: '01 Aug, 2025 – 11:20 AM',
    status: 'success'
  },
  {
    id: '4',
    type: 'dispute',
    title: 'Dispute Opened',
    description: 'Free Fire God Mode - Under admin review',
    time: '2 days ago',
    timestamp: '01 Aug, 2025 – 9:45 AM',
    status: 'warning',
    amount: '₦30,000'
  },
  {
    id: '5',
    type: 'referral',
    title: 'Referral Bonus',
    description: 'Earned from new user @gamer456 registration',
    time: '3 days ago',
    timestamp: '31 Jul, 2025 – 6:30 PM',
    status: 'success',
    amount: '₦500'
  },
  {
    id: '6',
    type: 'payment',
    title: 'Wallet Funded',
    description: 'Added funds via bank transfer',
    time: '4 days ago',
    timestamp: '30 Jul, 2025 – 3:15 PM',
    status: 'success',
    amount: '₦25,000'
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
    case 'message':
      return ChatBubbleLeftRightIcon;
    case 'access':
      return CheckCircleIcon;
    default:
      return ShoppingBagIcon;
  }
};

const getActivityEmoji = (type: string) => {
  switch (type) {
    case 'order':
      return '🛒';
    case 'payment':
      return '💳';
    case 'dispute':
      return '⚠️';
    case 'referral':
      return '🎁';
    case 'message':
      return '💬';
    case 'access':
      return '✅';
    default:
      return '🛒';
  }
};

const filterOptions = [
  { value: 'all', label: 'All Activity' },
  { value: 'order', label: 'Orders' },
  { value: 'message', label: 'Messages' },
  { value: 'access', label: 'Access Confirmations' },
  { value: 'payment', label: 'Payments' },
  { value: 'dispute', label: 'Disputes' },
  { value: 'referral', label: 'Referrals' }
];

interface BuyerDashboardOverviewProps {
  handlePageChange: (page: BuyerDashboardPage) => void;
  onNavigate?: (page: string) => void;
}

const BuyerDashboardOverview: React.FC<BuyerDashboardOverviewProps> = ({ handlePageChange }) => {

  const { escrow: escrowData, updateEscrowStatus } = useEscrow();
  const [activityFilter, setActivityFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Safe fallbacks
  const escrowAmount = escrowData?.amount || 0;
  const escrowStatus = escrowData?.status || 'none';
  
  console.log('BuyerDashboardOverview - Escrow Status:', escrowData);

  const handleMarketplaceClick = () => {
    alertUtils.info('Marketplace - This would redirect to marketplace in a real app');
  };

  const handleFundWallet = () => {
    alertUtils.success('Wallet Funding - Mock funding modal would open here');
    handlePageChange('wallet');
  };

  const handleReferralClick = () => {
    alertUtils.info('Referral Program - Opening referral dashboard...');
    handlePageChange('referral');
  };

  const handleSettingsClick = () => {
    alertUtils.info('Settings - Opening account settings...');
    handlePageChange('settings');
  };

  const handleConfirmDelivery = () => {
    try {
      if (escrowData && updateEscrowStatus) {
        updateEscrowStatus('released');
        alertUtils.success(
          `Payment Released - ₦${escrowAmount.toLocaleString()} has been released to the seller. Thank you for your purchase!`
        );
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      alertUtils.error('Error - Failed to confirm delivery. Please try again.');
    }
  };

  const handleRaiseDispute = () => {
    try {
      if (escrowData && updateEscrowStatus) {
        updateEscrowStatus('disputed');
        alertUtils.error(
          'Dispute Raised - Your dispute has been submitted. Our support team will review it within 24 hours.'
        );
      }
    } catch (error) {
      console.error('Error raising dispute:', error);
      alertUtils.error('Error - Failed to raise dispute. Please try again.');
    }
  };
  return (
    <div className="min-h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 space-y-6 lg:space-y-8 overflow-y-auto" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-gradient-to-br from-slate-50/[0.03] via-white/[0.05] to-slate-100/[0.03] backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-6 lg:p-8 overflow-hidden shadow-xl shadow-black/5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)'
        }}
      >
        {/* Ambient background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-purple-500/[0.03] to-pink-500/[0.02] opacity-80" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-pink-400/8 to-orange-400/8 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <TrophyIcon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <motion.h1 
                  className="text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-br from-white via-slate-100 to-slate-200 bg-clip-text text-transparent leading-tight tracking-tight mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Welcome back, Blunt! 👋
                </motion.h1>
                <motion.p 
                  className="text-sm lg:text-base text-slate-300 font-medium opacity-90 leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Ready to discover your next legendary gaming account?
                </motion.p>
              </div>
            </div>
            
            {/* Quick stats preview */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <div>
                  <span className="text-green-400 font-semibold text-xs">Active Orders</span>
                  <p className="text-white font-bold text-base">1</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl border border-pink-500/20">
                <HeartIcon className="w-4 h-4 text-pink-400" />
                <div>
                  <span className="text-pink-400 font-semibold text-xs">Wallet Balance</span>
                  <p className="text-white font-bold text-base">₦100K</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:gap-3 lg:min-w-[240px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              variant="primary"
              size="md"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 border-0 font-semibold rounded-xl px-6 py-3 text-sm"
              onClick={handleMarketplaceClick}
            >
              <BoltIcon className="w-4 h-4 mr-2" />
              Explore Marketplace
            </Button>
            <Button
              variant="outline"
              size="md"
              className="border-white/20 text-slate-300 hover:bg-white/5 hover:border-white/30 backdrop-blur-sm font-medium rounded-xl px-6 py-3 text-sm"
              onClick={() => handlePageChange('wallet')}
            >
              <WalletIcon className="w-4 h-4 mr-2" />
              Fund Wallet
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatCard
            title="Active Escrows"
            value={escrowData ? 1 : 0}
            icon={ShoppingBagIcon}
            color="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500"
            trend={escrowData ? "Pending Confirmation" : "No Active Escrows"}
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
                <p className="text-white font-medium">{escrowData.listingTitle || 'N/A'}</p>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Activity */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
           className="xl:col-span-2 relative bg-gradient-to-br from-slate-50/[0.02] via-white/[0.04] to-slate-100/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 lg:p-7 flex flex-col overflow-hidden shadow-lg shadow-black/5 min-h-[500px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] via-purple-500/[0.02] to-pink-500/[0.01] opacity-60" />
          
          <div className="relative z-10 flex-1 flex flex-col">
             <div className="flex items-center justify-between mb-6 flex-shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                   <BoltIcon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
                 </div>
                 <div>
                   <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                     Recent Activity
                   </h2>
                   <p className="text-sm text-slate-400 font-medium">Your latest transactions</p>
                 </div>
               </div>

            </div>
            
            {/* Filter and Controls */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="group flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-transparent hover:bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] rounded-md transition-all duration-200 min-w-[100px]"
                >
                  <FunnelIcon className="w-3.5 h-3.5" />
                  <span className="flex-1 text-left">
                    {filterOptions.find(opt => opt.value === activityFilter)?.label}
                  </span>
                  <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${showFilterDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showFilterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-1 w-44 bg-slate-800/95 backdrop-blur-xl border border-white/[0.08] rounded-md shadow-xl z-50 overflow-hidden"
                  >
                    <div className="py-1">
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setActivityFilter(option.value);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors duration-150 hover:bg-white/[0.05] ${
                            activityFilter === option.value 
                              ? 'text-indigo-400 bg-indigo-500/[0.08]' 
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              
              <button
                onClick={() => handlePageChange('orders')}
                className="group flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-400 hover:text-indigo-300 bg-gray-100/5 hover:bg-gray-200/10 border border-gray-300/20 hover:border-indigo-400/30 rounded-md transition-all duration-200 hover:shadow-sm max-h-8 w-fit"
              >
                <span>View All</span>
                <ArrowRightIcon className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {recentActivity
                .filter(activity => activityFilter === 'all' || activity.type === activityFilter)
                .map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                const emoji = getActivityEmoji(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ 
                      scale: 1.005,
                      y: -2,
                      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                    }}
                    className="group relative bg-gradient-to-r from-white/[0.02] to-white/[0.05] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] hover:from-white/[0.04] hover:to-white/[0.08] transition-all duration-300 cursor-pointer overflow-hidden min-h-[80px] flex items-center"
                    style={{
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    {/* Subtle hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.01] to-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    
                    <div className="relative z-10 flex items-center w-full gap-4">
                      {/* Icon with emoji overlay */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm border shadow-sm transition-all duration-300 group-hover:scale-105 ${
                          activity.status === 'success' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25 group-hover:bg-emerald-500/20' :
                          activity.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/25 group-hover:bg-amber-500/20' :
                          'bg-rose-500/15 text-rose-400 border-rose-500/25 group-hover:bg-rose-500/20'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-800/90 rounded-full flex items-center justify-center text-xs border border-white/10">
                          {emoji}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white group-hover:text-slate-100 transition-colors truncate mb-1">
                              {activity.title}
                            </h4>
                            <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors truncate leading-relaxed">
                              {activity.description}
                            </p>
                          </div>
                          
                          {/* Right side info */}
                          <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                            {activity.amount && (
                              <span className="text-xs font-semibold text-white bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                {activity.amount}
                              </span>
                            )}
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <ClockIcon className="w-3 h-3" />
                              <span>{activity.time}</span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium hidden sm:block">
                              {activity.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                      activity.status === 'success' ? 'bg-emerald-400' :
                      activity.status === 'pending' ? 'bg-amber-400' :
                      'bg-rose-400'
                    }`} />
                  </motion.div>
                );
              })}
              
              {/* Empty state */}
              {recentActivity.filter(activity => activityFilter === 'all' || activity.type === activityFilter).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                    <BoltIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No Activity Found</h3>
                  <p className="text-sm text-slate-400 max-w-sm">
                    No {filterOptions.find(opt => opt.value === activityFilter)?.label.toLowerCase()} found. Try a different filter or check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-gradient-to-br from-slate-50/[0.02] via-white/[0.04] to-slate-100/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 lg:p-7 flex flex-col overflow-hidden shadow-lg shadow-black/5 min-h-[500px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          {/* Ambient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.01] via-pink-500/[0.02] to-orange-500/[0.01] opacity-60" />
          
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-6 flex-shrink-0">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <SparklesIcon className="w-5 h-5 lg:w-6 lg:h-6 text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  Quick Actions
                </h2>
                <p className="text-sm text-slate-400 font-medium">Get things done faster</p>
              </div>
            </div>
            
            <div className="space-y-4 flex-1">
              <motion.div
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  variant="primary"
                  className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 justify-start text-left shadow-lg hover:shadow-xl transition-all duration-300 border-0 font-semibold rounded-xl py-3 h-auto"
                  onClick={handleMarketplaceClick}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <EyeIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-white text-sm">Browse Marketplace</div>
                      <div className="text-xs text-white/80 font-medium">Discover gaming accounts</div>
                    </div>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20 justify-start text-left backdrop-blur-sm font-medium rounded-xl py-3 h-auto transition-all duration-300"
                  onClick={() => handlePageChange('orders')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-blue-500/20">
                      <ShoppingBagIcon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-white text-sm">View All Orders</div>
                      <div className="text-xs text-slate-400 font-medium">Track your purchases</div>
                    </div>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20 justify-start text-left backdrop-blur-sm font-medium rounded-xl py-3 h-auto transition-all duration-300"
                  onClick={handleFundWallet}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-emerald-500/20">
                      <WalletIcon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-white text-sm">Fund Wallet</div>
                      <div className="text-xs text-slate-400 font-medium">Add funds & track balance</div>
                    </div>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20 justify-start text-left backdrop-blur-sm font-medium rounded-xl py-3 h-auto transition-all duration-300"
                  onClick={handleReferralClick}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-orange-500/20">
                      <GiftIcon className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-white text-sm">Refer & Earn ₦500</div>
                      <div className="text-xs text-slate-400 font-medium">Earn rewards & bonuses</div>
                    </div>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20 justify-start text-left backdrop-blur-sm font-medium rounded-xl py-3 h-auto transition-all duration-300"
                  onClick={handleSettingsClick}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-amber-500/20">
                      <ExclamationCircleIcon className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-white text-sm">Settings</div>
                      <div className="text-xs text-slate-400 font-medium">Account & preferences</div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyerDashboardOverview;