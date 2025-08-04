import React from 'react';

interface MarketplaceProps {
  onNavigate?: (page: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onNavigate }) => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* 🔝 Breadcrumb + Hero */}
        <div className="space-y-4">
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <button onClick={() => onNavigate?.('/')} className="text-gray-400 hover:text-white transition-colors">Home</button>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-indigo-400">Marketplace</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">🛒 Browse GameTrust Marketplace</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Browse listings from trusted, verified sellers across multiple games — from CODM to FIFA and more. Safe. Transparent. Escrow-protected.</p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <div className="space-y-8">
            {/* Game Categories */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-white">🎮 Popular Game Categories</h2>
                <p className="text-gray-300 leading-relaxed">Find accounts for your favorite games including Call of Duty Mobile, FIFA, Clash of Clans, PUBG Mobile, and many more. Each listing includes detailed screenshots and account statistics.</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-white">🛡️ Buyer Protections</h2>
                <p className="text-gray-300 leading-relaxed">Every purchase is protected by our escrow system. Your payment is held securely until you confirm the account details are exactly as described. Plus, all sellers are verified for your safety.</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-white">⚡ Instant Delivery</h2>
                <p className="text-gray-300 leading-relaxed">Most gaming accounts are delivered within minutes of purchase. Get your login credentials instantly and start playing right away.</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-white">🔍 Detailed Listings</h2>
                <p className="text-gray-300 leading-relaxed">Every account listing includes comprehensive screenshots, detailed statistics, rank information, and purchase history so you know exactly what you're buying.</p>
              </div>
            </div>

            {/* How Purchasing Works */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-white">💰 How Purchasing Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-indigo-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-indigo-400">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-400 mb-2">🔍 Browse & Select</h3>
                  <p className="text-gray-300">Browse through verified listings, check screenshots and stats, read seller reviews, and choose the perfect account for your needs.</p>
                </div>
                <div className="text-center">
                  <div className="bg-indigo-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-indigo-400">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-400 mb-2">💳 Secure Payment</h3>
                  <p className="text-gray-300">Pay safely through our escrow system. Your money is held securely until you confirm the account is exactly as described in the listing.</p>
                </div>
                <div className="text-center">
                  <div className="bg-indigo-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-indigo-400">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-400 mb-2">✅ Receive & Confirm</h3>
                  <p className="text-gray-300">Get your account credentials instantly, verify everything matches the description, then confirm to release payment to the seller.</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
                  <summary className="cursor-pointer font-medium text-white">How quickly will I receive my account?</summary>
                  <p className="mt-2 text-sm text-gray-300">Most accounts are delivered within 5-30 minutes. Digital delivery is instant once the seller confirms your payment through our escrow system.</p>
                </details>
                <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
                  <summary className="cursor-pointer font-medium text-white">What if the account doesn't match the description?</summary>
                  <p className="mt-2 text-sm text-gray-300">You have 24 hours to verify the account details. If anything doesn't match the listing, you can dispute and get a full refund through our escrow protection.</p>
                </details>
                <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
                  <summary className="cursor-pointer font-medium text-white">What should I do after receiving my account?</summary>
                  <p className="mt-2 text-sm text-gray-300">Immediately change the password, update security settings, and verify all account details match the listing. Then confirm delivery to release payment to the seller.</p>
                </details>
                <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
                  <summary className="cursor-pointer font-medium text-white">How do I know if a seller is trustworthy?</summary>
                  <p className="mt-2 text-sm text-gray-300">Look for verification badges, check seller ratings and reviews, and review their transaction history. Verified sellers have passed identity checks and have proven track records.</p>
                </details>
              </div>
            </section>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center">
          <button 
            onClick={() => onNavigate?.('marketplace')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg mr-4 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Browse All Listings
          </button>
          <button 
            onClick={() => onNavigate?.('platform/start-selling')}
            className="border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white hover:bg-gray-800 px-6 py-3 rounded-lg transition-all duration-200"
          >
            Start Selling
          </button>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;