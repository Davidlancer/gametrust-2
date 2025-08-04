import React from 'react';
import { Shield, Twitter, Github, Disc as Discord } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold text-white">GameTrust</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              The most secure marketplace for buying and selling verified gaming accounts. 
              Protected by escrow and trusted by gamers worldwide.
            </p>
            <div className="flex space-x-4">
              <Twitter className="h-5 w-5 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors" />
              <Discord className="h-5 w-5 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors" />
              <Github className="h-5 w-5 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate?.('platform/marketplace')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Marketplace
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('platform/start-selling')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Start Selling
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('platform/how-it-works')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('platform/verification')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate?.('support/help-center')} className="text-gray-400 hover:text-white transition-colors text-left">Help Center</button></li>
              <li><button onClick={() => onNavigate?.('support/safety-guidelines')} className="text-gray-400 hover:text-white transition-colors text-left">Safety Guidelines</button></li>
              <li><button onClick={() => onNavigate?.('support/contact-us')} className="text-gray-400 hover:text-white transition-colors text-left">Contact Us</button></li>
              <li><button onClick={() => onNavigate?.('support/terms-of-service')} className="text-gray-400 hover:text-white transition-colors text-left">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 GameTrust by GameBox Arena. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 sm:mt-0">
            Secure transactions powered by escrow
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;