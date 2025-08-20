import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Database, Shield, Zap, ArrowRight, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getAirtableAuthUrl, handleAirtableCallback } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCallback = async (code, state) => {
    setLoading(true);
    try {
      await handleAirtableCallback(code, state);
      navigate('/dashboard');
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Handle OAuth callback
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      setError('Authentication was cancelled or failed');
      return;
    }

    if (code && state) {
      handleCallback(code, state);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAirtableLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authUrl = await getAirtableAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      setError('Failed to initialize authentication. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <LoadingSpinner text="Connecting to Airtable..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">AF</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Airtable Form Builder
              </h1>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Transform your Airtable data collection
            </h2>
            
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Create beautiful, intelligent forms that sync directly with your Airtable bases. 
              No complex setup, no data migration - just seamless integration.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Database size={16} className="text-white" />
                </div>
                <span className="text-blue-100">Direct Airtable integration</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="text-blue-100">Smart conditional logic</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <span className="text-blue-100">Secure OAuth authentication</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back
              </h3>
              <p className="text-gray-600">
                Connect your Airtable account to get started
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Authentication Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <button
                onClick={handleAirtableLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
              >
                <Database size={24} />
                <span>Connect with Airtable</span>
                <ArrowRight size={20} />
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  By continuing, you agree to our{' '}
                  <button 
                    onClick={() => alert('Terms of Service - Coming Soon')} 
                    className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button 
                    onClick={() => alert('Privacy Policy - Coming Soon')} 
                    className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </p>
              </div>
            </div>

            {/* OAuth Security Notice */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3">
                <Shield size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Secure Authentication
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    We use Airtable's official OAuth 2.0 flow to securely connect to your account. 
                    Your credentials are never stored on our servers, and you can revoke access at any time.
                  </p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-2">
                Need help getting started?
              </p>
              <div className="space-x-4">
                <button 
                  onClick={() => alert('Documentation - Check our README.md file!')} 
                  className="text-blue-600 text-sm hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  View Documentation
                </button>
                <span className="text-gray-300">•</span>
                <button 
                  onClick={() => alert('Contact Support - support@bustbrainlabs.com')} 
                  className="text-blue-600 text-sm hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
