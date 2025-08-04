import React from 'react';

interface HowItWorksProps {
  onNavigate?: (page: string) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      {/* Breadcrumb */}
      <div className="border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => onNavigate?.('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </button>
            <span className="text-gray-500">/</span>
            <span className="text-white font-medium">How It Works</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-8 space-y-12 md:space-y-16">

        {/* 🔝 Hero */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">⚙️ How GameTrust Ensures Safe Trades</h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto md:mx-0">Not sure how GameTrust works? Here's everything you need to know about our secure trading platform.</p>
        </div>

        {/* 💸 Buy & Sell in 3 Easy Steps */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">💸 Buy & Sell in 3 Easy Steps</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center max-w-sm">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary text-white text-lg md:text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-indigo-400 mb-2">🔍 Browse & Choose</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">Find the perfect gaming account from verified sellers. Review ratings, screenshots, and detailed descriptions before making your choice.</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-sm">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary text-white text-lg md:text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-indigo-400 mb-2">🔒 Secure Payment</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">Pay safely through our escrow system. Your money is held securely until you confirm the account is exactly as described.</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-sm">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary text-white text-lg md:text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-indigo-400 mb-2">✅ Receive & Confirm</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">Get your account credentials instantly. Test everything works, then confirm to release payment to the seller. It's that simple!</p>
            </div>
          </div>
        </div>

        {/* 🔄 Escrow Explained */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">🔄 How Our Escrow System Works</h2>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-indigo-400 mb-4 text-center md:text-left">🛡️ For Buyers</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Your payment is held safely until you receive the account</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Full refund if account doesn't match description</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">24/7 dispute resolution support</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">No risk of losing money to scammers</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-indigo-400 mb-4 text-center md:text-left">💰 For Sellers</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Guaranteed payment once you deliver as promised</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Protection against chargebacks and fraud</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Fast payouts within 24 hours</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">No risk of buyers stealing accounts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ What Makes GameTrust Different */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">✅ What Makes GameTrust Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-semibold text-indigo-400 mb-3">🏆 Verified Sellers Only</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">All sellers go through identity verification. Look for verification badges to know you're dealing with trusted, legitimate sellers who have proven track records.</p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-semibold text-indigo-400 mb-3">📱 Real-Time Support</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">Our support team is available 24/7 to help with any issues. Live chat, email support, and comprehensive dispute resolution keep you protected.</p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-semibold text-indigo-400 mb-3">🔍 Detailed Listings</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">Every account listing includes screenshots, detailed stats, and seller ratings. You know exactly what you're buying before you commit to purchase.</p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-semibold text-indigo-400 mb-3">⚡ Instant Delivery</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">Most accounts are delivered within minutes. Our automated system ensures fast, secure transfer of credentials so you can start playing immediately.</p>
            </div>
          </div>
        </div>

        {/* 🧠 FAQ Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">🧠 Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">What is verification and why does it matter?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">Verification means sellers have provided government ID and passed background checks. Verified sellers are more trustworthy, get priority placement, and have proven track records of successful sales.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">Why should I use escrow instead of direct payment?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">Escrow protects both parties. Buyers can't lose money to scammers, and sellers can't have accounts stolen without payment. It's the safest way to trade gaming accounts online.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">What happens if there's a problem with my purchase?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">Our support team investigates all disputes fairly. If the account doesn't match the description, you get a full refund. If everything is as described, payment goes to the seller. Simple and fair.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">How long does the whole process take?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">From purchase to playing: usually 5-30 minutes. Payment processing is instant, account delivery is typically immediate, and you have 24 hours to confirm everything works perfectly.</p>
            </details>
          </div>
        </div>

        {/* 🚀 CTA */}
        <div className="pt-6 md:pt-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center md:justify-start">
            <button 
              onClick={() => onNavigate?.('platform/marketplace')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Marketplace
            </button>
            <button 
              onClick={() => onNavigate?.('platform/start-selling')}
              className="w-full sm:w-auto border border-indigo-500 text-indigo-400 px-6 py-3 rounded-lg font-medium hover:bg-indigo-600 hover:text-white transition-colors"
            >
              Start Selling
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;