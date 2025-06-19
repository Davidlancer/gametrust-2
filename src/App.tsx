import React, { useState } from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Sell from './pages/Sell';
import Auth from './pages/Auth';
import Platforms from './pages/Platforms';
import ListingDetails from './pages/ListingDetails';

type Page = 'home' | 'marketplace' | 'sell' | 'auth' | 'platforms' | 'listing-details';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedListingId, setSelectedListingId] = useState<string>('1');

  const handleNavigate = (page: string, listingId?: string) => {
    if (page === 'listing-details' && listingId) {
      setSelectedListingId(listingId);
    }
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'marketplace':
        return <Marketplace onNavigate={handleNavigate} />;
      case 'sell':
        return <Sell />;
      case 'auth':
        return <Auth />;
      case 'platforms':
        return <Platforms onNavigate={handleNavigate} />;
      case 'listing-details':
        return <ListingDetails listingId={selectedListingId} onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;