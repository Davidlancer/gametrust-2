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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import { BuyerDashboardPage } from '../../types/dashboard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 lg:p-6 hover:border-indigo-500/30 transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 lg:w-12 lg:h-12 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
      </div>
      {trend && (
        <span className="text-xs lg:text-sm text-green-400 font-medium">{trend}</span>
      )}
    </div>
    <h3 className="text-lg lg:text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-xs lg:text-sm text-gray-400">{title}</p>
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
    description: 'Order delivered - Confirm access',
    time: '2 hours ago',
    status: 'pending'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Wallet Funded',
    description: '₦50,000 added to wallet',
    time: '1 day ago',
    status: 'success'
  },
  {
    id: '3',
    type: 'referral',
    title: 'Referral Bonus',
    description: '₦500 earned from @newuser',
    time: '2 days ago',
    status: 'success'
  },
  {
    id: '4',
    type: 'order',
    title: 'PUBG Mobile Account',
    description: 'Order completed successfully',
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
}

const BuyerDashboardOverview: React.FC<BuyerDashboardOverviewProps> = ({ handlePageChange }) => {
  return (
    <div className="h-full flex flex-col space-y-4 lg:space-y-6 overflow-y-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 lg:p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">Welcome back, Blunt 👋</h1>
            <p className="text-sm lg:text-base text-gray-300">Ready to find your next gaming account?</p>
          </div>
          <div className="hidden lg:block">
            <Button
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              onClick={() => window.location.href = '/marketplace'}
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 flex-shrink-0">
        <StatCard
          title="Active Escrows"
          value={3}
          icon={ShoppingBagIcon}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend="+1 this week"
        />
        <StatCard
          title="Completed Orders"
          value={12}
          icon={CheckCircleIcon}
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend="+2 this month"
        />
        <StatCard
          title="Wallet Balance"
          value="₦12,000"
          icon={WalletIcon}
          color="bg-gradient-to-br from-indigo-500 to-purple-500"
        />
        <StatCard
          title="Referral Earnings"
          value="₦3,500"
          icon={UserGroupIcon}
          color="bg-gradient-to-br from-orange-500 to-red-500"
          trend="+₦500 this week"
        />
      </div>

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
              onClick={() => handlePageChange('wallet')}
            >
              <PlusIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
              Fund Wallet
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 hover:border-orange-400 hover:bg-orange-500/10 text-sm lg:text-base py-2 lg:py-3"
              onClick={() => handlePageChange('referral')}
            >
              <GiftIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
              Refer & Earn ₦500
            </Button>
            
            <div className="pt-2 lg:pt-4">
              <Button
                variant="primary"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-sm lg:text-base py-2 lg:py-3"
                onClick={() => window.location.href = '/marketplace'}
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