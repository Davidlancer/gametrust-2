import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import { useActivityLog } from '../../context/ActivityLogContext';
import {
  UsersIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon: Icon, color }) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {changeType === 'increase' ? (
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-500' : 'text-red-500'
            }`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-gray-400 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

interface DashboardHomeProps {
  setActivePanel?: (panel: string) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ setActivePanel }) => {
  const { log, clearLog } = useActivityLog();
  const [showAllActivity, setShowAllActivity] = useState(false);
  const stats = [
    {
      title: 'Total Users',
      value: '12,847',
      change: 12.5,
      changeType: 'increase' as const,
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Listings',
      value: '3,421',
      change: 8.2,
      changeType: 'increase' as const,
      icon: ShoppingBagIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Open Disputes',
      value: '23',
      change: -15.3,
      changeType: 'decrease' as const,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500'
    },
    {
      title: 'Monthly Revenue',
      value: '$47,892',
      change: 23.1,
      changeType: 'increase' as const,
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500'
    }
  ];

  // Use activity log from context, fallback to empty array if no logs
  const recentActivity = log.length > 0 ? log.slice(0, 5).map(entry => ({
    id: entry.id,
    type: entry.type,
    message: entry.message,
    time: entry.timestamp,
    status: entry.severity
  })) : [
    {
      id: 'default-1',
      type: 'system',
      message: 'Admin dashboard initialized - ready to track activity',
      time: new Date().toLocaleString(),
      status: 'info'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return UsersIcon;
      case 'listing': return ShoppingBagIcon;
      case 'dispute': return ExclamationTriangleIcon;
      case 'verification': return CheckCircleIcon;
      default: return EyeIcon;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'urgent':
      case 'error': return 'text-red-400';
      case 'pending':
      case 'warning': return 'text-yellow-400';
      case 'completed':
      case 'success': return 'text-green-400';
      case 'info':
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening on GameTrust today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <button 
                onClick={() => setShowAllActivity(true)}
                className="text-sm text-red-400 hover:text-red-300 font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="p-2 bg-gray-700 rounded-lg">
                      <Icon className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">{activity.time}</span>
                        {activity.status && (
                          <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                            • {activity.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setActivePanel?.('disputes')}
                className="w-full flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-medium text-white">Review Disputes</span>
                </div>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">5</span>
              </button>
              
              <button 
                onClick={() => setActivePanel?.('verifications')}
                className="w-full flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Pending Verifications</span>
                </div>
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">12</span>
              </button>
              
              <button 
                onClick={() => setActivePanel?.('users')}
                className="w-full flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <UsersIcon className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">Manage Users</span>
                </div>
              </button>
              
              <button 
                onClick={() => setActivePanel?.('revenue')}
                className="w-full flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-white">Revenue Report</span>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Activity Log Modal */}
      {showAllActivity && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-gray-800 w-full max-w-4xl rounded-lg shadow-xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">All Activity Logs</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={clearLog}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 text-sm"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
                <button
                  onClick={() => setShowAllActivity(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {log.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No activity logs yet</p>
                  <p className="text-gray-500 text-sm mt-2">Admin actions will appear here as they happen</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {log.map((entry, index) => {
                    const Icon = getActivityIcon(entry.type);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex items-start space-x-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="p-2 bg-gray-700 rounded-lg flex-shrink-0">
                          <Icon className="w-4 h-4 text-gray-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white break-words">{entry.message}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-400">{entry.timestamp}</span>
                            <span className={`text-xs font-medium capitalize ${getStatusColor(entry.severity)}`}>
                              • {entry.severity}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              • {entry.type}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;