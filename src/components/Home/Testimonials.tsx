import React from 'react';
import { Star, Quote } from 'lucide-react';
import Card from '../UI/Card';
import { testimonials } from '../../data/mockData';

const Testimonials: React.FC = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(75,0,130,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6 transform hover:scale-105 transition-transform duration-300">
            Trusted by Gamers Worldwide
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied users who have safely traded their gaming accounts through GameTrust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} hover className="relative transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-indigo-400/30 transform rotate-6" />
              
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-300 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* User Info */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-700">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.user}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.user}</div>
                    <div className="text-sm text-gray-400">{testimonial.game} Player</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-8 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm px-8 py-4 rounded-full border border-gray-600/50 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">99.8% Success Rate</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">24/7 Support</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">Escrow Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;