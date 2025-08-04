import React from 'react';
import { Star, Quote } from 'lucide-react';
import Card from '../UI/Card';
import { testimonials } from '../../data/mockData';

const Testimonials: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(75,0,130,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 sm:mb-6 transform hover:scale-105 transition-transform duration-300">
            Trusted by Gamers Worldwide
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied users who have safely traded their gaming accounts through GameTrust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.id} hover className="relative transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 h-full bg-white/5 backdrop-blur-sm border border-white/10" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Quote className="h-6 w-6 text-white" />
              </div>
              
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-300">
                    {testimonial.rating}.0
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm md:text-base text-gray-300 leading-relaxed line-clamp-4">
                  "{testimonial.content}"
                </p>

                {/* User Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.user}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-white/20 shadow-md"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-white text-sm md:text-base truncate">{testimonial.user}</div>
                      <div className="text-xs md:text-sm text-gray-400 truncate">{testimonial.game} Player</div>
                    </div>
                  </div>
                  
                  {/* Verified Badge */}
                  <div className="flex items-center space-x-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium border border-green-500/30">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 sm:mt-16 md:mt-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/10">
            <div className="text-center mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Why Gamers Trust Us
              </h3>
              <p className="text-gray-300 text-sm md:text-base">
                Built for gamers, by gamers - with security at our core
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <h4 className="font-semibold text-white mb-2 text-sm md:text-base">99.8% Success Rate</h4>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                  Trusted by thousands with proven track record
                </p>
              </div>

              <div className="text-center group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <h4 className="font-semibold text-white mb-2 text-sm md:text-base">24/7 Support</h4>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                  Round-the-clock assistance for all your needs
                </p>
              </div>

              <div className="text-center group">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <h4 className="font-semibold text-white mb-2 text-sm md:text-base">Escrow Protected</h4>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                  Your money is safe until transaction completes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;