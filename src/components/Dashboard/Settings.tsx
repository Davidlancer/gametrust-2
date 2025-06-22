import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  KeyIcon,
  ShieldCheckIcon,
  BellIcon,
  LinkIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';

interface NotificationSettings {
  emailNotifications: {
    newOrders: boolean;
    paymentReceived: boolean;
    disputes: boolean;
    reviews: boolean;
    promotions: boolean;
  };
  pushNotifications: {
    newOrders: boolean;
    paymentReceived: boolean;
    disputes: boolean;
    reviews: boolean;
  };
}

interface SocialAccounts {
  discord?: string;
  telegram?: string;
  twitter?: string;
  instagram?: string;
}

interface SellerProfile {
  displayName: string;
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  is2FAEnabled: boolean;
  socialAccounts: SocialAccounts;
  notificationSettings: NotificationSettings;
}

const mockProfile: SellerProfile = {
  displayName: 'Blunt',
  bio: 'Professional gaming account seller with 3+ years of experience. Specializing in CODM, PUBG Mobile, and Free Fire accounts. All accounts are hand-leveled and come with full ownership transfer.',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  email: 'blunt@gametrust.com',
  phone: '+234 801 234 5678',
  isEmailVerified: true,
  isPhoneVerified: false,
  is2FAEnabled: false,
  socialAccounts: {
    discord: 'Blunt#1234',
    telegram: '@blunt_seller'
  },
  notificationSettings: {
    emailNotifications: {
      newOrders: true,
      paymentReceived: true,
      disputes: true,
      reviews: true,
      promotions: false
    },
    pushNotifications: {
      newOrders: true,
      paymentReceived: true,
      disputes: true,
      reviews: false
    }
  }
};

const Settings: React.FC = () => {
  const [profile, setProfile] = useState(() => {
    // Load saved profile image from localStorage
    const savedImage = localStorage.getItem('userProfileImage');
    return {
      ...mockProfile,
      avatar: savedImage || mockProfile.avatar
    };
  });
  const [activeTab, setActiveTab] = useState('profile');
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'social', label: 'Social Links', icon: LinkIcon }
  ];

  const handleProfileUpdate = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleAvatarUpload = () => {
    // Trigger the hidden file input
    const fileInput = document.getElementById('profileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgData = e.target?.result as string;
      
      // Update the profile avatar
      setProfile(prev => ({
        ...prev,
        avatar: imgData
      }));
      
      // Save to localStorage for persistence
      localStorage.setItem('userProfileImage', imgData);
      
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
    
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleNotificationChange = (category: 'emailNotifications' | 'pushNotifications', setting: string, value: boolean) => {
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

  const handleSocialAccountChange = (platform: keyof SocialAccounts, value: string) => {
    setProfile(prev => ({
      ...prev,
      socialAccounts: {
        ...prev.socialAccounts,
        [platform]: value || undefined
      }
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              id="profilePic"
              src={profile.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleAvatarUpload}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#00FFB2] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <Button
              variant="outline"
              onClick={handleAvatarUpload}
              disabled={isUploading}
            >
              <CameraIcon className="w-5 h-5 mr-2" />
              {isUploading ? 'Uploading...' : 'Change Photo'}
            </Button>
            <p className="text-gray-400 text-sm mt-2">
              JPG, PNG or GIF. Max size 2MB.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Click on the image or button to select a new photo
            </p>
          </div>
        </div>
        
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="profileUpload"
          onChange={handleProfileUpload}
        />
      </Card>

      {/* Basic Information */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent resize-none"
              placeholder="Tell buyers about yourself and your experience..."
            />
            <p className="text-gray-400 text-sm mt-1">
              {profile.bio.length}/500 characters
            </p>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {profile.isEmailVerified ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                )}
              </div>
            </div>
            {!profile.isEmailVerified && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-yellow-400 text-sm">Email not verified</p>
                <Button variant="ghost" size="sm">
                  Send Verification
                </Button>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {profile.isPhoneVerified ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                )}
              </div>
            </div>
            {!profile.isPhoneVerified && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-yellow-400 text-sm">Phone not verified</p>
                <Button variant="ghost" size="sm">
                  Verify Phone
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="flex items-center space-x-3">
        <Button
          variant="primary"
          onClick={handleProfileUpdate}
          disabled={saveStatus === 'saving'}
          className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black"
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
        </Button>
        {saveStatus === 'saved' && (
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="text-sm">Changes saved successfully</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showCurrentPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={handlePasswordChange}
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || saveStatus === 'saving'}
            className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black"
          >
            {saveStatus === 'saving' ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
            <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
          </div>
          <div className="flex items-center space-x-3">
            {profile.is2FAEnabled ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">
                <CheckCircleIcon className="w-3 h-3 mr-1" />
                Enabled
              </Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">
                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                Disabled
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <DevicePhoneMobileIcon className="w-6 h-6 text-[#00FFB2]" />
              <div>
                <h4 className="text-white font-medium">Authenticator App</h4>
                <p className="text-gray-400 text-sm">Use Google Authenticator or similar apps</p>
              </div>
            </div>
            <Button
              variant={profile.is2FAEnabled ? 'outline' : 'primary'}
              size="sm"
              onClick={() => setProfile(prev => ({ ...prev, is2FAEnabled: !prev.is2FAEnabled }))}
              className={!profile.is2FAEnabled ? 'bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black' : ''}
            >
              {profile.is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {Object.entries(profile.notificationSettings.emailNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-gray-400 text-sm">
                  {key === 'newOrders' && 'Get notified when you receive new orders'}
                  {key === 'paymentReceived' && 'Get notified when payments are received'}
                  {key === 'disputes' && 'Get notified about dispute updates'}
                  {key === 'reviews' && 'Get notified when you receive new reviews'}
                  {key === 'promotions' && 'Get notified about promotional opportunities'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleNotificationChange('emailNotifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#00FFB2] peer-checked:to-[#00A8E8]"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Push Notifications */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Push Notifications</h3>
        <div className="space-y-4">
          {Object.entries(profile.notificationSettings.pushNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-gray-400 text-sm">
                  {key === 'newOrders' && 'Get push notifications for new orders'}
                  {key === 'paymentReceived' && 'Get push notifications for payments'}
                  {key === 'disputes' && 'Get push notifications for disputes'}
                  {key === 'reviews' && 'Get push notifications for reviews'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleNotificationChange('pushNotifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#00FFB2] peer-checked:to-[#00A8E8]"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Social Media Links</h3>
        <p className="text-gray-400 text-sm mb-6">
          Link your social media accounts to build trust with buyers
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Discord
            </label>
            <input
              type="text"
              value={profile.socialAccounts.discord || ''}
              onChange={(e) => handleSocialAccountChange('discord', e.target.value)}
              placeholder="Your Discord username#1234"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Telegram
            </label>
            <input
              type="text"
              value={profile.socialAccounts.telegram || ''}
              onChange={(e) => handleSocialAccountChange('telegram', e.target.value)}
              placeholder="@yourusername"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Twitter
            </label>
            <input
              type="text"
              value={profile.socialAccounts.twitter || ''}
              onChange={(e) => handleSocialAccountChange('twitter', e.target.value)}
              placeholder="@yourusername"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={profile.socialAccounts.instagram || ''}
              onChange={(e) => handleSocialAccountChange('instagram', e.target.value)}
              placeholder="@yourusername"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#00FFB2] text-[#00FFB2]'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'social' && renderSocialTab()}
      </motion.div>
    </div>
  );
};

export default Settings;