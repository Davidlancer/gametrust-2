import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FireIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  InboxIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { TrendingUpIcon, TrendingDownIcon, Users, Target } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { DashboardPage } from '../../types/dashboard';
import { useEscrow } from '../../hooks/useEscrow';
import EscrowStatusCard from '../UI/EscrowStatusCard';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
  color: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose' | 'indigo';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  trend, 
  onClick,
  color 
}) => {
  const colorClasses = {
    emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
    amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400',
    rose: 'from-rose-500/10 to-rose-600/5 border-rose-500/20 text-rose-400',
    indigo: 'from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 text-indigo-400'
  };

  return (
    <motion.div
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border rounded-2xl p-4 sm:p-6 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:scale-[1.02] min-h-[120px] sm:min-h-[140px]`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} border ${colorClasses[color].split(' ')[2]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 
            trend === 'down' ? 'bg-rose-500/20 text-rose-400' : 
            'bg-gray-500/20 text-gray-400'
          }`}>
            {trend === 'up' && <TrendingUpIcon className="w-3 h-3" />}
            {trend === 'down' && <TrendingDownIcon className="w-3 h-3" />}
            <span className="hidden xs:inline">{change}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-opacity-90 transition-colors leading-tight">
          {value}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-gray-200 transition-colors leading-tight">
          {title}
        </p>
        {trend && change && (
          <p className="text-xs text-gray-400 sm:hidden mt-1">
            {change}
          </p>
        )}
      </div>
    </motion.div>
  );
};

interface ActivityItem {
  id: string;
  type: 'sale' | 'view' | 'message' | 'dispute' | 'review';
  title: string;
  description: string;
  time: string;
  amount?: string;
  status: 'success' | 'pending' | 'warning';
}

const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'sale',
    title: 'Account Sold Successfully',
    description: 'CODM Legendary Account • Buyer: @gamer123',
    time: '2 hours ago',
    amount: '₦45,000',
    status: 'success'
  },
  {
    id: '2',
    type: 'message',
    title: 'New Buyer Inquiry',
    description: 'Question about Free Fire Diamond account features',
    time: '4 hours ago',
    status: 'pending'
  },
  {
    id: '3',
    type: 'view',
    title: 'High Interest Listing',
    description: 'PUBG Mobile Conqueror Account • 23 views today',
    time: '6 hours ago',
    status: 'success'
  },
  {
    id: '4',
    type: 'sale',
    title: 'Escrow Payment Released',
    description: 'Valorant Radiant Account • Transaction completed',
    time: '1 day ago',
    amount: '₦28,500',
    status: 'success'
  },
  {
    id: '5',
    type: 'review',
    title: 'New 5-Star Review',
    description: 'Excellent service and fast delivery - @buyer456',
    time: '2 days ago',
    status: 'success'
  }
];

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  action: DashboardPage;
  badge?: string;
}

interface DashboardOverviewProps {
  handlePageChange: (page: DashboardPage) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ handlePageChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  // Escrow data handling
  const { escrow } = useEscrow();
  const escrowData = escrow;
  const escrowAmount = escrowData?.amount || 0;
  const escrowStatus = escrowData?.status || 'none';

  // Mock performance insights
  const insights = {
    week: {
      topPerformer: 'CODM Legendary Account',
      conversionRate: 15.2,
      avgResponseTime: '< 1h',
      totalViews: 287
    },
    month: {
      topPerformer: 'Free Fire Diamond Account',
      conversionRate: 12.5,
      avgResponseTime: '< 2h',
      totalViews: 1234
    },
    year: {
      topPerformer: 'PUBG Mobile Conqueror',
      conversionRate: 11.8,
      avgResponseTime: '< 3h',
      totalViews: 15678
    }
  };

  const currentInsights = insights[selectedPeriod];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Create New Listing',
      description: 'Add a gaming account to sell',
      icon: PlusIcon,
      color: 'from-indigo-500 to-purple-600',
      action: 'create'
    },
    {
      id: '2',
      title: 'Check Messages',
      description: 'Respond to buyer inquiries',
      icon: InboxIcon,
      color: 'from-blue-500 to-cyan-600',
      action: 'orders',
      badge: '3'
    },
    {
      id: '3',
      title: 'Withdraw Funds',
      description: 'Transfer earnings to bank',
      icon: CreditCardIcon,
      color: 'from-emerald-500 to-teal-600',
      action: 'wallet'
    },
    {
      id: '4',
      title: 'View Analytics',
      description: 'Track performance metrics',
      icon: ArrowTrendingUpIcon,
      color: 'from-amber-500 to-orange-600',
      action: 'reviews'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return CurrencyDollarIcon;
      case 'view': return EyeIcon;
      case 'message': return ChatBubbleLeftRightIcon;
      case 'dispute': return ExclamationTriangleIcon;
      case 'review': return StarIcon;
      default: return BellIcon;
    }
  };

  const getActivityColor = (type: string, status: string) => {
    if (status === 'success') {
      switch (type) {
        case 'sale': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        case 'review': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      }
    }
    if (status === 'pending') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
              Welcome back, Blunt! 👋
            </h1>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
              Your seller dashboard is performing well today. Here's your overview.
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 hover:border-indigo-400 hover:bg-indigo-500/10 text-gray-300 hover:text-white min-h-[44px] flex-1 xs:flex-none"
              onClick={() => handlePageChange('reviews')}
            >
              <ArrowTrendingUpIcon className="w-4 h-4 mr-2" />
              <span className="hidden xs:inline">View </span>Analytics
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg min-h-[44px] flex-1 xs:flex-none"
              onClick={() => handlePageChange('create')}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              <span className="hidden xs:inline">Create </span>Listing
            </Button>
          </div>
        </div>
      </header>

      {/* Escrow Alert */}
      {escrowData && escrowStatus === 'in_escrow' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="p-2.5 sm:p-3 bg-amber-500/20 rounded-xl flex-shrink-0">
              <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
                <h3 className="text-base sm:text-lg font-semibold text-white leading-tight">Escrow Funds Secured</h3>
                <EscrowStatusCard status={escrowStatus} />
              </div>
              <p className="text-amber-200 font-medium text-sm sm:text-base">
                ₦{escrowAmount.toLocaleString()} is safely held in escrow
              </p>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Transaction ID: {escrowData?.id || 'N/A'}<br className="xs:hidden" />
                <span className="hidden xs:inline"> • </span>Awaiting buyer confirmation
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Metrics Grid */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard
            title="Total Earnings"
            value="₦234,500"
            icon={CurrencyDollarIcon}
            change="+12.5%"
            trend="up"
            color="emerald"
            onClick={() => handlePageChange('wallet')}
          />
          <MetricCard
            title="Active Listings"
            value="8"
            icon={FireIcon}
            change="+2 new"
            trend="up"
            color="blue"
            onClick={() => handlePageChange('listings')}
          />
          <MetricCard
            title="Completed Sales"
            value="23"
            icon={CheckCircleIcon}
            change="+3 this month"
            trend="up"
            color="purple"
            onClick={() => handlePageChange('orders')}
          />
          <MetricCard
            title="Pending Orders"
            value={escrowData && escrowStatus === 'in_escrow' ? "6" : "5"}
            icon={ClockIcon}
            change={escrowData && escrowStatus === 'in_escrow' ? "1 in escrow" : "2 urgent"}
            trend="neutral"
            color="amber"
            onClick={() => handlePageChange('orders')}
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-h-0">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                Recent Activity
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 text-sm px-2 sm:px-3"
              >
                <span className="hidden xs:inline">View </span>All
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3">
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <BellIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2">No Recent Activity</h3>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
                    Your recent sales, messages, and account views will appear here.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3 sm:mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 min-h-[44px]"
                    onClick={() => handlePageChange('create')}
                  >
                    Create Your First Listing
                  </Button>
                </div>
              ) : (
                recentActivity.map((activity, index) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50 group cursor-pointer"
                    >
                      <div className={`p-2 sm:p-2.5 rounded-lg border flex-shrink-0 ${getActivityColor(activity.type, activity.status)} group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between mb-1 gap-1 xs:gap-2">
                          <h3 className="text-white font-medium text-sm sm:text-base group-hover:text-indigo-300 transition-colors leading-tight">
                            {activity.title}
                          </h3>
                          <span className="text-xs text-gray-400 flex-shrink-0 xs:ml-2">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                          {activity.description}
                        </p>
                        {activity.amount && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                              {activity.amount}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar: Quick Actions & Insights */}
        <aside className="flex flex-col space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              Quick Actions
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {quickActions.map((action) => (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-3 sm:p-4 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium text-left transition-all duration-200 hover:shadow-lg group relative overflow-hidden min-h-[60px] sm:min-h-[auto]`}
                  onClick={() => handlePageChange(action.action)}
                >
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors flex-shrink-0">
                      <action.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm leading-tight">{action.title}</h3>
                        {action.badge && (
                          <span className="bg-white/30 text-white text-xs px-2 py-1 rounded-full font-bold flex-shrink-0">
                            {action.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-white/80 text-xs mt-1 leading-relaxed">{action.description}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Performance Insights */}
          <Card className="flex-1">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 sm:mb-4 gap-3 xs:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                Insights
              </h2>
              <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700 w-full xs:w-auto">
                {(['week', 'month', 'year'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`flex-1 xs:flex-none px-2 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 capitalize min-h-[36px] flex items-center justify-center ${
                      selectedPeriod === period
                        ? 'bg-indigo-500 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-300">Top Performer</span>
                  <StarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                </div>
                <p className="text-white font-semibold text-sm leading-tight">{currentInsights.topPerformer}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">Conversion</p>
                  <p className="text-emerald-400 font-bold text-base sm:text-lg">{currentInsights.conversionRate}%</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">Response</p>
                  <p className="text-blue-400 font-bold text-base sm:text-lg">{currentInsights.avgResponseTime}</p>
                </div>
              </div>
              
              <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-300">Total Views</span>
                  <EyeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                </div>
                <p className="text-white font-bold text-lg sm:text-xl">{currentInsights.totalViews.toLocaleString()}</p>
                <p className="text-purple-300 text-xs mt-1">Across all listings</p>
              </div>
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
};

export default DashboardOverview;