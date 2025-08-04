import React from 'react';

interface BuyerProtectionProps {
  onNavigate?: (page: string) => void;
}

const BuyerProtection: React.FC<BuyerProtectionProps> = ({ onNavigate }) => {
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
            <span className="text-white font-medium">Buyer Protection</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-8 space-y-12 md:space-y-16">

        {/* Hero */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">🛡️ Buyer Protection Guarantee</h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto md:mx-0">Shop with confidence knowing your purchase is fully protected by our comprehensive buyer protection program.</p>
        </div>

        {/* Protection Overview */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">🔒 Complete Protection Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-green-400">Money-Back Guarantee</h3>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Full refund if account doesn't match description</li>
                <li>• Protection against fraudulent sellers</li>
                <li>• No questions asked refund policy</li>
                <li>• Fast refund processing (24-48 hours)</li>
              </ul>
            </div>
            
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔐</span>
                </div>
                <h3 className="text-lg font-semibold text-blue-400">Secure Escrow System</h3>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Payment held safely until delivery confirmed</li>
                <li>• Seller can't access funds until you approve</li>
                <li>• Automatic dispute resolution</li>
                <li>• Bank-level security encryption</li>
              </ul>
            </div>
            
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-purple-400">Verified Sellers Only</h3>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Identity verification required</li>
                <li>• Background checks completed</li>
                <li>• Track record of successful sales</li>
                <li>• Continuous performance monitoring</li>
              </ul>
            </div>
            
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎧</span>
                </div>
                <h3 className="text-lg font-semibold text-indigo-400">24/7 Support</h3>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Round-the-clock customer support</li>
                <li>• Live chat and email assistance</li>
                <li>• Expert dispute resolution team</li>
                <li>• Multilingual support available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">⚙️ How Buyer Protection Works</h2>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">🛒 Make Your Purchase</h3>
                <p className="text-gray-300">Choose your account and complete payment. Your money is immediately placed in secure escrow, not sent to the seller.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">📦 Receive Account Details</h3>
                <p className="text-gray-300">Seller delivers account credentials instantly. You have 24 hours to verify everything matches the listing description.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">✅ Confirm or Dispute</h3>
                <p className="text-gray-300">If everything is perfect, confirm the purchase and payment is released. If there's an issue, open a dispute for full refund.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dispute Process */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">⚖️ Fair Dispute Resolution</h2>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-4">🔍 Investigation Process</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Expert team reviews all evidence</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Both parties can submit documentation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Impartial decision based on facts</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Resolution within 48-72 hours</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-4">📋 Common Dispute Reasons</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-red-400 mt-1 text-sm">•</span>
                    <span className="text-sm md:text-base">Account stats don't match listing</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-400 mt-1 text-sm">•</span>
                    <span className="text-sm md:text-base">Missing items or currency</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-400 mt-1 text-sm">•</span>
                    <span className="text-sm md:text-base">Account credentials don't work</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-400 mt-1 text-sm">•</span>
                    <span className="text-sm md:text-base">Account banned or restricted</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">💡 Smart Buying Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">✅ Do This</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Check seller verification status</li>
                <li>• Read all reviews and ratings</li>
                <li>• Verify account details match listing</li>
                <li>• Test account immediately after purchase</li>
                <li>• Contact support if anything seems wrong</li>
                <li>• Keep all communication on platform</li>
              </ul>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">❌ Avoid This</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Don't pay outside the platform</li>
                <li>• Don't share personal information</li>
                <li>• Don't rush the verification process</li>
                <li>• Don't ignore red flags in listings</li>
                <li>• Don't confirm purchase without testing</li>
                <li>• Don't wait too long to report issues</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">📊 Protection Statistics</h2>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">99.8%</div>
                <div className="text-gray-300 text-sm">Successful Transactions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">$2.1M+</div>
                <div className="text-gray-300 text-sm">Protected in Escrow</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">24hrs</div>
                <div className="text-gray-300 text-sm">Average Dispute Resolution</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-400 mb-2">50K+</div>
                <div className="text-gray-300 text-sm">Protected Buyers</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 md:pt-8">
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Shop with Complete Confidence</h2>
            <p className="text-gray-300 mb-6">Your purchase is 100% protected. Start browsing thousands of verified gaming accounts today.</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
              <button 
                onClick={() => onNavigate?.('marketplace')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Marketplace
              </button>
              <button 
                onClick={() => onNavigate?.('support')}
                className="w-full sm:w-auto border border-indigo-500 text-indigo-400 px-6 py-3 rounded-lg font-medium hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerProtection;