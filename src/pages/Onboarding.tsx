import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, User, Gamepad2, CheckCircle, Shield } from 'lucide-react';
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

  const totalSteps = 3;
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

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
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
      case 0: return selectedRoles.length > 0;
      case 1: return selectedGames.length > 0;
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
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">What brings you to GameTrust?</h2>
              <p className="text-xl text-gray-400">
                Select your primary interest to personalize your experience
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'buyer', label: 'Buy Gaming Accounts', desc: 'Looking to purchase verified gaming accounts' },
                { id: 'seller', label: 'Sell Gaming Accounts', desc: 'Want to sell your gaming accounts securely' },
                { id: 'both', label: 'Both Buying & Selling', desc: 'Interested in both buying and selling accounts' }
              ].map((role) => (
                <Card
                  key={role.id}
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    selectedRoles.includes(role.id)
                      ? 'ring-2 ring-indigo-500 bg-indigo-500/10'
                      : 'hover:bg-gray-700/50'
                  }`}
                  onCardClick={() => handleRoleToggle(role.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{role.label}</h3>
                      <p className="text-gray-400">{role.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedRoles.includes(role.id)
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-400'
                    }`}>
                      {selectedRoles.includes(role.id) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">What games interest you?</h2>
              <p className="text-xl text-gray-400">
                Select the games you're interested in trading
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
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
            
            <div className="flex space-x-2 mb-4">
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

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                🎉 You're all set!
              </h2>
              <p className="text-xl text-gray-300">
                Welcome to the GameTrust community
              </p>
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-8"
            >
              🚀
            </motion.div>
            
            <Confetti show={showConfetti} duration={2000} />
            
            <Card className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Your Profile Summary</h3>
              <div className="space-y-3 text-left">
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
            </Card>
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
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              )}
              
              {currentStep !== 0 && currentStep < totalSteps - 1 && (
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
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;