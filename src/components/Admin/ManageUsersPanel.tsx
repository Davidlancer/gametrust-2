import React from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useActivityLog } from '../../context/ActivityLogContext';
import {
  UsersIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ManageUsersPanelProps {
  onClose?: () => void;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'banned';
  joinedAt: string;
  lastActive: string;
  totalTransactions: number;
}

const ManageUsersPanel: React.FC<ManageUsersPanelProps> = ({ onClose }) => {
  const { addActivity } = useActivityLog();
  
  const mockUsers: User[] = [
    {
      id: 'U001',
      username: 'user123',
      email: 'user123@example.com',
      role: 'buyer',
      status: 'active',
      joinedAt: '2024-01-10',
      lastActive: '2024-01-25',
      totalTransactions: 15
    },
    {
      id: 'U002',
      username: 'adminMike',
      email: 'mike@gametrust.com',
      role: 'admin',
      status: 'active',
      joinedAt: '2023-12-01',
      lastActive: '2024-01-25',
      totalTransactions: 0
    },
    {
      id: 'U003',
      username: 'sellerPro',
      email: 'seller@example.com',
      role: 'seller',
      status: 'active',
      joinedAt: '2024-01-05',
      lastActive: '2024-01-24',
      totalTransactions: 42
    },
    {
      id: 'U004',
      username: 'suspiciousUser',
      email: 'suspicious@example.com',
      role: 'buyer',
      status: 'suspended',
      joinedAt: '2024-01-20',
      lastActive: '2024-01-22',
      totalTransactions: 3
    },
    {
      id: 'U005',
      username: 'bannedUser',
      email: 'banned@example.com',
      role: 'seller',
      status: 'banned',
      joinedAt: '2024-01-15',
      lastActive: '2024-01-18',
      totalTransactions: 1
    }
  ];

  const handleBan = (user: User) => {
    addActivity(`User ${user.username} has been banned`, 'user', 'warning');
    alert(`User ${user.username} has been banned.`);
  };

  const handleSuspend = (user: User) => {
    addActivity(`User ${user.username} has been suspended`, 'user', 'warning');
    alert(`User ${user.username} has been suspended.`);
  };

  const handleActivate = (user: User) => {
    addActivity(`User ${user.username} has been activated`, 'user', 'success');
    alert(`User ${user.username} has been activated.`);
  };

  const handlePromote = (user: User) => {
    addActivity(`User ${user.username} promoted to moderator`, 'user', 'info');
    alert(`User ${user.username} has been promoted to moderator.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/10';
      case 'suspended': return 'text-yellow-400 bg-yellow-500/10';
      case 'banned': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-400 bg-purple-500/10';
      case 'moderator': return 'text-blue-400 bg-blue-500/10';
      case 'seller': return 'text-orange-400 bg-orange-500/10';
      case 'buyer': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
            </button>
          )}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Manage Users</h1>
            <p className="text-gray-400 mt-1">Monitor and manage user accounts</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {mockUsers.filter(u => u.status === 'active').length} Active
          </span>
          <span className="bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {mockUsers.filter(u => u.status === 'suspended').length} Suspended
          </span>
        </div>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {mockUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <UsersIcon className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">{user.username}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Joined</p>
                      <p className="text-white font-medium">{user.joinedAt}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Last Active</p>
                      <p className="text-white font-medium">{user.lastActive}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Total Transactions</p>
                    <p className="text-white font-medium">{user.totalTransactions}</p>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-700">
                {user.status === 'active' && (
                  <>
                    <Button
                      onClick={() => handleSuspend(user)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      <span>Suspend</span>
                    </Button>
                    <Button
                      onClick={() => handleBan(user)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      <span>Ban</span>
                    </Button>
                    {user.role === 'seller' && (
                      <Button
                        onClick={() => handlePromote(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                      >
                        <ShieldCheckIcon className="w-4 h-4" />
                        <span>Promote to Moderator</span>
                      </Button>
                    )}
                  </>
                )}
                
                {(user.status === 'suspended' || user.status === 'banned') && (
                  <Button
                    onClick={() => handleActivate(user)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Activate</span>
                  </Button>
                )}
                
                <Button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View Profile
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ManageUsersPanel;