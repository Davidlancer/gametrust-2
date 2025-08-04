import React from 'react';

interface PricingProps {
  onNavigate?: (page: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
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
            <span className="text-white font-medium">Pricing</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-8 space-y-12 md:space-y-16">

        {/* Hero */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">💰 Transparent Pricing</h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto md:mx-0">Simple, fair pricing with no hidden fees. Pay only when you successfully buy or sell.</p>
        </div>

        {/* Buyer Pricing */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">🛒 For Buyers</h2>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center md:text-left">
                <div className="mb-6">
                  <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">FREE</div>
                  <div className="text-lg text-gray-300">No fees for buyers</div>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Browse unlimited listings</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Full escrow protection</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">24/7 customer support</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Instant account delivery</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Money-back guarantee</span>
                  </li>
                </ul>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-semibold text-indigo-400 mb-4">💡 Why Free for Buyers?</h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4">
                  We believe buyers shouldn't pay extra fees on top of account prices. Our seller fees cover all platform costs, ensuring you get the best deals without hidden charges.
                </p>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                  <div className="text-indigo-300 font-medium mb-2">What You Pay:</div>
                  <div className="text-white text-lg">Account Price Only</div>
                  <div className="text-gray-400 text-sm">No additional fees or charges</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Pricing */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">💼 For Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Standard Sellers */}
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 md:p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Standard Sellers</h3>
                <div className="text-3xl font-bold text-blue-400 mb-2">8%</div>
                <div className="text-gray-300">Commission per sale</div>
              </div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1 text-sm">✓</span>
                  <span className="text-sm md:text-base">List unlimited accounts</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1 text-sm">✓</span>
                  <span className="text-sm md:text-base">Basic seller tools</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1 text-sm">✓</span>
                  <span className="text-sm md:text-base">Standard support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1 text-sm">✓</span>
                  <span className="text-sm md:text-base">Payment protection</span>
                </li>
              </ul>
              <div className="text-center">
                <button 
                  onClick={() => onNavigate?.('platform/start-selling')}
                  className="w-full border border-blue-500 text-blue-400 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Start Selling
                </button>
              </div>
            </div>

            {/* Verified Sellers */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-6 md:p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">Recommended</span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Verified Sellers</h3>
                <div className="text-3xl font-bold text-indigo-400 mb-2">5%</div>
                <div className="text-gray-300">Commission per sale</div>
              </div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1 text-sm">✓</span>
                  <span className="text-sm md:text-base">All standard features</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1 text-sm">✓</span>
                  <span className="text-sm md:text-base">Verification badge</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1 text-sm">✓</span>
                  <span className="text-sm md:text-base">Priority listing placement</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1 text-sm">✓</span>
                  <span className="text-sm md:text-base">Advanced seller analytics</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1 text-sm">✓</span>
                  <span className="text-sm md:text-base">Priority customer support</span>
                </li>
              </ul>
              <div className="text-center">
                <button 
                  onClick={() => onNavigate?.('platform/verification')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Get Verified
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">📊 Fee Breakdown</h2>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">🔒 What Fees Cover</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Secure escrow system</li>
                  <li>• Payment processing</li>
                  <li>• 24/7 customer support</li>
                  <li>• Platform maintenance</li>
                  <li>• Fraud protection</li>
                </ul>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">💳 Payment Processing</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• No additional payment fees</li>
                  <li>• Instant payment processing</li>
                  <li>• Multiple payment methods</li>
                  <li>• Secure transactions</li>
                  <li>• Chargeback protection</li>
                </ul>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">⚡ Fast Payouts</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• 24-hour payout processing</li>
                  <li>• Direct bank transfers</li>
                  <li>• PayPal integration</li>
                  <li>• Cryptocurrency options</li>
                  <li>• No minimum payout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">⚖️ How We Compare</h2>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 md:p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 text-white font-medium">Platform</th>
                    <th className="text-center py-3 text-white font-medium">Buyer Fees</th>
                    <th className="text-center py-3 text-white font-medium">Seller Fees</th>
                    <th className="text-center py-3 text-white font-medium">Escrow</th>
                    <th className="text-center py-3 text-white font-medium">Support</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-700">
                    <td className="py-3 font-medium text-indigo-400">GameTrust</td>
                    <td className="text-center py-3 text-green-400">FREE</td>
                    <td className="text-center py-3">5-8%</td>
                    <td className="text-center py-3 text-green-400">✓</td>
                    <td className="text-center py-3 text-green-400">24/7</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3">Competitor A</td>
                    <td className="text-center py-3 text-red-400">3-5%</td>
                    <td className="text-center py-3">10-15%</td>
                    <td className="text-center py-3 text-red-400">✗</td>
                    <td className="text-center py-3">Business hours</td>
                  </tr>
                  <tr>
                    <td className="py-3">Competitor B</td>
                    <td className="text-center py-3 text-red-400">2%</td>
                    <td className="text-center py-3">12%</td>
                    <td className="text-center py-3 text-yellow-400">Limited</td>
                    <td className="text-center py-3">Email only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 md:pt-8">
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-gray-300 mb-6">Join thousands of gamers who trust GameTrust for secure account trading.</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
              <button 
                onClick={() => onNavigate?.('marketplace')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Buying
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
    </div>
  );
};

export default Pricing;