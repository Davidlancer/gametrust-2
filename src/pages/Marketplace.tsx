import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, TrendingUp, Award, Shield, ChevronDown } from 'lucide-react';
import { Skeleton } from '@heroui/react';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import ComponentTransition from '../components/UI/ComponentTransition';
import ListingCard from '../components/ListingCard';
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
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    await withLoading(
      () => new Promise(resolve => {
        // Simulate API call delay
        setTimeout(() => {
          setSearchTerm(term);
          setIsLoading(false);
          resolve(true);
        }, 500);
      }),
      'Searching listings...'
    );
  };

  // Enhanced filtering logic
  const filteredListings = featuredListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.seller.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = !filters.game || listing.game === filters.game;
    const matchesPlatform = !filters.platform || listing.platform === filters.platform;
    const matchesVerified = filters.verified === undefined || listing.isVerified === filters.verified;
    const matchesEscrow = filters.escrow === undefined || listing.hasEscrow === filters.escrow;
    
    // Price range filtering
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPrice = listing.price >= minPrice && listing.price <= maxPrice;

    return matchesSearch && matchesGame && matchesPlatform && matchesVerified && matchesEscrow && matchesPrice;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'level':
        return b.level - a.level;
      case 'rating':
        return b.seller.rating - a.seller.rating;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Section */}
        <div className="mb-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Explore Premium Gaming Accounts
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 leading-relaxed">
              Discover verified gaming accounts from trusted sellers. Find your perfect account with secure transactions and buyer protection.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-white">{featuredListings.length}</div>
                <div className="text-sm text-gray-400">Total Listings</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-green-400">{featuredListings.filter(l => l.isVerified).length}</div>
                <div className="text-sm text-gray-400">Verified</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-blue-400">{featuredListings.filter(l => l.hasEscrow).length}</div>
                <div className="text-sm text-gray-400">Escrow Protected</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-purple-400">{games.length}</div>
                <div className="text-sm text-gray-400">Games Available</div>
              </div>
            </div>
            
            {/* Active Filters */}
            {(filters.game || filters.platform || filters.verified || filters.escrow) && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {filters.game && (
                  <Badge type="linked" className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Game: {filters.game}
                  </Badge>
                )}
                {filters.platform && (
                  <Badge type="linked" className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Platform: {filters.platform}
                  </Badge>
                )}
                {filters.verified && (
                  <Badge type="verified" className="bg-green-500/20 text-green-400 border border-green-500/30">
                    Verified Only
                  </Badge>
                )}
                {filters.escrow && (
                  <Badge type="escrow" className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Escrow Protected
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <section className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8 sticky top-20 z-10">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Filter className="h-5 w-5 text-indigo-400" />
              Filter Listings
            </h2>
            <button
              onClick={() => {
                setFilters({});
                setPriceRange({ min: '', max: '' });
                setSearchTerm('');
              }}
              className="text-sm text-gray-400 hover:text-indigo-400 underline transition-colors font-medium"
            >
              Reset All Filters
            </button>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search accounts, games, features..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 focus:bg-gray-700 transition-all duration-200 text-base shadow-sm hover:shadow-md hover:shadow-indigo-500/5"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
              </div>
            )}
            {searchTerm && !isLoading && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white hover:bg-gray-700 transition-all duration-200 shadow-sm"
            >
              <span className="flex items-center gap-2 font-medium">
                <Filter className="h-4 w-4" />
                Show Filters
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Grid */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block transition-all duration-300`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Category/Game Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Game</label>
                <select
                  value={filters.game || ''}
                  onChange={(e) => setFilters({...filters, game: e.target.value || undefined})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 transition-all duration-200 hover:bg-gray-700 shadow-sm"
                >
                  <option value="">All Games</option>
                  {games.map(game => (
                    <option key={game.id} value={game.name}>{game.name}</option>
                  ))}
                </select>
              </div>

              {/* Platform Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Platform</label>
                <select
                  value={filters.platform || ''}
                  onChange={(e) => setFilters({...filters, platform: e.target.value || undefined})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 transition-all duration-200 hover:bg-gray-700 shadow-sm"
                >
                  <option value="">All Platforms</option>
                  <option value="iOS">iOS</option>
                  <option value="Android">Android</option>
                  <option value="PC">PC</option>
                  <option value="PlayStation">PlayStation</option>
                  <option value="Xbox">Xbox</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 transition-all duration-200 hover:bg-gray-700 shadow-sm"
                  />
                  <span className="text-gray-400 font-medium">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 transition-all duration-200 hover:bg-gray-700 shadow-sm"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 transition-all duration-200 hover:bg-gray-700 shadow-sm"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="level">Highest Level</option>
                  <option value="rating">Best Rated Sellers</option>
                  <option value="popular">Popular</option>
                </select>
              </div>
            </div>

            {/* Filter Toggles */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Quick Filters</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilters({...filters, verified: filters.verified ? undefined : true})}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                    filters.verified
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600/50 hover:border-gray-500'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Verified Only
                </button>
                <button
                  onClick={() => setFilters({...filters, escrow: filters.escrow ? undefined : true})}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                    filters.escrow
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600/50 hover:border-gray-500'
                  }`}
                >
                  <Award className="h-4 w-4" />
                  Escrow Protected
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <p className="text-lg font-semibold text-white">
                {sortedListings.length} {sortedListings.length === 1 ? 'Account' : 'Accounts'} Found
              </p>
              <p className="text-sm text-gray-400">
                {searchTerm && `Results for "${searchTerm}"`}
                {(filters.game || filters.platform) && (
                  <span>
                    {searchTerm ? ' • ' : ''}
                    Filtered by {[filters.game, filters.platform].filter(Boolean).join(', ')}
                  </span>
                )}
              </p>
            </div>
            
            {/* Trending indicator */}
            {sortedListings.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">Active marketplace</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Listings Grid/List */}
        <ComponentTransition show={true} type="fade" key={viewMode}>
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-6'
          }>
            {sortedListings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onNavigate={onNavigate}
              viewMode={viewMode}
              index={index}
            />
          ))}
          </div>
        </ComponentTransition>

        {/* Loading State with HeroUI Skeletons */}
        {isLoading && (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-6'
          }>
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="p-6 space-y-4">
                {/* Image Skeleton */}
                <Skeleton className="w-full h-56 rounded-lg bg-gray-700/30" />
                
                {/* Title and Game Skeletons */}
                <div className="space-y-3">
                  <Skeleton className="h-5 w-3/4 rounded bg-gray-700/30" />
                  <Skeleton className="h-4 w-1/2 rounded bg-gray-700/30" />
                </div>
                
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-center space-y-2">
                      <Skeleton className="h-6 w-full rounded bg-gray-700/30" />
                      <Skeleton className="h-3 w-3/4 mx-auto rounded bg-gray-700/30" />
                    </div>
                  ))}
                </div>
                
                {/* Tags Skeleton */}
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full bg-gray-700/30" />
                  <Skeleton className="h-6 w-20 rounded-full bg-gray-700/30" />
                </div>
                
                {/* Seller Info Skeleton */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full bg-gray-700/30" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20 rounded bg-gray-700/30" />
                      <Skeleton className="h-2 w-16 rounded bg-gray-700/30" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-16 rounded bg-gray-700/30" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Empty State */}
        {!isLoading && sortedListings.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700/50">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">No listings found</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                We couldn't find any listings matching your criteria. Try adjusting your search terms or filters to discover more accounts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                 <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({});
                      setPriceRange({ min: '', max: '' });
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    onClick={() => setSearchTerm('')}
                    className="bg-indigo-600 hover:bg-indigo-500"
                  >
                    Browse All Listings
                  </Button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;