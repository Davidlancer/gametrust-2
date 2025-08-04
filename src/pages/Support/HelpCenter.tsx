import React from 'react';

interface HelpCenterProps {
  onNavigate?: (page: string) => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onNavigate }) => {
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
            <li className="text-indigo-400">Help Center</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            📘 Help Center
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions and get the help you need
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Getting Started</h2>
              <div className="space-y-4 text-gray-300">
                <p>Welcome to GameTrust! Here you'll find everything you need to know about buying and selling gaming accounts safely.</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>How to create an account</li>
                  <li>Verifying your identity</li>
                  <li>Understanding our escrow system</li>
                  <li>Making your first purchase</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">How does the escrow system work?</h3>
                  <p className="text-gray-300">Our escrow system holds your payment securely until you confirm receipt of your gaming account. This protects both buyers and sellers.</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">What if I have issues with my purchase?</h3>
                  <p className="text-gray-300">You can raise a dispute within 24 hours of purchase. Our support team will review and help resolve any issues.</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">How do I start selling?</h3>
                  <p className="text-gray-300">Complete your profile verification, then create your first listing with detailed account information and screenshots.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Need More Help?</h2>
              <p className="text-gray-300 mb-4">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <button 
                onClick={() => onNavigate?.('support/contact-us')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Contact Support
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;