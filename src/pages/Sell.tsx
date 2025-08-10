import React, { useState } from 'react';
import { Upload, Camera, Shield, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
// Games data - in a real app, this would come from an API
const games = [
  { 
    id: 1, 
    name: 'Fortnite', 
    shortName: 'Fortnite',
    icon: '🎮', 
    category: 'Battle Royale',
    description: 'Popular battle royale game',
    platforms: ['PC', 'Console', 'Mobile']
  },
  { 
    id: 2, 
    name: 'Minecraft', 
    shortName: 'Minecraft',
    icon: '⛏️', 
    category: 'Sandbox',
    description: 'Creative sandbox building game',
    platforms: ['PC', 'Console', 'Mobile']
  },
  { 
    id: 3, 
    name: 'Valorant', 
    shortName: 'Valorant',
    icon: '🎯', 
    category: 'FPS',
    description: 'Tactical first-person shooter',
    platforms: ['PC']
  },
  { 
    id: 4, 
    name: 'League of Legends', 
    shortName: 'LoL',
    icon: '⚔️', 
    category: 'MOBA',
    description: 'Multiplayer online battle arena',
    platforms: ['PC']
  },
  { 
    id: 5, 
    name: 'World of Warcraft', 
    shortName: 'WoW',
    icon: '🗡️', 
    category: 'MMORPG',
    description: 'Massively multiplayer online RPG',
    platforms: ['PC']
  }
];

const Sell: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    game: '',
    platform: '',
    level: '',
    title: '',
    description: '',
    price: '',
    features: [] as string[],
    linkedAccounts: {} as Record<string, boolean>,
    images: [] as string[],
    videoUrl: ''
  });

  const steps = [
    { number: 1, title: 'Game Info', description: 'Basic account details' },
    { number: 2, title: 'Features', description: 'Account capabilities' },
    { number: 3, title: 'Media', description: 'Screenshots & videos' },
    { number: 4, title: 'Review', description: 'Confirm & submit' }
  ];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Game *
                </label>
                <select
                  name="game"
                  value={formData.game}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a game</option>
                  {games.map(game => (
                    <option key={game.id} value={game.name}>{game.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platform *
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select platform</option>
                  <option value="iOS">iOS</option>
                  <option value="Android">Android</option>
                  <option value="PC">PC</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Level *
              </label>
              <input
                type="number"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter account level"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Listing Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Legendary CODM Account - All Mythic Weapons"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Describe your account in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter price in USD"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Account Features</h3>
              <p className="text-gray-400 mb-6">
                Select all features that apply to your account. This helps buyers understand what they're getting.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Mythic Weapons', 'Legendary Skins', 'Rare Outfits', 'Max Battle Pass',
                  'Exclusive Titles', 'High K/D Ratio', 'Ranked Achievements', 'Rare Emotes',
                  'Premium Crates', 'Anniversary Items', 'Limited Edition', 'Tournament Rewards'
                ].map((feature) => (
                  <button
                    key={feature}
                    onClick={() => {
                      const features = formData.features.includes(feature)
                        ? formData.features.filter(f => f !== feature)
                        : [...formData.features, feature];
                      setFormData({...formData, features});
                    }}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.features.includes(feature)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Linked Accounts</h3>
              <p className="text-gray-400 mb-6">
                Specify which social accounts are linked and whether they can be unlinked.
              </p>

              <div className="space-y-4">
                {['Facebook', 'Google', 'Apple ID', 'Twitter'].map((platform) => (
                  <div key={platform} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <span className="text-white font-medium">{platform}</span>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.linkedAccounts[platform] || false}
                          onChange={(e) => setFormData({
                            ...formData,
                            linkedAccounts: {
                              ...formData.linkedAccounts,
                              [platform]: e.target.checked
                            }
                          })}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 ${
                          formData.linkedAccounts[platform] 
                            ? 'bg-indigo-600 border-indigo-600' 
                            : 'border-gray-400'
                        }`}>
                          {formData.linkedAccounts[platform] && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="ml-2 text-sm text-gray-300">Linked</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Upload Media</h3>
              <p className="text-gray-400 mb-6">
                Add screenshots and videos to showcase your account. High-quality media increases buyer confidence.
              </p>

              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">Upload Screenshots</h4>
                <p className="text-gray-400 mb-4">
                  Drag & drop images here, or click to browse (Max 10 images)
                </p>
                <Button variant="secondary">
                  <Camera className="mr-2 h-4 w-4" />
                  Choose Images
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video URL (Optional)
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="YouTube, Streamable, or direct video URL"
              />
              <p className="text-sm text-gray-400 mt-2">
                Videos should be under 30 seconds and show account gameplay or features.
              </p>
            </div>

            {/* Safety Notice */}
            <Card className="bg-yellow-500/10 border-yellow-500/20">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-400 mb-1">Privacy Notice</h4>
                  <p className="text-sm text-yellow-300/80">
                    Never include personal information, passwords, or sensitive data in your media. 
                    Our team reviews all uploads for safety and compliance.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Review Your Listing</h3>
              <p className="text-gray-400 mb-6">
                Please review all information before submitting. Your listing will be reviewed within 24 hours.
              </p>
            </div>

            {/* Summary */}
            <Card>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-semibold text-white">{formData.title}</h4>
                    <p className="text-gray-400">{formData.game} • {formData.platform} • Level {formData.level}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${formData.price}</div>
                    <div className="flex space-x-2 mt-2">
                      <Badge type="verified" size="sm" />
                      <Badge type="escrow" size="sm" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-300">{formData.description}</p>
                </div>

                {formData.features.length > 0 && (
                  <div className="border-t border-gray-700 pt-4">
                    <h5 className="font-medium text-white mb-2">Features:</h5>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-md">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Terms */}
            <Card className="bg-indigo-500/10 border-indigo-500/20">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-indigo-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-indigo-400 mb-2">Seller Protection</h4>
                  <ul className="text-sm text-indigo-300/80 space-y-1">
                    <li>• Funds held in secure escrow until transfer completion</li>
                    <li>• Account verification protects against chargebacks</li>
                    <li>• 24/7 support throughout the transaction process</li>
                    <li>• Dispute resolution available if issues arise</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sell Your Gaming Account
          </h1>
          <p className="text-xl text-gray-400">
            List your account safely with our guided process
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    currentStep >= step.number
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className={`font-medium ${
                      currentStep >= step.number ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-sm text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          {renderStepContent()}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit Listing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sell;