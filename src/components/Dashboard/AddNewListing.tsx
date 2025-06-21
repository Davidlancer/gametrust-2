import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';

interface FormData {
  gameTitle: string;
  platform: string;
  level: number;
  skins: string[];
  linkedSocials: {
    platform: string;
    isLinked: boolean;
    isRemovable: boolean;
  }[];
  images: File[];
  video?: File;
  price: number;
  description: string;
}

const games = [
  { id: 'codm', name: 'Call of Duty Mobile', platforms: ['Android', 'iOS'] },
  { id: 'pubg', name: 'PUBG Mobile', platforms: ['Android', 'iOS'] },
  { id: 'freefire', name: 'Free Fire', platforms: ['Android', 'iOS'] },
  { id: 'valorant', name: 'Valorant', platforms: ['PC'] },
  { id: 'csgo', name: 'CS:GO', platforms: ['PC'] },
  { id: 'fortnite', name: 'Fortnite', platforms: ['PC', 'Console', 'Mobile'] }
];

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'google', name: 'Google', icon: '🔍' },
  { id: 'apple', name: 'Apple ID', icon: '🍎' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'discord', name: 'Discord', icon: '💬' }
];

const AddNewListing: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    gameTitle: '',
    platform: '',
    level: 0,
    skins: [],
    linkedSocials: [],
    images: [],
    video: undefined,
    price: 0,
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  const totalSteps = 5;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.gameTitle) newErrors.gameTitle = 'Please select a game';
        if (!formData.platform) newErrors.platform = 'Please select a platform';
        break;
      case 2:
        if (formData.level < 1) newErrors.level = 'Level must be at least 1';
        break;
      case 3:
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        break;
      case 4:
        if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const videoFiles = files.filter(file => file.type.startsWith('video/'));

    if (imageFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageFiles].slice(0, 10)
      }));
    }

    if (videoFiles.length > 0) {
      setFormData(prev => ({ ...prev, video: videoFiles[0] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleSocialLink = (platformId: string) => {
    setFormData(prev => {
      const existing = prev.linkedSocials.find(s => s.platform === platformId);
      if (existing) {
        return {
          ...prev,
          linkedSocials: prev.linkedSocials.filter(s => s.platform !== platformId)
        };
      } else {
        return {
          ...prev,
          linkedSocials: [...prev.linkedSocials, {
            platform: platformId,
            isLinked: true,
            isRemovable: Math.random() > 0.3 // Simulate removability
          }]
        };
      }
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Game *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {games.map(game => (
                  <button
                    key={game.id}
                    onClick={() => setFormData(prev => ({ ...prev, gameTitle: game.name, platform: '' }))}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.gameTitle === game.name
                        ? 'border-[#00FFB2] bg-[#00FFB2]/10'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                    }`}
                  >
                    <h3 className="font-semibold text-white">{game.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {game.platforms.join(', ')}
                    </p>
                  </button>
                ))}
              </div>
              {errors.gameTitle && (
                <p className="text-red-400 text-sm mt-2">{errors.gameTitle}</p>
              )}
            </div>

            {formData.gameTitle && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Platform *
                </label>
                <div className="flex flex-wrap gap-3">
                  {games.find(g => g.name === formData.gameTitle)?.platforms.map(platform => (
                    <button
                      key={platform}
                      onClick={() => setFormData(prev => ({ ...prev, platform }))}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                        formData.platform === platform
                          ? 'border-[#00FFB2] bg-[#00FFB2]/10 text-[#00FFB2]'
                          : 'border-gray-700 hover:border-gray-600 text-gray-300'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
                {errors.platform && (
                  <p className="text-red-400 text-sm mt-2">{errors.platform}</p>
                )}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Account Level *
              </label>
              <input
                type="number"
                min="1"
                value={formData.level || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                placeholder="Enter account level"
              />
              {errors.level && (
                <p className="text-red-400 text-sm mt-2">{errors.level}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Linked Social Accounts
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {socialPlatforms.map(social => {
                  const isLinked = formData.linkedSocials.some(s => s.platform === social.id);
                  const linkedSocial = formData.linkedSocials.find(s => s.platform === social.id);
                  
                  return (
                    <button
                      key={social.id}
                      onClick={() => toggleSocialLink(social.id)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        isLinked
                          ? 'border-[#00FFB2] bg-[#00FFB2]/10'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{social.icon}</div>
                        <p className="text-sm text-white">{social.name}</p>
                        {isLinked && (
                          <div className="mt-2">
                            <Badge
                              text={linkedSocial?.isRemovable ? 'Removable' : 'Permanent'}
                              className={linkedSocial?.isRemovable 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              }
                            />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-400 font-medium">Social Account Linking</p>
                    <p className="text-sm text-gray-300 mt-1">
                      Select which social accounts are linked to this gaming account. 
                      Accounts marked as "Permanent" cannot be unlinked and may affect the listing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Upload Images * (Max 10)
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? 'border-[#00FFB2] bg-[#00FFB2]/5'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Drag and drop images here, or click to select</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData(prev => ({
                      ...prev,
                      images: [...prev.images, ...files].slice(0, 10)
                    }));
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Button variant="outline" className="mt-4">
                    Select Images
                  </Button>
                </label>
              </div>
              {errors.images && (
                <p className="text-red-400 text-sm mt-2">{errors.images}</p>
              )}
            </div>

            {formData.images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">
                  Selected Images ({formData.images.length}/10)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Upload Video (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
                <VideoCameraIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-300 mb-2">Upload gameplay video</p>
                <p className="text-sm text-gray-500">MP4, MOV up to 100MB</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData(prev => ({ ...prev, video: file }));
                    }
                  }}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Button variant="outline" className="mt-3">
                    {formData.video ? 'Change Video' : 'Select Video'}
                  </Button>
                </label>
              </div>
              {formData.video && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-green-400">Video uploaded: {formData.video.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Price (₦) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                placeholder="Enter price in Naira"
              />
              {errors.price && (
                <p className="text-red-400 text-sm mt-2">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent resize-none"
                placeholder="Describe your account, include details about skins, achievements, etc."
              />
            </div>
          </div>
        );

      case 5:
        const hasNonRemovableSocials = formData.linkedSocials.some(s => !s.isRemovable);
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Review Your Listing</h3>
              <p className="text-gray-400">Please review all details before submitting</p>
            </div>

            <Card>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Game Details</h4>
                    <p className="text-gray-300">{formData.gameTitle}</p>
                    <p className="text-gray-400">{formData.platform} • Level {formData.level}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Price</h4>
                    <p className="text-2xl font-bold text-[#00FFB2]">₦{formData.price.toLocaleString()}</p>
                  </div>
                </div>

                {formData.linkedSocials.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Linked Accounts</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.linkedSocials.map(social => (
                        <Badge
                          key={social.platform}
                          text={social.platform}
                          className={social.isRemovable 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-white mb-2">Media</h4>
                  <p className="text-gray-300">
                    {formData.images.length} image(s)
                    {formData.video && ' • 1 video'}
                  </p>
                </div>

                {formData.description && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Description</h4>
                    <p className="text-gray-300">{formData.description}</p>
                  </div>
                )}
              </div>
            </Card>

            {hasNonRemovableSocials && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-400 font-medium">Account Limitation Notice</p>
                    <p className="text-sm text-gray-300 mt-1">
                      This account has permanently linked social accounts that cannot be removed. 
                      Your listing will be automatically tagged with this limitation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Listing</h1>
        <p className="text-gray-400">List your gaming account for sale</p>
      </div>

      {/* Progress Bar */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-300">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-400">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </Card>

      {/* Form Content */}
      <Card>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button
            variant="primary"
            onClick={nextStep}
            className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black font-semibold flex items-center"
          >
            Next
            <ChevronRightIcon className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            variant="primary"
            className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black font-semibold flex items-center"
            onClick={() => {
              // Handle form submission
              console.log('Submitting listing:', formData);
            }}
          >
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Submit Listing
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddNewListing;