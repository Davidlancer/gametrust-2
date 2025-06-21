import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, ChevronLeftIcon, ShieldCheckIcon, CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Confetti from '../components/UI/Confetti';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onNavigate: (page: string) => void;
}

interface OnboardingData {
  roles: string[];
  games: string[];
  completedAt: Date;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [customGame, setCustomGame] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const totalSteps = 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const games = [
    'Call of Duty Mobile',
    'PUBG Mobile',
    'Free Fire',
    'Mobile Legends',
    'FIFA Mobile',
    'Genshin Impact',
    'Clash of Clans',
    'Valorant'
  ];

  const roles = [
    { id: 'buyer', label: 'I want to buy gaming accounts', icon: '🛒' },
    { id: 'seller', label: 'I want to sell my gaming accounts', icon: '💰' },
    { id: 'explorer', label: "I'm just exploring", icon: '🔍' }
  ];

  const escrowSteps = [
    {
      title: 'Buyer Pays GameTrust',
      description: 'Your payment is held securely in escrow',
      icon: CreditCardIcon,
      color: 'text-blue-400'
    },
    {
      title: 'Seller Delivers Account',
      description: 'Account credentials are provided to buyer',
      icon: ShieldCheckIcon,
      color: 'text-yellow-400'
    },
    {
      title: 'Payment Released',
      description: 'After confirmation, seller receives payment',
      icon: CheckCircleIcon,
      color: 'text-green-400'
    }
  ];

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleGameToggle = (game: string) => {
    setSelectedGames(prev => 
      prev.includes(game) 
        ? prev.filter(g => g !== game)
        : [...prev, game]
    );
  };

  const handleAddCustomGame = () => {
    if (customGame.trim() && !selectedGames.includes(customGame.trim())) {
      setSelectedGames(prev => [...prev, customGame.trim()]);
      setCustomGame('');
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep === 1) return; // Can't skip role selection
    handleNext();
  };

  const handleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => {
      const onboardingData: OnboardingData = {
        roles: selectedRoles,
        games: selectedGames,
        completedAt: new Date()
      };
      onComplete(onboardingData);
      
      // Navigate based on selected roles
      if (selectedRoles.includes('seller') && !selectedRoles.includes('buyer')) {
        onNavigate('seller-dashboard');
      } else if (selectedRoles.includes('buyer') && !selectedRoles.includes('seller')) {
        onNavigate('buyer-dashboard');
      } else {
        // Both roles - default to buyer dashboard
        onNavigate('buyer-dashboard');
      }
    }, 2000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedRoles.length > 0;
      case 2: return selectedGames.length > 0;
      default: return true;
    }
  };

  const getCompletionCTA = () => {
    if (selectedRoles.includes('seller') && !selectedRoles.includes('buyer')) {
      return { text: 'Create Your First Listing', action: () => onNavigate('seller-dashboard') };
    } else if (selectedRoles.includes('buyer') && !selectedRoles.includes('seller')) {
      return { text: 'Go to Buyer Dashboard', action: () => onNavigate('buyer-dashboard') };
    } else {
      return { text: 'Go to Buyer Dashboard', action: () => onNavigate('buyer-dashboard') };
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                🎮 Welcome to GameTrust
              </h1>
              <p className="text-xl text-gray-300 max-w-md mx-auto">
                Let's set up your experience in less than 60 seconds.
              </p>
            </div>
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-6xl">🎮</span>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">
                What do you want to do on GameTrust?
              </h2>
              <p className="text-gray-300">
                You can select multiple options
              </p>
            </div>
            <div className="space-y-4">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedRoles.includes(role.id)
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-400'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                  onCardClick={() => handleRoleToggle(role.id)}
                >
                  <div className="flex items-center space-x-4 p-4">
                    <span className="text-3xl">{role.icon}</span>
                    <span className="text-lg font-medium text-white">{role.label}</span>
                    {selectedRoles.includes(role.id) && (
                      <CheckCircleIcon className="h-6 w-6 text-green-400 ml-auto" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">
                What games are you here for?
              </h2>
              <p className="text-gray-300">
                Select all that interest you
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {games.map((game) => (
                <button
                  key={game}
                  onClick={() => handleGameToggle(game)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedGames.includes(game)
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {game}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add other games..."
                value={customGame}
                onChange={(e) => setCustomGame(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomGame()}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
              <Button onClick={handleAddCustomGame} variant="outline" size="sm">
                Add
              </Button>
            </div>
            {selectedGames.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedGames.map((game) => (
                  <span
                    key={game}
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full flex items-center space-x-2"
                  >
                    <span>{game}</span>
                    <button
                      onClick={() => handleGameToggle(game)}
                      className="text-indigo-200 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">
                🛡️ Your safety comes first
              </h2>
              <p className="text-gray-300">
                We protect both sides with our built-in escrow system
              </p>
            </div>
            <div className="space-y-6">
              {escrowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg"
                  >
                    <div className={`p-3 rounded-full bg-gray-700 ${step.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{step.title}</h3>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-600">{index + 1}</span>
                  </motion.div>
                );
              })}
            </div>
            <div className="text-center">
              <button 
                onClick={() => window.open('https://help.gametrust.gg/escrow', '_blank')}
                className="text-indigo-400 hover:text-indigo-300 text-sm underline transition-colors duration-200 hover:scale-105 transform"
              >
                Learn more about how escrow works →
              </button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">
                🔥 You're all set!
              </h2>
              <p className="text-xl text-gray-300">
                Welcome to the GameTrust community
              </p>
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl"
            >
              🎉
            </motion.div>
            
            <Confetti show={showConfetti} duration={2000} />
            
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Your Profile Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-indigo-100">
                      <p><strong>Role:</strong> {selectedRoles.join(', ')}</p>
                    </div>
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="text-xs text-indigo-200 hover:text-white underline transition-colors duration-200"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-indigo-100">
                      <p><strong>Interested Games:</strong> {selectedGames.slice(0, 3).join(', ')}{selectedGames.length > 3 && ` +${selectedGames.length - 3} more`}</p>
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-indigo-200 hover:text-white underline transition-colors duration-200"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation to completed steps or the next step
    if (stepIndex <= currentStep + 1 && stepIndex >= 0) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Progress Bar with Step Indicators */}
      <div className="w-full bg-gray-800 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  index <= currentStep
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white cursor-pointer hover:scale-110'
                    : index === currentStep + 1
                    ? 'bg-gray-600 text-gray-300 cursor-pointer hover:bg-gray-500'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
                disabled={index > currentStep + 1}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Role Selection</span>
            <span>Games</span>
            <span>Safety Info</span>
            <span>Summary</span>
            <span>Complete</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mt-12"
          >
            <div className="flex items-center space-x-4">
              {currentStep > 0 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              )}
              
              {currentStep !== 1 && currentStep < totalSteps - 1 && (
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  Skip
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                {currentStep + 1} of {totalSteps}
              </span>
              
              <Button
                onClick={currentStep === totalSteps - 1 ? handleComplete : handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-2"
              >
                <span>
                  {currentStep === totalSteps - 1 ? getCompletionCTA().text : 'Continue'}
                </span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;