import React, { useState } from 'react';
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
  ChartBarIcon
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
  type: 'bank' | 'paypal' | 'crypto';
  name: string;
  identifier: string;
  isVerified: boolean;
  isPrimary: boolean;
}

interface SellerProfile {
  displayName: string;
  sellerAlias: string;
  bio: string;
  avatar: string;
  bannerImage: string;
  email: string;
  phone: string;
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
      type: 'bank',
      name: 'Chase Bank',
      identifier: '****1234',
      isVerified: true,
      isPrimary: true
    },
    {
      type: 'paypal',
      name: 'PayPal',
      identifier: 'blunt@gametrust.com',
      isVerified: true,
      isPrimary: false
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

  const sections = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon, description: 'Dashboard & Stats' },
    { id: 'account', label: 'Account Info', icon: UserIcon, description: 'Profile & Identity' },
    { id: 'security', label: 'Security & 2FA', icon: ShieldCheckIcon, description: 'Protection & Access' },
    { id: 'payments', label: 'Payment & Payouts', icon: CreditCardIcon, description: 'Banking & Wallets' },
    { id: 'notifications', label: 'Notifications', icon: BellIcon, description: 'Alerts & Updates' },
    { id: 'visibility', label: 'Seller Visibility', icon: EyeIcon, description: 'Store & Trust Settings' },
    { id: 'integrations', label: 'Connected Apps', icon: LinkIcon, description: 'Social & Platforms' }
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

  const handleAvatarUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:ring-offset-2 focus:ring-offset-gray-900 ${
        checked ? 'bg-[#00FFB2]' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
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
            <button
              onClick={handleAvatarUpload}
              disabled={isUploading}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#00FFB2] rounded-full flex items-center justify-center hover:bg-[#00FFB2]/80 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <CameraIcon className="w-4 h-4 text-black" />
              )}
            </button>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium mb-1">Profile Picture</h4>
            <p className="text-gray-400 text-sm mb-3">Upload a high-quality image for your profile</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAvatarUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Change Avatar'}
            </Button>
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
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <KeyIcon className="w-5 h-5 mr-2 text-[#00FFB2]" />
          Password Management
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent pr-12 transition-all"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent pr-12 transition-all"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent pr-12 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
              className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black"
            >
              Update Password
            </Button>
            <Button variant="ghost">
              Cancel
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ShieldCheckIcon className="w-5 h-5 mr-2 text-[#00FFB2]" />
          Two-Factor Authentication
        </h3>
        
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              profile.is2FAEnabled ? 'bg-green-500/20' : 'bg-gray-600/20'
            }`}>
              <ShieldCheckIcon className={`w-6 h-6 ${
                profile.is2FAEnabled ? 'text-green-400' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <h4 className="text-white font-medium">Authenticator App</h4>
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
            className={profile.is2FAEnabled ? '' : 'bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black'}
          >
            {profile.is2FAEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
        
        {profile.is2FAEnabled && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-green-400 text-sm">
              <CheckCircleIconSolid className="w-4 h-4" />
              <span>Your account is protected with 2FA</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <EnvelopeIcon className="w-5 h-5 mr-2 text-[#00FFB2]" />
          Email Notifications
        </h3>
        
        <div className="space-y-4">
          {Object.entries(profile.notificationSettings.emailNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#00FFB2]/20 rounded-lg flex items-center justify-center">
                  <BellIcon className="w-5 h-5 text-[#00FFB2]" />
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
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <DevicePhoneMobileIcon className="w-5 h-5 mr-2 text-[#00FFB2]" />
          Push Notifications
        </h3>
        
        <div className="space-y-4">
          {Object.entries(profile.notificationSettings.pushNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#00FFB2]/20 rounded-lg flex items-center justify-center">
                  <BellIcon className="w-5 h-5 text-[#00FFB2]" />
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
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewSection();
      case 'account':
        return renderAccountSection();
      case 'security':
        return renderSecuritySection();
      case 'notifications':
        return renderNotificationsSection();
      default:
        return (
          <Card>
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">{activeSection} Settings</h3>
              <p className="text-gray-400">This section is coming soon.</p>
            </div>
          </Card>
        );
    }
  };

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
            <Card className="p-0 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-[#00FFB2]/10 to-[#00A8E8]/10 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Settings Menu</h2>
              </div>
              <div className="p-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 mb-2 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-[#00FFB2]/20 to-[#00A8E8]/20 border border-[#00FFB2]/30 text-white'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`w-5 h-5 ${
                          activeSection === section.id ? 'text-[#00FFB2]' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium">{section.label}</div>
                          <div className="text-xs text-gray-400">{section.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderCurrentSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;