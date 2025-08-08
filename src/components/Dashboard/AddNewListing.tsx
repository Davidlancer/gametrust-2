import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  PhotoIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookmarkIcon,
  EyeIcon,
  CloudArrowUpIcon,
  TagIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';

interface FormData {
  // Basic Info
  gameTitle: string;
  platform: string;
  category: string;
  tags: string[];
  
  // Account Details
  level: number;
  achievements: string[];
  linkedSocials: {
    platform: string;
    isLinked: boolean;
    isRemovable: boolean;
  }[];
  
  // Pricing & Inventory
  price: number;
  originalPrice?: number;
  negotiable: boolean;
  quantity: number;
  
  // Media
  images: File[];
  video?: File;
  
  // Description
  title: string;
  description: string;
  features: string[];
  
  // Shipping/Delivery
  deliveryMethod: 'instant' | 'manual' | 'both';
  deliveryTime: string;
  
  // Visibility & Options
  visibility: 'public' | 'private' | 'featured';
  autoRelist: boolean;
  allowOffers: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

const games = [
  { id: 'codm', name: 'Call of Duty Mobile', platforms: ['Android', 'iOS'], categories: ['Accounts', 'Items', 'Boosting'] },
  { id: 'pubg', name: 'PUBG Mobile', platforms: ['Android', 'iOS'], categories: ['Accounts', 'UC', 'Items'] },
  { id: 'freefire', name: 'Free Fire', platforms: ['Android', 'iOS'], categories: ['Accounts', 'Diamonds', 'Items'] },
  { id: 'valorant', name: 'Valorant', platforms: ['PC'], categories: ['Accounts', 'VP', 'Boosting'] },
  { id: 'csgo', name: 'CS:GO', platforms: ['PC'], categories: ['Accounts', 'Skins', 'Keys'] },
  { id: 'fortnite', name: 'Fortnite', platforms: ['PC', 'Console', 'Mobile'], categories: ['Accounts', 'V-Bucks', 'Items'] }
];

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'google', name: 'Google', icon: '🔍' },
  { id: 'apple', name: 'Apple ID', icon: '🍎' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'discord', name: 'Discord', icon: '💬' }
];

const popularTags = [
  'Rare Skins', 'High Level', 'Verified Account', 'Full Access', 'Email Included',
  'No Ban History', 'Premium Items', 'Battle Pass', 'Legendary Items', 'Collector Edition'
];

const AddNewListing: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    gameTitle: '',
    platform: '',
    category: '',
    tags: [],
    level: 0,
    achievements: [],
    linkedSocials: [],
    price: 0,
    originalPrice: undefined,
    negotiable: false,
    quantity: 1,
    images: [],
    video: undefined,
    title: '',
    description: '',
    features: [],
    deliveryMethod: 'instant',
    deliveryTime: '1-24 hours',
    visibility: 'public',
    autoRelist: false,
    allowOffers: true
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));
  const [dragActive, setDragActive] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto-save functionality
  const saveAsDraft = useCallback(() => {
    localStorage.setItem('listing_draft', JSON.stringify(formData));
    setIsDraft(true);
    setLastSaved(new Date());
  }, [formData]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.gameTitle || formData.title || formData.description) {
        saveAsDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, saveAsDraft]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('listing_draft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
        setIsDraft(true);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Basic Info validation
    if (!formData.gameTitle) newErrors.gameTitle = 'Please select a game';
    if (!formData.platform) newErrors.platform = 'Please select a platform';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title must be under 100 characters';

    // Pricing validation
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.originalPrice && formData.originalPrice <= formData.price) {
      newErrors.originalPrice = 'Original price must be higher than current price';
    }

    // Media validation
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    // Description validation
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (asDraft = false) => {
    if (!asDraft && !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (asDraft) {
        saveAsDraft();
      } else {
        localStorage.removeItem('listing_draft');
        console.log('Listing submitted:', formData);
        // Show success state or redirect
      }
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag].slice(0, 5)
    }));
  };

  const SectionCard: React.FC<{
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    required?: boolean;
    completed?: boolean;
  }> = ({ id, title, icon: Icon, children, required = false, completed = false }) => {
    const isExpanded = expandedSections.has(id);
    
    return (
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full p-4 md:p-6 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors touch-manipulation min-h-[60px]"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              completed ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
            }`}>
              {completed ? (
                <CheckCircleIconSolid className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white text-base md:text-lg">
                {title}
                {required && <span className="text-red-400 ml-1">*</span>}
              </h3>
              {completed && (
                <p className="text-sm text-green-400">Completed</p>
              )}
            </div>
          </div>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 md:px-6 md:pb-6 border-t border-gray-700">
                <div className="pt-4 md:pt-6">
                  {children}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  };

  const InputField: React.FC<{
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    help?: string;
  }> = ({ label, error, required, children, help }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        {help && (
          <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400 inline ml-1" title={help} />
        )}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-sm flex items-center">
          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header - Not sticky on mobile */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-800 touch-manipulation"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Create New Listing</h1>
                <p className="text-sm text-gray-400 hidden md:block">List your gaming account for sale</p>
              </div>
            </div>
            
            {/* Draft Status */}
            {isDraft && lastSaved && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                <CloudArrowUpIcon className="w-4 h-4" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="space-y-4 md:space-y-6">
          {/* Basic Info Section */}
          <SectionCard
            id="basic"
            title="Basic Information"
            icon={TagIcon}
            required
            completed={!!(formData.gameTitle && formData.platform && formData.category && formData.title)}
          >
            <div className="space-y-4 md:space-y-6">
              <InputField label="Game" required error={errors.gameTitle}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {games.map(game => (
                    <button
                      key={game.id}
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        gameTitle: game.name, 
                        platform: '', 
                        category: '' 
                      }))}
                      className={`p-3 md:p-4 rounded-lg border-2 transition-all text-left touch-manipulation min-h-[60px] ${
                        formData.gameTitle === game.name
                          ? 'border-[#00FFB2] bg-[#00FFB2]/10'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                      }`}
                    >
                      <h4 className="font-semibold text-white text-sm md:text-base">{game.name}</h4>
                      <p className="text-xs md:text-sm text-gray-400 mt-1">
                        {game.platforms.join(', ')}
                      </p>
                    </button>
                  ))}
                </div>
              </InputField>

              {formData.gameTitle && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <InputField label="Platform" required error={errors.platform}>
                    <div className="flex flex-wrap gap-2">
                      {games.find(g => g.name === formData.gameTitle)?.platforms.map(platform => (
                        <button
                          key={platform}
                          onClick={() => setFormData(prev => ({ ...prev, platform }))}
                          className={`px-3 py-2 rounded-lg border transition-all text-sm touch-manipulation min-h-[44px] ${
                            formData.platform === platform
                              ? 'border-[#00FFB2] bg-[#00FFB2]/10 text-[#00FFB2]'
                              : 'border-gray-700 hover:border-gray-600 text-gray-300'
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </InputField>

                  <InputField label="Category" required error={errors.category}>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent min-h-[44px]"
                    >
                      <option value="">Select category</option>
                      {games.find(g => g.name === formData.gameTitle)?.categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </InputField>
                </div>
              )}

              <InputField label="Listing Title" required error={errors.title}>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent min-h-[44px]"
                    placeholder="e.g., High Level CODM Account with Rare Skins"
                    maxLength={100}
                  />
                  <div className="absolute right-3 top-3 text-xs text-gray-400">
                    {formData.title.length}/100
                  </div>
                </div>
              </InputField>

              <InputField label="Tags (up to 5)">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        disabled={!formData.tags.includes(tag) && formData.tags.length >= 5}
                        className={`px-3 py-2 rounded-lg text-sm transition-all touch-manipulation min-h-[36px] ${
                          formData.tags.includes(tag)
                            ? 'bg-[#00FFB2]/20 text-[#00FFB2] border border-[#00FFB2]/50'
                            : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600 disabled:opacity-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-400">Selected:</span>
                      {formData.tags.map(tag => (
                        <Badge key={tag} text={tag} className="bg-[#00FFB2]/20 text-[#00FFB2]" />
                      ))}
                    </div>
                  )}
                </div>
              </InputField>
            </div>
          </SectionCard>

          {/* Pricing & Inventory Section */}
          <SectionCard
            id="pricing"
            title="Pricing & Inventory"
            icon={CurrencyDollarIcon}
            required
            completed={formData.price > 0}
          >
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InputField label="Price (₦)" required error={errors.price}>
                  <input
                    type="number"
                    min="1"
                    value={formData.price || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent min-h-[44px]"
                    placeholder="Enter price"
                  />
                </InputField>

                <InputField label="Original Price (Optional)" error={errors.originalPrice}>
                  <input
                    type="number"
                    min="1"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseInt(e.target.value) || undefined }))}
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent min-h-[44px]"
                    placeholder="Show discount"
                  />
                </InputField>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
                <label className="flex items-center space-x-3 cursor-pointer touch-manipulation">
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) => setFormData(prev => ({ ...prev, negotiable: e.target.checked }))}
                    className="w-4 h-4 text-[#00FFB2] bg-gray-800 border-gray-600 rounded focus:ring-[#00FFB2] focus:ring-2"
                  />
                  <span className="text-sm text-gray-300">Price is negotiable</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer touch-manipulation">
                  <input
                    type="checkbox"
                    checked={formData.allowOffers}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowOffers: e.target.checked }))}
                    className="w-4 h-4 text-[#00FFB2] bg-gray-800 border-gray-600 rounded focus:ring-[#00FFB2] focus:ring-2"
                  />
                  <span className="text-sm text-gray-300">Allow offers</span>
                </label>
              </div>
            </div>
          </SectionCard>

          {/* Media Upload Section */}
          <SectionCard
            id="media"
            title="Media Upload"
            icon={PhotoIcon}
            required
            completed={formData.images.length > 0}
          >
            <div className="space-y-4 md:space-y-6">
              <InputField label="Images" required error={errors.images} help="Upload screenshots of your account">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-all duration-200 ${
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
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB each (Max 10 images)</p>
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
                    <Button variant="outline" className="mt-4 touch-manipulation">
                      Select Images
                    </Button>
                  </label>
                </div>
              </InputField>

              {formData.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Selected Images ({formData.images.length}/10)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
                        >
                          <XMarkIcon className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <InputField label="Video (Optional)" help="Upload gameplay video to showcase your account">
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
                    <Button variant="outline" className="mt-3 touch-manipulation">
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
              </InputField>
            </div>
          </SectionCard>

          {/* Description Section */}
          <SectionCard
            id="description"
            title="Description & Details"
            icon={DocumentTextIcon}
            required
            completed={formData.description.length >= 50}
          >
            <div className="space-y-4 md:space-y-6">
              <InputField label="Description" required error={errors.description}>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent resize-none"
                    placeholder="Describe your account in detail. Include information about level, skins, achievements, linked accounts, etc. Be honest and detailed to attract serious buyers."
                    minLength={50}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                    {formData.description.length} characters (min 50)
                  </div>
                </div>
              </InputField>

              {formData.gameTitle && (
                <InputField label="Account Level">
                  <input
                    type="number"
                    min="1"
                    value={formData.level || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent min-h-[44px]"
                    placeholder="Enter account level"
                  />
                </InputField>
              )}

              <InputField label="Linked Social Accounts">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {socialPlatforms.map(social => {
                    const isLinked = formData.linkedSocials.some(s => s.platform === social.id);
                    const linkedSocial = formData.linkedSocials.find(s => s.platform === social.id);
                    
                    return (
                      <button
                        key={social.id}
                        onClick={() => {
                          setFormData(prev => {
                            const existing = prev.linkedSocials.find(s => s.platform === social.id);
                            if (existing) {
                              return {
                                ...prev,
                                linkedSocials: prev.linkedSocials.filter(s => s.platform !== social.id)
                              };
                            } else {
                              return {
                                ...prev,
                                linkedSocials: [...prev.linkedSocials, {
                                  platform: social.id,
                                  isLinked: true,
                                  isRemovable: Math.random() > 0.3
                                }]
                              };
                            }
                          });
                        }}
                        className={`p-3 rounded-lg border transition-all duration-200 touch-manipulation min-h-[80px] ${
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
              </InputField>
            </div>
          </SectionCard>

          {/* Advanced Options */}
          <Card>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-4 md:p-6 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors touch-manipulation"
            >
              <div className="flex items-center space-x-3">
                <SparklesIcon className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-white text-base md:text-lg">Advanced Options</h3>
              </div>
              {showAdvanced ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-gray-700"
                >
                  <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <InputField label="Delivery Method">
                        <select
                          value={formData.deliveryMethod}
                          onChange={(e) => setFormData(prev => ({ ...prev, deliveryMethod: e.target.value as 'instant' | 'manual' | 'both' }))}
                          className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent min-h-[44px]"
                        >
                          <option value="instant">Instant Delivery</option>
                          <option value="manual">Manual Delivery</option>
                          <option value="both">Both Options</option>
                        </select>
                      </InputField>

                      <InputField label="Delivery Time">
                        <select
                          value={formData.deliveryTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                          className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent min-h-[44px]"
                        >
                          <option value="1-24 hours">1-24 hours</option>
                          <option value="1-3 days">1-3 days</option>
                          <option value="3-7 days">3-7 days</option>
                          <option value="Custom">Custom</option>
                        </select>
                      </InputField>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center space-x-3 cursor-pointer touch-manipulation">
                        <input
                          type="checkbox"
                          checked={formData.autoRelist}
                          onChange={(e) => setFormData(prev => ({ ...prev, autoRelist: e.target.checked }))}
                          className="w-4 h-4 text-[#00FFB2] bg-gray-800 border-gray-600 rounded focus:ring-[#00FFB2] focus:ring-2"
                        />
                        <span className="text-sm text-gray-300">Auto-relist if not sold in 30 days</span>
                      </label>

                      <InputField label="Visibility">
                        <div className="flex flex-wrap gap-3">
                          {[
                            { value: 'public', label: 'Public', desc: 'Visible to everyone' },
                            { value: 'private', label: 'Private', desc: 'Only visible with direct link' },
                            { value: 'featured', label: 'Featured', desc: 'Promoted listing (+₦500)' }
                          ].map(option => (
                            <button
                              key={option.value}
                              onClick={() => setFormData(prev => ({ ...prev, visibility: option.value as 'public' | 'private' | 'featured' }))}
                              className={`p-3 rounded-lg border transition-all text-left touch-manipulation min-h-[60px] flex-1 md:flex-none ${
                                formData.visibility === option.value
                                  ? 'border-[#00FFB2] bg-[#00FFB2]/10'
                                  : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                              }`}
                            >
                              <div className="font-medium text-white text-sm">{option.label}</div>
                              <div className="text-xs text-gray-400 mt-1">{option.desc}</div>
                            </button>
                          ))}
                        </div>
                      </InputField>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Preview Section */}
          {showPreview && (
            <Card>
              <div className="p-4 md:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Listing Preview</h3>
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                  <div className="flex items-start space-x-4">
                    {formData.images[0] && (
                      <img
                        src={URL.createObjectURL(formData.images[0])}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{formData.title || 'Your listing title'}</h4>
                      <p className="text-sm text-gray-400">{formData.gameTitle} • {formData.platform}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg font-bold text-[#00FFB2]">₦{formData.price.toLocaleString()}</span>
                        {formData.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">₦{formData.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-3">{formData.description}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Sticky Action Footer - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 md:hidden">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="flex-1 touch-manipulation min-h-[48px]"
          >
            <BookmarkIcon className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="touch-manipulation min-h-[48px] px-4"
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black font-semibold touch-manipulation min-h-[48px]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Publishing...
              </div>
            ) : (
              <>Publish Listing</>
            )}
          </Button>
        </div>
      </div>

      {/* Desktop Action Bar */}
      <div className="hidden md:block max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            {isDraft && lastSaved && (
              <span className="text-sm text-gray-400">
                Draft saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="flex items-center"
            >
              <BookmarkIcon className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#00FFB2] to-[#00A8E8] text-black font-semibold flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Publish Listing
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewListing;