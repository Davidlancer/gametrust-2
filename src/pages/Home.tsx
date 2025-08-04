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
      <HowItWorks onNavigate={onNavigate} />
      <FeaturedListings onNavigate={onNavigate} />
      <Testimonials />
      </div>
    </div>
  );
};

export default Home;