import React from 'react';
import Hero from '../components/Home/Hero';
import HowItWorks from '../components/Home/HowItWorks';
import FeaturedListings from '../components/Home/FeaturedListings';
import Testimonials from '../components/Home/Testimonials';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      <div className="w-full max-w-screen-2xl mx-auto">
        <Hero onNavigate={onNavigate} />
        {/* Toast Test Button - for development */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => onNavigate('toast-test')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
          >
            Test Toasts
          </button>
        </div>
      <HowItWorks onNavigate={onNavigate} />
      <FeaturedListings onNavigate={onNavigate} />
      <Testimonials />
      </div>
    </div>
  );
};

export default Home;