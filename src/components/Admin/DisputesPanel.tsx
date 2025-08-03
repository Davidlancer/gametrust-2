import React from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useActivityLog } from '../../context/ActivityLogContext';
import {
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface DisputesPanelProps {
  onClose?: () => void;
}

interface Dispute {
  id: string;
  buyer: string;
  seller: string;
  reason: string;
  amount: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
}

const DisputesPanel: React.FC<DisputesPanelProps> = ({ onClose }) => {
  const { addActivity } = useActivityLog();
  
  const mockDisputes: Dispute[] = [
    {
      id: 'DISP123',
      buyer: 'userA',
      seller: 'userB',
      reason: 'Account not delivered',
      amount: '₦25,000',
      status: 'open',
      createdAt: '2024-01-15'
    },
    {
      id: 'DISP124',
      buyer: 'userX',
      seller: 'userY',
      reason: 'Wrong login info',
      amount: '₦15,500',
      status: 'investigating',
      createdAt: '2024-01-14'
    },
    {
      id: 'DISP125',
      buyer: 'gamerPro',
      seller: 'sellerZ',
      reason: 'Item not as described',
      amount: '₦30,000',
      status: 'open',
      createdAt: '2024-01-13'
    },
    {
      id: 'DISP126',
      buyer: 'buyerABC',
      seller: 'topSeller',
      reason: 'Payment issue',
      amount: '₦12,000',
      status: 'resolved',
      createdAt: '2024-01-12'
    }
  ];

  const handleResolve = (dispute: Dispute) => {
    addActivity(`Dispute ${dispute.id} resolved in favor of buyer`, 'dispute', 'success');
    alert(`Dispute ${dispute.id} has been resolved in favor of the buyer.`);
  };

  const handleInvestigate = (dispute: Dispute) => {
    addActivity(`Investigation started for dispute ${dispute.id}`, 'dispute', 'info');
    alert(`Investigation started for dispute ${dispute.id}.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-400 bg-red-500/10';
      case 'investigating': return 'text-yellow-400 bg-yellow-500/10';
      case 'resolved': return 'text-green-400 bg-green-500/10';
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
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Review Disputes</h1>
            <p className="text-gray-400 mt-1">Manage and resolve user disputes</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {mockDisputes.filter(d => d.status === 'open').length} Open
          </span>
        </div>
      </div>

      {/* Disputes List */}
      <div className="grid gap-4">
        {mockDisputes.map((dispute, index) => (
          <motion.div
            key={dispute.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">Dispute {dispute.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(dispute.status)}`}>
                      {dispute.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Buyer</p>
                      <p className="text-white font-medium">{dispute.buyer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Seller</p>
                      <p className="text-white font-medium">{dispute.seller}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="text-white font-medium">{dispute.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="text-white font-medium">{dispute.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-1">Reason</p>
                    <p className="text-white">{dispute.reason}</p>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              {dispute.status !== 'resolved' && (
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-700">
                  {dispute.status === 'open' && (
                    <Button
                      onClick={() => handleInvestigate(dispute)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Start Investigation
                    </Button>
                  )}
                  <Button
                    onClick={() => handleResolve(dispute)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Resolve for Buyer
                  </Button>
                  <Button
                    onClick={() => handleResolve(dispute)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Resolve for Seller
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DisputesPanel;