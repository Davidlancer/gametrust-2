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
  SparklesIcon,
  StarIcon,
  GiftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QrCodeIcon,
  PlusIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import { useToast } from '../UI/ToastProvider';

interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  currentLevel: string;
  nextLevel: string;
  progressToNext: number;
  referralsToNext: number;
}

interface Referral {
  id: string;
  username: string;
  joinDate: string;
  status: 'pending' | 'signed_up' | 'first_purchase' | 'completed';
  earnings: number;
  firstPurchase?: string;
}

const mockStats: ReferralStats = {
  totalReferrals: 12,
  completedReferrals: 6,
  totalEarnings: 3000,
  pendingEarnings: 500,
  currentLevel: 'Silver',
  nextLevel: 'Gold',
  progressToNext: 60,
  referralsToNext: 3
};

const mockReferrals: Referral[] = [
  {
    id: 'REF-001',
    username: '@gamerboy23',
    joinDate: 'June 18, 2024',
    status: 'completed',
    earnings: 500,
    firstPurchase: 'June 19, 2024'
  },
  {
    id: 'REF-002',
    username: '@codmmaster',
    joinDate: 'June 15, 2024',
    status: 'completed',
    earnings: 500,
    firstPurchase: 'June 16, 2024'
  },
  {
    id: 'REF-003',
    username: '@pubgpro',
    joinDate: 'June 12, 2024',
    status: 'first_purchase',
    earnings: 500,
    firstPurchase: 'June 13, 2024'
  },
  {
    id: 'REF-004',
    username: '@firemaster',
    joinDate: 'June 10, 2024',
    status: 'signed_up',
    earnings: 0
  },
  {
    id: 'REF-005',
    username: '@elitegamer',
    joinDate: 'June 8, 2024',
    status: 'pending',
    earnings: 0
  }
];

const getBadgeInfo = (level: string) => {
  const badges = {
    Bronze: { color: 'from-orange-600 to-yellow-600', icon: TrophyIcon, textColor: 'text-orange-400' },
    Silver: { color: 'from-gray-400 to-gray-600', icon: StarIcon, textColor: 'text-gray-300' },
    Gold: { color: 'from-yellow-400 to-yellow-600', icon: TrophyIcon, textColor: 'text-yellow-400' },
    Platinum: { color: 'from-purple-400 to-pink-600', icon: SparklesIcon, textColor: 'text-purple-400' }
  };
  return badges[level as keyof typeof badges] || badges.Bronze;
};



const getStatusInfo = (status: string) => {
  const statuses = {
    pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400', icon: '⏳' },
    signed_up: { label: 'Signed Up', color: 'bg-blue-500/20 text-blue-400', icon: '✅' },
    first_purchase: { label: 'Made Purchase', color: 'bg-green-500/20 text-green-400', icon: '🛒' },
    completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400', icon: '💰' }
  };
  return statuses[status as keyof typeof statuses] || statuses.pending;
};

interface BuyerReferralProps {
  onNavigate?: (page: string) => void;
}

const BuyerReferral: React.FC<BuyerReferralProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [expandedReferral, setExpandedReferral] = useState<string | null>(null);
  const [animatedStats, setAnimatedStats] = useState({ referrals: 0, earnings: 0 });
  const { showSuccess } = useToast();
  
  const referralLink = 'https://gametrust.ng/ref/blunt123';
  const referralCode = 'BLUNT123';
  
  // Animate counters on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({
        referrals: mockStats.totalReferrals,
        earnings: mockStats.totalEarnings
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Confetti effect simulation
    const confetti = document.createElement('div');
    confetti.innerHTML = '🎉';
    confetti.style.position = 'fixed';
    confetti.style.top = '50%';
    confetti.style.left = '50%';
    confetti.style.fontSize = '2rem';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      document.body.removeChild(confetti);
    }, 1000);
    
    showSuccess(
      `${type} Copied! 🎉`, 
      `Your referral ${type.toLowerCase()} is ready to share. Spread the word and earn rewards!`
    );
  };
  
  const shareOnWhatsApp = () => {
    const message = `🎮 Join GameTrust - Nigeria's most trusted gaming marketplace! Use my referral link and we both earn ₦500! ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  const shareOnTwitter = () => {
    const message = `🎮 Join GameTrust and level up your gaming! Use my referral link and we both earn ₦500! ${referralLink} #GameTrust #Gaming #ReferralRewards`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareOnInstagram = () => {
    // Copy link for Instagram sharing
    copyToClipboard(referralLink, 'Link');
    showSuccess('Link copied for Instagram!', 'Paste this link in your Instagram story or DM');
  };

  const badgeInfo = getBadgeInfo(mockStats.currentLevel);
  const BadgeIcon = badgeInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="p-4 space-y-4 pb-24">
          {/* Referral Card - Top Priority */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center"
              >
                <ShareIcon className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Referral Portal</h2>
              <p className="text-indigo-200 text-sm">Share with friends and earn rewards! 🚀</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">Referral Code</label>
                <div className="flex items-center bg-black/20 border border-indigo-400/30 rounded-xl p-4">
                  <span className="flex-1 text-white font-mono text-xl font-bold tracking-wider">{referralCode}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(referralCode, 'Code')}
                    className="ml-3 p-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <CheckIcon className="w-5 h-5 text-white" />
                    ) : (
                      <ClipboardDocumentIcon className="w-5 h-5 text-white" />
                    )}
                
                {/* Leaderboard Section */}
                <AnimatePresence>
                  {showLeaderboard && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-700/50 p-6 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"
                    >
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <TrophyIcon className="w-5 h-5 text-yellow-400 mr-2" />
                        Top Referrers This Month
                      </h4>
                      <div className="space-y-3">
                        {[
                          { rank: 1, username: '@gamingking', referrals: 15, earnings: 7500, badge: '👑' },
                          { rank: 2, username: '@codmaster', referrals: 12, earnings: 6000, badge: '🥈' },
                          { rank: 3, username: '@pubgpro', referrals: 10, earnings: 5000, badge: '🥉' },
                          { rank: 4, username: '@blunt123', referrals: mockStats.totalReferrals, earnings: mockStats.totalEarnings, badge: '🎮', isCurrentUser: true }
                        ].map((user) => (
                          <motion.div
                            key={user.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: user.rank * 0.1 }}
                            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                              user.isCurrentUser 
                                ? 'bg-indigo-500/20 border border-indigo-500/30 ring-2 ring-indigo-500/20' 
                                : 'bg-gray-700/30 hover:bg-gray-700/50'
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                                user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                                user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                                user.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                              }`}>
                                {user.rank <= 3 ? user.badge : user.rank}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className={`font-semibold ${
                                    user.isCurrentUser ? 'text-indigo-300' : 'text-white'
                                  }`}>
                                    {user.username}
                                  </p>
                                  {user.isCurrentUser && (
                                    <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-medium rounded-full">
                                      You
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400">
                                  {user.referrals} referrals • ₦{user.earnings.toLocaleString()} earned
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${
                                user.rank === 1 ? 'text-yellow-400' :
                                user.rank === 2 ? 'text-gray-300' :
                                user.rank === 3 ? 'text-orange-400' :
                                'text-indigo-400'
                              }`}>
                                #{user.rank}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-indigo-300 font-medium">Your Goal</p>
                            <p className="text-white font-semibold">Reach Top 3 this month</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Need {10 - mockStats.totalReferrals + 1} more</p>
                            <p className="text-indigo-400 font-semibold">referrals</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                  </motion.button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">Referral Link</label>
                <div className="flex items-center bg-black/20 border border-indigo-400/30 rounded-xl p-4">
                  <LinkIcon className="w-5 h-5 text-indigo-300 mr-3 flex-shrink-0" />
                  <span className="flex-1 text-white font-mono text-sm truncate">{referralLink}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(referralLink, 'Link')}
                    className="ml-3 p-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <CheckIcon className="w-5 h-5 text-white" />
                    ) : (
                      <ClipboardDocumentIcon className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Quick Share Buttons */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareOnWhatsApp}
                className="flex flex-col items-center p-3 bg-green-600/20 border border-green-500/30 rounded-xl hover:bg-green-600/30 transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <span className="text-xs text-green-300 font-medium">WhatsApp</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareOnTwitter}
                className="flex flex-col items-center p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <span className="text-xs text-blue-300 font-medium">Twitter</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareOnInstagram}
                className="flex flex-col items-center p-3 bg-pink-600/20 border border-pink-500/30 rounded-xl hover:bg-pink-600/30 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="text-xs text-pink-300 font-medium">Instagram</span>
              </motion.button>
            </div>
          </motion.div>
          
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <UsersIcon className="w-8 h-8 text-indigo-400" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-2xl font-bold text-white"
                >
                  {animatedStats.referrals}
                </motion.span>
              </div>
              <p className="text-sm text-gray-300 font-medium">Total Referrals</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <BanknotesIcon className="w-8 h-8 text-green-400" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="text-2xl font-bold text-white"
                >
                  ₦{animatedStats.earnings.toLocaleString()}
                </motion.span>
              </div>
              <p className="text-sm text-gray-300 font-medium">Total Earned</p>
            </div>
          </motion.div>
          
          {/* Gamification Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${badgeInfo.color} rounded-xl flex items-center justify-center`}>
                  <BadgeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${badgeInfo.textColor}`}>{mockStats.currentLevel} Member</h3>
                  <p className="text-sm text-gray-400">{mockStats.referralsToNext} more to {mockStats.nextLevel}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <TrophyIcon className="w-5 h-5 text-yellow-400" />
              </motion.button>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Progress to {mockStats.nextLevel}</span>
                <span className="text-indigo-400 font-medium">{mockStats.progressToNext}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mockStats.progressToNext}%` }}
                  transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Referral History - Mobile Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden"
          >
            <div className="p-4 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white">Referral History</h3>
              <p className="text-sm text-gray-400">{mockReferrals.length} referrals tracked</p>
            </div>
            
            {mockReferrals.length === 0 ? (
              <div className="p-8 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <UserGroupIcon className="w-8 h-8 text-gray-500" />
                </motion.div>
                <h4 className="text-lg font-semibold text-gray-400 mb-2">No referrals yet</h4>
                <p className="text-sm text-gray-500 mb-4">Share your link and stack rewards.</p>
                <Button variant="primary" className="bg-indigo-500 hover:bg-indigo-600">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Start Inviting
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {mockReferrals.map((referral) => {
                  const statusInfo = getStatusInfo(referral.status);
                  const isExpanded = expandedReferral === referral.id;
                  
                  return (
                    <motion.div key={referral.id} className="overflow-hidden">
                      <motion.button
                        onClick={() => setExpandedReferral(isExpanded ? null : referral.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{statusInfo.icon}</span>
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-white">{referral.username}</p>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.label}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className={`font-semibold ${referral.earnings > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                              {referral.earnings > 0 ? `+₦${referral.earnings}` : '₦0'}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </motion.button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-700/20"
                          >
                            <div className="p-4 space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-400">Joined Date:</span>
                                <span className="text-sm text-white">{referral.joinDate}</span>
                              </div>
                              {referral.firstPurchase && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-400">First Purchase:</span>
                                  <span className="text-sm text-white">{referral.firstPurchase}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-400">Referral ID:</span>
                                <span className="text-sm text-gray-300 font-mono">{referral.id}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Sticky Bottom CTA */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50"
        >
          <Button
            variant="primary"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 py-4 text-lg font-semibold"
            onClick={() => copyToClipboard(referralLink, 'Link')}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Invite More Friends
          </Button>
        </motion.div>
      </div>
      
      {/* Desktop Layout - Professional SaaS Referral Dashboard */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-10 py-8 space-y-8">
          
          {/* Top Section - Referral Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Referral Link</h2>
                <p className="text-gray-400">Share with your friends and earn rewards</p>
              </div>
              <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => alert('QR Code feature coming soon!')}
                 className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/30 transition-colors"
               >
                 <QrCodeIcon className="w-6 h-6 text-indigo-400" />
               </motion.button>
            </div>
            
            <div className="flex items-center bg-black/20 border border-gray-600/50 rounded-xl p-4">
              <LinkIcon className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0" />
              <span className="flex-1 text-white font-mono text-lg truncate">{referralLink}</span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => copyToClipboard(referralLink, 'Link')}
                className="ml-4 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors flex items-center space-x-2 font-medium"
              >
                {copied ? (
                  <CheckIcon className="w-5 h-5 text-white" />
                ) : (
                  <ClipboardDocumentIcon className="w-5 h-5 text-white" />
                )}
                <span className="text-white">{copied ? 'Copied!' : 'Copy Link'}</span>
              </motion.button>
            </div>
          </motion.div>
          
          {/* Middle Section - Performance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-6"
          >
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  <UsersIcon className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{animatedStats.referrals}</div>
              <div className="text-sm text-gray-400 font-medium">Total Referrals</div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <BanknotesIcon className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">₦{animatedStats.earnings.toLocaleString()}</div>
              <div className="text-sm text-gray-400 font-medium">Rewards Earned</div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <TrophyIcon className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{Math.round((mockStats.completedReferrals / animatedStats.referrals) * 100)}%</div>
              <div className="text-sm text-gray-400 font-medium">Conversion Rate</div>
            </motion.div>
          </motion.div>
          
          {/* Gamification Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${badgeInfo.color} rounded-xl flex items-center justify-center`}>
                  <BadgeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${badgeInfo.textColor}`}>{mockStats.currentLevel} Member</h3>
                  <p className="text-sm text-gray-400">{mockStats.referralsToNext} more referrals to unlock {mockStats.nextLevel}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-2">Progress to {mockStats.nextLevel}</div>
                <div className="w-48 bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${badgeInfo.color.replace('from-', 'bg-').split(' ')[0]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(mockStats.completedReferrals / (mockStats.completedReferrals + mockStats.referralsToNext)) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Referral History Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Referral History</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Updates</span>
                </div>
              </div>
            </div>
            
            {mockReferrals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">User</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date Joined</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Reward Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReferrals.map((referral, index) => (
                      <motion.tr
                        key={referral.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-indigo-400">{referral.username.charAt(1).toUpperCase()}</span>
                            </div>
                            <span className="text-white font-medium">{referral.username}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            referral.status === 'completed'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : referral.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : referral.status === 'signed_up'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {referral.status === 'completed' && <CheckIcon className="w-3 h-3 mr-1" />}
                            {referral.status === 'pending' && <ClockIcon className="w-3 h-3 mr-1" />}
                            {referral.status === 'signed_up' && <UserIcon className="w-3 h-3 mr-1" />}
                            {referral.status === 'first_purchase' && <TrophyIcon className="w-3 h-3 mr-1" />}
                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1).replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-sm">{referral.joinDate}</td>
                        <td className="py-4 px-6 text-right">
                          <span className={`font-bold ${
                            referral.earnings > 0 ? 'text-green-400' : 'text-gray-500'
                          }`}>
                            {referral.earnings > 0 ? `₦${referral.earnings.toLocaleString()}` : '₦0'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">No referrals yet</h4>
                <p className="text-gray-400 mb-6">Start inviting friends to see your referral history here</p>
                <Button
                  variant="primary"
                  onClick={() => copyToClipboard(referralLink, 'Link')}
                  className="bg-indigo-500 hover:bg-indigo-600"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Invite Your First Friend
                </Button>
              </div>
            )}
          </motion.div>
          
          {/* Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Maximize Your Earnings?</h3>
              <p className="text-gray-400">The more friends you invite, the more rewards you unlock. Start building your network today!</p>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8 py-4 text-lg font-semibold"
                onClick={() => copyToClipboard(referralLink, 'Link')}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Invite More Friends
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 hover:border-gray-500 px-8 py-4 text-lg"
                onClick={() => onNavigate?.('rewards')}
              >
                <GiftIcon className="w-5 h-5 mr-2" />
                View Reward Catalog
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BuyerReferral;