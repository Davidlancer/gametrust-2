import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import { featuredListings } from '../../data/mockData';

interface FeaturedListingsProps {
  onNavigate: (page: string, listingId?: string) => void;
}

const FeaturedListings: React.FC<FeaturedListingsProps> = ({ onNavigate }) => {
  return (
    <div className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Listings
            </h2>
            <p className="text-xl text-gray-400">
              Hand-picked premium accounts from verified sellers
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => onNavigate('marketplace')}
            className="hidden sm:flex group"
          >
            <span>View All</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.map((listing) => (
            <Card key={listing.id} hover className="group transform transition-transform duration-300 hover:scale-105">
              {/* Image */}
              <div className="relative overflow-hidden rounded-lg mb-4 shadow-lg">
                <img 
                  src={listing.images[0]} 
                  alt={listing.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
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
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-white text-lg leading-tight group-hover:text-indigo-400 transition-colors">
                    {listing.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>{listing.game}</span>
                  <span>•</span>
                  <span>Level {listing.level}</span>
                  <span>•</span>
                  <span>{listing.platform}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {listing.features.slice(0, 2).map((feature, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                  {listing.features.length > 2 && (
                    <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-md">
                      +{listing.features.length - 2} more
                    </span>
                  )}
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
                    variant="outline"
                    onClick={() => onNavigate('listing-details', listing.id)}
                    className="mt-4"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 sm:hidden">
          <Button 
            variant="outline"
            onClick={() => onNavigate('marketplace')}
            className="group"
          >
            <span>View All Listings</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;