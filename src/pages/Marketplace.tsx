import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star } from 'lucide-react';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import ComponentTransition from '../components/UI/ComponentTransition';
import { useLoading } from '../context/LoadingContext';
import { featuredListings, games } from '../data/mockData';
import { FilterOptions } from '../types';

interface MarketplaceProps {
  onNavigate: (page: string, listingId?: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onNavigate }) => {
  const { withLoading } = useLoading();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState<FilterOptions>({});

  // Handle query parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const gameFilter = queryParams.get('game');
    
    if (gameFilter) {
      // Find the game name by ID
      const selectedGame = games.find(game => game.id === gameFilter);
      if (selectedGame) {
        setFilters(prev => ({ ...prev, game: selectedGame.name }));
      }
    }
  }, []);

  // Search handler with loading animation
  const handleSearch = async (term: string) => {
    await withLoading(
      () => new Promise(resolve => {
        // Simulate API call delay
        setTimeout(() => {
          setSearchTerm(term);
          resolve(true);
        }, 800);
      }),
      'Searching listings...'
    );
  };

  const filteredListings = featuredListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = !filters.game || listing.game === filters.game;
    const matchesVerified = filters.verified === undefined || listing.isVerified === filters.verified;
    const matchesEscrow = filters.escrow === undefined || listing.hasEscrow === filters.escrow;

    return matchesSearch && matchesGame && matchesVerified && matchesEscrow;
  });

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Marketplace</h1>
          <p className="text-xl text-gray-400">
            Discover premium gaming accounts from verified sellers
          </p>
          {/* Active Filter Badge */}
          {filters.game && (
            <div className="mt-4">
              <Badge type="linked" className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Filtered by: {filters.game}
                </Badge>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts, games, or sellers..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Game Filter */}
            <select
              value={filters.game || ''}
              onChange={(e) => setFilters({...filters, game: e.target.value || undefined})}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Games</option>
              {games.map(game => (
                <option key={game.id} value={game.name}>{game.name}</option>
              ))}
            </select>

            {/* Platform Filter */}
            <select
              value={filters.platform || ''}
              onChange={(e) => setFilters({...filters, platform: e.target.value || undefined})}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Platforms</option>
              <option value="iOS">iOS</option>
              <option value="Android">Android</option>
              <option value="PC">PC</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="level">Level</option>
            </select>
          </div>

          {/* Filter Toggles */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => setFilters({...filters, verified: filters.verified ? undefined : true})}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.verified
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Verified Only
            </button>
            <button
              onClick={() => setFilters({...filters, escrow: filters.escrow ? undefined : true})}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.escrow
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Escrow Available
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            {filteredListings.length} accounts found
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Listings Grid/List */}
        <ComponentTransition show={true} type="fade" key={viewMode}>
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredListings.map((listing) => (
            <Card key={listing.id} hover>
              <div className={viewMode === 'list' ? 'flex space-x-6' : ''}>
                {/* Image */}
                <div className={`relative overflow-hidden rounded-lg ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'w-full h-48 mb-4'}`}>
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {listing.isVerified && <Badge type="verified" size="sm" />}
                    {listing.hasEscrow && <Badge type="escrow" size="sm" />}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
                    <span className="text-white font-semibold text-sm">${listing.price}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <h3 className="font-semibold text-white text-lg leading-tight hover:text-indigo-400 transition-colors cursor-pointer">
                    {listing.title}
                  </h3>

                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{listing.game}</span>
                    <span>•</span>
                    <span>Level {listing.level}</span>
                    <span>•</span>
                    <span>{listing.platform}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {listing.features.slice(0, 3).map((feature, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={listing.seller.avatar} 
                        alt={listing.seller.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-300">{listing.seller.username}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-400">{listing.seller.rating}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-indigo-400 hover:text-indigo-300"
                      onClick={() => onNavigate('listing-details', listing.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          </div>
        </ComponentTransition>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No accounts found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;