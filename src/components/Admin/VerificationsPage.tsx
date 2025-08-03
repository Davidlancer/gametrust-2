import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Button from '../UI/Button';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  DocumentTextIcon,
  PhotoIcon,
  UserIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface VerificationRequest {
  id: string;
  type: 'user' | 'listing' | 'seller';
  user: {
    username: string;
    email: string;
    avatar?: string;
    joinDate: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  documents: {
    id: string;
    name: string;
    type: 'image' | 'document';
    url: string;
    verified: boolean;
  }[];
  listing?: {
    id: string;
    title: string;
    game: string;
    price: number;
    category: string;
  };
  reason?: string;
  notes?: string;
  riskScore: number;
}

const VerificationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

  // Mock data
  const verificationRequests: VerificationRequest[] = [
    {
      id: 'VER001',
      type: 'user',
      user: {
        username: 'proGamer2024',
        email: 'progamer@email.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
        joinDate: '2024-01-15'
      },
      status: 'pending',
      priority: 'high',
      submittedAt: '2024-03-15T10:30:00Z',
      documents: [
        { id: 'doc1', name: 'Government ID', type: 'image', url: '/docs/id1.jpg', verified: false },
        { id: 'doc2', name: 'Proof of Address', type: 'document', url: '/docs/address1.pdf', verified: false }
      ],
      riskScore: 25,
      notes: 'User requesting verification for high-value transactions'
    },
    {
      id: 'VER002',
      type: 'listing',
      user: {
        username: 'csgoTrader',
        email: 'trader@email.com',
        joinDate: '2023-08-20'
      },
      status: 'under_review',
      priority: 'urgent',
      submittedAt: '2024-03-14T15:45:00Z',
      listing: {
        id: 'LST001',
        title: 'CS:GO Dragon Lore AWP Factory New',
        game: 'Counter-Strike 2',
        price: 8500.00,
        category: 'Weapon Skin'
      },
      documents: [
        { id: 'doc3', name: 'Item Screenshot', type: 'image', url: '/docs/item1.jpg', verified: true },
        { id: 'doc4', name: 'Steam Inventory', type: 'image', url: '/docs/inventory1.jpg', verified: false },
        { id: 'doc5', name: 'Ownership Proof', type: 'document', url: '/docs/ownership1.pdf', verified: false }
      ],
      riskScore: 85,
      notes: 'High-value item requiring additional verification'
    },
    {
      id: 'VER003',
      type: 'seller',
      user: {
        username: 'trustedSeller',
        email: 'seller@email.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face',
        joinDate: '2023-12-01'
      },
      status: 'approved',
      priority: 'medium',
      submittedAt: '2024-03-13T09:15:00Z',
      reviewedAt: '2024-03-14T14:30:00Z',
      reviewedBy: 'admin_sarah',
      documents: [
        { id: 'doc6', name: 'Business License', type: 'document', url: '/docs/license1.pdf', verified: true },
        { id: 'doc7', name: 'Tax ID', type: 'document', url: '/docs/tax1.pdf', verified: true }
      ],
      riskScore: 15,
      notes: 'Verified business seller with clean history'
    },
    {
      id: 'VER004',
      type: 'user',
      user: {
        username: 'newUser123',
        email: 'newuser@email.com',
        joinDate: '2024-03-10'
      },
      status: 'rejected',
      priority: 'low',
      submittedAt: '2024-03-12T14:20:00Z',
      reviewedAt: '2024-03-13T10:15:00Z',
      reviewedBy: 'admin_mike',
      documents: [
        { id: 'doc8', name: 'Blurry ID Photo', type: 'image', url: '/docs/id2.jpg', verified: false }
      ],
      reason: 'Documents not clear enough for verification',
      riskScore: 60,
      notes: 'Requested clearer documentation'
    },
    {
      id: 'VER005',
      type: 'listing',
      user: {
        username: 'valorantPro',
        email: 'valorant@email.com',
        joinDate: '2024-02-01'
      },
      status: 'pending',
      priority: 'medium',
      submittedAt: '2024-03-11T11:30:00Z',
      listing: {
        id: 'LST002',
        title: 'Valorant Radiant Account',
        game: 'Valorant',
        price: 1200.00,
        category: 'Game Account'
      },
      documents: [
        { id: 'doc9', name: 'Account Screenshot', type: 'image', url: '/docs/valorant1.jpg', verified: false },
        { id: 'doc10', name: 'Match History', type: 'image', url: '/docs/matches1.jpg', verified: false }
      ],
      riskScore: 40,
      notes: 'Account verification for rank authenticity'
    }
  ];

  const filteredRequests = verificationRequests.filter(request => {
    const matchesSearch = request.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (request.listing?.title.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         request.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || request.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'under_review': return <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />;
      case 'approved': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XMarkIcon className="w-4 h-4 text-red-500" />;
      default: return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/10';
      case 'under_review': return 'text-orange-400 bg-orange-500/10';
      case 'approved': return 'text-green-400 bg-green-500/10';
      case 'rejected': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-400 bg-red-500/10';
    if (score >= 40) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-green-400 bg-green-500/10';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <UserIcon className="w-4 h-4" />;
      case 'listing': return <TagIcon className="w-4 h-4" />;
      case 'seller': return <ShieldCheckIcon className="w-4 h-4" />;
      default: return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  const handleVerificationAction = (requestId: string, action: 'approve' | 'reject' | 'review') => {
    console.log(`${action} verification:`, requestId);
    // Implement verification action logic
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action}:`, selectedRequests);
    setSelectedRequests([]);
  };

  const handleViewRequest = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setShowVerificationModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Verification Requests</h1>
          <p className="text-gray-400 mt-1">Review and approve verification requests</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" size="md">
            Export Report
          </Button>
          <Button variant="primary" size="md">
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-white">{verificationRequests.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Under Review</p>
              <p className="text-2xl font-bold text-white">{verificationRequests.filter(r => r.status === 'under_review').length}</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-white">{verificationRequests.filter(r => r.status === 'approved').length}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">High Risk</p>
              <p className="text-2xl font-bold text-white">{verificationRequests.filter(r => r.riskScore >= 70).length}</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </Card>
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
              placeholder="Search verifications..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="user">User</option>
                <option value="listing">Listing</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRequests.length > 0 && (
          <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">
                {selectedRequests.length} request(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('approve')}>
                  Approve
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('reject')}>
                  Reject
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('review')}>
                  Mark for Review
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRequests([])}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Verification Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(request.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRequests([...selectedRequests, request.id]);
                      } else {
                        setSelectedRequests(selectedRequests.filter(id => id !== request.id));
                      }
                    }}
                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(request.type)}
                          <h3 className="text-lg font-semibold text-white capitalize">
                            {request.type} Verification - {request.user.username}
                          </h3>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskScoreColor(request.riskScore)}`}>
                          Risk: {request.riskScore}%
                        </span>
                      </div>
                      
                      {request.listing && (
                        <div className="bg-gray-700/30 rounded-lg p-3 mt-2">
                          <p className="text-sm font-medium text-white">{request.listing.title}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                            <span>{request.listing.game}</span>
                            <span>•</span>
                            <span>${request.listing.price.toLocaleString()}</span>
                            <span>•</span>
                            <span>{request.listing.category}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>ID: {request.id}</span>
                        <span>•</span>
                        <span>Email: {request.user.email}</span>
                        <span>•</span>
                        <span>Joined: {new Date(request.user.joinDate).toLocaleDateString()}</span>
                      </div>
                      
                      {request.notes && (
                        <p className="text-sm text-gray-300 bg-gray-700/30 rounded p-2 mt-2">{request.notes}</p>
                      )}
                      
                      {request.reason && (
                        <p className="text-sm text-red-300 bg-red-500/10 rounded p-2 mt-2">
                          <strong>Rejection Reason:</strong> {request.reason}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        {request.user.avatar ? (
                          <img src={request.user.avatar} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{request.user.username}</p>
                        <p className="text-xs text-gray-400">{request.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <DocumentTextIcon className="w-4 h-4" />
                        <span>{request.documents.length} documents</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>{request.documents.filter(d => d.verified).length} verified</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Submitted {formatDate(request.submittedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-300 mb-2">Documents:</p>
                    <div className="flex flex-wrap gap-2">
                      {request.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-2 bg-gray-700/30 rounded-lg px-3 py-2">
                          {doc.type === 'image' ? (
                            <PhotoIcon className="w-4 h-4 text-blue-400" />
                          ) : (
                            <DocumentTextIcon className="w-4 h-4 text-green-400" />
                          )}
                          <span className="text-xs text-gray-300">{doc.name}</span>
                          {doc.verified && (
                            <CheckCircleIcon className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center space-x-3 pt-4 border-t border-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewRequest(request)}
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    {(request.status === 'pending' || request.status === 'under_review') && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerificationAction(request.id, 'approve')}
                          className="text-green-400 border-green-400 hover:bg-green-500/10"
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerificationAction(request.id, 'reject')}
                          className="text-red-400 border-red-400 hover:bg-red-500/10"
                        >
                          <XMarkIcon className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {request.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerificationAction(request.id, 'review')}
                        className="text-yellow-400 border-yellow-400 hover:bg-yellow-500/10"
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                        Mark for Review
                      </Button>
                    )}
                    
                    {request.reviewedBy && (
                      <span className="text-xs text-gray-400">
                        Reviewed by {request.reviewedBy} on {request.reviewedAt && formatDate(request.reviewedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {filteredRequests.length} of {verificationRequests.length} requests
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

export default VerificationsPage;