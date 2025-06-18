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
    <div className="min-h-screen bg-gray-900">
      <Hero onNavigate={onNavigate} />
      <HowItWorks />
      <FeaturedListings onNavigate={onNavigate} />
      <Testimonials />
    </div>
  );
};

export default Home;