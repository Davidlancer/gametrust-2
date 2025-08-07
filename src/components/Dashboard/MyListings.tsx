import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  VideoCameraIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { useToast } from '../UI/ToastProvider';
import { TrendingUpIcon } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  game: string;
  platform: string;
  price: number;
  status: 'live' | 'paused' | 'sold';
  views: number;
  clicks: number;
  createdAt: string;
  hasVideo: boolean;
  hasWarning: boolean;
  warningReason?: string;
  image: string;
  level: number;
  linkedSocials?: string[];
  description?: string;
  promoted?: boolean;
  promotionTier?: string;
  promotionExpiry?: string;
}

interface PromotionPlan {
  id: string;
  label: string;
  duration: number;
  price: number;
  description: string;
}

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'CODM Legendary Account - Mythic Weapons',
    game: 'Call of Duty Mobile',
    platform: 'Android/iOS',
    price: 45000,
    status: 'live',
    views: 234,
    clicks: 45,
    createdAt: '2024-01-15',
    hasVideo: true,
    hasWarning: false,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    level: 150,
    linkedSocials: ['Discord', 'Instagram'],
    description: 'High-level Call of Duty Mobile account with mythic weapons and legendary skins. Perfect for competitive play.'
  },
  {
    id: '2',
    title: 'PUBG Mobile Conqueror Account',
    game: 'PUBG Mobile',
    platform: 'Android',
    price: 28500,
    status: 'live',
    views: 189,
    clicks: 32,
    createdAt: '2024-01-12',
    hasVideo: true,
    hasWarning: true,
    warningReason: 'Facebook-linked only',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    level: 95,
    linkedSocials: ['Discord'],
    description: 'Conqueror rank PUBG Mobile account with rare outfits and weapon skins. High K/D ratio.'
  },
  {
    id: '3',
    title: 'Free Fire Grandmaster Account',
    game: 'Free Fire',
    platform: 'Android/iOS',
    price: 15000,
    status: 'paused',
    views: 156,
    clicks: 28,
    createdAt: '2024-01-10',
    hasVideo: false,
    hasWarning: false,
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop',
    level: 78,
    linkedSocials: ['Discord', 'Twitter'],
    description: 'Grandmaster Free Fire account with exclusive skins and characters. Ready for ranked matches.'
  },
  {
    id: '4',
    title: 'Valorant Immortal Account - Rare Skins',
    game: 'Valorant',
    platform: 'PC',
    price: 52000,
    status: 'sold',
    views: 312,
    clicks: 67,
    createdAt: '2024-01-08',
    hasVideo: true,
    hasWarning: false,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    level: 0,
    linkedSocials: ['Discord', 'Instagram', 'Twitter'],
    description: 'Immortal rank Valorant account with rare weapon skins and agent unlocks. Perfect for competitive gaming.'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'live':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'paused':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'sold':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const promotionPlans: PromotionPlan[] = [
  { id: 'boost1', label: '1 Day Boost', duration: 1, price: 500, description: 'Basic visibility boost for 24 hours' },
  { id: 'boost3', label: '3 Days Boost + Homepage', duration: 3, price: 1200, description: 'Boosted visibility on homepage and search' },
  { id: 'boost7', label: '7 Days Boost + Top Search', duration: 7, price: 2500, description: 'Premium placement in search results and homepage' }
];

const MyListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Modal states
  const [editModal, setEditModal] = useState<{ isOpen: boolean; listing: Listing | null }>({ isOpen: false, listing: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; listing: Listing | null }>({ isOpen: false, listing: null });
  const [promoteModal, setPromoteModal] = useState<{ isOpen: boolean; listing: Listing | null }>({ isOpen: false, listing: null });
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    price: 0,
    level: 0,
    linkedSocials: [] as string[],
    description: '',
  });
  
  // Promotion state
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  
  const { showSuccess, showError } = useToast();
  
  // Load listings from localStorage on mount
  useEffect(() => {
    const savedListings = localStorage.getItem('listings');
    if (savedListings) {
      try {
        setListings(JSON.parse(savedListings));
      } catch (error) {
        console.error('Error parsing saved listings:', error);
        setListings(mockListings);
      }
    } else {
      setListings(mockListings);
    }
    
    // Load wallet balance
    const savedBalance = localStorage.getItem('walletBalance');
    if (savedBalance) {
      setWalletBalance(parseFloat(savedBalance));
    } else {
      // Set initial mock balance
      const initialBalance = 5000;
      setWalletBalance(initialBalance);
      localStorage.setItem('walletBalance', initialBalance.toString());
    }
  }, []);
  
  // Save listings to localStorage whenever listings change
  useEffect(() => {
    if (listings.length > 0) {
      localStorage.setItem('listings', JSON.stringify(listings));
    }
  }, [listings]);
  
  // Save wallet balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('walletBalance', walletBalance.toString());
  }, [walletBalance]);

  const filteredListings = listings.filter(listing => {
    const matchesFilter = filter === 'all' || listing.status === filter;
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.game.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleListingStatus = (id: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id === id) {
        return {
          ...listing,
          status: listing.status === 'live' ? 'paused' : 'live'
        };
      }
      return listing;
    }));
  };

  // Edit listing handlers
  const handleEditListing = (listing: Listing) => {
    setEditForm({
      price: listing.price,
      level: listing.level,
      linkedSocials: listing.linkedSocials || [],
      description: listing.description || '',
    });
    setEditModal({ isOpen: true, listing });
  };

  const handleSaveEdit = () => {
    if (!editModal.listing) return;
    
    if (editForm.price <= 0) {
      showError('Validation Error', 'Price must be greater than 0');
      return;
    }

    setListings(prev => prev.map(listing => 
      listing.id === editModal.listing!.id 
        ? { 
            ...listing, 
            price: editForm.price,
            level: editForm.level,
            linkedSocials: editForm.linkedSocials,
            description: editForm.description,
          }
        : listing
    ));
    
    setEditModal({ isOpen: false, listing: null });
    showSuccess('Success', 'Listing updated successfully!');
  };

  // Copy listing handler
  const handleCopyListing = (listing: Listing) => {
    const copiedListing: Listing = {
      ...listing,
      id: `copy-${Date.now()}`,
      title: `${listing.title} (Copy)`,
      createdAt: new Date().toLocaleDateString(),
      views: 0,
      clicks: 0,
    };
    
    setListings(prev => [copiedListing, ...prev]);
    showSuccess('Success', 'Listing copied successfully!');
  };

  // Delete listing handlers
  const handleDeleteListing = (listing: Listing) => {
    setDeleteModal({ isOpen: true, listing });
  };

  const confirmDeleteListing = () => {
    if (!deleteModal.listing) return;
    
    setListings(prev => prev.filter(listing => listing.id !== deleteModal.listing!.id));
    setDeleteModal({ isOpen: false, listing: null });
    showSuccess('Success', 'Listing deleted successfully!');
  };

  // Promotion handlers
  const handlePromoteListing = (listing: Listing) => {
    if (listing.promoted && listing.promotionExpiry) {
      const expiryDate = new Date(listing.promotionExpiry);
      if (expiryDate > new Date()) {
        showError('Error', `This listing is already promoted until ${expiryDate.toLocaleDateString()}.`);
        return;
      }
    }
    
    setSelectedPlanId('');
    setPromoteModal({ isOpen: true, listing });
  };

  const handlePromotePayment = () => {
    if (!promoteModal.listing || !selectedPlanId) return;
    
    const selectedPlan = promotionPlans.find(plan => plan.id === selectedPlanId);
    if (!selectedPlan) return;
    
    if (walletBalance < selectedPlan.price) {
      showError('Error', 'Insufficient wallet balance. Please top up your wallet.');
      return;
    }
    
    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + selectedPlan.duration);
    
    // Update listing with promotion
    setListings(prev => prev.map(listing => 
      listing.id === promoteModal.listing!.id
        ? {
            ...listing,
            promoted: true,
            promotionTier: selectedPlan.label,
            promotionExpiry: expiryDate.toISOString().split('T')[0]
          }
        : listing
    ));
    
    // Deduct from wallet
    setWalletBalance(prev => prev - selectedPlan.price);
    
    setPromoteModal({ isOpen: false, listing: null });
    showSuccess('Success', `✅ Listing promoted for ${selectedPlan.duration} day${selectedPlan.duration > 1 ? 's' : ''}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4 -mx-4 md:mx-0 md:bg-transparent md:backdrop-blur-none md:border-b-0 md:p-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">My Listings</h1>
            <p className="text-sm md:text-base text-gray-400">Manage your gaming account listings</p>
          </div>
          <div className="mt-3 md:mt-0">
            <Button 
              variant="primary"
              className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-sm md:text-base py-3 md:py-2"
            >
              <TrendingUpIcon className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="md:inline">Create New Listing</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex flex-col xs:flex-row xs:items-center space-y-3 xs:space-y-0 xs:space-x-3">
            <div className="relative flex-1 xs:flex-initial xs:min-w-[200px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 md:px-4 py-2.5 md:py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="paused">Paused</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 md:space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex-1 xs:flex-initial text-sm md:text-base py-2.5 md:py-2"
            >
              <span className="md:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex-1 xs:flex-initial text-sm md:text-base py-2.5 md:py-2"
            >
              <span className="md:inline">Table</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Listings Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full overflow-hidden">
                <div className="relative">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-40 md:h-48 object-cover rounded-lg mb-3 md:mb-4"
                  />
                  <div className="absolute top-2 left-2 flex items-center space-x-1.5 md:space-x-2">
                    <span className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm font-medium rounded-full ${getStatusColor(listing.status)}`}>
                      {listing.status.toUpperCase()}
                    </span>
                    {listing.hasVideo && (
                      <div className="bg-black/50 p-1 rounded">
                        <VideoCameraIcon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                    )}
                    {listing.hasWarning && (
                      <div className="bg-yellow-500/20 p-1 rounded" title={listing.warningReason}>
                        <ExclamationTriangleIcon className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => toggleListingStatus(listing.id)}
                      className="bg-black/50 p-1.5 md:p-2 rounded-lg hover:bg-black/70 transition-colors touch-manipulation"
                      disabled={listing.status === 'sold'}
                    >
                      {listing.status === 'live' ? (
                        <PauseIcon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      ) : (
                        <PlayIcon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 md:space-y-3">
                  <div>
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="text-base md:text-lg font-semibold text-white leading-tight flex-1 min-w-0">
                        <span className="block break-words">{listing.title}</span>
                      </h3>
                      {listing.promoted && listing.promotionExpiry && new Date(listing.promotionExpiry) > new Date() && (
                        <span className="bg-yellow-500 text-black text-xs font-bold px-1.5 md:px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                          Promoted
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 break-words">
                      {listing.game} • {listing.platform}
                      {listing.level > 0 && ` • Level ${listing.level}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl md:text-2xl font-bold text-indigo-400">
                      ₦{listing.price.toLocaleString()}
                    </span>
                    <div className="text-right">
                      <div className="flex items-center text-xs md:text-sm text-gray-400">
                        <EyeIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        {listing.views}
                      </div>
                      <div className="text-xs text-gray-500">
                        {listing.clicks} clicks
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 md:pt-3 border-t border-gray-700">
                    <div className="w-full">
                      <div className="grid grid-cols-2 gap-2 md:gap-2">
                        <button
                          onClick={() => handleEditListing(listing)}
                          className="bg-gray-700 text-white text-xs md:text-xs px-2.5 md:px-3 py-2 md:py-1.5 rounded-md hover:bg-gray-600 transition flex items-center justify-center space-x-1 touch-manipulation min-h-[36px] md:min-h-[auto]"
                          title="Edit"
                        >
                          <PencilIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden xs:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleCopyListing(listing)}
                          className="bg-blue-600 text-white text-xs md:text-xs px-2.5 md:px-3 py-2 md:py-1.5 rounded-md hover:bg-blue-500 transition flex items-center justify-center space-x-1 touch-manipulation min-h-[36px] md:min-h-[auto]"
                          title="Copy"
                        >
                          <DocumentDuplicateIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden xs:inline">Copy</span>
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing)}
                          className="bg-red-600 text-white text-xs md:text-xs px-2.5 md:px-3 py-2 md:py-1.5 rounded-md hover:bg-red-500 transition flex items-center justify-center space-x-1 touch-manipulation min-h-[36px] md:min-h-[auto]"
                          title="Delete"
                        >
                          <TrashIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden xs:inline">Delete</span>
                        </button>
                        <button
                          onClick={() => handlePromoteListing(listing)}
                          disabled={!!(listing.promoted && listing.promotionExpiry && new Date(listing.promotionExpiry) > new Date())}
                          className={`text-xs md:text-xs px-2.5 md:px-3 py-2 md:py-1.5 rounded-md transition inline-flex items-center justify-center gap-1 touch-manipulation min-h-[36px] md:min-h-[auto] ${
                            listing.promoted && listing.promotionExpiry && new Date(listing.promotionExpiry) > new Date()
                              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                              : 'bg-yellow-500 text-black hover:bg-yellow-400'
                          }`}
                          title={listing.promoted && listing.promotionExpiry && new Date(listing.promotionExpiry) > new Date() 
                            ? `This listing is already promoted until ${new Date(listing.promotionExpiry).toLocaleDateString()}.`
                            : 'Promote'
                          }
                        >
                          <span className="text-sm">{listing.promoted && listing.promotionExpiry && new Date(listing.promotionExpiry) > new Date() ? '🎯' : '🚀'}</span>
                          <span className="hidden xs:inline">Promote</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Table View - Mobile optimized */
        <div>
          {/* Mobile Card View (hidden on md+) */}
          <div className="md:hidden space-y-3">
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4">
                  <div className="flex space-x-3">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white break-words leading-tight">
                            {listing.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {listing.game} • {listing.platform}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ml-2 flex-shrink-0 ${getStatusColor(listing.status)}`}>
                          {listing.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-indigo-400">
                          ₦{listing.price.toLocaleString()}
                        </span>
                        <div className="text-xs text-gray-400">
                          {listing.views} views • {listing.clicks} clicks
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditListing(listing)}
                          className="bg-gray-700 text-white text-xs px-2.5 py-1.5 rounded-md hover:bg-gray-600 transition flex items-center space-x-1 touch-manipulation"
                          title="Edit"
                        >
                          <PencilIcon className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleCopyListing(listing)}
                          className="bg-blue-600 text-white text-xs px-2.5 py-1.5 rounded-md hover:bg-blue-500 transition flex items-center space-x-1 touch-manipulation"
                          title="Copy"
                        >
                          <DocumentDuplicateIcon className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing)}
                          className="bg-red-600 text-white text-xs px-2.5 py-1.5 rounded-md hover:bg-red-500 transition flex items-center space-x-1 touch-manipulation"
                          title="Delete"
                        >
                          <TrashIcon className="w-3 h-3" />
                          <span>Del</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Desktop Table View (hidden on mobile) */}
          <Card className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Account</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Game</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Views</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
              <tbody>
                {filteredListings.map((listing, index) => (
                  <motion.tr
                    key={listing.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{listing.title}</p>
                            {listing.promoted && listing.promotionExpiry && new Date(listing.promotionExpiry) > new Date() && (
                              <span className="bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded">
                                Promoted
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {listing.hasVideo && (
                              <VideoCameraIcon className="w-4 h-4 text-blue-400" />
                            )}
                            {listing.hasWarning && (
                              <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{listing.game}</td>
                    <td className="py-4 px-4 text-indigo-400 font-semibold">
                      ₦{listing.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(listing.status)}`}>
                        {listing.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {listing.views} views • {listing.clicks} clicks
                    </td>
                    <td className="py-4 px-4 text-gray-300">{listing.createdAt}</td>
                    <td className="py-4 px-4">
                      <div className="w-full max-w-[200px]">
                        <div className="grid grid-cols-2 gap-1">
                          <button
                            onClick={() => handleEditListing(listing)}
                            className="bg-gray-700 text-white text-xs px-2 py-1 rounded-md hover:bg-gray-600 transition flex items-center justify-center"
                            title="Edit"
                          >
                            <PencilIcon className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleCopyListing(listing)}
                            className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-500 transition flex items-center justify-center"
                            title="Copy"
                          >
                            <DocumentDuplicateIcon className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing)}
                            className="bg-red-600 text-white text-xs px-2 py-1 rounded-md hover:bg-red-500 transition flex items-center justify-center"
                            title="Delete"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handlePromoteListing(listing)}
                            disabled={!!(listing.promoted && listing.promotionExpiry && new Date(listing.promotionExpiry) > new Date())}
                            className={`text-xs px-2 py-1 rounded-md transition flex items-center justify-center ${
                              listing.promoted && listing.promotionExpiry && new Date(listing.promotionExpiry) > new Date()
                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                : 'bg-yellow-500 text-black hover:bg-yellow-400'
                            }`}
                            title={listing.promoted && listing.promotionExpiry && new Date(listing.promotionExpiry) > new Date() 
                              ? `This listing is already promoted until ${new Date(listing.promotionExpiry).toLocaleDateString()}.`
                              : 'Promote'
                            }
                          >
                            <span className="text-sm">{listing.promoted && listing.promotionExpiry && new Date(listing.promotionExpiry) > new Date() ? '🎯' : '🚀'}</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </div>
      )}

      {filteredListings.length === 0 && (
        <Card>
          <div className="text-center py-8 md:py-12 px-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <FunnelIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No listings found</h3>
            <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6 leading-relaxed">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t created any listings yet.'}
            </p>
            <Button 
              variant="primary"
              className="w-full xs:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-sm md:text-base py-3 md:py-2 px-6 touch-manipulation"
            >
              <TrendingUpIcon className="w-4 h-4 mr-2" />
              Create Your First Listing
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, listing: null })}
        title="Edit Listing"
        size="md"
      >
        {editModal.listing && (
          <div className="space-y-6">
            {/* Game Title (Disabled) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Game Title
              </label>
              <input
                type="text"
                value={editModal.listing.title}
                disabled
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                min="1"
                required
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Level
              </label>
              <input
                type="number"
                value={editForm.level}
                onChange={(e) => setEditForm(prev => ({ ...prev, level: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                min="0"
              />
            </div>

            {/* Linked Socials */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Linked Socials
              </label>
              <div className="space-y-2">
                {['Discord', 'Instagram', 'Twitter', 'TikTok'].map((social) => (
                  <label key={social} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.linkedSocials.includes(social)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditForm(prev => ({
                            ...prev,
                            linkedSocials: [...prev.linkedSocials, social]
                          }));
                        } else {
                          setEditForm(prev => ({
                            ...prev,
                            linkedSocials: prev.linkedSocials.filter(s => s !== social)
                          }));
                        }
                      }}
                      className="mr-2 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">{social}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Describe your listing..."
              />
            </div>

            {/* Upload Media (Dummy) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Media (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <div className="text-gray-400">
                    <svg className="mx-auto h-12 w-12 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p>Click to upload images or videos</p>
                    <p className="text-sm">PNG, JPG, MP4 up to 10MB</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setEditModal({ isOpen: false, listing: null })}
                className="px-4 py-2 text-gray-300 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, listing: null })}
        title="Delete Listing"
        size="sm"
      >
        {deleteModal.listing && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Delete "{deleteModal.listing.title}"?</h3>
                <p className="text-sm text-gray-400">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-300">
              Are you sure you want to delete this listing? This will permanently remove it from your account and it cannot be recovered.
            </p>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setDeleteModal({ isOpen: false, listing: null })}
                className="px-4 py-2 text-gray-300 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteListing}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Promote Listing Modal */}
      <Modal
        isOpen={promoteModal.isOpen}
        onClose={() => setPromoteModal({ isOpen: false, listing: null })}
        title="Promote Listing"
        size="md"
      >
        {promoteModal.listing && (
          <div className="space-y-6">
            {/* Listing Summary */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Listing Summary</h3>
              <div className="text-sm text-gray-400 space-y-1">
                <p>🎮 Game: <strong className="text-white">{promoteModal.listing.game}</strong></p>
                <p>💰 Price: <strong className="text-white">₦{promoteModal.listing.price.toLocaleString()}</strong></p>
                <p>🆔 Listing ID: <strong className="text-white">{promoteModal.listing.id.toUpperCase()}</strong></p>
              </div>
            </div>

            {/* Promotion Plans */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Choose Promotion Plan</h3>
              <div className="space-y-3">
                {promotionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`border rounded-xl p-4 cursor-pointer transition ${
                      selectedPlanId === plan.id
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-700 hover:border-green-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">🚀 {plan.label}</p>
                        <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-400 font-semibold">₦{plan.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{plan.duration} day{plan.duration > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    {selectedPlanId === plan.id && (
                      <div className="mt-2 flex items-center text-green-400 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet & Payment */}
            {selectedPlanId && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Wallet Balance:</span>
                    <span className="text-white font-semibold">₦{walletBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Promotion Cost:</span>
                    <span className="text-white font-semibold">
                      ₦{promotionPlans.find(p => p.id === selectedPlanId)?.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Remaining Balance:</span>
                      <span className={`font-semibold ${
                        walletBalance - (promotionPlans.find(p => p.id === selectedPlanId)?.price || 0) >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        ₦{(walletBalance - (promotionPlans.find(p => p.id === selectedPlanId)?.price || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {walletBalance < (promotionPlans.find(p => p.id === selectedPlanId)?.price || 0) && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Insufficient balance. Please top up your wallet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setPromoteModal({ isOpen: false, listing: null })}
                className="px-4 py-2 text-gray-300 hover:text-white transition"
              >
                Cancel
              </button>
              {selectedPlanId && (
                <button
                  onClick={handlePromotePayment}
                  disabled={walletBalance < (promotionPlans.find(p => p.id === selectedPlanId)?.price || 0)}
                  className={`px-6 py-2 rounded-lg transition ${
                    walletBalance >= (promotionPlans.find(p => p.id === selectedPlanId)?.price || 0)
                      ? 'bg-green-600 text-white hover:bg-green-500'
                      : 'bg-gray-500 text-white cursor-not-allowed'
                  }`}
                >
                  {walletBalance >= (promotionPlans.find(p => p.id === selectedPlanId)?.price || 0)
                    ? 'Pay with Wallet'
                    : 'Insufficient Balance'
                  }
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyListings;