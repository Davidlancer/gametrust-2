import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../UI/Button';

interface SavedListing {
  id: string;
  game: string;
  title: string;
  level: string;
  price: number;
  originalPrice?: number;
  seller: {
    username: string;
    rating: number;
    verified: boolean;
  };
  images: string[];
  features: string[];
  savedDate: string;
  lastUpdated: string;
  status: 'available' | 'sold' | 'reserved';
  discount?: number;
}

const mockSavedListings: SavedListing[] = [
  {
    id: 'SAVE-001',
    game: 'CODM',
    title: 'Legendary Account with Mythic Weapons',
    level: 'Level 150',
    price: 85000,
    originalPrice: 95000,
    seller: {
      username: '@ProGamer',
      rating: 4.9,
      verified: true
    },
    images: ['/api/placeholder/300/200'],
    features: ['Mythic AK47', 'Legendary Character', 'All Battle Pass'],
    savedDate: 'June 20, 2024',
    lastUpdated: '2 hours ago',
    status: 'available',
    discount: 10
  },
  {
    id: 'SAVE-002',
    game: 'PUBG',
    title: 'Conqueror Tier Account',
    level: 'Level 78',
    price: 120000,
    seller: {
      username: '@PubgMaster',
      rating: 4.8,
      verified: true
    },
    images: ['/api/placeholder/300/200'],
    features: ['Conqueror Title', 'Rare Outfits', 'Premium Crates'],
    savedDate: 'June 18, 2024',
    lastUpdated: '1 day ago',
    status: 'available'
  },
  {
    id: 'SAVE-003',
    game: 'Free Fire',
    title: 'Heroic Rank with Rare Bundles',
    level: 'Level 65',
    price: 45000,
    seller: {
      username: '@FFKing',
      rating: 4.7,
      verified: false
    },
    images: ['/api/placeholder/300/200'],
    features: ['Heroic Badge', 'Rare Bundles', 'Premium Characters'],
    savedDate: 'June 15, 2024',
    lastUpdated: '3 days ago',
    status: 'sold'
  },
  {
    id: 'SAVE-004',
    game: 'CODM',
    title: 'Master Rank Account',
    level: 'Level 95',
    price: 55000,
    originalPrice: 65000,
    seller: {
      username: '@CodmPro',
      rating: 4.6,
      verified: true
    },
    images: ['/api/placeholder/300/200'],
    features: ['Master Rank', 'Legendary Weapons', 'Rare Skins'],
    savedDate: 'June 12, 2024',
    lastUpdated: '5 days ago',
    status: 'reserved',
    discount: 15
  },
  {
    id: 'SAVE-005',
    game: 'PUBG',
    title: 'Crown Tier with Rare Items',
    level: 'Level 82',
    price: 75000,
    seller: {
      username: '@PubgElite',
      rating: 4.9,
      verified: true
    },
    images: ['/api/placeholder/300/200'],
    features: ['Crown Tier', 'Mythic Outfits', 'Rare Vehicles'],
    savedDate: 'June 10, 2024',
    lastUpdated: '1 week ago',
    status: 'available'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'available':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
          Available
        </span>
      );
    case 'sold':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
          Sold
        </span>
      );
    case 'reserved':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
          Reserved
        </span>
      );
    default:
      return null;
  }
};

const BuyerSavedListings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('saved_date');
  const [selectedListing, setSelectedListing] = useState<SavedListing | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  
  const filteredListings = mockSavedListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.seller.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = gameFilter === 'all' || listing.game === gameFilter;
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    
    return matchesSearch && matchesGame && matchesStatus;
  });
  
  const handleRemoveFromSaved = (listingId: string) => {
    setRemovingId(listingId);
    // Simulate API call
    setTimeout(() => {
      console.log('Removed listing:', listingId);
      setRemovingId(null);
    }, 1000);
  };
  
  const handleBuyNow = (listing: SavedListing) => {
    console.log('Buying listing:', listing.id);
    // Redirect to purchase flow
  };
  
  const handleViewDetails = (listing: SavedListing) => {
    setSelectedListing(listing);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Saved Listings</h1>
          <p className="text-gray-400 mt-1">Your favorited gaming accounts ({filteredListings.length} items)</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Available</p>
          <p className="text-xl font-bold text-green-400">
            {filteredListings.filter(l => l.status === 'available').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search saved listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Games</option>
            <option value="CODM">Call of Duty Mobile</option>
            <option value="PUBG">PUBG Mobile</option>
            <option value="Free Fire">Free Fire</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="saved_date">Recently Saved</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="last_updated">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredListings.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <HeartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No saved listings found</h3>
              <p className="text-gray-500">Start browsing and save your favorite gaming accounts</p>
              <Button
                variant="primary"
                onClick={() => window.open('/marketplace', '_blank')}
                className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                Browse Marketplace
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <motion.div
                key={listing.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-200"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-700">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 backdrop-blur-sm">
                      {listing.game}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(listing.status)}
                  </div>
                  {listing.discount && (
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 backdrop-blur-sm">
                        -{listing.discount}% OFF
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1 line-clamp-2">{listing.title}</h3>
                      <p className="text-sm text-gray-400">{listing.level}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromSaved(listing.id)}
                      disabled={removingId === listing.id}
                      className="ml-3 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      {removingId === listing.id ? (
                        <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <HeartSolidIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Seller Info */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-300">{listing.seller.username}</span>
                      {listing.seller.verified && (
                        <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-300">{listing.seller.rating}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {listing.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-700/50 text-gray-300"
                        >
                          {feature}
                        </span>
                      ))}
                      {listing.features.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-700/50 text-gray-300">
                          +{listing.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-white">
                        ₦{listing.price.toLocaleString()}
                      </span>
                      {listing.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₦{listing.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Saved: {listing.savedDate}</span>
                    <span>Updated: {listing.lastUpdated}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(listing)}
                      className="flex-1 flex items-center justify-center space-x-2"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>View</span>
                    </Button>
                    
                    {listing.status === 'available' ? (
                      <Button
                        variant="primary"
                        onClick={() => handleBuyNow(listing)}
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 flex items-center justify-center space-x-2"
                      >
                        <ShoppingCartIcon className="w-4 h-4" />
                        <span>Buy Now</span>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        disabled
                        className="flex-1 opacity-50 cursor-not-allowed"
                      >
                        {listing.status === 'sold' ? 'Sold' : 'Reserved'}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Listing Details</h3>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Image */}
              <div className="relative h-64 bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={selectedListing.images[0]}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 backdrop-blur-sm">
                    {selectedListing.game}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  {getStatusBadge(selectedListing.status)}
                </div>
              </div>
              
              {/* Details */}
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">{selectedListing.title}</h4>
                <p className="text-gray-400 mb-4">{selectedListing.level}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Seller</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{selectedListing.seller.username}</span>
                      {selectedListing.seller.verified && (
                        <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Rating</p>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{selectedListing.seller.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedListing.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-700/50 text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-white">
                      ₦{selectedListing.price.toLocaleString()}
                    </span>
                    {selectedListing.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ₦{selectedListing.originalPrice.toLocaleString()}
                      </span>
                    )}
                    {selectedListing.discount && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
                        -{selectedListing.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => handleRemoveFromSaved(selectedListing.id)}
                  className="flex items-center space-x-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Remove from Saved</span>
                </Button>
                
                {selectedListing.status === 'available' ? (
                  <Button
                    variant="primary"
                    onClick={() => handleBuyNow(selectedListing)}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    <span>Buy Now</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    disabled
                    className="flex-1 opacity-50 cursor-not-allowed"
                  >
                    {selectedListing.status === 'sold' ? 'Sold Out' : 'Reserved'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BuyerSavedListings;