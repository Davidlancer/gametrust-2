import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CameraIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  ComputerDesktopIcon,
  ClockIcon,
  StarIcon,
  CogIcon,
  WifiIcon,
  ExclamationCircleIcon,
  Bars3Icon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import Button from '../UI/Button';
import { alertUtils } from '../../utils/alertMigration';

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  verified: boolean;
  profileCompletion: number;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'email' | 'app';
  lastPasswordChange: string;
  recentLogins: Array<{
    device: string;
    location: string;
    time: string;
    current: boolean;
  }>;
}

interface NotificationSettings {
  masterEnabled: boolean;
  doNotDisturbStart: string;
  doNotDisturbEnd: string;
  emailNotifications: {
    savedListings: boolean;
    messages: boolean;
    promotions: boolean;
    security: boolean;
  };
  pushNotifications: {
    savedListings: boolean;
    messages: boolean;
    promotions: boolean;
  };
}

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'paypal';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface ConnectedAccount {
  id: string;
  platform: 'steam' | 'xbox' | 'playstation' | 'epic';
  username: string;
  connected: boolean;
  lastSync: string;
}

const mockProfile: UserProfile = {
  firstName: 'Blunt',
  lastName: 'User',
  username: 'blunt123',
  email: 'blunt@example.com',
  phone: '+234 801 234 5678',
  avatar: '/api/placeholder/100/100',
  joinDate: 'March 2024',
  verified: true,
  profileCompletion: 85
};

const mockSecurity: SecuritySettings = {
  twoFactorEnabled: false,
  twoFactorMethod: 'sms',
  lastPasswordChange: 'June 1, 2024',
  recentLogins: [
    { device: 'Chrome on Windows', location: 'Lagos, Nigeria', time: '2 minutes ago', current: true },
    { device: 'Safari on iPhone', location: 'Lagos, Nigeria', time: '2 hours ago', current: false },
    { device: 'Chrome on MacOS', location: 'Abuja, Nigeria', time: '1 day ago', current: false }
  ]
};

const mockNotifications: NotificationSettings = {
  masterEnabled: true,
  doNotDisturbStart: '22:00',
  doNotDisturbEnd: '08:00',
  emailNotifications: {
    savedListings: true,
    messages: true,
    promotions: false,
    security: true
  },
  pushNotifications: {
    savedListings: true,
    messages: true,
    promotions: false
  }
};

const mockPaymentMethods: PaymentMethod[] = [
  { id: '1', type: 'visa', last4: '4242', expiryMonth: '12', expiryYear: '2025', isDefault: true },
  { id: '2', type: 'mastercard', last4: '8888', expiryMonth: '06', expiryYear: '2026', isDefault: false }
];

const mockConnectedAccounts: ConnectedAccount[] = [
  { id: '1', platform: 'steam', username: 'blunt_gamer', connected: true, lastSync: '2 hours ago' },
  { id: '2', platform: 'xbox', username: 'BluntUser123', connected: true, lastSync: '1 day ago' },
  { id: '3', platform: 'playstation', username: '', connected: false, lastSync: 'Never' },
  { id: '4', platform: 'epic', username: '', connected: false, lastSync: 'Never' }
];

const BuyerSettings: React.FC = () => {

  const [activeSection, setActiveSection] = useState('account');
  const [profile, setProfile] = useState(mockProfile);
  const [security, setSecurity] = useState(mockSecurity);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [connectedAccounts, setConnectedAccounts] = useState(mockConnectedAccounts);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sideNavItems = [
    { id: 'account', label: 'Account Info', icon: UserCircleIcon, color: 'blue' },
    { id: 'security', label: 'Privacy & Security', icon: ShieldCheckIcon, color: 'green' },
    { id: 'notifications', label: 'Notifications', icon: BellIcon, color: 'yellow' },
    { id: 'payments', label: 'Payment Methods', icon: CreditCardIcon, color: 'purple' },
    { id: 'devices', label: 'Connected Devices', icon: DevicePhoneMobileIcon, color: 'indigo' },
    { id: 'danger', label: 'Danger Zone', icon: ExclamationTriangleIcon, color: 'red' }
  ];

  const handleSave = async (section: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      alertUtils.success(`${section} updated successfully!`);
    } catch {
      alertUtils.error(`Failed to update ${section}. Please try again.`);
    }
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate upload
      alertUtils.info('Avatar upload feature coming soon!');
    }
  };

  const toggleNotification = (category: 'emailNotifications' | 'pushNotifications', key: string) => {
    setNotifications(prev => {
      const categoryData = prev[category];
      return {
        ...prev,
        [category]: {
          ...categoryData,
          [key]: !categoryData[key as keyof typeof categoryData]
        }
      };
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'steam': return '🎮';
      case 'xbox': return '🎯';
      case 'playstation': return '🎲';
      case 'epic': return '⚡';
      default: return '🔗';
    }
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'paypal': return '💰';
      default: return '💳';
    }
  };

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const renderMobileProfileBanner = () => (
    <div className="md:hidden bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20 mb-6">
      <div className="flex items-center space-x-4">
        <img
          src={profile.avatar}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30"
        />
        <div className="flex-1">
          <h2 className="text-white font-semibold text-lg">{profile.firstName} {profile.lastName}</h2>
          <p className="text-gray-400 text-sm">@{profile.username}</p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="text-sm font-medium text-blue-400">{profile.profileCompletion}% Complete</div>
            <div className="flex-1 bg-gray-700 rounded-full h-1.5">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${profile.profileCompletion}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileNavigation = () => (
    <>
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <Bars3Icon className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-lg font-bold text-white">Settings</h1>
              <p className="text-xs text-gray-400">{sideNavItems.find(item => item.id === activeSection)?.label}</p>
            </div>
          </div>
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <CogIcon className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {showMobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileNav(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-80 bg-gray-800 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <CogIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">Settings</h1>
                      <p className="text-gray-400 text-sm">Control Panel</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMobileNav(false)}
                    className="p-2 bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <nav className="space-y-2">
                  {sideNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveSection(item.id);
                          setShowMobileNav(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-4 rounded-lg text-left transition-all duration-200 group ${
                          isActive
                            ? `bg-${item.color}-500/20 border-l-4 border-${item.color}-500 text-${item.color}-400`
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }`}
                      >
                        <Icon className={`w-6 h-6 transition-all duration-200 ${
                          isActive ? `text-${item.color}-400` : 'text-gray-400 group-hover:text-white'
                        } ${isActive ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                        <span className={`font-medium transition-colors ${
                          isActive ? `text-${item.color}-400` : 'text-gray-400 group-hover:text-white'
                        }`}>
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="mobileActiveIndicator"
                            className={`ml-auto w-2 h-2 bg-${item.color}-400 rounded-full`}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );

  const renderFloatingActionButton = () => (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setEditingField('firstName')}
      className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center z-30"
    >
      <PencilIcon className="w-6 h-6 text-white" />
    </motion.button>
  );

  const renderCollapsibleCard = (title: string, icon: React.ElementType, children: React.ReactNode, sectionId: string, color: string = 'blue') => {
    const Icon = icon;
    const isCollapsed = collapsedSections[sectionId];
    
    return (
      <div className="md:hidden bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 mb-4">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
              <Icon className={`w-5 h-5 text-${color}-400`} />
            </div>
            <h3 className="text-white font-semibold">{title}</h3>
          </div>
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 border-t border-gray-700/30">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderAccountInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Mobile Profile Banner */}
      {renderMobileProfileBanner()}
      {/* Profile Completion - Desktop Only */}
      <div className="hidden md:block bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <StarIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Profile Completion</h3>
              <p className="text-gray-400 text-sm">Complete your profile to unlock all features</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">{profile.profileCompletion}%</div>
            <div className="text-xs text-gray-400">Complete</div>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${profile.profileCompletion}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Mobile Collapsible Cards */}
      <div className="md:hidden space-y-4">
        {renderCollapsibleCard(
          'Profile Picture',
          CameraIcon,
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-600 group-hover:border-blue-500 transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAvatarUpload}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <CameraIcon className="w-5 h-5 text-white" />
              </motion.button>
            </div>
            <div className="flex-1">
              <p className="text-gray-300 mb-2">Upload a new profile picture</p>
              <p className="text-gray-500 text-sm">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
            <Button
              onClick={handleAvatarUpload}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              Upload
            </Button>
          </div>,
          'avatar',
          'blue'
        )}

        {renderCollapsibleCard(
          'Personal Information',
          UserCircleIcon,
          <div className="space-y-4">
            {[
              { key: 'firstName', label: 'First Name', icon: UserCircleIcon },
              { key: 'lastName', label: 'Last Name', icon: UserCircleIcon },
              { key: 'username', label: 'Username', icon: UserCircleIcon },
              { key: 'email', label: 'Email', icon: EnvelopeIcon },
              { key: 'phone', label: 'Phone', icon: PhoneIcon }
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="space-y-2">
                <label className="text-gray-300 text-sm font-medium flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span>{label}</span>
                </label>
                <div className="relative group">
                  {editingField === key ? (
                    <div className="flex space-x-2">
                      <input
                        type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                        value={profile[key as keyof UserProfile] as string}
                        onChange={(e) => setProfile(prev => ({ ...prev, [key]: e.target.value }))}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                        autoFocus
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingField(null);
                          handleSave('profile');
                        }}
                        className="p-3 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditingField(null)}
                        className="p-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-700/50 rounded-lg px-3 py-3 group-hover:bg-gray-700 transition-colors">
                      <span className="text-white">{profile[key as keyof UserProfile]}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingField(key)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-600 rounded transition-all duration-200"
                      >
                        <PencilIcon className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>,
          'personal',
          'blue'
        )}
      </div>

      {/* Desktop Avatar Section */}
      <div className="hidden md:block bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
        <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
          <CameraIcon className="w-5 h-5 text-blue-400" />
          <span>Profile Picture</span>
        </h3>
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-600 group-hover:border-blue-500 transition-all duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAvatarUpload}
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <CameraIcon className="w-6 h-6 text-white" />
            </motion.button>
          </div>
          <div className="flex-1">
            <p className="text-gray-300 mb-2">Upload a new profile picture</p>
            <p className="text-gray-500 text-sm">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
          <Button
            onClick={handleAvatarUpload}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Upload
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Desktop Personal Information */}
      <div className="hidden md:block bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
        <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
          <UserCircleIcon className="w-5 h-5 text-blue-400" />
          <span>Personal Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'firstName', label: 'First Name', icon: UserCircleIcon },
            { key: 'lastName', label: 'Last Name', icon: UserCircleIcon },
            { key: 'username', label: 'Username', icon: UserCircleIcon },
            { key: 'email', label: 'Email', icon: EnvelopeIcon },
            { key: 'phone', label: 'Phone', icon: PhoneIcon }
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="space-y-2">
              <label className="text-gray-300 text-sm font-medium flex items-center space-x-2">
                <Icon className="w-4 h-4 text-gray-400" />
                <span>{label}</span>
              </label>
              <div className="relative group">
                {editingField === key ? (
                  <div className="flex space-x-2">
                    <input
                      type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                      value={profile[key as keyof UserProfile] as string}
                      onChange={(e) => setProfile(prev => ({ ...prev, [key]: e.target.value }))}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none transition-colors"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                         setEditingField(null);
                         handleSave('profile');
                       }}
                      className="p-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingField(null)}
                      className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-gray-700/50 rounded-lg px-3 py-2 group-hover:bg-gray-700 transition-colors">
                    <span className="text-white">{profile[key as keyof UserProfile]}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingField(key)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all duration-200"
                    >
                      <PencilIcon className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </motion.div>
  );

  const renderSecurity = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 2FA Section */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${security.twoFactorEnabled ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
              <ShieldCheckIcon className={`w-5 h-5 ${security.twoFactorEnabled ? 'text-green-400' : 'text-yellow-400'}`} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Two-Factor Authentication</h3>
              <p className="text-gray-400 text-sm">
                {security.twoFactorEnabled ? 'Your account is protected' : 'Add an extra layer of security'}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSecurity(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
              alertUtils.success(security.twoFactorEnabled ? '2FA disabled' : '2FA enabled');
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              security.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <motion.span
              animate={{ x: security.twoFactorEnabled ? 20 : 2 }}
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            />
          </motion.button>
        </div>
        {security.twoFactorEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20"
          >
            <p className="text-green-400 text-sm flex items-center space-x-2">
              <CheckCircleSolid className="w-4 h-4" />
              <span>Two-factor authentication is active via {security.twoFactorMethod}</span>
            </p>
          </motion.div>
        )}
      </div>

      {/* Password Section */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4 max-md:flex-col max-md:space-y-3">
          <div className="flex items-center space-x-3 max-md:w-full max-md:justify-center">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <KeyIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="max-md:text-center">
              <h3 className="text-white font-semibold">Password</h3>
              <p className="text-gray-400 text-sm">Last changed: {security.lastPasswordChange}</p>
            </div>
          </div>
          <div className="max-md:flex max-md:justify-center max-md:w-full">
            <Button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors md:px-4 md:py-2 max-md:px-3 max-md:py-2 max-md:text-sm max-md:w-auto max-md:min-w-[120px]"
            >
              Change Password
            </Button>
          </div>
        </div>
        
        <AnimatePresence>
          {showPasswordChange && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
            >
              {[
                { key: 'current', label: 'Current Password', type: 'password' },
                { key: 'new', label: 'New Password', type: 'password' },
                { key: 'confirm', label: 'Confirm Password', type: 'password' }
              ].map(({ key, label, type }) => (
                <div key={key} className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">{label}</label>
                  <div className="relative">
                    <input
                      type={showPasswords[key as keyof typeof showPasswords] ? 'text' : type}
                      value={passwordForm[key as keyof typeof passwordForm]}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPasswords[key as keyof typeof showPasswords] ? (
                        <EyeSlashIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex space-x-3 pt-2">
                <Button
                   onClick={() => {
                     handleSave('password');
                     setShowPasswordChange(false);
                     setPasswordForm({ current: '', new: '', confirm: '' });
                   }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Update Password
                </Button>
                <Button
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordForm({ current: '', new: '', confirm: '' });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Login Activity */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4 max-md:flex-col max-md:space-y-3">
          <div className="flex items-center space-x-3 max-md:w-full max-md:justify-center">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <ClockIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div className="max-md:text-center">
              <h3 className="text-white font-semibold">Recent Login Activity</h3>
              <p className="text-gray-400 text-sm">Monitor your account access</p>
            </div>
          </div>
          <div className="max-md:flex max-md:justify-center max-md:w-full">
            <Button
              onClick={() => alertUtils.info('Logged out from all devices')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors md:px-4 md:py-2 max-md:px-3 max-md:py-2 max-md:text-sm max-md:w-auto max-md:min-w-[120px]"
            >
              Log Out All
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {security.recentLogins.map((login, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                login.current
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-gray-700/30 border-gray-600/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  login.current ? 'bg-green-500/20' : 'bg-gray-600/20'
                }`}>
                  <ComputerDesktopIcon className={`w-4 h-4 ${
                    login.current ? 'text-green-400' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{login.device}</p>
                  <p className="text-gray-400 text-xs">{login.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${
                  login.current ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {login.current ? 'Current Session' : login.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Master Control */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${notifications.masterEnabled ? 'bg-yellow-500/20' : 'bg-gray-600/20'}`}>
              <BellIcon className={`w-5 h-5 ${notifications.masterEnabled ? 'text-yellow-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Master Notifications</h3>
              <p className="text-gray-400 text-sm">
                {notifications.masterEnabled ? 'All notifications enabled' : 'All notifications disabled'}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotifications(prev => ({ ...prev, masterEnabled: !prev.masterEnabled }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              notifications.masterEnabled ? 'bg-yellow-500' : 'bg-gray-600'
            }`}
          >
            <motion.span
              animate={{ x: notifications.masterEnabled ? 20 : 2 }}
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            />
          </motion.button>
        </div>
      </div>

      {/* Do Not Disturb */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <ClockIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Do Not Disturb</h3>
            <p className="text-gray-400 text-sm">Set quiet hours for notifications</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium">Start Time</label>
            <input
              type="time"
              value={notifications.doNotDisturbStart}
              onChange={(e) => setNotifications(prev => ({ ...prev, doNotDisturbStart: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium">End Time</label>
            <input
              type="time"
              value={notifications.doNotDisturbEnd}
              onChange={(e) => setNotifications(prev => ({ ...prev, doNotDisturbEnd: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <EnvelopeIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Email Notifications</h3>
            <p className="text-gray-400 text-sm">Choose what you want to receive via email</p>
          </div>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications.emailNotifications).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div>
                <p className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-gray-400 text-sm">
                  {key === 'savedListings' && 'Price drops, new matches, and updates'}
                  {key === 'messages' && 'Direct messages and chat notifications'}
                  {key === 'promotions' && 'Special offers and promotional content'}
                  {key === 'security' && 'Login alerts and security updates'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleNotification('emailNotifications', key)}
                className={`
                  relative inline-flex h-7 w-12 items-center rounded-full 
                  transition-colors duration-200 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
                  min-h-[44px] min-w-[44px] flex items-center justify-center
                  md:min-h-0 md:min-w-0
                  ${
                    enabled 
                      ? 'bg-blue-500 focus:ring-blue-500/50' 
                      : 'bg-gray-600 focus:ring-gray-500'
                  }
                `}
                aria-checked={enabled}
                role="switch"
              >
                <motion.span
                  animate={{ x: enabled ? 20 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform"
                />
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <DevicePhoneMobileIcon className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Push Notifications</h3>
            <p className="text-gray-400 text-sm">Instant notifications on your devices</p>
          </div>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications.pushNotifications).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div>
                <p className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-gray-400 text-sm">
                  {key === 'savedListings' && 'Instant alerts for your saved items'}
                  {key === 'messages' && 'Real-time chat and message notifications'}
                  {key === 'promotions' && 'Flash sales and limited-time offers'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleNotification('pushNotifications', key)}
                className={`
                  relative inline-flex h-7 w-12 items-center rounded-full 
                  transition-colors duration-200 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
                  min-h-[44px] min-w-[44px] flex items-center justify-center
                  md:min-h-0 md:min-w-0
                  ${
                    enabled 
                      ? 'bg-green-500 focus:ring-green-500/50' 
                      : 'bg-gray-600 focus:ring-gray-500'
                  }
                `}
                aria-checked={enabled}
                role="switch"
              >
                <motion.span
                  animate={{ x: enabled ? 20 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform"
                />
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderPayments = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Add New Card Button */}
      <div className="flex justify-between items-center max-md:flex-col max-md:items-start max-md:space-y-3">
        <div className="max-md:w-full">
          <h3 className="text-white font-semibold text-lg">Payment Methods</h3>
          <p className="text-gray-400 text-sm">Manage your saved payment methods</p>
        </div>
        <div className="max-md:w-full max-md:flex max-md:justify-center">
          <Button
            onClick={() => setShowAddCard(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 md:px-4 md:py-2 max-md:px-3 max-md:py-1.5 max-md:text-sm max-md:min-w-[100px] max-md:justify-center"
          >
            <PlusIcon className="w-4 h-4 max-md:w-3 max-md:h-3" />
            <span>Add Card</span>
          </Button>
        </div>
      </div>

      {/* Payment Cards */}
      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            whileHover={{ scale: 1.02, rotateY: 5 }}
            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{getCardIcon(method.type)}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-semibold capitalize">{method.type}</p>
                    {method.isDefault && (
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">•••• •••• •••• {method.last4}</p>
                  <p className="text-gray-500 text-xs">Expires {method.expiryMonth}/{method.expiryYear}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!method.isDefault && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setPaymentMethods(prev => prev.map(p => ({ ...p, isDefault: p.id === method.id })));
                      alertUtils.success('Default payment method updated');
                    }}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                  >
                    Set Default
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPaymentMethods(prev => prev.filter(p => p.id !== method.id));
                    alertUtils.success('Payment method removed');
                  }}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddCard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Add New Card</h3>
                <button
                  onClick={() => setShowAddCard(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none transition-colors mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm font-medium">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none transition-colors mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none transition-colors mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none transition-colors mt-1"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowAddCard(false);
                      alertUtils.success('Payment method added successfully!');
                    }}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Add Card
                  </Button>
                  <Button
                    onClick={() => setShowAddCard(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderDevices = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-white font-semibold text-lg">Connected Accounts</h3>
        <p className="text-gray-400 text-sm">Link your gaming accounts for better recommendations</p>
      </div>

      <div className="grid gap-4">
        {connectedAccounts.map((account) => (
          <motion.div
            key={account.id}
            whileHover={{ scale: 1.02 }}
            className={`bg-gray-800/50 rounded-xl p-6 max-md:p-4 border transition-all duration-300 ${
              account.connected
                ? 'border-green-500/30 hover:border-green-500/50'
                : 'border-gray-700/50 hover:border-indigo-500/30'
            }`}
          >
            <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:space-y-4">
              <div className="flex items-center space-x-4 max-md:space-x-3 max-md:w-full">
                <div className={`text-3xl max-md:text-2xl p-3 max-md:p-2 rounded-lg ${
                  account.connected ? 'bg-green-500/20' : 'bg-gray-600/20'
                }`}>
                  {getPlatformIcon(account.platform)}
                </div>
                <div className="max-md:flex-1">
                  <div className="flex items-center space-x-2 max-md:flex-wrap max-md:gap-1">
                    <p className="text-white font-semibold capitalize max-md:text-base">{account.platform}</p>
                    {account.connected && (
                      <div className="flex items-center space-x-1">
                        <CheckCircleSolid className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-xs">Connected</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm max-md:text-xs">
                    {account.connected ? account.username : 'Not connected'}
                  </p>
                  <p className="text-gray-500 text-xs max-md:text-xs">Last sync: {account.lastSync}</p>
                </div>
              </div>
              <div className="flex space-x-2 max-md:w-full max-md:justify-center max-md:space-x-3">
                {account.connected ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => alertUtils.info(`Syncing ${account.platform} account...`)}
                      className="px-3 py-1 max-md:px-4 max-md:py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs max-md:text-sm rounded-lg transition-colors flex items-center space-x-1 max-md:min-w-[80px] max-md:justify-center"
                    >
                      <WifiIcon className="w-3 h-3 max-md:w-4 max-md:h-4" />
                      <span>Sync</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setConnectedAccounts(prev => prev.map(a => 
                          a.id === account.id ? { ...a, connected: false, username: '', lastSync: 'Never' } : a
                        ));
                        alertUtils.success(`${account.platform} account disconnected`);
                      }}
                      className="px-3 py-1 max-md:px-4 max-md:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs max-md:text-sm rounded-lg transition-colors max-md:min-w-[100px] max-md:justify-center max-md:flex max-md:items-center"
                    >
                      Disconnect
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setConnectedAccounts(prev => prev.map(a => 
                        a.id === account.id ? { 
                          ...a, 
                          connected: true, 
                          username: `user_${account.platform}`, 
                          lastSync: 'Just now' 
                        } : a
                      ));
                      alertUtils.success(`${account.platform} account connected`);
                    }}
                    className="px-4 py-2 max-md:px-6 max-md:py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm max-md:text-sm rounded-lg transition-colors flex items-center space-x-2 max-md:min-w-[120px] max-md:justify-center"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Connect</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderDangerZone = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-red-400 font-semibold text-lg">Danger Zone</h3>
            <p className="text-red-300/70 text-sm">Irreversible actions that affect your account</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Deactivate Account */}
          <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Deactivate Account</h4>
                <p className="text-gray-400 text-sm">Temporarily disable your account. You can reactivate it later.</p>
              </div>
              <Button
                onClick={() => alertUtils.info('Account deactivation feature coming soon')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Deactivate
              </Button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-white font-medium">Delete Account</h4>
                <p className="text-gray-400 text-sm">Permanently delete your account and all associated data.</p>
              </div>
              <Button
                onClick={() => setShowDangerZone(!showDangerZone)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Delete</span>
              </Button>
            </div>
            
            <AnimatePresence>
              {showDangerZone && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30"
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <ExclamationCircleIcon className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">This action cannot be undone!</p>
                      <p className="text-red-300/70 text-xs mt-1">
                        This will permanently delete your account, all your listings, messages, and transaction history.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-red-300 text-sm font-medium">Type "DELETE" to confirm:</label>
                      <input
                        type="text"
                        placeholder="DELETE"
                        className="w-full bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none transition-colors mt-1"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => alertUtils.error('Account deletion is not available in demo mode')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Confirm Delete
                      </Button>
                      <Button
                        onClick={() => setShowDangerZone(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'account': return renderAccountInfo();
      case 'security': return renderSecurity();
      case 'notifications': return renderNotifications();
      case 'payments': return renderPayments();
      case 'devices': return renderDevices();
      case 'danger': return renderDangerZone();
      default: return renderAccountInfo();
    }
  };

  return (
    <div className="h-full bg-gray-900">
      {/* Mobile Navigation */}
      {renderMobileNavigation()}
      
      <div className="flex h-full">
        {/* Desktop Sticky Side Navigation */}
        <div className="hidden md:block w-64 bg-gray-800/50 border-r border-gray-700/50 sticky top-0 h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CogIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 text-sm">Control Panel</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {sideNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                      isActive
                        ? `bg-${item.color}-500/20 border-l-4 border-${item.color}-500 text-${item.color}-400`
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-all duration-200 ${
                      isActive ? `text-${item.color}-400` : 'text-gray-400 group-hover:text-white'
                    } ${isActive ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                    <span className={`font-medium transition-colors ${
                      isActive ? `text-${item.color}-400` : 'text-gray-400 group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={`ml-auto w-2 h-2 bg-${item.color}-400 rounded-full`}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Mobile Floating Action Button */}
      {renderFloatingActionButton()}
    </div>
  );
};

export default BuyerSettings;