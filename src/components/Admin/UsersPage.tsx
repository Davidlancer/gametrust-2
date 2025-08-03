import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useActivityLog } from '../../context/ActivityLogContext';
import { exportToCSV } from '../../utils/exportToCSV';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Toast notification function
const toast = {
  success: (message: string) => {
    console.log('✅ SUCCESS:', message);
    // In a real app, this would show a toast notification
    alert('✅ ' + message);
  },
  error: (message: string) => {
    console.log('❌ ERROR:', message);
    alert('❌ ' + message);
  },
  info: (message: string) => {
    console.log('ℹ️ INFO:', message);
    alert('ℹ️ ' + message);
  }
};

interface User {
  id: string;
  username: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin' | 'both';
  status: 'active' | 'banned' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
  totalTransactions: number;
  totalSpent: number;
  verified: boolean;
  avatar?: string;
}

const UsersPage: React.FC = () => {
  const { addActivity } = useActivityLog();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'gamer123',
      email: 'gamer123@example.com',
      role: 'buyer',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      totalTransactions: 15,
      totalSpent: 1250.00,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
    },
    {
      id: '2',
      username: 'proSeller',
      email: 'proseller@example.com',
      role: 'seller',
      status: 'active',
      joinDate: '2023-11-20',
      lastActive: '1 day ago',
      totalTransactions: 89,
      totalSpent: 0,
      verified: true
    },
    {
      id: '3',
      username: 'suspiciousUser',
      email: 'suspicious@example.com',
      role: 'both',
      status: 'suspended',
      joinDate: '2024-02-01',
      lastActive: '1 week ago',
      totalTransactions: 3,
      totalSpent: 150.00,
      verified: false
    },
    {
      id: '4',
      username: 'bannedUser',
      email: 'banned@example.com',
      role: 'buyer',
      status: 'banned',
      joinDate: '2024-01-10',
      lastActive: '2 weeks ago',
      totalTransactions: 1,
      totalSpent: 50.00,
      verified: false
    },
    {
      id: '5',
      username: 'newbie2024',
      email: 'newbie@example.com',
      role: 'buyer',
      status: 'active',
      joinDate: '2024-03-01',
      lastActive: '5 minutes ago',
      totalTransactions: 0,
      totalSpent: 0,
      verified: false
    },
    {
      id: '6',
      username: 'adminUser',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2023-01-01',
      lastActive: '30 minutes ago',
      totalTransactions: 0,
      totalSpent: 0,
      verified: true
    },
    {
      id: '7',
      username: 'pendingUser',
      email: 'pending@example.com',
      role: 'buyer',
      status: 'pending',
      joinDate: '2024-03-15',
      lastActive: '1 hour ago',
      totalTransactions: 0,
      totalSpent: 0,
      verified: false
    }
  ]);

  // Load users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('admin_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Save users to localStorage whenever users state changes
  useEffect(() => {
    localStorage.setItem('admin_users', JSON.stringify(users));
  }, [users]);

  // Enhanced admin actions with toast notifications
  const handleBan = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    if (user.status === 'banned') {
      toast.info(`${user.username} is already banned.`);
      return;
    }
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: 'banned' }
          : user
      )
    );
    addActivity(`User ${user.username} has been banned`, 'user', 'warning');
    toast.error(`${user.username} has been banned.`);
  };

  const handleUnban = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: 'active' }
          : user
      )
    );
    toast.success(`${user.username} has been unbanned.`);
  };



  const promoteToModerator = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    if (user.role === 'both') {
      toast.info(`${user.username} is already a moderator.`);
      return;
    }
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId
          ? { ...user, role: 'both' }
          : user
      )
    );
    addActivity(`User ${user.username} has been promoted to moderator`, 'user', 'info');
    toast.success(`${user.username} has been promoted to moderator.`);
  };

  const suspendUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    if (user.status === 'suspended') {
      toast.info(`${user.username} is already suspended.`);
      return;
    }
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: 'suspended' }
          : user
      )
    );
    addActivity(`User ${user.username} has been suspended`, 'user', 'warning');
    toast.error(`${user.username} has been suspended.`);
  };

  const activateUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: 'active' }
          : user
      )
    );
    addActivity(`User ${user.username} has been activated`, 'user', 'success');
    toast.success(`${user.username} has been activated.`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'banned': return <NoSymbolIcon className="w-4 h-4 text-red-500" />;
      case 'suspended': return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'pending': return <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />;
      default: return <UserIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/10';
      case 'banned': return 'text-red-400 bg-red-500/10';
      case 'suspended': return 'text-yellow-400 bg-yellow-500/10';
      case 'pending': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-500/10';
      case 'buyer': return 'text-blue-400 bg-blue-500/10';
      case 'seller': return 'text-purple-400 bg-purple-500/10';
      case 'both': return 'text-indigo-400 bg-indigo-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };



  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }

    let message = '';
    let severity: 'info' | 'warning' | 'success' | 'error' = 'info';
    
    selectedUsers.forEach(userId => {
      switch (action) {
        case 'ban':
          handleBan(userId);
          break;
        case 'suspend':
          suspendUser(userId);
          break;
        case 'activate':
          activateUser(userId);
          break;
        case 'promote':
          promoteToModerator(userId);
          break;
      }
    });

    switch (action) {
      case 'ban':
        message = `${selectedUsers.length} users banned`;
        severity = 'warning';
        break;
      case 'suspend':
        message = `${selectedUsers.length} users suspended`;
        severity = 'warning';
        break;
      case 'activate':
        message = `${selectedUsers.length} users activated`;
        severity = 'success';
        break;
      case 'promote':
        message = `${selectedUsers.length} users promoted to moderator`;
        severity = 'info';
        break;
    }

    // Log bulk action to activity log
    addActivity(`Bulk action: ${message}`, 'user', severity);
    toast.success(message);
    setSelectedUsers([]);
  };

  const handleViewUser = (user: User) => {
    // TODO: Implement user profile modal or navigation
    console.log('Viewing user profile:', user);
    alert(`Viewing profile for ${user.username}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Users Management</h1>
          <p className="text-gray-400 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            variant="primary" 
            size="md"
            onClick={() => exportToCSV("user_export.csv", filteredUsers)}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or email..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700/50 border border-gray-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 px-3 py-2.5 transition-all duration-200 hover:bg-gray-700"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-700/50 border border-gray-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 px-3 py-2.5 transition-all duration-200 hover:bg-gray-700"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('activate')}>
                  Activate ({selectedUsers.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('suspend')}>
                  Suspend ({selectedUsers.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('ban')}>
                  Ban ({selectedUsers.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('promote')}>
                  Promote ({selectedUsers.length})
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedUsers([])}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-300">No users found</h3>
            <p className="mt-1 text-sm text-gray-400">
              {searchQuery || statusFilter !== 'all' || roleFilter !== 'all'
                ? 'No users match the selected criteria. Try adjusting your filters.'
                : 'No users available in the system.'}
            </p>
            {(searchQuery || statusFilter !== 'all' || roleFilter !== 'all') && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setRoleFilter('all');
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800/30 divide-y divide-gray-700">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-white">{user.username}</div>
                          {user.verified && (
                            <ShieldCheckIcon className="w-4 h-4 text-blue-500" title="Verified" />
                          )}
                        </div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div>
                      <div>{user.totalTransactions} transactions</div>
                      <div className="text-xs text-gray-400">${user.totalSpent.toFixed(2)} spent</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="View Profile"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {user.status === 'banned' ? (
                        <button
                          title="Unban User"
                          onClick={() => handleUnban(user.id)}
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          title="Ban User"
                          onClick={() => handleBan(user.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <NoSymbolIcon className="w-4 h-4" />
                        </button>
                      )}
                      {user.status !== 'suspended' && (
                        <button
                          title="Suspend User"
                          onClick={() => suspendUser(user.id)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4" />
                        </button>
                      )}
                      {(user.status === 'suspended' || user.status === 'banned') && (
                        <button
                          title="Activate User"
                          onClick={() => activateUser(user.id)}
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      )}
                      {user.role !== 'both' && (
                        <button
                          title="Promote to Moderator"
                          onClick={() => promoteToModerator(user.id)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <ShieldCheckIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;