import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  LinkIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  BanknotesIcon,
  UsersIcon,
  TrophyIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';

interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}

interface Referral {
  id: string;
  username: string;
  joinDate: string;
  status: 'pending' | 'completed';
  earnings: number;
  firstPurchase?: string;
}

const mockStats: ReferralStats = {
  totalReferrals: 8,
  completedReferrals: 5,
  totalEarnings: 3500,
  pendingEarnings: 1500
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
    status: 'completed',
    earnings: 500,
    firstPurchase: 'June 13, 2024'
  },
  {
    id: 'REF-004',
    username: '@newuser1',
    joinDate: 'June 20, 2024',
    status: 'pending',
    earnings: 0
  },
  {
    id: 'REF-005',
    username: '@gamer456',
    joinDate: 'June 19, 2024',
    status: 'pending',
    earnings: 0
  }
];

const BuyerReferral: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const referralLink = 'https://gametrust.ng/ref/blunt123';
  const referralCode = 'BLUNT123';
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareOnWhatsApp = () => {
    const message = `🎮 Join GameTrust - Nigeria's most trusted gaming marketplace! Use my referral link and we both earn ₦500! ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  const shareOnTwitter = () => {
    const message = `🎮 Join GameTrust - Nigeria's most trusted gaming marketplace! Use my referral link and we both earn ₦500! ${referralLink} #GameTrust #Gaming`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Referral Program</h1>
          <p className="text-gray-400 mt-1">Invite friends and earn ₦500 for each successful referral</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowShareModal(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          <ShareIcon className="w-5 h-5 mr-2" />
          Share & Earn
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            {mockStats.totalReferrals}
          </h3>
          <p className="text-sm text-gray-300">Total Referrals</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            {mockStats.completedReferrals}
          </h3>
          <p className="text-sm text-gray-300">Completed</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            ₦{mockStats.totalEarnings.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-300">Total Earnings</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            ₦{mockStats.pendingEarnings.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-300">Pending</p>
        </motion.div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Referral Link</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Referral Link</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 flex items-center bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3">
                <LinkIcon className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-white font-mono text-sm truncate">{referralLink}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(referralLink)}
                className="flex items-center space-x-2"
              >
                {copied ? (
                  <CheckIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <ClipboardDocumentIcon className="w-5 h-5" />
                )}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Referral Code</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 flex items-center bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3">
                <span className="text-white font-mono text-lg font-bold">{referralCode}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(referralCode)}
                className="flex items-center space-x-2"
              >
                {copied ? (
                  <CheckIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <ClipboardDocumentIcon className="w-5 h-5" />
                )}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            onClick={shareOnWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Share on WhatsApp
          </Button>
          
          <Button
            variant="primary"
            onClick={shareOnTwitter}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Share on Twitter
          </Button>
        </div>
      </div>

      {/* Referral History */}
      <div className="flex-1 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Referral History</h2>
          <Button
            variant="outline"
            onClick={() => window.open('/referral-program', '_blank')}
            className="flex items-center space-x-2"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            <span>View Program Details</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockReferrals.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <UserGroupIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No referrals yet</h3>
                <p className="text-gray-500">Start sharing your referral link to earn rewards</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {mockReferrals.map((referral) => (
                <motion.div
                  key={referral.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      referral.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      <UsersIcon className="w-5 h-5" />
                    </div>
                    
                    <div>
                      <p className="font-medium text-white">{referral.username}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-400">Joined: {referral.joinDate}</span>
                        {referral.firstPurchase && (
                          <span className="text-sm text-gray-500">• First purchase: {referral.firstPurchase}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      referral.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {referral.status === 'completed' ? 'Completed' : 'Pending'}
                    </div>
                    <p className={`font-semibold mt-1 ${
                      referral.earnings > 0 ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {referral.earnings > 0 ? `+₦${referral.earnings}` : '₦0'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How It Works Info */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-3">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
            <div>
              <p className="font-medium text-white">Share Your Link</p>
              <p>Send your referral link to friends via WhatsApp, Twitter, or any platform</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
            <div>
              <p className="font-medium text-white">Friend Joins & Buys</p>
              <p>Your friend signs up using your link and makes their first purchase</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
            <div>
              <p className="font-medium text-white">You Both Earn</p>
              <p>You get ₦500 and your friend gets ₦500 credit to their wallet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerReferral;