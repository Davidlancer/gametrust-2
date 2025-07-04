import React, { useState } from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Sell from './pages/Sell';
import Auth from './pages/Auth';
import Platforms from './pages/Platforms';
import ListingDetails from './pages/ListingDetails';
import SellerProfile from './pages/SellerProfile';
import HelpCenter from './pages/HelpCenter';
import Contact from './pages/Contact';
import Terms from './pages/Terms';

type Page = 'home' | 'marketplace' | 'sell' | 'auth' | 'platforms' | 'listing-details' | 'seller-profile' | 'help-center' | 'contact' | 'terms';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedListingId, setSelectedListingId] = useState<string>('1');
  const [selectedSellerId, setSelectedSellerId] = useState<string>('1');

  const handleNavigate = (page: string, id?: string) => {
    if (page === 'listing-details' && id) {
      setSelectedListingId(id);
    }
    if (page === 'seller-profile' && id) {
      setSelectedSellerId(id);
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
      case 'seller-profile':
        return <SellerProfile sellerId={selectedSellerId} onNavigate={handleNavigate} />;
      case 'help-center':
        return <HelpCenter onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact onNavigate={handleNavigate} />;
      case 'terms':
        return <Terms onNavigate={handleNavigate} />;
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
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;