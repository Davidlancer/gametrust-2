import React from 'react';
import { ArrowRight, Users, TrendingUp } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
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

interface PlatformsProps {
  onNavigate: (page: string) => void;
}

const Platforms: React.FC<PlatformsProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gaming Platforms
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Browse accounts by your favorite games. Each platform offers verified accounts 
            with secure escrow protection and detailed verification.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {games.map((game) => (
            <Card key={game.id} hover className="group">
              <div className="flex items-start space-x-6">
                {/* Game Icon */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center"
                    style={{ 
                      backgroundImage: `url(${game.icon})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="w-full h-full bg-black/20 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{game.shortName}</span>
                    </div>
                  </div>
                </div>

                {/* Game Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {game.description}
                  </p>

                  {/* Platforms */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.platforms.map((platform) => (
                      <span 
                        key={platform}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-md"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>2.3k+ listings</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>$50-$500 range</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button 
                      size="sm"
                      onClick={() => onNavigate(`marketplace?game=${game.id}`)}
                      className="group"
                    >
                      <span>View Listings</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onNavigate('sell')}
                    >
                      Sell Account
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Platform Request */}
        <Card className="text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Don't see your game?
            </h3>
            <p className="text-gray-400 mb-6">
              We're constantly adding new gaming platforms based on community demand. 
              Request your favorite game and we'll prioritize its addition to GameTrust.
            </p>
            <Button variant="secondary">
              Request New Platform
            </Button>
          </div>
        </Card>

        {/* Platform Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400">Game Platforms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">15k+</div>
              <div className="text-gray-400">Active Listings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">$2.5M+</div>
              <div className="text-gray-400">Trade Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">99.8%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platforms;