import React from 'react';
import { Search, Shield, Zap, ArrowRight } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface HowItWorksProps {
  onNavigate?: (page: string) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  const steps = [
    {
      icon: Search,
      title: 'Browse Accounts',
      description: 'Discover thousands of verified gaming accounts across popular games and platforms.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Shield,
      title: 'Buy with Escrow',
      description: 'Your payment is protected in escrow until you receive and verify your account.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: Zap,
      title: 'Get Instant Delivery',
      description: 'Receive your account details instantly and start gaming within minutes.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/3 to-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 mb-6">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span className="text-indigo-300 text-sm font-medium">Simple & Secure Process</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            How <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">GameTrust</span> Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get started in minutes with our streamlined process designed for gamers, by gamers.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-full w-12 lg:w-24 h-0.5 bg-gradient-to-r from-gray-600 to-gray-700 transform translate-x-0 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
                </div>
              )}
              
              <Card className={`relative p-8 sm:p-10 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl group-hover:shadow-indigo-500/10 ${step.bgColor} border ${step.borderColor} backdrop-blur-sm`}>
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full flex items-center justify-center border-2 border-gray-600 group-hover:border-indigo-500/50 transition-colors duration-300">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>

                {/* Icon */}
                <div className="mb-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${step.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full bg-gray-900 rounded-2xl flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
                    {step.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-gray-600/50 max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 mb-4">
                <Shield className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-green-300 text-sm font-medium">100% Secure • Escrow Protected</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-300 text-lg mb-8">
                Join thousands of gamers who trust GameTrust for secure account trading.
              </p>
            </div>
            
            <Button 
              size="lg"
              onClick={() => onNavigate?.('marketplace')}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
            >
              <span>Start Exploring Now</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;