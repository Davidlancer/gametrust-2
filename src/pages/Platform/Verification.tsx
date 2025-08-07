import React from 'react';

interface VerificationProps {
  onNavigate?: (page: string) => void;
}

const Verification: React.FC<VerificationProps> = ({ onNavigate }) => {
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
            <span className="text-white font-medium">Verification</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 space-y-16">

        {/* 🔝 Hero */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">🛡️ Get Verified & Build Trust</h1>
          <p className="text-lg text-gray-300">Become a verified seller to increase trust and boost your sales. Join thousands of verified sellers earning more on GameTrust.</p>
        </div>

        {/* 🛡️ Why Verification Matters */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">🛡️ Why Verification Matters</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">Higher Trust</h3>
              <p className="text-gray-300">Buyers prefer verified sellers. Your verification badge shows you're legitimate and trustworthy, leading to more sales.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">Better Visibility</h3>
              <p className="text-gray-300">Verified listings appear higher in search results and get featured placement, giving you a competitive advantage.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">Higher Prices</h3>
              <p className="text-gray-300">Verified sellers can charge premium prices. Buyers pay more for the security and trust that comes with verification.</p>
            </div>
          </div>
        </div>

        {/* 📤 What's Required */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">📤 What's Required for Verification</h2>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-indigo-400 mb-4">📋 Required Documents</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">📄</span>
                    <span>Government-issued photo ID (driver's license, passport, or national ID)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">🤳</span>
                    <span>Clear selfie holding your ID next to your face</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">🏠</span>
                    <span>Proof of address (utility bill or bank statement, less than 3 months old)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">📱</span>
                    <span>Phone number verification via SMS</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-indigo-400 mb-4">⚡ Process Timeline</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Step 1:</strong> Upload documents (5 minutes)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Step 2:</strong> Automated checks (instant)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Step 3:</strong> Manual review (24-48 hours)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Step 4:</strong> Get your verified badge!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 🏅 Verified Badge Benefits */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">🎯 Priority Placement</h2>
            <p className="text-gray-300 mt-2">Your listings appear at the top of search results and get featured on our homepage. More visibility means more sales and higher profits.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">🔒 Enhanced Security</h2>
            <p className="text-gray-300 mt-2">Verified sellers get additional account security features, priority customer support, and protection against false disputes.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">💎 Premium Features</h2>
            <p className="text-gray-300 mt-2">Access exclusive seller tools, advanced analytics, bulk listing options, and promotional opportunities to grow your business.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">⚡ Faster Payouts</h2>
            <p className="text-gray-300 mt-2">Verified sellers get instant payouts instead of waiting 24 hours. Your money is available immediately after successful transactions.</p>
          </div>
        </div>

        {/* 🧠 FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">Is my personal data safe during verification?</summary>
              <p className="mt-2 text-sm text-gray-300">Absolutely. We use bank-level encryption and never share your personal information. Documents are stored securely and only used for verification purposes. We're fully GDPR compliant.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">How long does verification take?</summary>
              <p className="mt-2 text-sm text-gray-300">Most verifications are completed within 24-48 hours. During busy periods, it may take up to 72 hours. You'll receive email updates throughout the process.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">What if my verification is rejected?</summary>
              <p className="mt-2 text-sm text-gray-300">We'll tell you exactly why and what to fix. Common issues are blurry photos or expired documents. You can resubmit immediately with corrected documents at no extra cost.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">Can I sell without verification?</summary>
              <p className="mt-2 text-sm text-gray-300">Yes, but verified sellers have significant advantages: higher search rankings, buyer trust, premium pricing, and faster payouts. Most successful sellers get verified within their first week.</p>
            </details>
          </div>
        </div>

        {/* 🚀 CTA */}
        <div className="pt-6">
          <button 
            onClick={() => onNavigate?.('auth/register')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded mr-4 transition-colors"
          >
            Get Verified Now
          </button>
          <button 
            onClick={() => onNavigate?.('platform/start-selling')}
            className="border border-indigo-500 text-indigo-400 px-6 py-3 rounded hover:bg-indigo-900/50 transition-colors"
          >
            Start Selling
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;