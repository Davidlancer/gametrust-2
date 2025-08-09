import React from 'react';
import Button from './UI/Button';
import Card from './UI/Card';
import { useSimpleToast } from './UI/SimpleToast';

const ToastTest: React.FC = () => {
  const { addToast: addSimpleToast, ToastContainer } = useSimpleToast();



  return (
    <div className="p-6 space-y-6">
      <ToastContainer />
      <Card>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Simple Toast System Test</h2>
          <p className="text-gray-400 mb-6">
            Test the SimpleToast system functionality.
          </p>
        </div>
      </Card>
      
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">Simple Toast System</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => addSimpleToast({ title: 'Success!', description: 'Simple toast working', type: 'success' })}
              variant="primary"
              className="bg-gradient-to-r from-green-500 to-green-600"
            >
              Simple Success Toast
            </Button>
            <Button 
              onClick={() => addSimpleToast({ title: 'Error!', description: 'Simple error toast', type: 'error' })}
              variant="primary"
              className="bg-gradient-to-r from-red-500 to-red-600"
            >
              Simple Error Toast
            </Button>
            <Button 
              onClick={() => addSimpleToast({ title: 'Warning!', description: 'Simple warning toast', type: 'warning' })}
              variant="primary"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600"
            >
              Simple Warning Toast
            </Button>
            <Button 
              onClick={() => addSimpleToast({ title: 'Info!', description: 'Simple info toast', type: 'info' })}
              variant="primary"
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              Simple Info Toast
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ToastTest;