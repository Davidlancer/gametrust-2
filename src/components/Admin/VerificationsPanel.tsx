import React from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useActivityLog } from '../../context/ActivityLogContext';
import {
  CheckCircleIcon,
  XMarkIcon,
  DocumentTextIcon,
  UserIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface VerificationsPanelProps {
  onClose?: () => void;
}

interface Verification {
  id: string;
  username: string;
  email: string;
  submittedAt: string;
  type: 'seller' | 'buyer';
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
}

const VerificationsPanel: React.FC<VerificationsPanelProps> = ({ onClose }) => {
  const { addActivity } = useActivityLog();
  
  const mockVerifications: Verification[] = [
    {
      id: 'VERIF001',
      username: 'sellerAlpha',
      email: 'seller@example.com',
      submittedAt: '2024-01-20',
      type: 'seller',
      documents: ['ID Card', 'Bank Statement'],
      status: 'pending'
    },
    {
      id: 'VERIF002',
      username: 'proGamerZ',
      email: 'gamer@example.com',
      submittedAt: '2024-01-24',
      type: 'seller',
      documents: ['Driver License', 'Utility Bill'],
      status: 'pending'
    },
    {
      id: 'VERIF003',
      username: 'buyerPro',
      email: 'buyer@example.com',
      submittedAt: '2024-01-18',
      type: 'buyer',
      documents: ['Passport', 'Bank Statement'],
      status: 'pending'
    },
    {
      id: 'VERIF004',
      username: 'topSeller99',
      email: 'topseller@example.com',
      submittedAt: '2024-01-16',
      type: 'seller',
      documents: ['National ID', 'Business License'],
      status: 'approved'
    }
  ];

  const handleApprove = (verification: Verification) => {
    addActivity(`Verification approved for user ${verification.username}`, 'verification', 'success');
    alert(`Verification for ${verification.username} has been approved.`);
  };

  const handleReject = (verification: Verification) => {
    addActivity(`Verification rejected for user ${verification.username}`, 'verification', 'warning');
    alert(`Verification for ${verification.username} has been rejected.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/10';
      case 'approved': return 'text-green-400 bg-green-500/10';
      case 'rejected': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'seller': return 'text-blue-400 bg-blue-500/10';
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
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Pending Verifications</h1>
            <p className="text-gray-300 mt-1">Review and manage user verification requests</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {mockVerifications.filter(v => v.status === 'pending').length} Pending
          </span>
        </div>
      </div>

      {/* Verifications List */}
      <div className="grid gap-4">
        {mockVerifications.map((verification, index) => (
          <motion.div
            key={verification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <UserIcon className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">{verification.username}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(verification.type)}`}>
                      {verification.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(verification.status)}`}>
                      {verification.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium">{verification.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Submitted</p>
                      <p className="text-white font-medium">{verification.submittedAt}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Verification ID</p>
                      <p className="text-white font-medium">{verification.id}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Submitted Documents</p>
                    <div className="flex flex-wrap gap-2">
                      {verification.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-gray-700/50 px-3 py-1 rounded-lg">
                          <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-white">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              {verification.status === 'pending' && (
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => handleApprove(verification)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Approve</span>
                  </Button>
                  <Button
                    onClick={() => handleReject(verification)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>Reject</span>
                  </Button>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Documents
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

export default VerificationsPanel;