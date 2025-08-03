import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

interface AdminLoginProps {
  onNavigate: (page: string) => void;
}

export default function AdminLogin({ onNavigate }: AdminLoginProps) {
  const handleLogin = () => {
    const fakeAdmin = {
      id: "ADMIN001",
      username: "admin",
      role: "admin",
      name: "Admin User",
      email: "admin@gametrust.com",
      isAuthenticated: true
    };
    localStorage.setItem("current_user", JSON.stringify(fakeAdmin));
    onNavigate('admin-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
            <p className="text-gray-400">Secure admin portal login</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Demo Credentials</h3>
              <div className="space-y-1 text-sm text-gray-400">
                <p><span className="text-gray-300">Username:</span> admin</p>
                <p><span className="text-gray-300">Role:</span> Administrator</p>
                <p><span className="text-gray-300">Access:</span> Full system control</p>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Login as Admin
            </Button>

            <div className="text-center">
              <button
                onClick={() => onNavigate('home')}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                ← Back to Home
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              🧪 This is a frontend-only demo. No real authentication required.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}