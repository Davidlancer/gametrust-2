import React from 'react';

interface TermsOfServiceProps {
  onNavigate?: (page: string) => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onNavigate }) => {
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
            <li className="text-indigo-400">Terms of Service</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            📄 Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Last updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  By accessing and using GameTrust, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">2. Platform Description</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  GameTrust is a secure marketplace for buying and selling gaming accounts. We provide:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li>Escrow services to protect both buyers and sellers</li>
                  <li>Identity verification systems</li>
                  <li>Dispute resolution services</li>
                  <li>Secure communication channels</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">3. User Responsibilities</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">For All Users:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                      <li>Provide accurate and truthful information</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Respect other users and maintain professional conduct</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">For Sellers:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                      <li>Only sell accounts you legitimately own</li>
                      <li>Provide accurate account information and screenshots</li>
                      <li>Transfer account access promptly after payment confirmation</li>
                      <li>Not attempt to recover accounts after successful sale</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">For Buyers:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                      <li>Verify account details before confirming delivery</li>
                      <li>Use our escrow system for all transactions</li>
                      <li>Report any issues within the specified timeframe</li>
                      <li>Change account credentials immediately after purchase</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">4. Prohibited Activities</h2>
                <p className="text-gray-300 mb-4">The following activities are strictly prohibited:</p>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>Selling stolen, hacked, or compromised accounts</li>
                    <li>Engaging in fraudulent activities or scams</li>
                    <li>Attempting to bypass our escrow system</li>
                    <li>Creating multiple accounts to manipulate ratings</li>
                    <li>Harassing or threatening other users</li>
                    <li>Violating game publishers' terms of service</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">5. Fees and Payments</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  GameTrust charges a service fee for successful transactions. Current fee structure:
                </p>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <ul className="space-y-2 text-gray-300">
                    <li>• Seller fee: 5% of transaction value</li>
                    <li>• Buyer protection fee: 2% of transaction value</li>
                    <li>• Payment processing fees may apply</li>
                    <li>• Fees are subject to change with 30 days notice</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">6. Dispute Resolution</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  In case of disputes between buyers and sellers:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                  <li>Users must first attempt to resolve issues directly</li>
                  <li>If unresolved, either party may open a formal dispute</li>
                  <li>Our support team will review evidence from both parties</li>
                  <li>Decisions are final and binding on both parties</li>
                  <li>Refunds or account transfers will be processed accordingly</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">7. Limitation of Liability</h2>
                <p className="text-gray-300 leading-relaxed">
                  GameTrust acts as an intermediary platform. While we strive to provide secure services, 
                  we cannot guarantee the legitimacy of all accounts or the actions of users. Our liability 
                  is limited to the transaction value and our service fees.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">8. Privacy Policy</h2>
                <p className="text-gray-300 leading-relaxed">
                  We collect and process personal information as outlined in our Privacy Policy. 
                  By using our service, you consent to such processing and warrant that all data 
                  provided by you is accurate.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">9. Modifications to Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to modify these terms at any time. Users will be notified 
                  of significant changes via email or platform notifications. Continued use of the 
                  service constitutes acceptance of modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Information</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-300">
                    Email: <a href="mailto:legal@gametrust.com" className="text-indigo-400 hover:text-indigo-300 underline">legal@gametrust.com</a>
                  </p>
                  <p className="text-gray-300">
                    Support: <a href="mailto:support@gametrust.com" className="text-indigo-400 hover:text-indigo-300 underline">support@gametrust.com</a>
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-700">
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => onNavigate?.('support/help-center')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Help Center
                </button>
                <button 
                  onClick={() => onNavigate?.('support/contact-us')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
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

export default TermsOfService;