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

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 space-y-16">

        {/* 🔝 Hero */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">⚙️ How GameTrust Ensures Safe Trades</h1>
          <p className="text-lg text-gray-300">Not sure how GameTrust works? Here's everything you need to know about our secure trading platform.</p>
        </div>

        {/* 💸 Buy & Sell in 3 Easy Steps */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">💸 Buy & Sell in 3 Easy Steps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">🔍 Browse & Choose</h3>
              <p className="text-gray-300">Find the perfect gaming account from verified sellers. Review ratings, screenshots, and detailed descriptions before making your choice.</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">🔒 Secure Payment</h3>
              <p className="text-gray-300">Pay safely through our escrow system. Your money is held securely until you confirm the account is exactly as described.</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">✅ Receive & Confirm</h3>
              <p className="text-gray-300">Get your account credentials instantly. Test everything works, then confirm to release payment to the seller. It's that simple!</p>
            </div>
          </div>
        </div>

        {/* 🔄 Escrow Explained */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">🔄 How Our Escrow System Works</h2>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-indigo-400 mb-4">🛡️ For Buyers</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Your payment is held safely until you receive the account</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Full refund if account doesn't match description</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>24/7 dispute resolution support</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>No risk of losing money to scammers</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-indigo-400 mb-4">💰 For Sellers</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Guaranteed payment once you deliver as promised</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Protection against chargebacks and fraud</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Fast payouts within 24 hours</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>No risk of buyers stealing accounts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ What Makes GameTrust Different */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">🏆 Verified Sellers Only</h2>
            <p className="text-gray-300 mt-2">All sellers go through identity verification. Look for verification badges to know you're dealing with trusted, legitimate sellers who have proven track records.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">📱 Real-Time Support</h2>
            <p className="text-gray-300 mt-2">Our support team is available 24/7 to help with any issues. Live chat, email support, and comprehensive dispute resolution keep you protected.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">🔍 Detailed Listings</h2>
            <p className="text-gray-300 mt-2">Every account listing includes screenshots, detailed stats, and seller ratings. You know exactly what you're buying before you commit to purchase.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">⚡ Instant Delivery</h2>
            <p className="text-gray-300 mt-2">Most accounts are delivered within minutes. Our automated system ensures fast, secure transfer of credentials so you can start playing immediately.</p>
          </div>
        </div>

        {/* 🧠 FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">What is verification and why does it matter?</summary>
              <p className="mt-2 text-sm text-gray-300">Verification means sellers have provided government ID and passed background checks. Verified sellers are more trustworthy, get priority placement, and have proven track records of successful sales.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">Why should I use escrow instead of direct payment?</summary>
              <p className="mt-2 text-sm text-gray-300">Escrow protects both parties. Buyers can't lose money to scammers, and sellers can't have accounts stolen without payment. It's the safest way to trade gaming accounts online.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">What happens if there's a problem with my purchase?</summary>
              <p className="mt-2 text-sm text-gray-300">Our support team investigates all disputes fairly. If the account doesn't match the description, you get a full refund. If everything is as described, payment goes to the seller. Simple and fair.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">How long does the whole process take?</summary>
              <p className="mt-2 text-sm text-gray-300">From purchase to playing: usually 5-30 minutes. Payment processing is instant, account delivery is typically immediate, and you have 24 hours to confirm everything works perfectly.</p>
            </details>
          </div>
        </div>

        {/* 🚀 CTA */}
        <div className="pt-6">
          <button 
            onClick={() => onNavigate?.('platform/marketplace')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded mr-4 transition-colors"
          >
            Browse Marketplace
          </button>
          <button 
            onClick={() => onNavigate?.('platform/start-selling')}
            className="border border-indigo-500 text-indigo-400 px-6 py-3 rounded hover:bg-indigo-600 hover:text-white transition-colors"
          >
            Start Selling
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;