import React from 'react';

interface StartSellingProps {
  onNavigate?: (page: string) => void;
}

const StartSelling: React.FC<StartSellingProps> = ({ onNavigate }) => {
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
            <span className="text-white font-medium">Start Selling</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 space-y-16">

        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">🚀 Start Selling on GameTrust</h1>
          <p className="text-lg text-gray-300">Turn your in-game assets into real money. List accounts for free. Escrow ensures your safety.</p>
        </div>

        {/* ✅ How Selling Works */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">📈 Step 1: Create Your Listing</h2>
            <p className="text-gray-300 mt-2">Upload clear screenshots, write detailed descriptions, and set competitive prices. Our listing tools make it easy to showcase your account's value and attract serious buyers.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">🔐 Step 2: Secure Transaction</h2>
            <p className="text-gray-300 mt-2">When someone buys your account, their payment goes into escrow protection. You're guaranteed to get paid once you deliver the account as described. No chargebacks, no scams.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">🎯 Step 3: Quick Transfer</h2>
            <p className="text-gray-300 mt-2">Provide account credentials to the buyer through our secure system. Once they confirm everything works, payment is instantly released to your account. It's that simple!</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">💰 Step 4: Get Paid Fast</h2>
            <p className="text-gray-300 mt-2">Receive payments directly to your bank account or PayPal within 24 hours. Track all your sales and earnings in your seller dashboard.</p>
          </div>
        </div>

        {/* 🛡️ Seller Protection */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">🛡️ Why Sellers Choose GameTrust</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <h3 className="font-semibold text-indigo-400 mb-2">🔒 Escrow Protection</h3>
              <p className="text-sm text-gray-300">Your payment is guaranteed once you deliver. No risk of buyers taking your account without paying.</p>
            </div>
            <div className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <h3 className="font-semibold text-indigo-400 mb-2">📊 Free Listings</h3>
              <p className="text-sm text-gray-300">List unlimited accounts for free. We only take a small commission when you make a sale.</p>
            </div>
            <div className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <h3 className="font-semibold text-indigo-400 mb-2">⚡ Fast Payouts</h3>
              <p className="text-sm text-gray-300">Get paid within 24 hours of completing a sale. No waiting weeks for your money.</p>
            </div>
          </div>
        </div>

        {/* 🧠 FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">How do I get paid?</summary>
              <p className="mt-2 text-sm text-gray-300">We support PayPal, bank transfers, and other secure payment methods. Payments are processed within 24 hours of completing a sale. You can track all earnings in your seller dashboard.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">Can I sell multiple accounts?</summary>
              <p className="mt-2 text-sm text-gray-300">Absolutely! There's no limit to how many accounts you can list. Many sellers manage dozens of listings across different games. Our bulk listing tools make it easy to manage multiple accounts.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">What fees do you charge?</summary>
              <p className="mt-2 text-sm text-gray-300">Listing is completely free. We only charge a small commission (5-10%) when you successfully sell an account. No hidden fees, no monthly charges.</p>
            </details>
            <details className="bg-gray-700/50 border border-gray-600 rounded p-4">
              <summary className="cursor-pointer font-medium text-white">What if a buyer tries to scam me?</summary>
              <p className="mt-2 text-sm text-gray-300">Our escrow system prevents all buyer scams. Payment is held securely until you deliver the account. If there's any dispute, our support team investigates and protects legitimate sellers.</p>
            </details>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6">
          <button 
            onClick={() => onNavigate?.('auth/register')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded mr-4 transition-colors"
          >
            Create Seller Account
          </button>
          <button 
            onClick={() => onNavigate?.('platform/how-it-works')}
            className="border border-indigo-500 text-indigo-400 px-6 py-3 rounded hover:bg-indigo-500/10 transition-colors"
          >
            Learn How It Works
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default StartSelling;