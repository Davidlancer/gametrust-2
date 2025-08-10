import React, { useState, useRef, useEffect, ErrorInfo, Component } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  ShoppingCartIcon,
  EyeIcon,
  TrashIcon,
  StarIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  BoltIcon,
  TrophyIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, SparklesIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import Button from '../UI/Button';
import { alertUtils } from '../../utils/alertMigration';

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
  pinned?: boolean;
  priceDropped?: boolean;
  recentlyAdded?: boolean;
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

// Helper functions
const getRandomSavedCount = () => Math.floor(Math.random() * 50) + 5;
const getTimeSinceSaved = () => {
  const options = ['2 hours ago', '1 day ago', '3 days ago', '1 week ago', '2 weeks ago'];
  return options[Math.floor(Math.random() * options.length)];
};

const getBadgeType = (listing: SavedListing) => {
  if (listing.recentlyAdded) return 'new';
  if (listing.priceDropped) return 'price-drop';
  if (listing.discount && listing.discount > 0) return 'discount';
  return null;
};

const getBadgeText = (type: string | null) => {
  switch (type) {
    case 'new': return 'NEW';
    case 'price-drop': return 'PRICE DROP';
    case 'discount': return 'SALE';
    default: return null;
  }
};

const getBadgeColor = (type: string | null) => {
  switch (type) {
    case 'new': return 'bg-green-500/20 text-green-400';
    case 'price-drop': return 'bg-orange-500/20 text-orange-400';
    case 'discount': return 'bg-red-500/20 text-red-400';
    default: return '';
  }
};

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

// Desktop Filter Drawer Component
interface DesktopFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  gameFilter: string;
  setGameFilter: (filter: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const DesktopFilterDrawer: React.FC<DesktopFilterDrawerProps> = ({
  isOpen,
  onClose,
  gameFilter,
  setGameFilter,
  statusFilter,
  setStatusFilter,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy
}) => {
  const resetFilters = () => {
    setGameFilter('all');
    setStatusFilter('all');
    setPriceRange([0, 200000]);
    setSortBy('recent');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <FunnelIcon className="w-6 h-6 text-indigo-400" />
                  <span>Advanced Filters</span>
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-400" />
                </motion.button>
              </div>

              {/* Sort Options */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: 'recent', label: 'Recently Saved' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Seller Rating' },
                    { value: 'game', label: 'Game Title' }
                  ].map((option) => (
                    <motion.label
                      key={option.value}
                      whileHover={{ x: 4 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/30 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-4 h-4 text-indigo-500 bg-gray-700 border-gray-600 focus:ring-indigo-500 focus:ring-2"
                      />
                      <span className="text-gray-300">{option.label}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Game Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Games' },
                    { value: 'CODM', label: 'Call of Duty Mobile' },
                    { value: 'PUBG', label: 'PUBG Mobile' },
                    { value: 'Free Fire', label: 'Free Fire' }
                  ].map((option) => (
                    <motion.label
                      key={option.value}
                      whileHover={{ x: 4 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/30 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={gameFilter === option.value}
                        onChange={() => setGameFilter(option.value)}
                        className="w-4 h-4 text-indigo-500 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                      <span className="text-gray-300">{option.label}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Availability</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Status' },
                    { value: 'available', label: 'Available' },
                    { value: 'reserved', label: 'Reserved' },
                    { value: 'sold', label: 'Sold' }
                  ].map((option) => (
                    <motion.label
                      key={option.value}
                      whileHover={{ x: 4 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/30 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={statusFilter === option.value}
                        onChange={() => setStatusFilter(option.value)}
                        className="w-4 h-4 text-indigo-500 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                      <span className="text-gray-300">{option.label}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>₦{priceRange[0].toLocaleString()}</span>
                    <span>₦{priceRange[1].toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb absolute top-0"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800/50"
                >
                  Reset All
                </Button>
                <Button
                  variant="primary"
                  onClick={onClose}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Desktop Grid Component
interface DesktopGridProps {
  listings: SavedListing[];
  viewMode: 'grid' | 'list';
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  onSelectListing: (listing: SavedListing) => void;
  onRemoveListing: (id: string) => void;
  onBuyNow: (listing: SavedListing) => void;
  onPinListing: (id: string) => void;
}

const DesktopGrid: React.FC<DesktopGridProps> = ({
  listings,
  viewMode,
  hoveredCard,
  setHoveredCard,
  onSelectListing,
  onRemoveListing,
  onBuyNow,
  onPinListing
}) => {
  const getTimeSinceSaved = () => {
    const options = ['2 hours ago', '1 day ago', '3 days ago', '1 week ago', '2 weeks ago'];
    return options[Math.floor(Math.random() * options.length)];
  };

  return (
    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
      {listings.map((listing, index) => {
        const badgeType = getBadgeType(listing);
        const timeSaved = getTimeSinceSaved();
        
        return (
          <motion.div
            key={listing.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredCard(listing.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 cursor-pointer"
          >
            {/* Pin Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: hoveredCard === listing.id || listing.pinned ? 1 : 0,
                scale: hoveredCard === listing.id || listing.pinned ? 1 : 0.8
              }}
              onClick={() => onPinListing(listing.id)}
              className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-colors ${
                listing.pinned 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'bg-gray-900/50 text-gray-400 hover:text-yellow-400 border border-gray-600/50'
              }`}
            >
              {listing.pinned ? (
                <BookmarkSolidIcon className="w-4 h-4" />
              ) : (
                <BookmarkIcon className="w-4 h-4" />
              )}
            </motion.button>

            {/* Hover Actions */}
            <AnimatePresence>
              {hoveredCard === listing.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-3 left-3 z-10 flex space-x-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSelectListing(listing)}
                    className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-full text-gray-300 hover:text-white border border-gray-600/50 hover:border-gray-500/50 transition-colors"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onBuyNow(listing)}
                    className="p-2 bg-green-500/20 backdrop-blur-sm rounded-full text-green-400 hover:text-green-300 border border-green-500/30 hover:border-green-400/50 transition-colors"
                  >
                    <ShoppingCartIcon className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/50 transition-colors"
                  >
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemoveListing(listing.id)}
                    className="p-2 bg-red-500/20 backdrop-blur-sm rounded-full text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                {badgeType && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeColor(badgeType)}`}>
                    {getBadgeText(badgeType)}
                  </span>
                )}
                {listing.priceDropped && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs font-bold"
                  >
                    <BoltIcon className="w-3 h-3" />
                    <span>PRICE DROP</span>
                  </motion.div>
                )}
                {listing.recentlyAdded && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-bold"
                  >
                    <SparklesIcon className="w-3 h-3" />
                    <span>NEW</span>
                  </motion.div>
                )}
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-3 right-3">
                {getStatusBadge(listing.status)}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">
                    {listing.game}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-400">{listing.level}</p>
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {listing.seller.username.charAt(1).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-white">{listing.seller.username}</span>
                    {listing.seller.verified && (
                      <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-400">{listing.seller.rating}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-4">
                {listing.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                    {feature}
                  </span>
                ))}
                {listing.features.length > 3 && (
                  <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                    +{listing.features.length - 3} more
                  </span>
                )}
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">₦{listing.price.toLocaleString()}</span>
                    {listing.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">₦{listing.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">Saved {timeSaved}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Smart Sidebar Component
interface SmartSidebarProps {
  listings: SavedListing[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  onClearAll: () => void;
}

const SmartSidebar: React.FC<SmartSidebarProps> = ({
  listings,
  sortBy,
  setSortBy,
  onClearAll
}) => {

  
  const stats = {
    total: listings.length,
    available: listings.filter(l => l.status === 'available').length,
    totalValue: listings.reduce((sum, l) => sum + l.price, 0),
    avgPrice: listings.length > 0 ? listings.reduce((sum, l) => sum + l.price, 0) / listings.length : 0
  };

  const mostValuable = listings.reduce((max, listing) => 
    listing.price > max.price ? listing : max, listings[0] || { price: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Vault Statistics */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <CubeIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Vault Statistics</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-gray-400">Total Items</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{stats.available}</p>
            <p className="text-xs text-gray-400">Available</p>
          </div>
          <div className="text-center col-span-2">
            <p className="text-xl font-bold text-indigo-400">₦{stats.totalValue.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Total Value</p>
          </div>
        </div>
      </motion.div>

      {/* Sort Controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-400" />
          <span>Quick Sort</span>
        </h3>
        
        <div className="space-y-2">
          {[
            { value: 'recent', label: 'Recently Saved', icon: ClockIcon },
            { value: 'price-high', label: 'Highest Price', icon: TrophyIcon },
            { value: 'price-low', label: 'Lowest Price', icon: BoltIcon },
            { value: 'rating', label: 'Best Sellers', icon: StarIcon }
          ].map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ x: 4 }}
              onClick={() => setSortBy(option.value)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                sortBy === option.value 
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <option.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Most Valuable Item */}
      {mostValuable && mostValuable.price > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border border-yellow-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <TrophyIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Most Valuable</h3>
          </div>
          
          <div className="flex items-center space-x-3">
            <img
              src={mostValuable.images[0]}
              alt={mostValuable.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white truncate">{mostValuable.title}</p>
              <p className="text-lg font-bold text-yellow-400">₦{mostValuable.price.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Clear All Action */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <TrashIcon className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Danger Zone</h3>
        </div>
        
        <p className="text-sm text-gray-400 mb-4">
          Remove all items from your saved listings. This action cannot be undone.
        </p>
        
        <Button
          variant="outline"
          onClick={() => {
            onClearAll();
            alertUtils.success('Vault Cleared', 'All items have been removed from your vault');
          }}
          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
        >
          Clear All Items
        </Button>
      </motion.div>
    </div>
  );
};

// Error Boundary Component
class SavedListingsErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SavedListings Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-6">We're sorry, but there was an error loading your saved listings.</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const BuyerSavedListingsContent: React.FC = () => {

  const [listings, setListings] = useState<SavedListing[]>(() => {
    try {
      return mockSavedListings.map(listing => ({
        ...listing,
        pinned: Math.random() > 0.8,
        priceDropped: Math.random() > 0.7,
        recentlyAdded: Math.random() > 0.6
      }));
    } catch (error) {
      console.error('Error initializing listings:', error);
      return [];
    }
  });

  // Removed selectedListing state as it's not used for modal/detail view
  const [sortBy, setSortBy] = useState('recent');
  const [gameFilter, setGameFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll for sticky header animation
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setIsScrolled(containerRef.current.scrollTop > 20);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleSwipeAction = (listingId: string, direction: 'left' | 'right') => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    if (direction === 'left') {
      handleRemoveFromSaved(listingId);
    } else if (direction === 'right') {
      handleBuyNow(listing);
    }
  };

  const handleRemoveFromSaved = async (listingId: string) => {
    setRemovingId(listingId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setListings(prev => prev.filter(listing => listing.id !== listingId));
    setRemovingId(null);
    alertUtils.success('Removed', 'Item removed from saved listings');
  };

  const handleBuyNow = (listing: SavedListing) => {
    alertUtils.success('Added to Cart', `${listing.title} added to cart`);
  };

  // Safe filtering with null checks
  const filteredListings = Array.isArray(listings) ? listings.filter(listing => {
    if (!listing) return false;
    try {
      const matchesGame = gameFilter === 'all' || listing.game === gameFilter;
      const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
      const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
      return matchesGame && matchesStatus && matchesPrice;
    } catch (error) {
      console.error('Error filtering listing:', error, listing);
      return false;
    }
  }) : [];

  // Safe sorting with error handling
  const sortedListings = [...filteredListings].sort((a, b) => {
    try {
      switch (sortBy) {
        case 'price-low': return (a?.price || 0) - (b?.price || 0);
        case 'price-high': return (b?.price || 0) - (a?.price || 0);
        case 'rating': return (b?.seller?.rating || 0) - (a?.seller?.rating || 0);
        case 'game': return (a?.game || '').localeCompare(b?.game || '');
        default: return 0; // recent - keep original order
      }
    } catch (error) {
      console.error('Error sorting listings:', error);
      return 0;
    }
  });

  // Safe pinning with null checks
  const pinnedListings = sortedListings.filter(l => l?.pinned);
  const unpinnedListings = sortedListings.filter(l => !l?.pinned);
  const finalListings = [...pinnedListings, ...unpinnedListings];

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
        <HeartSolidIcon className="w-12 h-12 text-gray-600" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">No Saved Listings Yet</h3>
      <p className="text-gray-400 text-lg mb-6 max-w-md">
        You haven't saved any listings yet. Explore the marketplace and save your favorites to see them here!
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={() => window.history.back()}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Browse Listings
        </Button>
        <Button 
          variant="outline"
          onClick={() => {
            setGameFilter('all');
            setStatusFilter('all');
            setPriceRange([0, 200000]);
            setSortBy('recent');
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );

  const SwipeableCard: React.FC<{ listing: SavedListing; index: number }> = ({ listing, index }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragX, setDragX] = useState(0);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      setDragX(0);
      
      if (Math.abs(info.offset.x) > 100) {
        const direction = info.offset.x > 0 ? 'right' : 'left';
        handleSwipeAction(listing.id, direction);
      }
    };

    const handleTapToExpand = () => {
      // TODO: Implement listing detail view
      console.log('Selected listing:', listing.title);
    };

    const badgeType = getBadgeType(listing);
    const savedCount = getRandomSavedCount();
    const timeSaved = getTimeSinceSaved();

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: dragX > 0 ? 300 : -300, scale: 0.8 }}
        transition={{ 
          delay: index * 0.08,
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onDrag={(_, info) => setDragX(info.offset.x)}
        whileHover={{ 
          scale: 1.02,
          y: -4,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
        className={`max-md:relative max-md:bg-gray-800/60 max-md:backdrop-blur-md max-md:border max-md:border-gray-700/40 max-md:rounded-2xl max-md:overflow-hidden max-md:mb-3 max-md:cursor-grab active:max-md:cursor-grabbing max-md:transform-gpu max-md:shadow-lg max-md:shadow-black/20 ${
          isDragging ? 'max-md:scale-105 max-md:shadow-2xl max-md:shadow-black/40' : 'max-md:hover:shadow-xl max-md:hover:shadow-black/30'
        } max-md:transition-all max-md:duration-300 max-md:ease-out`}
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX * 0.01}deg)`,
        }}
        onClick={handleTapToExpand}
      >
        {/* Swipe Indicators */}
        <div className={`max-md:absolute max-md:inset-0 max-md:flex max-md:items-center max-md:justify-start max-md:pl-8 max-md:bg-red-500/20 max-md:backdrop-blur-sm max-md:transition-opacity max-md:duration-200 ${
          dragX < -50 ? 'max-md:opacity-100' : 'max-md:opacity-0'
        }`}>
          <TrashIcon className="max-md:w-8 max-md:h-8 max-md:text-red-400" />
          <span className="max-md:ml-2 max-md:text-red-400 max-md:font-semibold max-md:text-lg">Remove</span>
        </div>
        
        <div className={`max-md:absolute max-md:inset-0 max-md:flex max-md:items-center max-md:justify-end max-md:pr-8 max-md:bg-green-500/20 max-md:backdrop-blur-sm max-md:transition-opacity max-md:duration-200 ${
          dragX > 50 ? 'max-md:opacity-100' : 'max-md:opacity-0'
        }`}>
          <span className="max-md:mr-2 max-md:text-green-400 max-md:font-semibold max-md:text-lg">Add to Cart</span>
          <ShoppingCartIcon className="max-md:w-8 max-md:h-8 max-md:text-green-400" />
        </div>

        {/* Card Content */}
        <div className="max-md:relative max-md:z-10 max-md:p-4">
          {/* Image Section - Redesigned for better visual hierarchy */}
          <div className="max-md:relative max-md:w-full max-md:h-48 max-md:rounded-xl max-md:overflow-hidden max-md:mb-4 max-md:group">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="max-md:w-full max-md:h-full max-md:object-cover max-md:transition-transform max-md:duration-300 max-md:group-hover:scale-105"
            />
            
            {/* Gradient Overlay for better text readability */}
            <div className="max-md:absolute max-md:inset-0 max-md:bg-gradient-to-t max-md:from-black/60 max-md:via-transparent max-md:to-black/20" />
            
            {/* Game Badge - Top Left */}
            <div className="max-md:absolute max-md:top-3 max-md:left-3">
              <span className="max-md:text-sm max-md:font-bold max-md:bg-gray-900/90 max-md:backdrop-blur-sm max-md:text-white max-md:px-3 max-md:py-1.5 max-md:rounded-lg max-md:border max-md:border-gray-700/50">
                {listing.game}
              </span>
            </div>
            
            {/* Remove from Saved - Top Right */}
            <div className="max-md:absolute max-md:top-3 max-md:right-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromSaved(listing.id);
                }}
                disabled={removingId === listing.id}
                className="max-md:p-2.5 max-md:bg-gray-900/90 max-md:backdrop-blur-sm max-md:border max-md:border-gray-700/50 max-md:rounded-lg max-md:hover:bg-red-500/20 max-md:transition-colors max-md:duration-200"
              >
                {removingId === listing.id ? (
                  <div className="max-md:w-5 max-md:h-5 max-md:border-2 max-md:border-red-400 max-md:border-t-transparent max-md:rounded-full max-md:animate-spin" />
                ) : (
                  <HeartSolidIcon className="max-md:w-5 max-md:h-5 max-md:text-red-400" />
                )}
              </motion.button>
            </div>
            
            {/* Special Badges - Top Right, below heart */}
            {badgeType && (
              <div className="max-md:absolute max-md:top-16 max-md:right-3">
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`max-md:text-xs max-md:font-bold max-md:px-2.5 max-md:py-1 max-md:rounded-lg max-md:backdrop-blur-sm ${getBadgeColor(badgeType)}`}
                >
                  {getBadgeText(badgeType)}
                </motion.span>
              </div>
            )}
            
            {/* Discount Badge */}
            {listing.discount && listing.discount > 0 && (
              <div className="max-md:absolute max-md:-top-2 max-md:-right-2">
                <motion.div 
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 12 }}
                  className="max-md:bg-red-500 max-md:text-white max-md:text-sm max-md:font-bold max-md:px-2.5 max-md:py-1 max-md:rounded-full max-md:shadow-lg max-md:border-2 max-md:border-white"
                >
                  -{listing.discount}%
                </motion.div>
              </div>
            )}
            
            {/* Status Badge - Bottom Left */}
            <div className="max-md:absolute max-md:bottom-3 max-md:left-3">
              <span className={`max-md:text-sm max-md:font-medium max-md:px-3 max-md:py-1.5 max-md:rounded-lg max-md:backdrop-blur-sm max-md:border ${
                listing.status === 'available' ? 'max-md:bg-green-500/90 max-md:text-white max-md:border-green-400/50' :
                listing.status === 'sold' ? 'max-md:bg-red-500/90 max-md:text-white max-md:border-red-400/50' :
                'max-md:bg-yellow-500/90 max-md:text-white max-md:border-yellow-400/50'
              }`}>
                {listing.status === 'available' ? 'Available' : listing.status === 'sold' ? 'Sold' : 'Reserved'}
              </span>
            </div>
          </div>

          {/* Content Section - Redesigned for better mobile UX */}
          <div className="max-md:space-y-3">
            {/* Title and Platform */}
            <div>
              <h3 className="max-md:font-bold max-md:text-white max-md:text-lg max-md:leading-tight max-md:mb-1">
                {listing.title}
              </h3>
              <p className="max-md:text-sm max-md:text-gray-400 max-md:font-medium">{listing.level}</p>
            </div>
            
            {/* Price Section - More prominent */}
            <div className="max-md:flex max-md:items-center max-md:justify-between">
              <div>
                <div className="max-md:flex max-md:items-center max-md:space-x-2">
                  <span className="max-md:font-bold max-md:text-white max-md:text-2xl">₦{listing.price.toLocaleString()}</span>
                  {listing.originalPrice && (
                    <span className="max-md:text-sm max-md:text-gray-400 max-md:line-through">₦{listing.originalPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Seller Info - Enhanced */}
            <div className="max-md:flex max-md:items-center max-md:space-x-3 max-md:p-3 max-md:bg-gray-700/30 max-md:rounded-lg max-md:border max-md:border-gray-600/30">
              <div className="max-md:flex max-md:items-center max-md:space-x-2">
                <span className="max-md:text-sm max-md:text-gray-300 max-md:font-medium">{listing.seller.username}</span>
                {listing.seller.verified && (
                  <ShieldCheckIcon className="max-md:w-4 max-md:h-4 max-md:text-green-400" />
                )}
              </div>
              <div className="max-md:flex max-md:items-center max-md:space-x-1">
                <StarIcon className="max-md:w-4 max-md:h-4 max-md:text-yellow-400 max-md:fill-current" />
                <span className="max-md:text-sm max-md:text-gray-300 max-md:font-medium">{listing.seller.rating}</span>
              </div>
            </div>
            
            {/* Features - Better spacing */}
            <div className="max-md:flex max-md:flex-wrap max-md:gap-2">
              {listing.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="max-md:text-sm max-md:bg-gray-700/50 max-md:text-gray-300 max-md:px-3 max-md:py-1.5 max-md:rounded-lg max-md:border max-md:border-gray-600/30">
                  {feature}
                </span>
              ))}
              {listing.features.length > 3 && (
                <span className="max-md:text-sm max-md:text-gray-400 max-md:px-3 max-md:py-1.5">+{listing.features.length - 3} more</span>
              )}
            </div>
            
            {/* Meta Info */}
            <div className="max-md:flex max-md:items-center max-md:justify-between max-md:text-xs max-md:text-gray-400">
              <span className="max-md:flex max-md:items-center max-md:space-x-1">
                <ClockIcon className="max-md:w-3 max-md:h-3" />
                <span>Saved {timeSaved}</span>
              </span>
              <span className="max-md:flex max-md:items-center max-md:space-x-1">
                <UserGroupIcon className="max-md:w-3 max-md:h-3" />
                <span>{savedCount} saved this</span>
              </span>
            </div>
            
            {/* Action Buttons - Enhanced for mobile */}
            <div className="max-md:flex max-md:space-x-3 max-md:pt-2">
              {listing.status === 'available' ? (
                <>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(listing);
                    }}
                    className="max-md:flex-1 max-md:py-3 max-md:text-sm max-md:font-semibold max-md:bg-indigo-500 max-md:hover:bg-indigo-600 max-md:rounded-xl max-md:transition-all max-md:duration-200 max-md:shadow-lg max-md:shadow-indigo-500/25"
                  >
                    <ShoppingCartIcon className="max-md:w-4 max-md:h-4 max-md:mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement listing detail view
                      console.log('Selected listing:', listing.title);
                    }}
                    className="max-md:px-4 max-md:py-3 max-md:border-gray-600 max-md:hover:border-gray-500 max-md:rounded-xl max-md:transition-all max-md:duration-200"
                  >
                    <EyeIcon className="max-md:w-4 max-md:h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  className="max-md:flex-1 max-md:opacity-50 max-md:cursor-not-allowed max-md:py-3 max-md:rounded-xl"
                >
                  {listing.status === 'sold' ? 'Sold Out' : 'Reserved'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Mobile Header - Hidden on Desktop */}
      <motion.div 
        className={`md:hidden sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50 shadow-lg' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <motion.div
              className="p-2 bg-indigo-500/20 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HeartSolidIcon className="w-6 h-6 text-indigo-400" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white">Saved Listings</h1>
              <p className="text-sm text-gray-400">{listings.length} items in vault</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(true)}
            className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-gray-600/50 transition-colors"
          >
            <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-400" />
          </motion.button>
        </div>
      </motion.div>

      {/* Desktop Header - Hidden on Mobile */}
      <div className="hidden md:block sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <HeartSolidIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Gaming Vault</h1>
                <p className="text-gray-400">{listings.length} premium accounts saved</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle - Mobile Optimized */}
              <div className="flex items-center bg-gray-800/50 border border-gray-700/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                    p-3 md:p-2 rounded-md transition-colors 
                    min-h-[44px] min-w-[44px] flex items-center justify-center
                    ${
                      viewMode === 'grid' 
                        ? 'bg-indigo-500/20 text-indigo-400' 
                        : 'text-gray-400 hover:text-gray-300'
                    }
                  `}
                  aria-label="Switch to grid view"
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`
                    p-3 md:p-2 rounded-md transition-colors 
                    min-h-[44px] min-w-[44px] flex items-center justify-center
                    ${
                      viewMode === 'list' 
                        ? 'bg-indigo-500/20 text-indigo-400' 
                        : 'text-gray-400 hover:text-gray-300'
                    }
                  `}
                  aria-label="Switch to list view"
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Filter Button */}
              <button
                onClick={() => setShowDesktopFilters(!showDesktopFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-gray-600/50 transition-colors"
              >
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden">
        <div ref={containerRef} className="h-screen overflow-y-auto pb-20 scroll-smooth">
          {/* Empty State */}
          {listings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mb-8 border border-gray-700/50 backdrop-blur-sm"
              >
                <HeartSolidIcon className="w-16 h-16 text-indigo-400" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-white mb-3">Your Gaming Vault is Empty</h3>
                <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                  Discover amazing gaming accounts and start building your collection. Save your favorites to access them quickly!
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="primary"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300"
                  >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Explore Listings
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : finalListings.length > 0 ? (
            /* Listings Grid with optimized spacing */
            <div className="px-4 py-2">
              <AnimatePresence mode="popLayout">
                {finalListings.map((listing, index) => (
                  <SwipeableCard key={listing.id} listing={listing} index={index} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Floating Filter Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowDesktopFilters(true)}
          className="fixed bottom-6 right-6 p-4 bg-indigo-500 hover:bg-indigo-600 rounded-full shadow-2xl z-40"
        >
          <AdjustmentsHorizontalIcon className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Main Content - 9 columns */}
            <div className="col-span-9">
              {/* Pinned Listings Bar */}
              {pinnedListings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <BookmarkSolidIcon className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-lg font-bold text-white">Pinned Items</h2>
                    <span className="text-sm text-gray-400">({pinnedListings.length})</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                     {pinnedListings.map((listing) => (
                       <motion.div
                         key={`pinned-${listing.id}`}
                         whileHover={{ scale: 1.02 }}
                         className="bg-gray-800/50 rounded-lg p-3 border border-yellow-500/30 cursor-pointer"
                         onClick={() => {
                           // TODO: Implement listing detail view
                           console.log('Selected listing:', listing.title);
                         }}
                       >
                         <div className="flex items-center space-x-3">
                           <img
                             src={listing.images[0]}
                             alt={listing.title}
                             className="w-12 h-12 rounded-lg object-cover"
                           />
                           <div className="flex-1 min-w-0">
                             <h4 className="font-medium text-white text-sm truncate">{listing.title}</h4>
                             <p className="text-xs text-gray-400">{listing.game}</p>
                             <p className="text-sm font-semibold text-yellow-400">₦{listing.price.toLocaleString()}</p>
                           </div>
                         </div>
                       </motion.div>
                     ))}
                   </div>
                 </motion.div>
               )}

               {/* Main Grid */}
               {finalListings.length > 0 ? (
                 <DesktopGrid 
                   listings={finalListings}
                   viewMode={viewMode}
                   hoveredCard={hoveredCard}
                   setHoveredCard={setHoveredCard}
                   onSelectListing={(listing) => {
                     // TODO: Implement listing detail view
                     console.log('Selected listing:', listing.title);
                   }}
                   onRemoveListing={handleRemoveFromSaved}
                   onBuyNow={handleBuyNow}
                   onPinListing={(id: string) => {
                     setListings(prev => prev.map(l => 
                       l.id === id ? { ...l, pinned: !l.pinned } : l
                     ));
                   }}
                 />
               ) : (
                 <EmptyState />
               )}
             </div>

             {/* Right Column - Smart Sidebar (3 columns) */}
             <div className="col-span-3">
               <SmartSidebar 
                 listings={listings}
                 sortBy={sortBy}
                 setSortBy={setSortBy}
                 onClearAll={() => setListings([])}
               />
             </div>
           </div>
         </div>
       </div>

       {/* Mobile Filter Modal */}
       <AnimatePresence>
         {showFilters && (
           <>
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowFilters(false)}
               className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
             />
             <motion.div
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 z-50 rounded-t-2xl p-6"
             >
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-white">Filter & Sort</h2>
                 <button
                   onClick={() => setShowFilters(false)}
                   className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                 >
                   <XMarkIcon className="w-6 h-6 text-gray-400" />
                 </button>
               </div>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">Game</label>
                   <select
                     value={gameFilter}
                     onChange={(e) => setGameFilter(e.target.value)}
                     className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                   >
                     <option value="all">All Games</option>
                     <option value="CODM">Call of Duty Mobile</option>
                     <option value="PUBG">PUBG Mobile</option>
                     <option value="Free Fire">Free Fire</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                   <select
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                   >
                     <option value="all">All Status</option>
                     <option value="available">Available</option>
                     <option value="sold">Sold</option>
                     <option value="reserved">Reserved</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                   <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                   >
                     <option value="recent">Recently Saved</option>
                     <option value="price-low">Price: Low to High</option>
                     <option value="price-high">Price: High to Low</option>
                     <option value="name">Name A-Z</option>
                   </select>
                 </div>
               </div>
             </motion.div>
           </>
         )}
       </AnimatePresence>

       {/* Desktop Filter Drawer */}
       <DesktopFilterDrawer
         isOpen={showDesktopFilters}
         onClose={() => setShowDesktopFilters(false)}
         gameFilter={gameFilter}
         setGameFilter={setGameFilter}
         statusFilter={statusFilter}
         setStatusFilter={setStatusFilter}
         priceRange={priceRange}
         setPriceRange={setPriceRange}
         sortBy={sortBy}
         setSortBy={setSortBy}
       />
    </div>
  );
};

const BuyerSavedListings: React.FC = () => {
  return (
    <SavedListingsErrorBoundary>
      <BuyerSavedListingsContent />
    </SavedListingsErrorBoundary>
  );
};

export default BuyerSavedListings;