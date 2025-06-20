import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Shield, Users, CreditCard, AlertTriangle, Lock, ArrowRight } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCenterProps {
  onNavigate: (page: string) => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle, color: 'text-indigo-400' },
    { id: 'general', name: 'General', icon: HelpCircle, color: 'text-blue-400' },
    { id: 'buying', name: 'For Buyers', icon: Users, color: 'text-green-400' },
    { id: 'selling', name: 'For Sellers', icon: CreditCard, color: 'text-purple-400' },
    { id: 'wallet', name: 'Wallet & Payments', icon: CreditCard, color: 'text-yellow-400' },
    { id: 'disputes', name: 'Disputes & Escrow', icon: AlertTriangle, color: 'text-orange-400' },
    { id: 'safety', name: 'Safety & Security', icon: Shield, color: 'text-red-400' }
  ];

  const faqData: FAQItem[] = [
    // General
    {
      id: 'what-is-gametrust',
      question: 'What is GameTrust?',
      answer: 'GameTrust is a secure marketplace for buying and selling verified gaming accounts. We use an escrow system to protect both buyers and sellers, ensuring safe transactions for mobile game accounts like CODM, PUBG, Free Fire, and more.',
      category: 'general'
    },
    {
      id: 'is-gametrust-safe',
      question: 'Is GameTrust safe?',
      answer: 'Yes! GameTrust prioritizes security with our escrow protection system, verified seller badges, account verification process, and 24/7 customer support. All transactions are protected, and we have a 99.8% success rate.',
      category: 'general'
    },
    {
      id: 'supported-games',
      question: 'What games are supported?',
      answer: 'We support popular mobile games including Call of Duty Mobile, PUBG Mobile, Free Fire, Valorant Mobile, and many others. We\'re constantly adding new games based on community demand.',
      category: 'general'
    },

    // Buying
    {
      id: 'how-to-buy',
      question: 'How do I buy an account?',
      answer: 'Browse our marketplace, select an account, review the details, and click "Buy Now". Your payment will be held in escrow while the seller transfers the account. Once you confirm everything works, the payment is released to the seller.',
      category: 'buying'
    },
    {
      id: 'how-escrow-works',
      question: 'How does escrow work?',
      answer: 'Escrow protects your purchase by holding your payment securely until you confirm the account works as described. You have 48 hours to test the account. If there are issues, you can open a dispute for a full refund.',
      category: 'buying'
    },
    {
      id: 'refund-policy',
      question: 'Can I get a refund if the account doesn\'t work?',
      answer: 'Yes! If the account doesn\'t match the description or has issues, you can request a refund within 48 hours of delivery. Our dispute team will investigate and issue a full refund if the claim is valid.',
      category: 'buying'
    },
    {
      id: 'delivery-time',
      question: 'How long does delivery take?',
      answer: 'Most accounts are delivered within 2-24 hours. Delivery time depends on the seller\'s response time and verification requirements. You\'ll receive notifications throughout the process.',
      category: 'buying'
    },

    // Selling
    {
      id: 'how-to-list',
      question: 'How do I list an account?',
      answer: 'Click "Start Selling", fill out the account details, upload screenshots/videos, set your price, and submit for review. Our team verifies listings within 24 hours before they go live.',
      category: 'selling'
    },
    {
      id: 'required-proof',
      question: 'What proof do I need to upload?',
      answer: 'You need clear screenshots of account stats, inventory, achievements, and any special features. For high-value accounts, additional verification like video gameplay may be required.',
      category: 'selling'
    },
    {
      id: 'linked-accounts',
      question: 'Can I sell accounts linked to Facebook or Apple ID?',
      answer: 'Yes, but you must clearly disclose all linked platforms and whether they can be unlinked. Permanently linked accounts (like Apple ID) must be marked as such to ensure buyer awareness.',
      category: 'selling'
    },
    {
      id: 'commission-fee',
      question: 'What\'s the commission or fee?',
      answer: 'GameTrust charges a 10% commission on successful sales. This covers escrow protection, payment processing, customer support, and platform maintenance. No upfront fees to list.',
      category: 'selling'
    },

    // Wallet & Payments
    {
      id: 'fund-wallet',
      question: 'How do I fund my wallet?',
      answer: 'You can add funds using credit/debit cards, PayPal, bank transfers, or cryptocurrency. Funds are instantly available for purchases and held securely in your GameTrust wallet.',
      category: 'wallet'
    },
    {
      id: 'payment-methods',
      question: 'What payment methods are supported?',
      answer: 'We accept Visa, Mastercard, PayPal, bank transfers, and major cryptocurrencies (Bitcoin, Ethereum, USDT). All payments are processed securely through encrypted channels.',
      category: 'wallet'
    },
    {
      id: 'withdraw-money',
      question: 'How do I withdraw money as a seller?',
      answer: 'Go to your wallet, click "Withdraw", choose your preferred method (bank transfer, PayPal, crypto), and submit. Withdrawals are processed within 24-48 hours.',
      category: 'wallet'
    },
    {
      id: 'transaction-fees',
      question: 'Are there any transaction fees?',
      answer: 'No additional fees for buyers. Sellers pay a 10% commission on sales. Withdrawal fees may apply depending on the method chosen (typically 1-3% for external transfers).',
      category: 'wallet'
    },

    // Disputes
    {
      id: 'problem-with-sale',
      question: 'What happens if there\'s a problem with a sale?',
      answer: 'Open a dispute within 48 hours of delivery. Provide details and evidence. Our dispute team investigates both sides and makes a fair decision. Most disputes are resolved within 24-72 hours.',
      category: 'disputes'
    },
    {
      id: 'dispute-resolution',
      question: 'How are disputes resolved?',
      answer: 'Our experienced dispute team reviews all evidence from both parties, checks account details, and makes an impartial decision. Decisions are final and binding for both parties.',
      category: 'disputes'
    },
    {
      id: 'dispute-deadline',
      question: 'What\'s the deadline to report an issue?',
      answer: 'You have 48 hours from account delivery to report any issues. After this period, the transaction is considered complete and funds are released to the seller.',
      category: 'disputes'
    },

    // Safety
    {
      id: 'verify-seller',
      question: 'How do I know a seller is legit?',
      answer: 'Look for verified seller badges, check their rating and review history, see their total sales count, and read recent buyer feedback. Verified sellers have passed our identity and quality checks.',
      category: 'safety'
    },
    {
      id: 'scam-protection',
      question: 'What happens if I get scammed?',
      answer: 'Our escrow system prevents most scams. If you encounter fraud, report it immediately. We investigate all claims and provide full refunds for verified scam cases. Scammers are permanently banned.',
      category: 'safety'
    },
    {
      id: 'verified-badge',
      question: 'What is a "verified seller" badge?',
      answer: 'Verified sellers have completed identity verification, maintained high ratings, demonstrated consistent quality, and passed our trust checks. They represent our most reliable sellers.',
      category: 'safety'
    }
  ];

  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Find answers to common questions about GameTrust. Can't find what you're looking for? 
            <button 
              onClick={() => onNavigate('contact')}
              className="text-indigo-400 hover:text-indigo-300 ml-1 underline"
            >
              Contact our support team
            </button>
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <category.icon className={`h-4 w-4 ${category.color}`} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Results */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            <>
              <div className="text-center mb-6">
                <p className="text-gray-400">
                  {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'} found
                </p>
              </div>
              
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10">
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full text-left flex items-center justify-between p-2 focus:outline-none group"
                  >
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {expandedItems.has(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                      )}
                    </div>
                  </button>
                  
                  {expandedItems.has(faq.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-700 animate-in slide-in-from-top-2 duration-200">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or browse by category
              </p>
              <Button 
                variant="outline"
                onClick={() => onNavigate('contact')}
              >
                Contact Support
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover className="text-center group cursor-pointer" onClick={() => onNavigate('contact')}>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500/30 transition-colors">
              <HelpCircle className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
              Contact Support
            </h3>
            <p className="text-gray-400 mb-4">
              Get personalized help from our support team
            </p>
            <div className="flex items-center justify-center text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium">Get Help</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Card>

          <Card hover className="text-center group cursor-pointer" onClick={() => onNavigate('marketplace')}>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
              Browse Marketplace
            </h3>
            <p className="text-gray-400 mb-4">
              Explore verified gaming accounts for sale
            </p>
            <div className="flex items-center justify-center text-green-400 group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium">Start Shopping</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Card>

          <Card hover className="text-center group cursor-pointer" onClick={() => onNavigate('sell')}>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
              <CreditCard className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
              Start Selling
            </h3>
            <p className="text-gray-400 mb-4">
              List your gaming account safely and securely
            </p>
            <div className="flex items-center justify-center text-purple-400 group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium">List Account</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Card>
        </div>

        {/* Trust Banner */}
        <Card className="mt-12 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-green-400" />
              <span className="text-lg font-semibold text-green-400">100% Secure Platform</span>
            </div>
            <p className="text-gray-300 mb-4">
              All transactions are protected by our escrow system. Your safety is our top priority.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <span>🔒 Escrow Protected</span>
              <span>✓ Verified Sellers</span>
              <span>🛡️ 24/7 Support</span>
              <span>💯 99.8% Success Rate</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;