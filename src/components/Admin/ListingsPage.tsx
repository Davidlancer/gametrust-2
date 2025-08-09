import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useActivityLog } from '../../context/ActivityLogContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  TrashIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

import { alertUtils } from '../../utils/alertMigration';

// Toast notification function using SimpleToast
const toast = {
  success: (message: string) => {
    alertUtils.success(message);
  },
  error: (message: string) => {
    alertUtils.error(message);
  },
  info: (message: string) => {
    alertUtils.info(message);
  }
};

interface Listing {
  id: string;
  title: string;
  game: string;
  seller: {
    username: string;
    verified: boolean;
  };
  price: number;
  status: 'active' | 'pending' | 'rejected' | 'sold';
  category: string;
  createdAt: string;
  views: number;
  flagged: boolean;
  description: string;
  images: string[];
}

const ListingsPage: React.FC = () => {
  const { addActivity } = useActivityLog();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [selectedListings, setSelectedListings] = useState<string[]>([]);

  const [listings, setListings] = useState<Listing[]>([
    {
      id: '1',
      title: 'Rare CS:GO Dragon Lore AWP',
      game: 'CS:GO',
      seller: { username: 'proSeller', verified: true },
      price: 2500.00,
      status: 'active',
      category: 'Weapon Skin',
      createdAt: '2024-03-15',
      views: 1250,
      flagged: false,
      description: 'Factory New Dragon Lore AWP with perfect float value',
      images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop']
    },
    {
      id: '2',
      title: 'Fortnite Account - 500+ Skins',
      game: 'Fortnite',
      seller: { username: 'gamer123', verified: false },
      price: 850.00,
      status: 'pending',
      category: 'Account',
      createdAt: '2024-03-14',
      views: 89,
      flagged: true,
      description: 'Account with rare skins including Renegade Raider',
      images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop']
    },
    {
      id: '3',
      title: 'Valorant Radiant Account',
      game: 'Valorant',
      seller: { username: 'valorantPro', verified: true },
      price: 1200.00,
      status: 'active',
      category: 'Account',
      createdAt: '2024-03-13',
      views: 456,
      flagged: false,
      description: 'Radiant rank account with exclusive skins',
      images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop']
    },
    {
      id: '4',
      title: 'Suspicious Cheap Account',
      game: 'League of Legends',
      seller: { username: 'suspiciousUser', verified: false },
      price: 50.00,
      status: 'rejected',
      category: 'Account',
      createdAt: '2024-03-12',
      views: 23,
      flagged: true,
      description: 'Diamond account with all champions',
      images: []
    },
    {
      id: '5',
      title: 'Minecraft Premium Account',
      game: 'Minecraft',
      seller: { username: 'minecraftFan', verified: true },
      price: 25.00,
      status: 'sold',
      category: 'Account',
      createdAt: '2024-03-10',
      views: 234,
      flagged: false,
      description: 'Premium Minecraft account with Java edition',
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop']
    }
  ]);

  // Load listings from localStorage on component mount
  useEffect(() => {
    const savedListings = localStorage.getItem('admin_listings');
    if (savedListings) {
      setListings(JSON.parse(savedListings));
    }
  }, []);

  // Save listings to localStorage whenever listings state changes
  useEffect(() => {
    localStorage.setItem('admin_listings', JSON.stringify(listings));
  }, [listings]);

  const games = ['CS:GO', 'Fortnite', 'Valorant', 'League of Legends', 'Minecraft', 'Apex Legends'];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.seller.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    const matchesGame = gameFilter === 'all' || listing.game === gameFilter;
    return matchesSearch && matchesStatus && matchesGame;
  });



  // Enhanced listing actions with toast notifications
  const handleFlag = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;
    
    if (listing.flagged) {
      toast.info(`"${listing.title}" is already flagged.`);
      return;
    }
    
    setListings(prevListings => 
      prevListings.map(listing => 
        listing.id === listingId 
          ? { ...listing, flagged: true, status: 'pending' }
          : listing
      )
    );
    addActivity(`Listing "${listing.title}" has been flagged for review`, 'listing', 'warning');
    toast.info(`"${listing.title}" has been flagged ⚠️`);
  };

  const handleRemove = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;
    
    setListings(prevListings => prevListings.filter(l => l.id !== listingId));
    addActivity(`Listing "${listing.title}" has been removed from the platform`, 'listing', 'error');
    toast.error(`"${listing.title}" has been removed.`);
  };

  const handleApprove = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;
    
    setListings(prevListings => 
      prevListings.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: 'active', flagged: false }
          : listing
      )
    );
    addActivity(`Listing "${listing.title}" has been approved`, 'listing', 'success');
    toast.success(`"${listing.title}" has been approved.`);
  };

  const handleReject = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;
    
    setListings(prevListings => 
      prevListings.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: 'rejected' }
          : listing
      )
    );
    addActivity(`Listing "${listing.title}" has been rejected`, 'listing', 'error');
    toast.error(`"${listing.title}" has been rejected.`);
  };

  const handleListingAction = (listingId: string, action: 'approve' | 'reject' | 'deactivate' | 'flag' | 'remove') => {
    switch (action) {
      case 'approve':
        handleApprove(listingId);
        break;
      case 'reject':
        handleReject(listingId);
        break;
      case 'flag':
        handleFlag(listingId);
        break;
      case 'remove':
        handleRemove(listingId);
        break;
      case 'deactivate': {
        setListings(prevListings => 
          prevListings.map(listing => 
            listing.id === listingId 
              ? { ...listing, status: 'pending' }
              : listing
          )
        );
        const deactivatedListing = listings.find(l => l.id === listingId);
        addActivity(`Listing "${deactivatedListing?.title}" has been deactivated`, 'listing', 'warning');
        toast.info('Listing has been deactivated.');
        break;
      }
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedListings.length === 0) {
      toast.error('No listings selected');
      return;
    }

    let message = '';
    let severity: 'info' | 'warning' | 'success' | 'error' = 'info';

    selectedListings.forEach(listingId => {
      switch (action) {
        case 'flag':
          handleFlag(listingId);
          break;
        case 'remove':
          handleRemove(listingId);
          break;
        case 'approve':
          handleApprove(listingId);
          break;
        case 'reject':
          handleReject(listingId);
          break;
        case 'deactivate':
          handleListingAction(listingId, 'deactivate');
          break;
      }
    });

    switch (action) {
      case 'flag':
        message = `${selectedListings.length} listings flagged`;
        severity = 'warning';
        break;
      case 'remove':
        message = `${selectedListings.length} listings removed`;
        severity = 'error';
        break;
      case 'approve':
        message = `${selectedListings.length} listings approved`;
        severity = 'success';
        break;
      case 'reject':
        message = `${selectedListings.length} listings rejected`;
        severity = 'warning';
        break;
      case 'deactivate':
        message = `${selectedListings.length} listings deactivated`;
        severity = 'warning';
        break;
    }

    // Log bulk action to activity log
    addActivity(`Bulk action: ${message}`, 'listing', severity);
    const actionCount = selectedListings.length;
    setSelectedListings([]);
    toast.success(`Bulk ${action} completed for ${actionCount} listing(s).`);
  };

  const handleViewListing = (listing: Listing) => {
    // TODO: Implement listing detail modal or navigation
    console.log('Viewing listing:', listing);
    alert(`Viewing listing: ${listing.title}`);
  };

  // Status color mapping for badges
  const statusColorMap = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    active: "bg-green-100 text-green-800 border-green-200", 
    rejected: "bg-red-100 text-red-800 border-red-200",
    sold: "bg-blue-100 text-blue-800 border-blue-200"
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedListings(filteredListings.map(listing => listing.id));
    } else {
      setSelectedListings([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Listings Management</h1>
          <p className="text-gray-400 mt-1">Review and moderate game listings</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" size="md">
            Export Data
          </Button>
          <Button variant="primary" size="md">
            Bulk Review
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Listings</p>
              <p className="text-2xl font-bold text-white">{listings.length}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Pending Review</p>
              <p className="text-2xl font-bold text-white">{listings.filter(l => l.status === 'pending').length}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Flagged</p>
              <p className="text-2xl font-bold text-white">{listings.filter(l => l.flagged).length}</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <XMarkIcon className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active</p>
              <p className="text-2xl font-bold text-white">{listings.filter(l => l.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
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
              placeholder="Search by title, game, or seller..."
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
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 px-3 py-2.5 transition-all duration-200 hover:bg-gray-600"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 px-3 py-2.5 transition-all duration-200 hover:bg-gray-600"
            >
              <option value="all">All Games</option>
              {games.map(game => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedListings.length > 0 && (
          <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">
                {selectedListings.length} listing(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('approve')}>
                  Approve ({selectedListings.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('reject')}>
                  Reject ({selectedListings.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('flag')}>
                  Flag ({selectedListings.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('remove')}>
                  Remove ({selectedListings.length})
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedListings([])}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Listings Table */}
      <Card className="overflow-hidden">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-300">No listings found</h3>
            <p className="mt-1 text-sm text-gray-400">
              {searchQuery || statusFilter !== 'all' || gameFilter !== 'all'
                ? 'No listings match the selected criteria. Try adjusting your filters.'
                : 'No listings available in the system.'}
            </p>
            {(searchQuery || statusFilter !== 'all' || gameFilter !== 'all') && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setGameFilter('all');
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
                      checked={selectedListings.length === filteredListings.length && filteredListings.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Game
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date Listed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900/50 divide-y divide-gray-700">
                {filteredListings.map((listing, index) => (
                  <motion.tr
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedListings.includes(listing.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedListings([...selectedListings, listing.id]);
                            } else {
                              setSelectedListings(selectedListings.filter(id => id !== listing.id));
                            }
                          }}
                          className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
                        />
                        {listing.flagged && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" title="Flagged" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="h-12 w-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-700 rounded-lg flex items-center justify-center">
                          <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white truncate max-w-xs">
                        {listing.title}
                      </div>
                      <div className="text-sm text-gray-400">
                        {listing.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{listing.game}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">{listing.seller.username}</span>
                        {listing.seller.verified && (
                          <CheckCircleIcon className="w-4 h-4 text-blue-500" title="Verified Seller" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        ${listing.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColorMap[listing.status as keyof typeof statusColorMap]}`}>
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {listing.views} views
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleViewListing(listing)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-1 rounded transition-colors"
                          title="View"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        
                        {listing.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleListingAction(listing.id, 'approve')}
                              className="text-green-400 hover:text-green-300 hover:bg-green-500/10 p-1 rounded transition-colors"
                              title="Approve"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleListingAction(listing.id, 'reject')}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded transition-colors"
                              title="Reject"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {listing.status === 'active' && (
                          <button
                            onClick={() => handleListingAction(listing.id, 'deactivate')}
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 p-1 rounded transition-colors"
                            title="Deactivate"
                          >
                            <ExclamationTriangleIcon className="w-4 h-4" />
                          </button>
                        )}
                        
                        {!listing.flagged && (
                          <button
                            onClick={() => handleListingAction(listing.id, 'flag')}
                            className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 p-1 rounded transition-colors"
                            title="Flag"
                          >
                            <FlagIcon className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleListingAction(listing.id, 'remove')}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
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
          Showing {filteredListings.length} of {listings.length} listings
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

export default ListingsPage;