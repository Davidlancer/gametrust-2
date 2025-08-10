import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  KeyIcon,
  ShieldCheckIcon,
  BellIcon,
  LinkIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  CameraIcon,
  CreditCardIcon,
  StarIcon,
  TrophyIcon,
  BoltIcon,
  ClockIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  BanknotesIcon,
  WalletIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  TrophyIcon as TrophyIconSolid
} from '@heroicons/react/24/solid';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface NotificationSettings {
  emailNotifications: {
    newOrders: boolean;
    paymentReceived: boolean;
    disputes: boolean;
    reviews: boolean;
    promotions: boolean;
    securityAlerts: boolean;
  };
  pushNotifications: {
    newOrders: boolean;
    paymentReceived: boolean;
    disputes: boolean;
    reviews: boolean;
    securityAlerts: boolean;
  };
  smsNotifications: {
    criticalAlerts: boolean;
    paymentConfirmations: boolean;
  };
}

interface SocialAccounts {
  discord?: string;
  telegram?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  twitch?: string;
}

interface PaymentAccount {
  id: string;
  type: 'bank' | 'paypal' | 'crypto' | 'wallet';
  name: string;
  identifier: string;
  isVerified: boolean;
  isPrimary: boolean;
  lastUsed?: string;
}

interface SellerProfile {
  displayName: string;
  sellerAlias: string;
  bio: string;
  avatar: string;
  bannerImage: string;
  email: string;
  phone: string;
  website?: string;
  businessName?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  is2FAEnabled: boolean;
  socialAccounts: SocialAccounts;
  notificationSettings: NotificationSettings;
  paymentAccounts: PaymentAccount[];
  trustLevel: number;
  totalSales: number;
  responseTime: number;
  isStoreVisible: boolean;
  autoDisplayTrustBadge: boolean;
  theme: 'dark' | 'light' | 'auto';
  profileVisibility?: boolean;
  autoPayouts?: boolean;
}

const mockProfile: SellerProfile = {
  displayName: 'Blunt',
  sellerAlias: 'BluntGaming',
  bio: 'Professional gaming account seller with 3+ years of experience. Specializing in CODM, PUBG Mobile, and Free Fire accounts. All accounts are hand-leveled and come with full ownership transfer.',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=200&fit=crop',
  email: 'blunt@gametrust.com',
  phone: '+234 801 234 5678',
  isEmailVerified: true,
  isPhoneVerified: false,
  is2FAEnabled: false,
  socialAccounts: {
    discord: 'Blunt#1234',
    telegram: '@blunt_seller',
    twitch: 'bluntgaming'
  },
  notificationSettings: {
    emailNotifications: {
      newOrders: true,
      paymentReceived: true,
      disputes: true,
      reviews: true,
      promotions: false,
      securityAlerts: true
    },
    pushNotifications: {
      newOrders: true,
      paymentReceived: true,
      disputes: true,
      reviews: false,
      securityAlerts: true
    },
    smsNotifications: {
      criticalAlerts: true,
      paymentConfirmations: false
    }
  },
  paymentAccounts: [
    {
      id: '1',
      type: 'bank',
      name: 'Chase Bank',
      identifier: '****1234',
      isVerified: true,
      isPrimary: true,
      lastUsed: '2024-01-15'
    },
    {
      id: '2',
      type: 'paypal',
      name: 'PayPal',
      identifier: 'blunt@gametrust.com',
      isVerified: true,
      isPrimary: false,
      lastUsed: '2024-01-10'
    },
    {
      id: '3',
      type: 'crypto',
      name: 'Bitcoin Wallet',
      identifier: '1A1z...Nx7B',
      isVerified: true,
      isPrimary: false,
      lastUsed: '2024-01-05'
    }
  ],
  trustLevel: 85,
  totalSales: 247,
  responseTime: 12,
  isStoreVisible: true,
  autoDisplayTrustBadge: true,
  theme: 'dark'
};

const Settings: React.FC = () => {
  const [profile, setProfile] = useState<SellerProfile>(() => {
    return {
      ...mockProfile,
      notificationSettings: JSON.parse(JSON.stringify(mockProfile.notificationSettings))
    };
  });
  const [activeSection, setActiveSection] = useState('overview');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSecurityTips, setShowSecurityTips] = useState(true);

  // Refs for each section
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [editForm] = useState({
    displayName: mockProfile.displayName,
    sellerAlias: mockProfile.sellerAlias,
    email: mockProfile.email,
    phone: mockProfile.phone,
    bio: mockProfile.bio
  });

  useEffect(() => {
    const hasChanges = JSON.stringify(editForm) !== JSON.stringify({
      displayName: profile.displayName,
      sellerAlias: profile.sellerAlias,
      email: profile.email,
      phone: profile.phone,
      bio: profile.bio
    });
    setHasUnsavedChanges(hasChanges);
  }, [editForm, profile]);

  const sections = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon, description: 'Dashboard & Stats' },
    { id: 'account', label: 'Account Info', icon: UserIcon, description: 'Profile & Identity' },
    { id: 'security', label: 'Security & 2FA', icon: ShieldCheckIcon, description: 'Protection & Access' },
    { id: 'payments', label: 'Payment & Payouts', icon: CreditCardIcon, description: 'Banking & Wallets' },
    { id: 'notifications', label: 'Notifications', icon: BellIcon, description: 'Alerts & Updates' },
    { id: 'visibility', label: 'Seller Visibility', icon: EyeIcon, description: 'Store & Trust Settings' },
    { id: 'integrations', label: 'Connected Apps', icon: LinkIcon, description: 'Social & Platforms' },
    { id: 'privacy', label: 'Privacy & Data', icon: ExclamationTriangleIcon, description: 'Data & Account Management' }
  ];

  const getTrustLevelInfo = (level: number) => {
    if (level >= 90) return { label: 'Arena Pro', color: 'from-yellow-400 to-orange-500' };
    if (level >= 75) return { label: 'Power Seller', color: 'from-[#00FFB2] to-[#00A8E8]' };
    if (level >= 50) return { label: 'Verified Seller', color: 'from-blue-400 to-purple-500' };
    return { label: 'New Seller', color: 'from-gray-400 to-gray-600' };
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleTestNotification = () => {
    alert('Test notification sent!');
  };

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
    setActiveSection(sectionId);
  };

  const handleExportData = () => {
    alert('Data export initiated. You will receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    alert('Account deletion process initiated. You will receive a confirmation email.');
  };



  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'bank': return BanknotesIcon;
      case 'paypal': return CreditCardIcon;
      case 'crypto': return WalletIcon;
      case 'wallet': return WalletIcon;
      default: return CreditCardIcon;
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setIsUploading(false);
    }
  };

  const handleNotificationChange = (category: keyof NotificationSettings, setting: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [category]: {
          ...prev.notificationSettings[category],
          [setting]: value
        }
      }
    }));
  };

  const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-7 w-12 items-center rounded-full 
        transition-colors duration-200 focus:outline-none 
        focus:ring-2 focus:ring-[#00FFB2] focus:ring-offset-2 focus:ring-offset-gray-900
        min-h-[44px] min-w-[44px] flex items-center justify-center
        md:min-h-0 md:min-w-0
        ${
          checked ? 'bg-[#00FFB2]' : 'bg-gray-600'
        }
      `}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white 
          shadow-lg transition-transform duration-200
          ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }
        `}
      />
    </button>
  );

  const renderOverviewSection = () => {
    const trustInfo = getTrustLevelInfo(profile.trustLevel);
    
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-[#00FFB2]/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Elite Seller Dashboard</h2>
              <p className="text-gray-400">Your command center performance metrics</p>
            </div>
            <div className="relative">
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#00FFB2]/50"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] rounded-full flex items-center justify-center">
                <TrophyIconSolid className="w-3 h-3 text-black" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#00FFB2]/20 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="w-5 h-5 text-[#00FFB2]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{profile.totalSales}</p>
                  <p className="text-gray-400 text-sm">Total Sales</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{profile.responseTime}m</p>
                  <p className="text-gray-400 text-sm">Avg Response</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <StarIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4.9</p>
                  <p className="text-gray-400 text-sm">Rating</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <BoltIcon className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{trustInfo.label}</p>
                  <p className="text-gray-400 text-sm">Trust Level</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Trust Level Progress</span>
              <span className="text-[#00FFB2] font-bold">{profile.trustLevel}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${trustInfo.color}`}
                style={{ width: `${profile.trustLevel}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>New Seller</span>
              <span>Arena Pro</span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderAccountSection = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <PhotoIcon className="w-5 h-5 mr-2 text-[#00FFB2]" />
          Profile Media
        </h3>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover ring-2 ring-[#00FFB2]/50"
            />
            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#00FFB2] rounded-full flex items-center justify-center hover:bg-[#00FFB2]/80 transition-colors cursor-pointer">
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <CameraIcon className="w-4 h-4 text-black" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium mb-1">Profile Picture</h4>
            <p className="text-gray-400 text-sm mb-3">Upload a high-quality image for your profile</p>
            <label className="inline-block cursor-pointer">
               <span className="inline-flex items-center px-3 py-1.5 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FFB2] disabled:opacity-50 transition-colors">
                 {isUploading ? 'Uploading...' : 'Change Avatar'}
               </span>
               <input
                 type="file"
                 accept="image/*"
                 onChange={handleAvatarUpload}
                 className="hidden"
                 disabled={isUploading}
               />
             </label>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <UserIcon className="w-5 h-5 mr-2 text-[#00FFB2]" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Seller Alias</label>
            <input
              type="text"
              value={profile.sellerAlias}
              onChange={(e) => setProfile(prev => ({ ...prev, sellerAlias: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent transition-all resize-none"
            placeholder="Tell buyers about your gaming expertise and what makes you trustworthy..."
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSave()}
          disabled={saveStatus === 'saving'}
          className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black font-medium"
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-[#00FFB2]/20">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <KeyIcon className="w-6 h-6 mr-3 text-[#00FFB2]" />
          Password Management
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-[#00FFB2] pr-12 transition-all duration-300"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00FFB2] transition-colors"
              >
                {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-[#00FFB2] pr-12 transition-all duration-300"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00FFB2] transition-colors"
              >
                {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-[#00FFB2] pr-12 transition-all duration-300"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00FFB2] transition-colors"
              >
                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <Button
              variant="primary"
              onClick={() => {
                 setSaveStatus('saving');
                 setTimeout(() => {
                   setSaveStatus('saved');
                   setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                   setTimeout(() => setSaveStatus('idle'), 2000);
                 }, 1000);
               }}
              className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black font-medium"
            >
              {saveStatus === 'saving' ? 'Updating...' : 'Update Password'}
            </Button>
            <Button variant="ghost" className="hover:bg-gray-800/50">
              Cancel
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-[#00FFB2]/20">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <ShieldCheckIcon className="w-6 h-6 mr-3 text-[#00FFB2]" />
          Two-Factor Authentication
        </h3>
        
        <div className="flex items-center justify-between p-6 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-[#00FFB2]/30 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300 ${
              profile.is2FAEnabled ? 'bg-green-500/20 ring-2 ring-green-500/30' : 'bg-gray-600/20'
            }`}>
              <ShieldCheckIcon className={`w-7 h-7 ${
                profile.is2FAEnabled ? 'text-green-400' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <h4 className="text-white font-medium text-lg">Authenticator App</h4>
              <p className="text-gray-400 text-sm">
                {profile.is2FAEnabled ? 'Two-factor authentication is enabled' : 'Add an extra layer of security'}
              </p>
            </div>
          </div>
          
          <Button
            variant={profile.is2FAEnabled ? "ghost" : "primary"}
            onClick={() => {
              setProfile(prev => ({ ...prev, is2FAEnabled: !prev.is2FAEnabled }));
            }}
            className={profile.is2FAEnabled ? 'hover:bg-red-500/10 hover:text-red-400' : 'bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black font-medium'}
          >
            {profile.is2FAEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
        
        <AnimatePresence>
          {profile.is2FAEnabled && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <CheckCircleIconSolid className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Your account is protected with 2FA</p>
                  <p className="text-green-400/70 text-sm">Backup codes and QR setup available</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Security Tips */}
      <AnimatePresence>
        {showSecurityTips && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Security Tips</h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• Use a strong, unique password</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Never share your login credentials</li>
                      <li>• Regularly review account activity</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => setShowSecurityTips(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderNotificationsSection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-[#00FFB2]/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <EnvelopeIcon className="w-6 h-6 mr-3 text-[#00FFB2]" />
            Email Notifications
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestNotification}
            className="border-[#00FFB2]/30 text-[#00FFB2] hover:bg-[#00FFB2]/10"
          >
            Test Email
          </Button>
        </div>
        
        <div className="space-y-4">
          {Object.entries(profile.notificationSettings.emailNotifications).map(([key, value], index) => (
            <motion.div 
              key={key} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-4 px-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-[#00FFB2]/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#00FFB2]/20 rounded-lg flex items-center justify-center">
                  <BellIcon className="w-6 h-6 text-[#00FFB2]" />
                </div>
                <div>
                  <h4 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                  <p className="text-gray-400 text-sm">Get notified about {key.toLowerCase()}</p>
                </div>
              </div>
              <ToggleSwitch
                checked={value}
                onChange={(checked) => handleNotificationChange('emailNotifications', key, checked)}
              />
            </motion.div>
          ))}
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-[#00FFB2]/20">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <DevicePhoneMobileIcon className="w-6 h-6 mr-3 text-[#00FFB2]" />
          Push Notifications
        </h3>
        
        <div className="space-y-4">
          {Object.entries(profile.notificationSettings.pushNotifications).map(([key, value], index) => (
            <motion.div 
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-4 px-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-[#00FFB2]/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#00FFB2]/20 rounded-lg flex items-center justify-center">
                  <BellIcon className="w-6 h-6 text-[#00FFB2]" />
                </div>
                <div>
                  <h4 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                  <p className="text-gray-400 text-sm">Push notifications for {key.toLowerCase()}</p>
                </div>
              </div>
              <ToggleSwitch
                checked={value}
                onChange={(checked) => handleNotificationChange('pushNotifications', key, checked)}
              />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* SMS Notifications */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-[#00FFB2]/20">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <DevicePhoneMobileIcon className="w-6 h-6 mr-3 text-[#00FFB2]" />
          SMS Notifications
        </h3>
        
        <div className="space-y-4">
          {Object.entries(profile.notificationSettings.smsNotifications).map(([key, value], index) => (
            <motion.div 
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-4 px-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-[#00FFB2]/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#00FFB2]/20 rounded-lg flex items-center justify-center">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-[#00FFB2]" />
                </div>
                <div>
                  <h4 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                  <p className="text-gray-400 text-sm">SMS alerts for {key.toLowerCase()}</p>
                </div>
              </div>
              <ToggleSwitch
                checked={value}
                onChange={(checked) => handleNotificationChange('smsNotifications', key, checked)}
              />
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );

  const renderPaymentsSection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Payout Methods */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-[#00FFB2]/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
              <CreditCardIcon className="w-6 h-6 mr-3 text-[#00FFB2]" />
              Payout & Wallet Preferences
            </h3>
            <p className="text-gray-400">Manage your payout methods and wallet settings</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            <CreditCardIcon className="w-4 h-4 mr-2" />
            Add Method
          </motion.button>
        </div>

        <div className="space-y-4">
          {profile.paymentAccounts.map((account, index) => {
            const IconComponent = getPaymentIcon(account.type);
            return (
              <motion.div 
                key={account.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-[#00FFB2]/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#00FFB2]/20 rounded-lg flex items-center justify-center shadow-lg">
                    <IconComponent className="w-6 h-6 text-[#00FFB2]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{account.name}</h4>
                    <p className="text-gray-400 text-sm">{account.identifier}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {account.isPrimary && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#00FFB2]/20 text-[#00FFB2]">
                          Primary
                        </span>
                      )}
                      {account.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          <CheckCircleIconSolid className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                      <span className="text-xs text-gray-500">Last used: {account.lastUsed}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="hover:bg-[#00FFB2]/10">
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-red-500/10 hover:text-red-400">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Auto Payout Toggle */}
        <div className="mt-6 p-4 bg-gradient-to-r from-[#00FFB2]/10 to-[#00A8E8]/10 rounded-lg border border-[#00FFB2]/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Auto-Payouts</h4>
              <p className="text-sm text-gray-400">Automatically transfer earnings to your primary account</p>
            </div>
            <ToggleSwitch
              checked={profile.autoDisplayTrustBadge}
              onChange={(checked) => setProfile(prev => ({ ...prev, autoDisplayTrustBadge: checked }))}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full border-[#00FFB2]/30 text-[#00FFB2] hover:bg-[#00FFB2]/10"
          >
            Add Payment Method
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  const renderVisibilitySection = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <EyeIcon className="w-5 h-5 mr-2 text-[#00FFB2]" />
          Store Visibility
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00FFB2]/20 rounded-lg flex items-center justify-center">
                <GlobeAltIcon className="w-5 h-5 text-[#00FFB2]" />
              </div>
              <div>
                <h4 className="text-white font-medium">Store Visibility</h4>
                <p className="text-gray-400 text-sm">Make your store visible to buyers</p>
              </div>
            </div>
            <ToggleSwitch
              checked={profile.isStoreVisible}
              onChange={(checked) => setProfile(prev => ({ ...prev, isStoreVisible: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00FFB2]/20 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-5 h-5 text-[#00FFB2]" />
              </div>
              <div>
                <h4 className="text-white font-medium">Auto Display Trust Badge</h4>
                <p className="text-gray-400 text-sm">Automatically show trust level on listings</p>
              </div>
            </div>
            <ToggleSwitch
              checked={profile.autoDisplayTrustBadge}
              onChange={(checked) => setProfile(prev => ({ ...prev, autoDisplayTrustBadge: checked }))}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderIntegrationsSection = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <LinkIcon className="w-5 h-5 mr-2 text-[#00FFB2]" />
          Social Accounts
        </h3>
        
        <div className="space-y-4">
          {Object.entries(profile.socialAccounts).map(([platform, handle]) => (
            <div key={platform} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#00FFB2]/20 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-[#00FFB2]" />
                </div>
                <div>
                  <h4 className="text-white font-medium capitalize">{platform}</h4>
                  <p className="text-gray-400 text-sm">{handle || 'Not connected'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {handle ? 'Update' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderPrivacySection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Privacy Settings */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-[#00FFB2]/20">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <EyeIcon className="w-6 h-6 mr-3 text-[#00FFB2]" />
          Privacy & Data
        </h3>
        
        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-[#00FFB2]/30 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#00FFB2]/20 rounded-lg flex items-center justify-center">
                <GlobeAltIcon className="w-6 h-6 text-[#00FFB2]" />
              </div>
              <div>
                <h4 className="font-medium text-white">Profile Visibility</h4>
                <p className="text-sm text-gray-400">Make your profile visible to buyers</p>
              </div>
            </div>
            <ToggleSwitch
              checked={profile.isStoreVisible}
              onChange={(checked) => setProfile(prev => ({ ...prev, isStoreVisible: checked }))}
            />
          </div>

          {/* Data Export */}
          <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <DocumentArrowDownIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Export Account Data</h4>
                  <p className="text-sm text-blue-300">Download a copy of your account data</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportData}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Export Data
              </motion.button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 bg-gradient-to-r from-red-900/20 to-pink-900/20 rounded-lg border border-red-500/30">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white mb-2">Danger Zone</h4>
                <p className="text-sm text-red-300 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Delete Account
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account, security, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-[#00FFB2]/20">
              <div className="p-6 bg-gradient-to-r from-[#00FFB2]/10 to-[#00A8E8]/10 border-b border-[#00FFB2]/20">
                <h2 className="text-lg font-semibold text-white">Settings Menu</h2>
                <p className="text-gray-400 text-sm mt-1">Customize your experience</p>
              </div>
              <div className="p-2">
                {sections.map((section, index) => {
                  const IconComponent = section.icon;
                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-300 mb-2 group ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-[#00FFB2]/20 to-[#00A8E8]/20 border border-[#00FFB2]/30 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-[#00FFB2]/20 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          activeSection === section.id 
                            ? 'bg-[#00FFB2]/20' 
                            : 'bg-gray-700/50 group-hover:bg-[#00FFB2]/10'
                        }`}>
                          <IconComponent className={`w-5 h-5 transition-all duration-300 ${
                            activeSection === section.id ? 'text-[#00FFB2]' : 'text-gray-400 group-hover:text-[#00FFB2]'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{section.label}</div>
                          <div className="text-xs text-gray-400">{section.description}</div>
                        </div>
                        {activeSection === section.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-[#00FFB2] rounded-full"
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Section */}
            <div ref={(el) => (sectionRefs.current['overview'] = el)} id="overview-section">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderOverviewSection()}
              </motion.div>
            </div>

            {/* Account Section */}
            <div ref={(el) => (sectionRefs.current['account'] = el)} id="account-section">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {renderAccountSection()}
              </motion.div>
            </div>

            {/* Security Section */}
            <div ref={(el) => (sectionRefs.current['security'] = el)} id="security-section">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {renderSecuritySection()}
              </motion.div>
            </div>

            {/* Payments Section */}
            <div ref={(el) => (sectionRefs.current['payments'] = el)} id="payments-section">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {renderPaymentsSection()}
              </motion.div>
            </div>

            {/* Notifications Section */}
            <div ref={(el) => (sectionRefs.current['notifications'] = el)} id="notifications-section">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {renderNotificationsSection()}
              </motion.div>
            </div>

            {/* Visibility Section */}
            <div ref={(el) => (sectionRefs.current['visibility'] = el)} id="visibility-section">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                {renderVisibilitySection()}
              </motion.div>
            </div>

            {/* Integrations Section */}
            <div ref={(el) => (sectionRefs.current['integrations'] = el)} id="integrations-section">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                {renderIntegrationsSection()}
              </motion.div>
            </div>

            {/* Privacy Section */}
            <div ref={(el) => (sectionRefs.current['privacy'] = el)} id="privacy-section">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                {renderPrivacySection()}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Sticky Save Button */}
        <AnimatePresence>
          {hasUnsavedChanges && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <div className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] p-4 rounded-xl shadow-2xl border border-[#00FFB2]/30">
                <div className="flex items-center space-x-4">
                  <div className="text-black">
                    <p className="font-medium">Unsaved Changes</p>
                    <p className="text-sm opacity-80">Don't forget to save your settings</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHasUnsavedChanges(false)}
                      className="text-black hover:bg-black/10"
                    >
                      Discard
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSave}
                      disabled={saveStatus === 'saving'}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;