import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { apiService } from '../services/api';

interface AuthProps {
  onNavigate: (page: string) => void;
  onAuthSuccess?: () => void;
}

interface UserData {
  role: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: UserData;
    refreshToken: string;
  };
}

// const DEV_MODE = true; // Toggle for testing mode - currently unused

const Auth: React.FC<AuthProps> = ({ onNavigate, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName': {
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        return '';
      }
      case 'lastName': {
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        return '';
      }
      case 'email': {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      }
      case 'username': {
        if (!value.trim()) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username must be less than 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';
      }
      case 'password': {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character (@$!%*?&)';
        return '';
      }
      case 'confirmPassword': {
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      }
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (isSignUp) {
      errors.firstName = validateField('firstName', formData.firstName);
      errors.lastName = validateField('lastName', formData.lastName);
      errors.username = validateField('username', formData.username);
      errors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    }
    
    errors.email = validateField('email', formData.email);
    errors.password = validateField('password', formData.password);
    
    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Debug logging with masked password
        console.log('Registration payload:', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          username: formData.username,
          password: '***'
        });
        
        const response = await apiService.auth.register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          username: formData.username,
          password: formData.password
        });
        
        // Log the full response object for debugging
        console.log('Full registration response:', response);
        console.log('Registration response status:', response.status);
        console.log('Registration response data:', response.data);
        
        const responseData = response.data as AuthResponse;
        
        // Check for successful response
        if (response.status === 200 && responseData.success === true && responseData.data) {
          const { token, user, refreshToken } = responseData.data;
          
          // Store authentication token and user data
          localStorage.setItem('auth_token', token);
          localStorage.setItem('current_user', JSON.stringify(user));
          localStorage.setItem('refresh_token', refreshToken);
          
          console.log('Registration successful:', { 
            email: formData.email, 
            username: formData.username,
            hasToken: !!token,
            userRole: user.role,
            message: responseData.message
          });
          
          // Update parent authentication state
          if (onAuthSuccess) {
            onAuthSuccess();
          }
          
          onNavigate('onboarding');
        } else {
          // Handle unsuccessful response
          const errorMessage = responseData.message || 'Registration failed';
          console.error('Registration failed - Backend returned unsuccessful response:', {
            status: response.status,
            success: responseData.success,
            message: responseData.message,
            hasData: !!responseData.data
          });
          throw new Error(errorMessage);
        }
      } else {
        // Validate form data before sending
        console.log('Form data validation:', {
          email: formData.email,
          emailType: typeof formData.email,
          emailLength: formData.email?.length,
          emailEmpty: !formData.email || formData.email.trim() === '',
          password: formData.password ? '***' : 'UNDEFINED/EMPTY',
          passwordType: typeof formData.password,
          passwordLength: formData.password?.length,
          passwordEmpty: !formData.password || formData.password.trim() === ''
        });
        
        // Check for empty or undefined values
        if (!formData.email || formData.email.trim() === '') {
          throw new Error('Email is required');
        }
        if (!formData.password || formData.password.trim() === '') {
          throw new Error('Password is required');
        }
        
        // Log the exact payload being sent
        const loginPayload = {
          email: formData.email.trim(),
          password: formData.password
        };
        console.log('Login payload being sent:', {
          email: loginPayload.email,
          password: '***',
          payloadKeys: Object.keys(loginPayload)
        });
        
        const response = await apiService.auth.login(loginPayload);
        
        // Log the full response object for debugging
        console.log('=== LOGIN RESPONSE DEBUG ===');
        console.log('Full login response:', response);
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        console.log('Response data type:', typeof response.data);
        
        const responseData = response.data as AuthResponse;
        console.log('Response data success:', responseData?.success);
        console.log('Response data success type:', typeof responseData?.success);
        console.log('Response data has data:', !!responseData?.data);
        console.log('=== END LOGIN RESPONSE DEBUG ===');
        
        // Check for successful response
        if (response.status === 200 && responseData.success === true && responseData.data) {
          const { token, user, refreshToken } = responseData.data;
          
          // Store authentication token and user data
          localStorage.setItem('auth_token', token);
          localStorage.setItem('current_user', JSON.stringify(user));
          localStorage.setItem('refresh_token', refreshToken);
          
          console.log('Login successful:', { 
            email: formData.email, 
            hasToken: !!token, 
            userRole: user.role,
            message: responseData.message 
          });
          
          // Update parent authentication state
          if (onAuthSuccess) {
            onAuthSuccess();
          }
          
          // Route based on user role
          if (user && user.role === 'admin') {
            onNavigate('admin-dashboard');
          } else if (user) {
            // Check if user has completed onboarding
            const onboarded = localStorage.getItem('onboardingComplete');
            if (onboarded === 'true') {
              if (user.role === 'buyer') {
                onNavigate('buyer-dashboard');
              } else {
                onNavigate('seller-dashboard');
              }
            } else {
              onNavigate('onboarding');
            }
          }
        } else {
          // Handle unsuccessful response
          const errorMessage = responseData.message || 'Login failed';
          console.error('Login failed - Backend returned unsuccessful response:', {
            status: response.status,
            success: responseData.success,
            message: responseData.message,
            hasData: !!responseData.data
          });
          throw new Error(errorMessage);
        }
      }
    } catch (err: unknown) {
      // Log the full error object for debugging
      console.error(`${isSignUp ? 'Registration' : 'Login'} - Full error object:`, err);
      
      // Extract meaningful error message
      const isAxiosError = err && typeof err === 'object' && 'response' in err;
      const isRegularError = err instanceof Error;
      let message = isSignUp ? 'Registration failed' : 'Login failed';
      
      if (isAxiosError) {
        const axiosError = err as { response?: { data?: { message?: string; success?: boolean }; status?: number }; message?: string };
        
        // Log detailed error information
        console.error(`${isSignUp ? 'Registration' : 'Login'} - Axios error details:`, {
          status: axiosError.response?.status,
          responseData: axiosError.response?.data,
          requestMessage: axiosError.message
        });
        
        // Extract error message from response.data.message as requested
        message = axiosError.response?.data?.message || axiosError.message || message;
        
        // Additional logging for debugging
        console.error(`${isSignUp ? 'Registration' : 'Login'} error (full response):`, axiosError.response?.data);
        console.error(`${isSignUp ? 'Registration' : 'Login'} error (full error):`, err);
      } else if (isRegularError) {
        // Handle backend validation errors (thrown from our success check above)
        message = err.message;
        console.error(`${isSignUp ? 'Registration' : 'Login'} - Backend validation error:`, {
          errorMessage: err.message,
          fullError: err
        });
      } else {
        // Network/preflight errors
        message = 'Network error. Check server or CORS.';
        console.error(`${isSignUp ? 'Registration' : 'Login'} - Network/other error:`, {
          errorType: typeof err,
          errorMessage: err instanceof Error ? err.message : 'Unknown error',
          fullError: err
        });
      }
      
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setFieldErrors({
        ...fieldErrors,
        [name]: error
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16 flex items-center justify-center">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        <Card className="backdrop-blur-sm bg-gray-800/90">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400">
              {isSignUp 
                ? 'Join GameTrust to start trading safely' 
                : 'Sign in to your GameTrust account'
              }
            </p>
            
            {/* Development Mode Banner */}
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-yellow-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Testing Mode Active</span>
              </div>
              <p className="text-xs text-yellow-300 mt-1">
                Buyer: buyer@gametrust.gg / password123<br/>
                Seller: test@gametrust.gg / password123
              </p>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex mb-6 bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                !isSignUp 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                isSignUp 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        fieldErrors.firstName ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="First name"
                      required
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-sm text-red-400">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        fieldErrors.lastName ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Last name"
                      required
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-sm text-red-400">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        fieldErrors.username ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                  {fieldErrors.username && (
                    <p className="mt-1 text-sm text-red-400">{fieldErrors.username}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          {!isSignUp && (
            <div className="text-center mt-4">
              <a href="#" className="text-indigo-400 hover:text-indigo-300 text-sm">
                Forgot your password?
              </a>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>🔒 Secure</span>
              <span>•</span>
              <span>✓ Verified</span>
              <span>•</span>
              <span>🛡️ Protected</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;