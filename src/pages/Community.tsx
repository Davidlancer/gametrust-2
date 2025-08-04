import React from 'react';

interface CommunityProps {
  onNavigate?: (page: string) => void;
}

const Community: React.FC<CommunityProps> = ({ onNavigate }) => {
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
            <span className="text-white font-medium">Community</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-8 space-y-12 md:space-y-16">

        {/* Hero */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">🎮 GameTrust Community</h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto md:mx-0">Join thousands of gamers in our thriving community. Share experiences, get tips, and connect with fellow traders.</p>
        </div>

        {/* Community Stats */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">📊 Community at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-400 mb-2">50K+</div>
              <div className="text-gray-300 text-sm">Active Members</div>
            </div>
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">1M+</div>
              <div className="text-gray-300 text-sm">Successful Trades</div>
            </div>
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">25+</div>
              <div className="text-gray-300 text-sm">Supported Games</div>
            </div>
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-300 text-sm">Community Support</div>
            </div>
          </div>
        </div>

        {/* Community Platforms */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">🌐 Join Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">💬</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Discord Server</h3>
                  <p className="text-gray-400 text-sm">Real-time chat and support</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">Join our active Discord community for instant help, trading tips, and direct communication with other gamers and our support team.</p>
              <ul className="space-y-2 text-gray-300 text-sm mb-4">
                <li>• Live trading discussions</li>
                <li>• Game-specific channels</li>
                <li>• Direct support access</li>
                <li>• Community events</li>
              </ul>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Join Discord
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📱</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Reddit Community</h3>
                  <p className="text-gray-400 text-sm">Discussions and guides</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">Participate in detailed discussions, share trading strategies, and access comprehensive guides created by our community members.</p>
              <ul className="space-y-2 text-gray-300 text-sm mb-4">
                <li>• Trading guides and tips</li>
                <li>• Community reviews</li>
                <li>• Q&A discussions</li>
                <li>• Success stories</li>
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Visit Subreddit
              </button>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📺</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">YouTube Channel</h3>
                  <p className="text-gray-400 text-sm">Tutorials and updates</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">Watch detailed tutorials, platform updates, and community highlights on our official YouTube channel.</p>
              <ul className="space-y-2 text-gray-300 text-sm mb-4">
                <li>• How-to tutorials</li>
                <li>• Platform updates</li>
                <li>• Community spotlights</li>
                <li>• Safety guides</li>
              </ul>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Subscribe Now
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📧</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Newsletter</h3>
                  <p className="text-gray-400 text-sm">Weekly updates and tips</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">Stay updated with our weekly newsletter featuring market trends, new features, and exclusive community content.</p>
              <ul className="space-y-2 text-gray-300 text-sm mb-4">
                <li>• Market insights</li>
                <li>• Feature announcements</li>
                <li>• Exclusive offers</li>
                <li>• Community highlights</li>
              </ul>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">📋 Community Guidelines</h2>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-4">✅ Do's</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Be respectful and helpful to other members</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Share legitimate trading experiences</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Report suspicious activity or scams</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Follow platform rules and guidelines</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1 text-sm">✓</span>
                    <span className="text-sm md:text-base">Contribute positively to discussions</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-4">❌ Don'ts</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 mt-1 text-sm">✗</span>
                    <span className="text-sm md:text-base">Spam or post irrelevant content</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 mt-1 text-sm">✗</span>
                    <span className="text-sm md:text-base">Attempt to trade outside the platform</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 mt-1 text-sm">✗</span>
                    <span className="text-sm md:text-base">Share personal information publicly</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 mt-1 text-sm">✗</span>
                    <span className="text-sm md:text-base">Use offensive language or harassment</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 mt-1 text-sm">✗</span>
                    <span className="text-sm md:text-base">Promote competing platforms</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Community Content */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">🌟 Featured Community Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6">
              <div className="mb-4">
                <div className="w-full h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-4xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Trading Guides</h3>
                <p className="text-gray-300 text-sm">Comprehensive guides created by experienced community members to help new traders get started safely.</p>
              </div>
              <button className="w-full border border-indigo-500 text-indigo-400 px-4 py-2 rounded-lg font-medium hover:bg-indigo-600 hover:text-white transition-colors">
                Read Guides
              </button>
            </div>

            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6">
              <div className="mb-4">
                <div className="w-full h-32 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-4xl">🏆</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Success Stories</h3>
                <p className="text-gray-300 text-sm">Real stories from community members who have had great experiences trading on GameTrust.</p>
              </div>
              <button className="w-full border border-green-500 text-green-400 px-4 py-2 rounded-lg font-medium hover:bg-green-600 hover:text-white transition-colors">
                Read Stories
              </button>
            </div>

            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6">
              <div className="mb-4">
                <div className="w-full h-32 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Market Insights</h3>
                <p className="text-gray-300 text-sm">Weekly market analysis and trends to help you make informed decisions about buying and selling accounts.</p>
              </div>
              <button className="w-full border border-red-500 text-red-400 px-4 py-2 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-colors">
                View Insights
              </button>
            </div>
          </div>
        </div>

        {/* Community Events */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">🎉 Upcoming Community Events</h2>
          <div className="space-y-4">
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400 mb-2">Monthly Trading Contest</h3>
                  <p className="text-gray-300 text-sm mb-2">Compete with other traders for prizes and recognition in our monthly contest.</p>
                  <div className="text-gray-400 text-xs">Next Event: December 15, 2024</div>
                </div>
                <button className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>

            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Community AMA Session</h3>
                  <p className="text-gray-300 text-sm mb-2">Ask our team anything about GameTrust, trading, and upcoming features.</p>
                  <div className="text-gray-400 text-xs">Next Session: December 20, 2024</div>
                </div>
                <button className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Join AMA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 md:pt-8">
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Ready to Join Our Community?</h2>
            <p className="text-gray-300 mb-6">Connect with thousands of gamers and start your trading journey with the support of our amazing community.</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
              <button 
                onClick={() => onNavigate?.('auth')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Join GameTrust
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

export default Community;