import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  WalletIcon,
  FireIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { TrendingUpIcon } from 'lucide-react';
import { DashboardPage } from '../../types/dashboard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, change, trend }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden"
    >
      <Card padding="none" className="h-full border-gray-700 hover:border-gray-600 transition-all duration-300 p-3 lg:p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs lg:text-sm font-medium text-gray-400 truncate">{title}</p>
            <p className="text-lg lg:text-2xl font-bold text-white mt-1 truncate">{value}</p>
            {change && (
              <div className={`flex items-center mt-1 lg:mt-2 text-xs lg:text-sm ${
                trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                <TrendingUpIcon className={`w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0 ${
                  trend === 'down' ? 'transform rotate-180' : ''
                }`} />
                <span className="truncate">{change}</span>
              </div>
            )}
          </div>
          <div className={`p-2 lg:p-3 rounded-lg flex-shrink-0 ml-2 ${color}`}>
            <Icon className="w-4 h-4 lg:w-6 lg:h-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

interface RecentActivityItem {
  id: string;
  type: 'sale' | 'view' | 'message' | 'dispute';
  title: string;
  description: string;
  time: string;
  amount?: string;
}

const recentActivity: RecentActivityItem[] = [
  {
    id: '1',
    type: 'sale',
    title: 'Account Sold',
    description: 'CODM Legendary Account sold to @gamer123',
    time: '2 hours ago',
    amount: '₦45,000'
  },
  {
    id: '2',
    type: 'view',
    title: 'Listing Viewed',
    description: 'PUBG Mobile Conqueror Account viewed 15 times',
    time: '4 hours ago'
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    description: 'Buyer inquiry about Free Fire account',
    time: '6 hours ago'
  },
  {
    id: '4',
    type: 'sale',
    title: 'Escrow Released',
    description: 'Payment released for Valorant account',
    time: '1 day ago',
    amount: '₦28,500'
  }
];



interface DashboardOverviewProps {
  handlePageChange: (page: DashboardPage) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ handlePageChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock data for different time periods
  const performanceData = {
    week: {
      profileViews: 287,
      listingViews: 1234,
      messages: 23,
      conversionRate: '15.2%',
      responseTime: '< 1h',
      rating: '4.9/5'
    },
    month: {
      profileViews: 1234,
      listingViews: 5678,
      messages: 89,
      conversionRate: '12.5%',
      responseTime: '< 2h',
      rating: '4.9/5'
    },
    year: {
      profileViews: 15678,
      listingViews: 67890,
      messages: 1045,
      conversionRate: '11.8%',
      responseTime: '< 3h',
      rating: '4.8/5'
    }
  };

  const currentData = performanceData[selectedPeriod];

  return (
    <div className="h-full flex flex-col space-y-4 lg:space-y-6 overflow-y-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 lg:p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">Welcome back, Blunt! 👋</h1>
            <p className="text-gray-400 text-sm lg:text-base">Here's what's happening with your gaming accounts today.</p>
          </div>
          <div className="hidden md:block">
            <Button
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              onClick={() => handlePageChange('create')}
            >
              Create New Listing
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 flex-shrink-0">
        <StatCard
          title="Total Earnings"
          value="₦234,500"
          icon={CurrencyDollarIcon}
          color="bg-green-500/20 text-green-400"
          change="+12.5%"
          trend="up"
        />
        <StatCard
          title="Active Listings"
          value="8"
          icon={FireIcon}
          color="bg-orange-500/20 text-orange-400"
          change="+2 this week"
          trend="up"
        />
        <StatCard
          title="Completed Sales"
          value="23"
          icon={CheckCircleIcon}
          color="bg-blue-500/20 text-blue-400"
          change="+3 this month"
          trend="up"
        />
        <StatCard
          title="Pending Orders"
          value="5"
          icon={ClockIcon}
          color="bg-yellow-500/20 text-yellow-400"
          change="2 urgent"
          trend="neutral"
        />
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 min-h-0">
        {/* Recent Activity */}
        <div className="lg:col-span-2 flex flex-col min-h-0 order-1 lg:order-none">
          <Card className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4 lg:mb-6 flex-shrink-0">
              <h2 className="text-lg lg:text-xl font-semibold text-white">Recent Activity</h2>
              <Button variant="ghost" size="sm" className="text-indigo-400 hover:bg-indigo-500/10">
                View All
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 lg:space-y-4">
              {recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-200 flex-shrink-0"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'sale' ? 'bg-green-500/20 text-green-400' :
                    activity.type === 'view' ? 'bg-blue-500/20 text-blue-400' :
                    activity.type === 'message' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {activity.type === 'sale' && <CurrencyDollarIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
                    {activity.type === 'view' && <EyeIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
                    {activity.type === 'message' && <ClockIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
                    {activity.type === 'dispute' && <ExclamationTriangleIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm lg:text-base truncate">{activity.title}</h3>
                    <p className="text-gray-400 text-xs lg:text-sm truncate">{activity.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {activity.amount && (
                      <p className="text-green-400 font-semibold text-sm lg:text-base">{activity.amount}</p>
                    )}
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions & Performance */}
        <div className="flex flex-col space-y-4 lg:space-y-6 min-h-0 order-2 lg:order-none">
          {/* Quick Actions */}
          <Card className="flex-shrink-0">
            <h2 className="text-lg lg:text-xl font-semibold text-white mb-3 lg:mb-4">Quick Actions</h2>
            <div className="space-y-2 lg:space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-gray-700 hover:border-indigo-400 hover:bg-indigo-500/10 text-sm lg:text-base py-2 lg:py-3"
                onClick={() => handlePageChange('create')}
              >
                <FireIcon className="w-4 h-4 mr-2" />
                Create New Listing
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-700 hover:border-purple-400 hover:bg-purple-500/10 text-sm lg:text-base py-2 lg:py-3"
                onClick={() => handlePageChange('wallet')}
              >
                <WalletIcon className="w-4 h-4 mr-2" />
                Withdraw Earnings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-700 hover:border-yellow-500 hover:bg-yellow-500/10 text-sm lg:text-base py-2 lg:py-3"
                onClick={() => handlePageChange('disputes')}
              >
                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                View Disputes
              </Button>
            </div>
          </Card>

          {/* Performance Overview */}
          <Card className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 lg:mb-4 flex-shrink-0">
              <h2 className="text-lg lg:text-xl font-semibold text-white">Performance</h2>
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setSelectedPeriod('week')}
                  className={`px-2 lg:px-3 py-1 text-xs lg:text-sm font-medium rounded-md transition-all duration-200 ${
                    selectedPeriod === 'week'
                      ? 'bg-indigo-500 text-white'
                     : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setSelectedPeriod('month')}
                  className={`px-2 lg:px-3 py-1 text-xs lg:text-sm font-medium rounded-md transition-all duration-200 ${
                    selectedPeriod === 'month'
                      ? 'bg-indigo-500 text-white'
                     : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setSelectedPeriod('year')}
                  className={`px-2 lg:px-3 py-1 text-xs lg:text-sm font-medium rounded-md transition-all duration-200 ${
                    selectedPeriod === 'year'
                      ? 'bg-indigo-500 text-white'
                     : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-3 lg:space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 text-sm lg:text-base">Profile Views</span>
                <span className="text-white font-semibold text-sm lg:text-base">{currentData.profileViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 text-sm lg:text-base">Listing Views</span>
                <span className="text-white font-semibold text-sm lg:text-base">{currentData.listingViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 text-sm lg:text-base">Messages</span>
                <span className="text-white font-semibold text-sm lg:text-base">{currentData.messages.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 text-sm lg:text-base">Conversion Rate</span>
                <span className="text-green-400 font-semibold text-sm lg:text-base">{currentData.conversionRate}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                 <span className="text-gray-400 text-sm lg:text-base">Response Time</span>
                 <span className="text-blue-400 font-semibold text-sm lg:text-base">{currentData.responseTime}</span>
               </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 text-sm lg:text-base">Rating</span>
                <span className="text-yellow-400 font-semibold text-sm lg:text-base">{currentData.rating}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;