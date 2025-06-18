import React from 'react';
import { Upload, Shield, CheckCircle } from 'lucide-react';
import Card from '../UI/Card';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      title: 'List Your Account',
      description: 'Upload your gaming account with detailed information, screenshots, and verification documents.',
      color: 'text-blue-400'
    },
    {
      icon: Shield,
      title: 'Secure Escrow',
      description: 'Once a buyer is found, funds are held securely in escrow until the transfer is completed.',
      color: 'text-green-400'
    },
    {
      icon: CheckCircle,
      title: 'Safe Delivery',
      description: 'Account details are transferred, verified, and funds are released. Both parties are protected.',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How GameTrust Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our three-step process ensures safe, secure, and transparent transactions for all gaming account trades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} hover className="text-center relative transform transition-transform duration-300 hover:scale-105">
              <div className="absolute top-4 right-4 w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                <span className="text-indigo-400 font-bold text-sm">{index + 1}</span>
              </div>
              <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700/50 ${step.color} mb-4 animate-pulse`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent"></div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">100% Secure • Escrow Protected • Verified Accounts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;