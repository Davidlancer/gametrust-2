import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  UserIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  FlagIcon,
  CalendarIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  VideoCameraIcon,
  PaperClipIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import ChatModal from '../UI/ChatModal';
import { useToast } from '../UI/ToastProvider';

interface PendingOrder {
  id: string;
  orderId: string;
  game: string;
  buyerUsername: string;
  buyerAvatar: string;
  salePrice: number;
  escrowStatus: 'awaiting_delivery' | 'awaiting_confirmation' | 'released' | 'disputed';
  orderDate: string;
  timeLeftHours: number;
  timeLeftMinutes: number;
  isDelivered: boolean;
  listingTitle: string;
}

interface PendingOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderDetails {
  orderId: string;
  game: string;
  buyer: string;
  price: string;
  paymentStatus: string;
  deliveryDue: string;
  dateOrdered: string;
  accountDetails: {
    linkedSocials: string[];
    level: string;
    notableSkins: string[];
    videoProof: boolean;
  };
}

interface DisputeData {
  orderId: string;
  category: string;
  description: string;
  timestamp: number;
}

const mockPendingOrders: PendingOrder[] = [
  {
    id: '1',
    orderId: 'GTX-24053',
    game: 'CODM',
    buyerUsername: 'KingShadow12',
    buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
    salePrice: 72000,
    escrowStatus: 'awaiting_confirmation',
    orderDate: 'June 21, 2025',
    timeLeftHours: 23,
    timeLeftMinutes: 17,
    isDelivered: true,
    listingTitle: 'CODM Legendary Account - Mythic Weapons'
  },
  {
    id: '2',
    orderId: 'GTX-24054',
    game: 'PUBG Mobile',
    buyerUsername: 'ProGamer88',
    buyerAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face',
    salePrice: 45000,
    escrowStatus: 'awaiting_delivery',
    orderDate: 'June 22, 2025',
    timeLeftHours: 47,
    timeLeftMinutes: 32,
    isDelivered: false,
    listingTitle: 'PUBG Mobile Conqueror Account'
  },
  {
    id: '3',
    orderId: 'GTX-24055',
    game: 'Free Fire',
    buyerUsername: 'FireMaster99',
    buyerAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face',
    salePrice: 28000,
    escrowStatus: 'disputed',
    orderDate: 'June 20, 2025',
    timeLeftHours: 0,
    timeLeftMinutes: 0,
    isDelivered: true,
    listingTitle: 'Free Fire Grandmaster Account'
  }
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'awaiting_delivery':
      return {
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: '🟡',
        label: 'Awaiting Delivery'
      };
    case 'awaiting_confirmation':
      return {
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: '🔵',
        label: 'Awaiting Buyer Confirmation'
      };
    case 'released':
      return {
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: '🟢',
        label: 'Released'
      };
    case 'disputed':
      return {
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: '🔴',
        label: 'Disputed'
      };
    default:
      return {
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        icon: '⚪',
        label: 'Unknown'
      };
  }
};

const PendingOrdersModal: React.FC<PendingOrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState(mockPendingOrders);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [viewDetailsModal, setViewDetailsModal] = useState<string | null>(null);
  const [chatModal, setChatModal] = useState<string | null>(null);
  const [reportIssueModal, setReportIssueModal] = useState<string | null>(null);
  const [disputeForm, setDisputeForm] = useState({
    category: '',
    description: '',
    proofFile: null as File | null
  });
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(`#${orderId}`);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleMarkAsDelivered = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, isDelivered: true, escrowStatus: 'awaiting_confirmation' as const }
        : order
    ));
  };

  const handleViewOrderDetails = (orderId: string) => {
    setViewDetailsModal(orderId);
  };

  const handleReportIssue = (orderId: string) => {
    setReportIssueModal(orderId);
    setDisputeForm({ category: '', description: '', proofFile: null });
  };

  const handleContactBuyer = (orderId: string) => {
    setChatModal(orderId);
  };

  const handleSubmitDispute = async () => {
    if (!disputeForm.category || !disputeForm.description) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSubmittingDispute(true);
    
    try {
      // DEVMODE: Save dispute data locally
      const disputeData: DisputeData = {
        orderId: reportIssueModal!,
        category: disputeForm.category,
        description: disputeForm.description,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`dispute_orderId_${reportIssueModal}`, JSON.stringify(disputeData));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock admin notification
      const adminNotification = {
        type: 'dispute',
        title: 'New Dispute Submitted',
        body: `You have a new dispute on order ${reportIssueModal}.`,
        timestamp: Date.now()
      };
      
      console.log('Admin notification:', adminNotification);
      
      showSuccess('Dispute submitted successfully! Our team will review it within 24 hours.');
      setReportIssueModal(null);
      setDisputeForm({ category: '', description: '', proofFile: null });
      
    } catch (error) {
      showError('Failed to submit dispute. Please try again.');
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showError('File size must be less than 10MB');
        return;
      }
      setDisputeForm(prev => ({ ...prev, proofFile: file }));
      showSuccess(`File "${file.name}" uploaded successfully`);
    }
  };

  const getOrderDetails = (orderId: string): OrderDetails => {
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
      return {
        orderId: orderId,
        game: 'Unknown',
        buyer: 'Unknown',
        price: '₦0',
        paymentStatus: 'Unknown',
        deliveryDue: 'Unknown',
        dateOrdered: 'Unknown',
        accountDetails: {
          linkedSocials: [],
          level: 'Unknown',
          notableSkins: [],
          videoProof: false
        }
      };
    }

    return {
      orderId: order.orderId,
      game: order.game === 'CODM' ? 'Call of Duty Mobile' : order.game,
      buyer: `@${order.buyerUsername}`,
      price: `₦${order.salePrice.toLocaleString()}`,
      paymentStatus: 'Escrowed',
      deliveryDue: `${order.timeLeftHours}h ${order.timeLeftMinutes}m left`,
      dateOrdered: order.orderDate,
      accountDetails: {
        linkedSocials: ['Facebook', 'Apple ID'],
        level: 'Lv. 89',
        notableSkins: ['Dark Aether M4', 'Ghost - Plasma'],
        videoProof: true
      }
    };
  };

  const handleMarkAsDeliveredFromModal = (orderId: string) => {
    handleMarkAsDelivered(orders.find(o => o.orderId === orderId)?.id || '');
    showSuccess('Order marked as delivered! Buyer will be notified.');
    setViewDetailsModal(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-[#121212] border-l border-[#292929] flex flex-col"
          >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#292929] bg-[#1E1E1E]">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-6 h-6 text-[#00FFB2]" />
                <h2 className="text-xl font-semibold text-white">Pending Orders</h2>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>You have {orders.length} pending orders</span>
                <div className="group relative">
                  <InformationCircleIcon className="w-4 h-4 text-gray-500 hover:text-gray-300 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    Orders remain pending until buyer confirms successful delivery.
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orders.filter(order => order && (order.id || order.orderId)).map((order, index) => {
              const statusConfig = getStatusConfig(order.escrowStatus);
              const uniqueKey = order.id || order.orderId || `order-${index}`;
              
              return (
                <motion.div
                  key={uniqueKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1E1E1E] border border-[#292929] rounded-xl p-6 hover:border-[#00FFB2]/30 transition-all duration-200"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={order.buyerAvatar}
                        alt={order.buyerUsername}
                        className="w-10 h-10 rounded-full border-2 border-gray-700"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{order.buyerUsername}</span>
                          <button
                            onClick={() => handleCopyOrderId(order.orderId)}
                            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-[#00FFB2] transition-colors"
                          >
                            <span>#{order.orderId}</span>
                            <DocumentDuplicateIcon className="w-3 h-3" />
                          </button>
                          {copiedOrderId === order.orderId && (
                            <span className="text-xs text-green-400">Copied!</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{order.game} • {order.orderDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#00FFB2]">₦{order.salePrice.toLocaleString()}</p>
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${statusConfig.color}`}>
                        <span>{statusConfig.icon}</span>
                        <span>{statusConfig.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Listing</p>
                      <p className="text-sm text-white">{order.listingTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Escrow Status</p>
                      <p className="text-sm text-white">
                        {order.escrowStatus === 'awaiting_confirmation' ? '🔄 Waiting for buyer confirmation' :
                         order.escrowStatus === 'awaiting_delivery' ? '📦 Waiting for delivery' :
                         order.escrowStatus === 'disputed' ? '⚠️ Under dispute' :
                         '✅ Released'}
                      </p>
                    </div>
                  </div>

                  {/* Time Remaining */}
                  {order.timeLeftHours > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Time Left Before Auto-Confirm</p>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400 font-medium">
                          ⏰ {order.timeLeftHours}h {order.timeLeftMinutes}m
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOrderDetails(order.orderId)}
                      className="border-gray-600 hover:border-[#00FFB2] hover:bg-[#00FFB2]/10"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleContactBuyer(order.orderId)}
                      className="border-gray-600 hover:border-blue-400 hover:bg-blue-400/10"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                      Contact Buyer
                    </Button>

                    {!order.isDelivered && order.escrowStatus === 'awaiting_delivery' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleMarkAsDelivered(order.id)}
                        className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] hover:from-[#00FFB2]/80 hover:to-[#00A8E8]/80"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Mark as Delivered
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReportIssue(order.orderId)}
                      className="border-red-600 hover:border-red-400 hover:bg-red-400/10 text-red-400"
                    >
                      <FlagIcon className="w-4 h-4 mr-1" />
                      Report Issue
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
      )}
      
      {/* View Details Modal */}
      <AnimatePresence>
        {viewDetailsModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setViewDetailsModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#1E1E1E] border border-[#292929] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const details = getOrderDetails(viewDetailsModal);
                return (
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-[#00FFB2]/20 rounded-lg">
                          <EyeIcon className="w-6 h-6 text-[#00FFB2]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">Order Details</h3>
                          <p className="text-sm text-gray-400">#{details.orderId}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewDetailsModal(null)}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Order Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Game</p>
                          <p className="text-white font-medium">{details.game}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Buyer</p>
                          <p className="text-white font-medium">{details.buyer}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Price</p>
                          <p className="text-[#00FFB2] font-bold text-lg">{details.price}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Status</p>
                          <div className="flex items-center space-x-2">
                            <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                            <p className="text-green-400 font-medium">{details.paymentStatus}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery Due</p>
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="w-4 h-4 text-yellow-400" />
                            <p className="text-yellow-400 font-medium">{details.deliveryDue}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date Ordered</p>
                          <p className="text-white font-medium">{details.dateOrdered}</p>
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="bg-[#121212] border border-[#292929] rounded-xl p-4 mb-6">
                      <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                        <UserIcon className="w-5 h-5 text-[#00FFB2]" />
                        <span>Account Details</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Linked Socials</p>
                          <div className="flex flex-wrap gap-2">
                            {details.accountDetails.linkedSocials.filter(social => social).map((social, index) => (
                              <span key={`social-${social}-${index}`} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                                {social}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Level</p>
                          <div className="flex items-center space-x-2">
                            <StarIcon className="w-4 h-4 text-yellow-400" />
                            <span className="text-white font-medium">{details.accountDetails.level}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Notable Skins</p>
                          <div className="space-y-1">
                            {details.accountDetails.notableSkins.filter(skin => skin).map((skin, index) => (
                              <p key={`skin-${skin}-${index}`} className="text-sm text-gray-300">• {skin}</p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Video Proof</p>
                          <div className="flex items-center space-x-2">
                            <VideoCameraIcon className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-medium">
                              {details.accountDetails.videoProof ? 'Yes ✅' : 'No ❌'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="primary"
                        onClick={() => handleMarkAsDeliveredFromModal(details.orderId)}
                        className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] hover:from-[#00FFB2]/80 hover:to-[#00A8E8]/80"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Mark as Delivered
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setViewDetailsModal(null);
                          handleContactBuyer(details.orderId);
                        }}
                        className="border-gray-600 hover:border-blue-400 hover:bg-blue-400/10"
                      >
                        <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                        Contact Buyer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setViewDetailsModal(null);
                          handleReportIssue(details.orderId);
                        }}
                        className="border-red-600 hover:border-red-400 hover:bg-red-400/10 text-red-400"
                      >
                        <FlagIcon className="w-4 h-4 mr-2" />
                        Report Issue
                      </Button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Issue Modal */}
      <AnimatePresence>
        {reportIssueModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setReportIssueModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#1E1E1E] border border-[#292929] rounded-2xl p-6 w-full max-w-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <FlagIcon className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Report Issue</h3>
                    <p className="text-sm text-gray-400">Order #{reportIssueModal}</p>
                  </div>
                </div>
                <button
                  onClick={() => setReportIssueModal(null)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Issue Category */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Issue Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={disputeForm.category}
                    onChange={(e) => setDisputeForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-lg text-white focus:border-[#00FFB2] focus:outline-none"
                  >
                    <option value="">Select an issue category</option>
                    <option value="buyer_unresponsive">Buyer unresponsive</option>
                    <option value="wrong_payment">Wrong payment</option>
                    <option value="account_error">Account error</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Short Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={disputeForm.description}
                    onChange={(e) => setDisputeForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please describe the issue in detail..."
                    rows={4}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-lg text-white placeholder-gray-500 focus:border-[#00FFB2] focus:outline-none resize-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Upload Proof (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="proof-upload"
                    />
                    <label
                      htmlFor="proof-upload"
                      className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-[#292929] rounded-lg cursor-pointer hover:border-[#00FFB2]/50 transition-colors"
                    >
                      <div className="text-center">
                        <PaperClipIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">
                          {disputeForm.proofFile ? disputeForm.proofFile.name : 'Click to upload image or video'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setReportIssueModal(null)}
                  className="flex-1 border-gray-600 hover:border-gray-500"
                  disabled={isSubmittingDispute}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmitDispute}
                  disabled={isSubmittingDispute || !disputeForm.category || !disputeForm.description}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingDispute ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <>🚨 Submit Dispute</>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      {chatModal && (() => {
        const order = orders.find(o => o.orderId === chatModal);
        const otherUser = {
          id: order?.buyerUsername || 'unknown',
          username: order?.buyerUsername || 'Unknown Buyer',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${order?.buyerUsername || 'default'}`,
          isOnline: Math.random() > 0.5, // Mock online status
          lastSeen: 'Active now'
        };
        
        return (
          <ChatModal
            isOpen={!!chatModal}
            onClose={() => setChatModal(null)}
            orderId={chatModal}
            userRole="seller"
            otherUser={otherUser}
            onSendMessage={(message) => {
              console.log('Message sent:', message);
              showSuccess('Message sent successfully!');
            }}
          />
        );
      })()}
    </AnimatePresence>
  );
};

export default PendingOrdersModal;