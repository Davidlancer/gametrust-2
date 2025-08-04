import React from 'react';

interface SafetyGuidelinesProps {
  onNavigate?: (page: string) => void;
}

const SafetyGuidelines: React.FC<SafetyGuidelinesProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <button 
                onClick={() => onNavigate?.('home')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </button>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-indigo-400">Safety Guidelines</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            🔐 Safety Guidelines
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay safe while buying and selling gaming accounts on our platform
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">For Buyers</h2>
              <div className="space-y-4 text-gray-300">
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">✅ Do:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Always use our escrow system for payments</li>
                    <li>Verify account details before confirming delivery</li>
                    <li>Check seller ratings and reviews</li>
                    <li>Report suspicious activity immediately</li>
                    <li>Change passwords and security settings after purchase</li>
                  </ul>
                </div>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h3 className="font-semibold text-red-400 mb-2">❌ Don't:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Never pay outside of our platform</li>
                    <li>Don't share your personal payment information</li>
                    <li>Avoid deals that seem too good to be true</li>
                    <li>Don't confirm delivery without testing the account</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">For Sellers</h2>
              <div className="space-y-4 text-gray-300">
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">✅ Do:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Provide accurate account information and screenshots</li>
                    <li>Respond promptly to buyer questions</li>
                    <li>Keep account credentials secure until sale completion</li>
                    <li>Be honest about account history and limitations</li>
                    <li>Complete identity verification for higher trust</li>
                  </ul>
                </div>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h3 className="font-semibold text-red-400 mb-2">❌ Don't:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Never sell accounts you don't own</li>
                    <li>Don't provide false information about accounts</li>
                    <li>Avoid selling banned or compromised accounts</li>
                    <li>Don't attempt to recover accounts after sale</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">General Security Tips</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">🔒 Account Security</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Use strong, unique passwords</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Regularly update security settings</li>
                  </ul>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">💬 Communication</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Keep all communication on platform</li>
                    <li>• Be respectful and professional</li>
                    <li>• Report harassment or abuse</li>
                  </ul>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">⚠️ Red Flags</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Requests for off-platform payment</li>
                    <li>• Pressure to complete transactions quickly</li>
                    <li>• Sellers with no reviews or verification</li>
                  </ul>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">🛡️ Dispute Resolution</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Use our dispute system for issues</li>
                    <li>• Provide evidence and documentation</li>
                    <li>• Be patient during review process</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Need Help?</h2>
              <p className="text-gray-300 mb-4">
                If you encounter any safety concerns or need assistance, don't hesitate to contact our support team.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => onNavigate?.('support/contact-us')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Contact Support
                </button>
                <button 
                  onClick={() => onNavigate?.('support/help-center')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Help Center
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuidelines;