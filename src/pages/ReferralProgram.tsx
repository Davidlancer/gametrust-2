import React, { useState } from 'react';
import {
  LinkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  BanknotesIcon,
  UsersIcon,
  ClockIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import Button from '../components/UI/Button';

interface ReferralStats {
  totalReferrals: number;
  totalEarned: number;
  pendingRewards: number;
}

interface ReferralUser {
  id: string;
  username: string;
  dateJoined: string;
  status: 'signed_up' | 'purchased' | 'active';
  earnings: number;
}

const mockStats: ReferralStats = {
  totalReferrals: 12,
  totalEarned: 6000,
  pendingRewards: 1500
};

const mockReferrals: ReferralUser[] = [
  { id: '1', username: 'GameMaster23', dateJoined: '2024-01-15', status: 'active', earnings: 500 },
  { id: '2', username: 'ProPlayer99', dateJoined: '2024-01-10', status: 'purchased', earnings: 500 },
  { id: '3', username: 'EliteGamer', dateJoined: '2024-01-08', status: 'signed_up', earnings: 0 },
  { id: '4', username: 'CyberNinja', dateJoined: '2024-01-05', status: 'active', earnings: 500 },
  { id: '5', username: 'PixelWarrior', dateJoined: '2024-01-02', status: 'purchased', earnings: 500 }
];

const ReferralProgram: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  const referralCode = 'GAMER2024';
  const referralLink = `https://gametrust.gg/r/${referralCode}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareOnWhatsApp = () => {
    const message = `🎮 Join GameTrust and earn ₦500! Use my referral code: ${referralCode} or link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'purchased':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'signed_up':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'purchased':
        return 'Purchased';
      case 'signed_up':
        return 'Signed Up';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Referral Program
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Earn rewards by inviting friends to GameTrust
          </p>
        </div>

        {/* Referral Code Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Referral Code
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1 flex items-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3">
              <LinkIcon className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-gray-900 dark:text-white font-mono">{referralLink}</span>
            </div>
            <Button
              onClick={() => copyToClipboard(referralLink)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center space-x-2"
            >
              {copied ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5" />
              )}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
          
          {/* Share Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Button
              onClick={shareOnWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
            >
              <ShareIcon className="w-5 h-5" />
              <span>WhatsApp</span>
            </Button>
            
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
            >
              <ShareIcon className="w-5 h-5" />
              <span>Telegram</span>
            </Button>
            
            <Button
              className="bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
            >
              <ShareIcon className="w-5 h-5" />
              <span>Twitter</span>
            </Button>
          </div>
        </div>

        {/* Rewards Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockStats.totalReferrals}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Referrals</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₦{mockStats.totalEarned.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Earned</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₦{mockStats.pendingRewards.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Rewards</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShareIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">1. Share Your Link</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Copy your unique link or share directly to WhatsApp, Twitter, etc.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">2. They Sign Up & Use</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                They must complete a transaction (buy/sell) using GameTrust escrow.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BanknotesIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">3. You Get Paid</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You earn ₦500, and they get ₦250 cashback/credit.
              </p>
            </div>
          </div>
        </div>

        {/* Referral Performance Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Referrals
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {mockReferrals.map((referral) => (
                  <tr key={referral.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {referral.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(referral.dateJoined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                        getStatusBadge(referral.status)
                      }`}>
                        {getStatusText(referral.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ₦{referral.earnings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;