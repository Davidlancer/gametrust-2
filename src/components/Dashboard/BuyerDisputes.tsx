import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowUpIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import { useToast } from '../UI/ToastProvider';

interface Dispute {
  id: string;
  caseNumber: string;
  orderId: string;
  game: string;
  accountLevel: string;
  seller: string;
  amount: number;
  status: 'awaiting_review' | 'under_investigation' | 'escalated' | 'resolved_buyer' | 'resolved_seller';
  reason: string;
  createdDate: string;
  lastUpdate: string;
  supportThread?: string;
  evidence: {
    screenshots: number;
    documents: number;
  };
}

const mockDisputes: Dispute[] = [
  {
    id: 'DISP-001',
    caseNumber: 'GT-2024-001',
    orderId: 'ORD-001',
    game: 'CODM',
    accountLevel: 'Lvl 72 Legendary',
    seller: '@GamerPlug',
    amount: 75000,
    status: 'under_investigation',
    reason: 'Account credentials not working',
    createdDate: 'June 18, 2024',
    lastUpdate: 'June 20, 2024',
    supportThread: 'THREAD-001',
    evidence: {
      screenshots: 3,
      documents: 1
    }
  },
  {
    id: 'DISP-002',
    caseNumber: 'GT-2024-002',
    orderId: 'ORD-007',
    game: 'PUBG',
    accountLevel: 'Lvl 65 Conqueror',
    seller: '@PubgKing',
    amount: 85000,
    status: 'resolved_buyer',
    reason: 'Account banned after purchase',
    createdDate: 'June 10, 2024',
    lastUpdate: 'June 15, 2024',
    supportThread: 'THREAD-002',
    evidence: {
      screenshots: 5,
      documents: 2
    }
  },
  {
    id: 'DISP-003',
    caseNumber: 'GT-2024-003',
    orderId: 'ORD-012',
    game: 'Free Fire',
    accountLevel: 'Lvl 80 Heroic',
    seller: '@FFMaster',
    amount: 45000,
    status: 'awaiting_review',
    reason: 'Missing skins as advertised',
    createdDate: 'June 22, 2024',
    lastUpdate: 'June 22, 2024',
    supportThread: 'THREAD-003',
    evidence: {
      screenshots: 2,
      documents: 0
    }
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'awaiting_review':
      return ClockIcon;
    case 'under_investigation':
      return ExclamationTriangleIcon;
    case 'escalated':
      return ExclamationTriangleIcon;
    case 'resolved_buyer':
      return CheckCircleIcon;
    case 'resolved_seller':
      return XCircleIcon;
    default:
      return ClockIcon;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'awaiting_review':
      return 'text-yellow-400 bg-yellow-500/20';
    case 'under_investigation':
      return 'text-orange-400 bg-orange-500/20';
    case 'escalated':
      return 'text-red-400 bg-red-500/20';
    case 'resolved_buyer':
      return 'text-green-400 bg-green-500/20';
    case 'resolved_seller':
      return 'text-red-400 bg-red-500/20';
    default:
      return 'text-gray-400 bg-gray-500/20';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'awaiting_review':
      return 'Awaiting Review';
    case 'under_investigation':
      return 'Under Investigation';
    case 'escalated':
      return 'Escalated';
    case 'resolved_buyer':
      return 'Resolved (Buyer Favor)';
    case 'resolved_seller':
      return 'Resolved (Seller Favor)';
    default:
      return 'Unknown';
  }
};

const BuyerDisputes: React.FC = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  
  const filteredDisputes = mockDisputes.filter(dispute => {
    if (filter === 'all') return true;
    return dispute.status === filter;
  });
  
  const activeDisputes = mockDisputes.filter(d => 
    ['awaiting_review', 'under_investigation', 'escalated'].includes(d.status)
  ).length;
  
  const resolvedDisputes = mockDisputes.filter(d => 
    ['resolved_buyer', 'resolved_seller'].includes(d.status)
  ).length;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Disputes</h1>
          <p className="text-gray-400 mt-1">Manage your order disputes and support cases</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-400">Active Cases</p>
            <p className="text-xl font-bold text-orange-400">{activeDisputes}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Resolved</p>
            <p className="text-xl font-bold text-green-400">{resolvedDisputes}</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Disputes</option>
          <option value="awaiting_review">Awaiting Review</option>
          <option value="under_investigation">Under Investigation</option>
          <option value="escalated">Escalated</option>
          <option value="resolved_buyer">Resolved (Buyer Favor)</option>
          <option value="resolved_seller">Resolved (Seller Favor)</option>
        </select>
      </div>

      {/* Disputes List */}
      <div className="flex-1 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 flex flex-col">
        {filteredDisputes.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <ExclamationTriangleIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No disputes found</h3>
              <p className="text-gray-500">Your dispute cases will appear here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDisputes.map((dispute) => {
              const StatusIcon = getStatusIcon(dispute.status);
              const statusColor = getStatusColor(dispute.status);
              
              return (
                <motion.div
                  key={dispute.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-700/30 rounded-lg p-6 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedDispute(dispute)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusColor}`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{dispute.game} - {dispute.accountLevel}</h3>
                          <p className="text-sm text-gray-400">Case #{dispute.caseNumber} • Order {dispute.orderId}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Seller</p>
                          <p className="text-white font-medium">{dispute.seller}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Amount</p>
                          <p className="text-white font-medium">₦{dispute.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Reason</p>
                          <p className="text-white font-medium">{dispute.reason}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Last Update</p>
                          <p className="text-white font-medium">{dispute.lastUpdate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:items-end space-y-2">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {getStatusText(dispute.status)}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <PaperClipIcon className="w-4 h-4" />
                          <span>{dispute.evidence.screenshots + dispute.evidence.documents}</span>
                        </div>
                        {dispute.supportThread && (
                          <div className="flex items-center space-x-1">
                            <ChatBubbleLeftRightIcon className="w-4 h-4" />
                            <span>Support</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dispute Detail Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">Dispute Details</h3>
                <p className="text-gray-400">Case #{selectedDispute.caseNumber}</p>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(selectedDispute.status)}`}>
                  {React.createElement(getStatusIcon(selectedDispute.status), { className: 'w-6 h-6' })}
                </div>
                <div>
                  <p className="font-semibold text-white">{getStatusText(selectedDispute.status)}</p>
                  <p className="text-sm text-gray-400">Last updated: {selectedDispute.lastUpdate}</p>
                </div>
              </div>
              
              {/* Order Details */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Order Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Order ID</p>
                    <p className="text-white font-medium">{selectedDispute.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Game</p>
                    <p className="text-white font-medium">{selectedDispute.game}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Account</p>
                    <p className="text-white font-medium">{selectedDispute.accountLevel}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Seller</p>
                    <p className="text-white font-medium">{selectedDispute.seller}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Amount</p>
                    <p className="text-white font-medium">₦{selectedDispute.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Created</p>
                    <p className="text-white font-medium">{selectedDispute.createdDate}</p>
                  </div>
                </div>
              </div>
              
              {/* Dispute Reason */}
              <div>
                <h4 className="font-semibold text-white mb-2">Dispute Reason</h4>
                <p className="text-gray-300 bg-gray-700/30 rounded-lg p-3">{selectedDispute.reason}</p>
              </div>
              
              {/* Evidence */}
              <div>
                <h4 className="font-semibold text-white mb-3">Evidence Submitted</h4>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <EyeIcon className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-gray-300">{selectedDispute.evidence.screenshots} Screenshots</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <PaperClipIcon className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-gray-300">{selectedDispute.evidence.documents} Documents</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
                {selectedDispute.status !== 'resolved_buyer' && selectedDispute.status !== 'resolved_seller' && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowUploadModal(true);
                      setSelectedDispute(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                    Upload More Evidence
                  </Button>
                )}
                
                {selectedDispute.supportThread && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      showInfo('Opening support thread...');
                      // Here you would typically navigate to the support thread
                      console.log('Opening support thread:', selectedDispute.supportThread);
                    }}
                    className="flex-1"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    View Support Thread
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Upload Evidence Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Upload Evidence</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Files
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                  <DocumentArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-xs text-gray-500">Supported: JPG, PNG, PDF, DOC (Max 10MB each)</p>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    className="hidden"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Comments
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide additional context for your evidence..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={async () => {
                    setUploading(true);
                    try {
                      // Simulate file upload
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      showSuccess('Evidence uploaded successfully! Our team will review it shortly.');
                      setShowUploadModal(false);
                    } catch (error) {
                      showError('Failed to upload evidence. Please try again.');
                    } finally {
                      setUploading(false);
                    }
                  }}
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    'Upload Evidence'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BuyerDisputes;