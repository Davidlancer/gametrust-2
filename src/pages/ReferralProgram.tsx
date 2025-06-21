import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  LinkIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  BanknotesIcon,
  UsersIcon,
  TrophyIcon,
  ArrowTopRightOnSquareIcon,
  WalletIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  GiftIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import {
  TrophyIcon as TrophySolid,
  SparklesIcon as SparklesSolid
} from '@heroicons/react/24/solid';
import Button from '../components/UI/Button';
import { useToast } from '../components/UI/ToastProvider';
import Confetti from '../components/UI/Confetti';

interface ReferralStats {
  totalInvites: number;
  convertedUsers: number;
  referralEarnings: number;
  walletBalance: number;
  nextPayoutDate: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  referrals: number;
  earnings: number;
  isCurrentUser?: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

const mockStats: ReferralStats = {
  totalInvites: 42,
  convertedUsers: 23,
  referralEarnings: 11500,
  walletBalance: 4000,
  nextPayoutDate: 'June 30'
};

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: '@Blunt', referrals: 58, earnings: 29000, isCurrentUser: true },
  { rank: 2, username: '@DarkSniper', referrals: 44, earnings: 22000 },
  { rank: 3, username: '@AceCODM', referrals: 39, earnings: 19500 },
  { rank: 4, username: '@ProGamer99', referrals: 35, earnings: 17500 },
  { rank: 5, username: '@ElitePlayer', referrals: 31, earnings: 15500 },
  { rank: 6, username: '@GameMaster', referrals: 28, earnings: 14000 },
  { rank: 7, username: '@CyberNinja', referrals: 25, earnings: 12500 },
  { rank: 8, username: '@PixelWarrior', referrals: 22, earnings: 11000 }
];

const faqs: FAQ[] = [
  {
    question: 'How do I get paid?',
    answer: 'You earn ₦500 for each friend who signs up using your referral link and completes their first transaction. Payments are processed to your GameTrust wallet within 24 hours of the qualifying transaction.'
  },
  {
    question: 'Can I refer my second account?',
    answer: 'No, self-referrals are not allowed. Each referral must be a unique individual with their own device and payment method. We have systems in place to detect and prevent fraudulent referrals.'
  },
  {
    question: 'How long does it take to receive referral funds?',
    answer: 'Referral earnings are credited to your referral wallet immediately after your friend completes their first transaction. You can then withdraw these funds to your main GameTrust wallet anytime.'
  },
  {
    question: 'Can sellers refer buyers (or vice versa)?',
    answer: 'Yes! Both buyers and sellers can participate in the referral program. Anyone can refer anyone - the program is open to all GameTrust users regardless of their role on the platform.'
  },
  {
    question: 'Can I withdraw referral earnings to bank directly?',
    answer: 'Referral earnings must first be transferred to your main GameTrust wallet. From there, you can withdraw to your bank account following our standard withdrawal process with a minimum of ₦1,000.'
  }
];

const ReferralProgram: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leaderboardView, setLeaderboardView] = useState<'week' | 'alltime'>('week');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isLoggedIn] = useState(true); // Mock login state
  const { showSuccess, showError } = useToast();
  
  const referralLink = 'https://gametrust.gg/r/blunt';
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setShowConfetti(true);
      setTimeout(() => {
        setCopied(false);
        setShowConfetti(false);
      }, 3000);
      showSuccess('Copied!', 'Your referral link has been copied to clipboard!');
    }).catch(() => {
      showError('Failed to copy', 'Please try again');
    });
  };
  
  const shareOnWhatsApp = () => {
    const message = `🎮 Join GameTrust - Nigeria's most trusted gaming marketplace! Use my referral link and we both earn ₦500! ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  const shareOnTelegram = () => {
    const message = `🎮 Join GameTrust and earn ₦500! ${referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`, '_blank');
  };
  
  const shareOnTwitter = () => {
    const message = `🎮 Join GameTrust - Nigeria's most trusted gaming marketplace! Use my referral link and we both earn ₦500! ${referralLink} #GameTrust #Gaming`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleWithdraw = () => {
    if (mockStats.walletBalance < 1000) {
      showError('Minimum withdrawal', 'Minimum withdrawal amount is ₦1,000');
      return;
    }
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    showSuccess('Withdrawal successful!', `₦${mockStats.walletBalance.toLocaleString()} sent to your main wallet!`);
  };

  const scrollToReferralPanel = () => {
    document.getElementById('referral-panel')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white">
      {showConfetti && <Confetti />}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-indigo-400 to-white bg-clip-text text-transparent">
                Invite Gamers.
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Earn Real Money.
              </span>
            </h1>
            
            <motion.p 
              className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Earn <span className="text-indigo-400 font-semibold">₦500</span> per friend who signs up and transacts. 
              They earn <span className="text-indigo-400 font-semibold">₦250</span> too.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                onClick={scrollToReferralPanel}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-indigo-500/25 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <SparklesSolid className="w-6 h-6 mr-2" />
                Start Referring Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Three simple steps to start earning with your gaming network
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Share Your Link',
                description: 'Copy your unique link or share directly to WhatsApp, Twitter, etc.',
                icon: ShareIcon,
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                step: 2,
                title: 'They Sign Up & Use',
                description: 'They must complete a transaction (buy/sell) using GameTrust escrow.',
                icon: UsersIcon,
                gradient: 'from-purple-500 to-pink-500'
              },
              {step: 3,
                title: 'You Get Paid',
                description: 'You earn ₦500, and they get ₦250 cashback/credit.',
                icon: BanknotesIcon,
                gradient: 'from-indigo-500 to-purple-500'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full hover:border-indigo-500/30 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {isLoggedIn ? (
        <>
          {/* Referral Stats Panel */}
          <section id="referral-panel" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
                    Your Performance
                  </span>
                </h2>
              </motion.div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                {[
                  { label: 'Total Invites', value: mockStats.totalInvites, icon: UsersIcon, gradient: 'from-blue-500 to-cyan-500' },
                  { label: 'Converted Users', value: mockStats.convertedUsers, icon: TrophyIcon, gradient: 'from-green-500 to-emerald-500' },
                  { label: 'Referral Earnings', value: `₦${mockStats.referralEarnings.toLocaleString()}`, icon: BanknotesIcon, gradient: 'from-yellow-500 to-orange-500' },
                  { label: 'Wallet Balance', value: `₦${mockStats.walletBalance.toLocaleString()}`, icon: WalletIcon, gradient: 'from-purple-500 to-pink-500' },
                  { label: 'Next Payout Date', value: mockStats.nextPayoutDate, icon: CalendarIcon, gradient: 'from-indigo-500 to-purple-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-indigo-500/30 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center mb-4`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-gray-300">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* Referral Link & Actions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Referral Link</h3>
                
                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex-1 flex items-center bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4">
                    <LinkIcon className="w-5 h-5 text-indigo-400 mr-3" />
                    <span className="text-white font-mono text-lg truncate">{referralLink}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(referralLink)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 flex items-center space-x-2"
                  >
                    {copied ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <ClipboardDocumentIcon className="w-5 h-5" />
                    )}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </motion.button>
                </div>
                
                {/* Share Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(37, 211, 102, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareOnWhatsApp}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareOnTelegram}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ShareIcon className="w-5 h-5" />
                    <span>Telegram</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(29, 161, 242, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareOnTwitter}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    <span>Twitter</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Referral Wallet & Payout */}
          <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <WalletIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Referral Wallet</h3>
                  <p className="text-gray-400">Manage your referral earnings</p>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 mb-8">
                  <div className="text-center">
                    <p className="text-gray-300 mb-2">Available Balance</p>
                    <h4 className="text-4xl font-bold text-indigo-400 mb-4">
                      ₦{mockStats.walletBalance.toLocaleString()}
                    </h4>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleWithdraw}
                      disabled={mockStats.walletBalance < 1000}
                      className={`font-semibold py-3 px-8 rounded-xl transition-all duration-300 ${
                        mockStats.walletBalance >= 1000
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <CurrencyDollarIcon className="w-5 h-5 mr-2 inline" />
                      Withdraw to Main Wallet
                    </motion.button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-400">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h5 className="font-semibold text-white mb-2">Withdrawal Rules</h5>
                    <ul className="space-y-1">
                      <li>• Minimum ₦1,000</li>
                      <li>• Once every 7 days</li>
                      <li>• Instant transfer</li>
                    </ul>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h5 className="font-semibold text-white mb-2">Next Features</h5>
                    <ul className="space-y-1">
                      <li>• Auto-withdrawal</li>
                      <li>• Direct bank transfer</li>
                      <li>• Earning history</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </>
      ) : (
        /* Login Prompt */
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12"
            >
              <GiftIcon className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">Login to Track Referrals</h3>
              <p className="text-gray-400 mb-8">Sign in to access your referral dashboard, track earnings, and manage your referral network.</p>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold">
                Login to Continue
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Referral Leaderboard */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
                Top Referrers
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              See who's leading the referral game this week
            </p>
            
            {/* Toggle */}
            <div className="inline-flex bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
              <button
                onClick={() => setLeaderboardView('week')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  leaderboardView === 'week'
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setLeaderboardView('alltime')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  leaderboardView === 'alltime'
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All Time
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden"
          >
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-gray-700/50 px-8 py-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-300">
                  <div>Rank</div>
                  <div>Username</div>
                  <div>Referrals</div>
                  <div>Earnings</div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-700/50">
                {mockLeaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.username}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`grid grid-cols-4 gap-4 px-8 py-6 hover:bg-gray-700/20 transition-all duration-300 ${
                      entry.isCurrentUser ? 'bg-indigo-500/5 border-l-4 border-indigo-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {entry.rank <= 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          entry.rank === 1 ? 'bg-yellow-500' :
                          entry.rank === 2 ? 'bg-gray-400' :
                          'bg-orange-500'
                        }`}>
                          <TrophySolid className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {entry.rank}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{entry.username}</span>
                      {entry.isCurrentUser && (
                        <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    
                    <div className="text-white font-semibold">{entry.referrals}</div>
                    <div className="text-indigo-400 font-bold">₦{entry.earnings.toLocaleString()}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Mobile Cards */}
            <div className="lg:hidden p-6 space-y-4">
              {mockLeaderboard.slice(0, 5).map((entry, index) => (
                <motion.div
                  key={entry.username}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-gray-700/30 rounded-xl p-4 ${
                    entry.isCurrentUser ? 'border-2 border-indigo-500' : 'border border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {entry.rank <= 3 ? (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          entry.rank === 1 ? 'bg-yellow-500' :
                          entry.rank === 2 ? 'bg-gray-400' :
                          'bg-orange-500'
                        }`}>
                          <TrophySolid className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white">
                          {entry.rank}
                        </div>
                      )}
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{entry.username}</span>
                          {entry.isCurrentUser && (
                            <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{entry.referrals} referrals</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-indigo-400 font-bold text-lg">₦{entry.earnings.toLocaleString()}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about our referral program
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/20 transition-all duration-300"
                >
                  <span className="font-semibold text-white text-lg">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-700/50"
                    >
                      <div className="px-6 py-4 text-gray-300 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => copyToClipboard(referralLink)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-indigo-500/25 hover:shadow-2xl transition-all duration-300"
        >
          {copied ? (
            <CheckIcon className="w-6 h-6" />
          ) : (
            <ShareIcon className="w-6 h-6" />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ReferralProgram;