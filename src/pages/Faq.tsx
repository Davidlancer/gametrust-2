import React from 'react';

interface FaqProps {
  onNavigate?: (page: string) => void;
}

const Faq: React.FC<FaqProps> = ({ onNavigate }) => {
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
            <span className="text-white font-medium">FAQ</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-8 space-y-12 md:space-y-16">

        {/* Hero */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">❓ Frequently Asked Questions</h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto md:mx-0">Find answers to the most common questions about GameTrust's secure trading platform.</p>
        </div>

        {/* General Questions */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">🔍 General Questions</h2>
          <div className="space-y-4">
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">What is GameTrust and how does it work?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">GameTrust is a secure marketplace for buying and selling gaming accounts. We use an escrow system to protect both buyers and sellers, ensuring safe transactions for all parties involved.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">Is it safe to buy gaming accounts online?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">Yes, when using GameTrust's secure platform. Our escrow system holds your payment until you receive and verify your account, protecting you from scams and fraudulent sellers.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">What games and platforms do you support?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">We support accounts for popular games including Fortnite, Valorant, League of Legends, CS:GO, Minecraft, and many more across PC, console, and mobile platforms.</p>
            </details>
          </div>
        </div>

        {/* Buying Questions */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">🛒 Buying Questions</h2>
          <div className="space-y-4">
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">How do I know if a seller is trustworthy?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">Look for verification badges, seller ratings, and detailed reviews from previous buyers. Verified sellers have passed identity checks and have proven track records.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">What payment methods do you accept?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">We accept major credit cards, PayPal, and various digital payment methods. All payments are processed securely through our escrow system.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">What if the account doesn't match the description?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">You have 24 hours to verify your purchase. If the account doesn't match the listing, contact our support team for a full refund through our dispute resolution process.</p>
            </details>
          </div>
        </div>

        {/* Selling Questions */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">💰 Selling Questions</h2>
          <div className="space-y-4">
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">How do I become a verified seller?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">Complete our verification process by providing government-issued ID and passing background checks. Verified sellers get priority placement and higher trust ratings.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">What fees do you charge sellers?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">We charge a small commission on successful sales to cover platform costs and buyer protection. Fees are clearly displayed before you list your account.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">How quickly do I get paid after a sale?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">Once the buyer confirms receipt and the 24-hour verification period ends, payment is released to your account within 24 hours.</p>
            </details>
          </div>
        </div>

        {/* Support Questions */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">🎧 Support Questions</h2>
          <div className="space-y-4">
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">How can I contact customer support?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">Our support team is available 24/7 through live chat, email, or our support ticket system. We typically respond within 30 minutes during business hours.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">What is your dispute resolution process?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">Our team investigates all disputes fairly and impartially. We review evidence from both parties and make decisions based on our terms of service and platform policies.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 md:p-6">
              <summary className="cursor-pointer font-medium text-white text-sm md:text-base">Do you offer refunds?</summary>
              <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">Yes, we offer full refunds if accounts don't match their descriptions or if there are issues with the transaction. Our buyer protection guarantee ensures your satisfaction.</p>
            </details>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 md:pt-8">
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-gray-300 mb-6">Can't find what you're looking for? Our support team is here to help 24/7.</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
              <button 
                onClick={() => onNavigate?.('support')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Support
              </button>
              <button 
                onClick={() => onNavigate?.('support/help-center')}
                className="w-full sm:w-auto border border-indigo-500 text-indigo-400 px-6 py-3 rounded-lg font-medium hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Visit Help Center
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;