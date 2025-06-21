import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';

interface DisputeEvidence {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  uploadedAt: string;
}

interface DisputeMessage {
  id: string;
  sender: 'seller' | 'buyer' | 'admin';
  message: string;
  timestamp: string;
  attachments?: DisputeEvidence[];
}

interface Dispute {
  id: string;
  orderId: string;
  buyerUsername: string;
  buyerAvatar: string;
  listingTitle: string;
  reason: string;
  description: string;
  amount: number;
  status: 'open' | 'under_review' | 'resolved_seller' | 'resolved_buyer' | 'closed';
  createdAt: string;
  resolvedAt?: string;
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  adminNotes?: string;
}

const mockDisputes: Dispute[] = [
  {
    id: 'DIS_001',
    orderId: 'ORD_12345',
    buyerUsername: 'gamer_pro',
    buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'CODM Legendary Account - Mythic Weapons',
    reason: 'Account credentials not working',
    description: 'The login credentials provided do not work. I have tried multiple times but cannot access the account.',
    amount: 45000,
    status: 'under_review',
    createdAt: '2024-01-18T10:30:00Z',
    evidence: [
      {
        id: 'ev1',
        type: 'image',
        url: '/evidence/screenshot1.jpg',
        name: 'Login Error Screenshot',
        uploadedAt: '2024-01-18T10:35:00Z'
      }
    ],
    messages: [
      {
        id: 'msg1',
        sender: 'buyer',
        message: 'The credentials you provided are not working. I keep getting an error message.',
        timestamp: '2024-01-18T10:30:00Z'
      },
      {
        id: 'msg2',
        sender: 'seller',
        message: 'I have double-checked the credentials. They were working when I last tested them. Can you try again?',
        timestamp: '2024-01-18T11:15:00Z'
      },
      {
        id: 'msg3',
        sender: 'admin',
        message: 'We are reviewing this case. Please provide any additional evidence you may have.',
        timestamp: '2024-01-18T14:20:00Z'
      }
    ]
  },
  {
    id: 'DIS_002',
    orderId: 'ORD_12346',
    buyerUsername: 'mobile_gamer',
    buyerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'PUBG Mobile Conqueror Account',
    reason: 'Account banned after purchase',
    description: 'The account was banned shortly after I received it. This suggests it may have been compromised.',
    amount: 28500,
    status: 'resolved_buyer',
    createdAt: '2024-01-15T14:20:00Z',
    resolvedAt: '2024-01-17T16:45:00Z',
    evidence: [
      {
        id: 'ev2',
        type: 'image',
        url: '/evidence/ban_notice.jpg',
        name: 'Account Ban Notice',
        uploadedAt: '2024-01-15T14:25:00Z'
      }
    ],
    messages: [
      {
        id: 'msg4',
        sender: 'buyer',
        message: 'The account got banned just 2 hours after I received it. This is unacceptable.',
        timestamp: '2024-01-15T14:20:00Z'
      },
      {
        id: 'msg5',
        sender: 'seller',
        message: 'I am not responsible for bans that occur after the sale. The account was clean when sold.',
        timestamp: '2024-01-15T15:30:00Z'
      },
      {
        id: 'msg6',
        sender: 'admin',
        message: 'After investigation, we found evidence of prior violations. Refund has been processed.',
        timestamp: '2024-01-17T16:45:00Z'
      }
    ],
    adminNotes: 'Account showed signs of previous violations. Buyer refunded.'
  },
  {
    id: 'DIS_003',
    orderId: 'ORD_12347',
    buyerUsername: 'ff_player',
    buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    listingTitle: 'Free Fire Grandmaster Account',
    reason: 'Missing items from description',
    description: 'The account is missing several skins and characters that were listed in the description.',
    amount: 15000,
    status: 'resolved_seller',
    createdAt: '2024-01-12T09:15:00Z',
    resolvedAt: '2024-01-14T11:30:00Z',
    evidence: [
      {
        id: 'ev3',
        type: 'video',
        url: '/evidence/account_showcase.mp4',
        name: 'Account Showcase Video',
        uploadedAt: '2024-01-12T12:00:00Z'
      }
    ],
    messages: [
      {
        id: 'msg7',
        sender: 'buyer',
        message: 'The account is missing the Alok character and several weapon skins mentioned in your listing.',
        timestamp: '2024-01-12T09:15:00Z'
      },
      {
        id: 'msg8',
        sender: 'seller',
        message: 'I have provided a video showing all items. Please check the inventory carefully.',
        timestamp: '2024-01-12T12:00:00Z'
      },
      {
        id: 'msg9',
        sender: 'admin',
        message: 'Video evidence confirms all listed items are present. Dispute resolved in favor of seller.',
        timestamp: '2024-01-14T11:30:00Z'
      }
    ],
    adminNotes: 'Seller provided comprehensive video evidence. All items confirmed present.'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'open':
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
          Open
        </Badge>
      );
    case 'under_review':
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border">
          <ClockIcon className="w-3 h-3 mr-1" />
          Under Review
        </Badge>
      );
    case 'resolved_seller':
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Seller Won
        </Badge>
      );
    case 'resolved_buyer':
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Buyer Refunded
        </Badge>
      );
    case 'closed':
      return (
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 border">
          Closed
        </Badge>
      );
    default:
      return null;
  }
};

const getEvidenceIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <PhotoIcon className="w-5 h-5" />;
    case 'video':
      return <VideoCameraIcon className="w-5 h-5" />;
    case 'document':
      return <DocumentTextIcon className="w-5 h-5" />;
    default:
      return <PaperClipIcon className="w-5 h-5" />;
  }
};

const Disputes: React.FC = () => {
  const [disputes, setDisputes] = useState(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [uploadingEvidence, setUploadingEvidence] = useState(false);

  const filteredDisputes = disputes.filter(dispute => {
    const matchesFilter = filter === 'all' || dispute.status === filter;
    const matchesSearch = 
      dispute.buyerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedDispute) return;

    const message: DisputeMessage = {
      id: Date.now().toString(),
      sender: 'seller',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setDisputes(prev => prev.map(dispute => 
      dispute.id === selectedDispute.id
        ? { ...dispute, messages: [...dispute.messages, message] }
        : dispute
    ));

    setSelectedDispute(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message]
    } : null);

    setNewMessage('');
  };

  const handleUploadEvidence = () => {
    setUploadingEvidence(true);
    // Simulate file upload
    setTimeout(() => {
      if (selectedDispute) {
        const evidence: DisputeEvidence = {
          id: Date.now().toString(),
          type: 'image',
          url: '/evidence/new_evidence.jpg',
          name: 'Additional Evidence',
          uploadedAt: new Date().toISOString()
        };

        setDisputes(prev => prev.map(dispute => 
          dispute.id === selectedDispute.id
            ? { ...dispute, evidence: [...dispute.evidence, evidence] }
            : dispute
        ));

        setSelectedDispute(prev => prev ? {
          ...prev,
          evidence: [...prev.evidence, evidence]
        } : null);
      }
      setUploadingEvidence(false);
    }, 2000);
  };

  const openDisputes = disputes.filter(d => d.status === 'open' || d.status === 'under_review').length;
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved_seller' || d.status === 'resolved_buyer').length;
  const winRate = disputes.length > 0 ? (disputes.filter(d => d.status === 'resolved_seller').length / disputes.length * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Disputes</h1>
        <p className="text-gray-400">Manage and resolve disputes with buyers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Open Disputes</p>
              <p className="text-2xl font-bold text-red-400">{openDisputes}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/20">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-green-400">{resolvedDisputes}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/20">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Win Rate</p>
              <p className="text-2xl font-bold text-[#00FFB2]">{winRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 rounded-lg bg-[#00FFB2]/20">
              <CheckCircleIcon className="w-6 h-6 text-[#00FFB2]" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Cases</p>
              <p className="text-2xl font-bold text-white">{disputes.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-500/20">
              <DocumentTextIcon className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disputes List */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">All Disputes</h3>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="open">Open</option>
                  <option value="under_review">Under Review</option>
                  <option value="resolved_seller">Seller Won</option>
                  <option value="resolved_buyer">Buyer Refunded</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredDisputes.map((dispute, index) => (
                <motion.div
                  key={dispute.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedDispute(dispute)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedDispute?.id === dispute.id
                      ? 'bg-[#00FFB2]/10 border-[#00FFB2]/30'
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={dispute.buyerAvatar}
                        alt={dispute.buyerUsername}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-white font-medium text-sm">{dispute.buyerUsername}</p>
                        <p className="text-gray-400 text-xs">{dispute.id}</p>
                      </div>
                    </div>
                    {getStatusBadge(dispute.status)}
                  </div>
                  
                  <p className="text-white text-sm font-medium mb-1">{dispute.listingTitle}</p>
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">{dispute.reason}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#00FFB2] font-medium">₦{dispute.amount.toLocaleString()}</span>
                    <span className="text-gray-500">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredDisputes.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No disputes found</h3>
                <p className="text-gray-400 text-sm">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No disputes have been filed against your listings.'}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Dispute Details */}
        <div className="lg:col-span-2">
          {selectedDispute ? (
            <div className="space-y-6">
              {/* Dispute Header */}
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedDispute.buyerAvatar}
                      alt={selectedDispute.buyerUsername}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{selectedDispute.listingTitle}</h3>
                      <p className="text-gray-400">Dispute with @{selectedDispute.buyerUsername}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Filed {new Date(selectedDispute.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="text-[#00FFB2] font-medium">₦{selectedDispute.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(selectedDispute.status)}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Dispute Reason</h4>
                    <p className="text-white">{selectedDispute.reason}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
                    <p className="text-gray-300">{selectedDispute.description}</p>
                  </div>

                  {selectedDispute.adminNotes && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-400 mb-1">Admin Notes</h4>
                      <p className="text-blue-300 text-sm">{selectedDispute.adminNotes}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Evidence */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Evidence</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUploadEvidence}
                    disabled={uploadingEvidence || selectedDispute.status === 'resolved_seller' || selectedDispute.status === 'resolved_buyer'}
                  >
                    <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                    {uploadingEvidence ? 'Uploading...' : 'Upload Evidence'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDispute.evidence.map((evidence) => (
                    <div
                      key={evidence.id}
                      className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex-shrink-0 p-2 bg-gray-700 rounded-lg">
                        {getEvidenceIcon(evidence.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{evidence.name}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(evidence.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedDispute.evidence.length === 0 && (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <DocumentTextIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm">No evidence uploaded yet</p>
                  </div>
                )}
              </Card>

              {/* Messages */}
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Communication</h3>
                
                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {selectedDispute.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'seller'
                            ? 'bg-[#00FFB2]/20 text-white'
                            : message.sender === 'admin'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium capitalize">
                            {message.sender === 'seller' ? 'You' : message.sender}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {(selectedDispute.status === 'open' || selectedDispute.status === 'under_review') && (
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      variant="primary"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black"
                    >
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Select a Dispute</h3>
                <p className="text-gray-400">Choose a dispute from the list to view details and communicate</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Disputes;