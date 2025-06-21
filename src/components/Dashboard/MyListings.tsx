import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PlayIcon,
  PauseIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  VideoCameraIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
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
    level: 150
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
    level: 95
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
    level: 78
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
    level: 0
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

const MyListings: React.FC = () => {
  const [listings, setListings] = useState(mockListings);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Listings</h1>
          <p className="text-gray-400">Manage your gaming account listings</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="primary"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold"
          >
            <TrendingUpIcon className="w-5 h-5 mr-2" />
            Create New Listing
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="paused">Paused</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
          </div>
        </div>
      </Card>

      {/* Listings Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="relative">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="absolute top-2 left-2 flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(listing.status)}`}>
                      {listing.status.toUpperCase()}
                    </span>
                    {listing.hasVideo && (
                      <div className="bg-black/50 p-1 rounded">
                        <VideoCameraIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {listing.hasWarning && (
                      <div className="bg-yellow-500/20 p-1 rounded" title={listing.warningReason}>
                        <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => toggleListingStatus(listing.id)}
                      className="bg-black/50 p-2 rounded-lg hover:bg-black/70 transition-colors"
                      disabled={listing.status === 'sold'}
                    >
                      {listing.status === 'live' ? (
                        <PauseIcon className="w-4 h-4 text-white" />
                      ) : (
                        <PlayIcon className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {listing.game} • {listing.platform}
                      {listing.level > 0 && ` • Level ${listing.level}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-indigo-400">
                      ₦{listing.price.toLocaleString()}
                    </span>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-400">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        {listing.views}
                      </div>
                      <div className="text-xs text-gray-500">
                        {listing.clicks} clicks
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteListing(listing.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      Promote
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
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
                          <p className="text-white font-medium">{listing.title}</p>
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
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <DocumentDuplicateIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteListing(listing.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filteredListings.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FunnelIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No listings found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t created any listings yet.'}
            </p>
            <Button 
              variant="primary"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold"
            >
              Create Your First Listing
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyListings;