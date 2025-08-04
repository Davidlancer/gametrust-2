import React from 'react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-base">GT</span>
              </div>
              <span className="text-2xl font-bold text-white">GameTrust</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Securely buy & sell game accounts with confidence.
            </p>
            <p className="text-gray-500 mb-6 leading-relaxed text-xs">
              Trusted escrow protection for gamers worldwide.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com/gametrust" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-indigo-500/20 transition-all duration-300 group-hover:scale-110 shadow-md">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
              </a>
              <a 
                href="https://twitter.com/gametrust" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-indigo-500/20 transition-all duration-300 group-hover:scale-110 shadow-md">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
              </a>
              <a 
                href="https://discord.gg/gametrust" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-indigo-500/20 transition-all duration-300 group-hover:scale-110 shadow-md">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-white font-bold mb-6 text-base">Support</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate?.('support/help-center')} 
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('support/safety-guidelines')} 
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  Safety Guidelines
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('support/contact-us')} 
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('support/terms-of-service')} 
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Section */}
          <div>
            <h3 className="text-white font-bold mb-6 text-base">Platform</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate?.('platform/marketplace')}
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  Marketplace
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('platform/start-selling')}
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  Start Selling
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('platform/how-it-works')}
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('platform/verification')}
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-white font-bold mb-6 text-base">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate?.('faq')}
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('pricing')}
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('buyer-protection')}
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  Buyer Protection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('community')}
                  className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm text-left block w-full"
                >
                  Community
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 lg:mt-16 border-t border-gray-800"></div>
        
        {/* Bottom Section */}
        <div className="mt-8 flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 GameTrust. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-xs">
              <button 
                onClick={() => onNavigate?.('legal/privacy-policy')}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-gray-600">•</span>
              <button 
                onClick={() => onNavigate?.('legal/cookie-policy')}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                Cookie Policy
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-gray-400 text-sm">Secure & Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-gray-400 text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;