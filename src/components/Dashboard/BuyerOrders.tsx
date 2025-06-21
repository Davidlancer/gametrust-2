import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import { useToast } from '../UI/ToastProvider';
import DisputeModal from '../UI/DisputeModal';

interface Order {
  id: string;
  game: string;
  accountTitle: string;
  seller: string;
  sellerAvatar: string;
  price: number;
  status: 'in_escrow' | 'delivered' | 'completed' | 'disputed' | 'refunded';
  escrowStatus: 'pending_delivery' | 'delivered' | 'confirmed' | 'disputed';
  date: string;
  timeLeft?: string;
  credentials?: {
    email: string;
    password: string;
    additionalInfo?: string;
  };
  proofImages?: string[];
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    game: 'CODM',
    accountTitle: 'Legendary',
    seller: '@GamerPlug',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face',
    price: 70000,
    status: 'in_escrow',
    escrowStatus: 'delivered',
    date: 'June 18, 2024',
    timeLeft: '2 days left to confirm',
    credentials: {
      email: 'codm.legend@email.com',
      password: 'SecurePass123',
      additionalInfo: 'Facebook linked, all legendary skins included'
    },
    proofImages: ['proof1.jpg', 'proof2.jpg']
  },
  {
    id: 'ORD-002',
    game: 'PUBG',
    accountTitle: 'Elite',
    seller: '@ProGamer',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    price: 50000,
    status: 'completed',
    escrowStatus: 'confirmed',
    date: 'June 15, 2024',
    credentials: {
      email: 'pubg.elite@email.com',
      password: 'ElitePass456',
      additionalInfo: 'All season passes completed'
    }
  },
  {
    id: 'ORD-003',
    game: 'Free Fire',
    accountTitle: 'God Mode',
    seller: '@FireMaster',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    price: 30000,
    status: 'disputed',
    escrowStatus: 'disputed',
    date: 'June 12, 2024'
  }
];

const getStatusBadge = (status: string, escrowStatus: string) => {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
        <CheckCircleIcon className="w-3 h-3 mr-1" />
        Completed
      </span>
    );
  }
  
  if (status === 'disputed') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
        <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
        Disputed
      </span>
    );
  }
  
  if (status === 'in_escrow') {
    if (escrowStatus === 'delivered') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          <ClockIcon className="w-3 h-3 mr-1" />
          Confirm Access
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
        <ShieldCheckIcon className="w-3 h-3 mr-1" />
        In Escrow
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
      {status}
    </span>
  );
};

const BuyerOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeOrder, setDisputeOrder] = useState<Order | null>(null);
  const [disputedOrders, setDisputedOrders] = useState<Set<string>>(new Set());
  const { showSuccess, showError, showWarning } = useToast();

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.accountTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.seller.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || order.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleConfirmAccess = (orderId: string) => {
    const order = mockOrders.find(o => o.id === orderId);
    showSuccess(
      'Access Confirmed!',
      `Successfully confirmed access for ${order?.accountTitle} account. Escrow funds have been released to the seller.`
    );
    setSelectedOrder(null);
  };

  const handleOpenDispute = (orderId: string) => {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
      setDisputeOrder(order);
      setShowDisputeModal(true);
    }
  };

  const handleDisputeSubmitted = (orderId: string) => {
    setDisputedOrders(prev => new Set([...prev, orderId]));
    setShowDisputeModal(false);
    setDisputeOrder(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">My Orders</h1>
          <p className="text-gray-400 mt-1">Track your gaming account purchases</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Orders</option>
          <option value="in_escrow">In Escrow</option>
          <option value="completed">Completed</option>
          <option value="disputed">Disputed</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <ShieldCheckIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Game & Account</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Seller</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Price</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Date</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-t border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-white">{order.accountTitle}</p>
                            <p className="text-sm text-gray-400">{order.game}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={order.sellerAvatar}
                              alt={order.seller}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-white">{order.seller}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-indigo-400 font-semibold">
                          ₦{order.price.toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(order.status, order.escrowStatus)}
                          {order.timeLeft && (
                            <p className="text-xs text-gray-500 mt-1">{order.timeLeft}</p>
                          )}
                        </td>
                        <td className="py-4 px-6 text-gray-300">{order.date}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="text-indigo-400 hover:bg-indigo-500/10"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            {order.status === 'in_escrow' && order.escrowStatus === 'delivered' && (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleConfirmAccess(order.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Confirm
                                </Button>
                                {disputedOrders.has(order.id) ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    className="border-orange-500 text-orange-400 cursor-not-allowed"
                                  >
                                    In Dispute
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenDispute(order.id)}
                                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                                  >
                                    Open Dispute
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{order.accountTitle}</h3>
                      <p className="text-sm text-gray-400">{order.game}</p>
                    </div>
                    {getStatusBadge(order.status, order.escrowStatus)}
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={order.sellerAvatar}
                      alt={order.seller}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-white">{order.seller}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-indigo-400">
                      ₦{order.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400">{order.date}</span>
                  </div>
                  
                  {order.timeLeft && (
                    <p className="text-xs text-yellow-400 mb-3">{order.timeLeft}</p>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 text-indigo-400 hover:bg-indigo-500/10"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {order.status === 'in_escrow' && order.escrowStatus === 'delivered' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleConfirmAccess(order.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirm
                        </Button>
                        {disputedOrders.has(order.id) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="border-orange-500 text-orange-400 cursor-not-allowed"
                          >
                            In Dispute
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDispute(order.id)}
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                          >
                            Open Dispute
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Order ID</p>
                <p className="text-white font-mono">{selectedOrder.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Account</p>
                <p className="text-white">{selectedOrder.accountTitle} - {selectedOrder.game}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Seller</p>
                <div className="flex items-center space-x-2">
                  <img
                    src={selectedOrder.sellerAvatar}
                    alt={selectedOrder.seller}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-white">{selectedOrder.seller}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Price</p>
                <p className="text-indigo-400 font-semibold">₦{selectedOrder.price.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Status</p>
                {getStatusBadge(selectedOrder.status, selectedOrder.escrowStatus)}
              </div>
              
              {selectedOrder.credentials && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Account Credentials</p>
                  <div className="bg-gray-700/50 rounded-lg p-3 space-y-2">
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-white font-mono text-sm">{selectedOrder.credentials.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Password</p>
                      <p className="text-white font-mono text-sm">{selectedOrder.credentials.password}</p>
                    </div>
                    {selectedOrder.credentials.additionalInfo && (
                      <div>
                        <p className="text-xs text-gray-400">Additional Info</p>
                        <p className="text-white text-sm">{selectedOrder.credentials.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedOrder.status === 'in_escrow' && selectedOrder.escrowStatus === 'delivered' && (
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="primary"
                    onClick={() => handleConfirmAccess(selectedOrder.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Confirm Access
                  </Button>
                  {disputedOrders.has(selectedOrder.id) ? (
                    <Button
                      variant="outline"
                      disabled
                      className="flex-1 border-orange-500 text-orange-400 cursor-not-allowed"
                    >
                      In Dispute
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleOpenDispute(selectedOrder.id)}
                      className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      Open Dispute
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        order={disputeOrder}
        onDisputeSubmitted={handleDisputeSubmitted}
      />
    </div>
  );
};

export default BuyerOrders;