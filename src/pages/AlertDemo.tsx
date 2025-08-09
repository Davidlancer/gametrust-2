import React from 'react';
import { Alert } from '@heroui/react';
import { useAlert } from '../components/UI/AlertSystem';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

const AlertDemo: React.FC = () => {
  const { showAlert, showSuccess, showError, showWarning, showInfo } = useAlert();

  const handleShowAlert = (type: string) => {
    switch (type) {
      case 'success':
        showSuccess('Success! Your action was completed successfully.');
        break;
      case 'error':
        showError('Error! Something went wrong. Please try again.');
        break;
      case 'warning':
        showWarning('Warning! Please review your input before proceeding.');
        break;
      case 'info':
        showInfo('Info: Here\'s some helpful information for you.');
        break;
      default:
        showAlert({
          type: 'info',
          title: 'Default Alert',
          message: 'This is a default alert message.'
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Alert System Demo
        </h1>
        
        {/* Static HeroUI Alerts */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Static HeroUI Alerts</h2>
          <div className="space-y-4">
            <Alert 
              color="default" 
              title="Default Alert" 
              description="This is a default alert using HeroUI components."
              className="bg-gray-800 border-gray-700"
            />
            
            <Alert 
              color="primary" 
              title="Primary Alert" 
              description="This is a primary alert with cyan/teal theming."
              className="bg-cyan-900/20 border-cyan-500/30"
              startContent={<InformationCircleIcon className="w-5 h-5" />}
            />
            
            <Alert 
              color="success" 
              title="Success Alert" 
              description="This indicates a successful operation."
              className="bg-emerald-900/20 border-emerald-500/30"
              startContent={<CheckCircleIcon className="w-5 h-5" />}
            />
            
            <Alert 
              color="warning" 
              title="Warning Alert" 
              description="This is a warning message that requires attention."
              className="bg-amber-900/20 border-amber-500/30"
              startContent={<ExclamationTriangleIcon className="w-5 h-5" />}
            />
            
            <Alert 
              color="danger" 
              title="Danger Alert" 
              description="This indicates an error or dangerous action."
              className="bg-red-900/20 border-red-500/30"
              startContent={<XCircleIcon className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Interactive Alert System */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Interactive Alert System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleShowAlert('default')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 font-medium"
            >
              Show Default Alert
            </button>
            
            <button
              onClick={() => handleShowAlert('success')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors duration-200 font-medium"
            >
              Show Success Alert
            </button>
            
            <button
              onClick={() => handleShowAlert('error')}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg transition-colors duration-200 font-medium"
            >
              Show Error Alert
            </button>
            
            <button
              onClick={() => handleShowAlert('warning')}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors duration-200 font-medium"
            >
              Show Warning Alert
            </button>
            
            <button
              onClick={() => handleShowAlert('info')}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors duration-200 font-medium"
            >
              Show Info Alert
            </button>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-cyan-400">Usage Instructions</h3>
          <div className="space-y-3 text-gray-300">
            <p>• <strong>Static Alerts:</strong> Use HeroUI Alert components directly in your JSX</p>
            <p>• <strong>Interactive Alerts:</strong> Use the AlertProvider hooks (showSuccess, showError, etc.)</p>
            <p>• <strong>Legacy Support:</strong> Existing alert() calls can be replaced with createLegacyAlert()</p>
            <p>• <strong>Styling:</strong> All alerts use the website's cyan/teal color scheme</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDemo;