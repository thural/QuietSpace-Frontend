/**
 * Enterprise Authentication Example Component
 * 
 * Demonstrates the usage of enterprise authentication hooks with
 * advanced security features, error handling, and performance optimization
 */

import React, { useState } from 'react';
import { useEnterpriseAuthWithSecurity } from '@features/auth/application/hooks/useEnterpriseAuthWithSecurity';
import { useAuthMigration } from '@features/auth/application/hooks/useAuthMigration';
import { LoginBody, SignupBody } from '@shared/types/auth.dto';

/**
 * Enterprise Auth Example Props
 */
interface EnterpriseAuthExampleProps {
  className?: string;
  enableMigrationMode?: boolean;
  securityLevel?: 'basic' | 'enhanced' | 'maximum';
}

/**
 * Loading Spinner Component
 */
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
  </div>
);

/**
 * Error Message Component
 */
const ErrorMessage: React.FC<{ error: string; onRetry: () => void; onClear: () => void }> = ({ 
  error, 
  onRetry, 
  onClear 
}) => (
  <div className="error-message p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="text-red-700">{error}</div>
    <div className="mt-2 flex space-x-2">
      <button 
        onClick={onRetry}
        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
      >
        Retry
      </button>
      <button 
        onClick={onClear}
        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
      >
        Clear
      </button>
    </div>
  </div>
);

/**
 * Security Status Component
 */
const SecurityStatus: React.FC<{ 
  requiresTwoFactor: boolean; 
  deviceTrusted: boolean; 
  sessionExpiry: Date | null;
  onTrustDevice: () => void;
}> = ({ requiresTwoFactor, deviceTrusted, sessionExpiry, onTrustDevice }) => (
  <div className="security-status p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="font-medium mb-2">Security Status</div>
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span>Two-Factor Auth:</span>
        <span className={`px-2 py-1 rounded text-xs ${
          requiresTwoFactor ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {requiresTwoFactor ? 'Required' : 'Not Required'}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>Device Trust:</span>
        <span className={`px-2 py-1 rounded text-xs ${
          deviceTrusted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {deviceTrusted ? 'Trusted' : 'Not Trusted'}
        </span>
      </div>
      {sessionExpiry && (
        <div className="flex items-center justify-between">
          <span>Session Expires:</span>
          <span className="text-xs text-gray-600">
            {sessionExpiry.toLocaleString()}
          </span>
        </div>
      )}
    </div>
    {!deviceTrusted && (
      <button 
        onClick={onTrustDevice}
        className="mt-3 w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        Trust This Device
      </button>
    )}
  </div>
);

/**
 * Two-Factor Auth Component
 */
const TwoFactorAuth: React.FC<{ 
  onVerify: (code: string) => Promise<void>; 
  isLoading: boolean;
}> = ({ onVerify, isLoading }) => {
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      await onVerify(code.trim());
    }
  };

  return (
    <div className="two-factor-auth p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="font-medium mb-2">Two-Factor Authentication</div>
      <p className="text-sm text-gray-600 mb-4">
        Enter the verification code from your authenticator app
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter 6-digit code"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={6}
        />
        <button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
    </div>
  );
};

/**
 * Enterprise Auth Example Component
 */
export const EnterpriseAuthExample: React.FC<EnterpriseAuthExampleProps> = ({
  className = '',
  enableMigrationMode = false,
  securityLevel = 'enhanced'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showMigrationInfo, setShowMigrationInfo] = useState(false);

  // Use either migration hook or direct enterprise hook
  const auth = enableMigrationMode 
    ? useAuthMigration({
        useEnterpriseHooks: true,
        enableFallback: true,
        logMigrationEvents: true,
        securityLevel
      })
    : useEnterpriseAuthWithSecurity();

  // Form states
  const [loginForm, setLoginForm] = useState<LoginBody>({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState<SignupBody>({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: ''
  });

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth.login(loginForm);
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth.signup(signupForm);
  };

  // Handle form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`enterprise-auth-example max-w-md mx-auto ${className}`}>
      {/* Migration Info */}
      {enableMigrationMode && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Migration Mode</span>
            <button
              onClick={() => setShowMigrationInfo(!showMigrationInfo)}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              {showMigrationInfo ? 'Hide' : 'Show'} Info
            </button>
          </div>
          {showMigrationInfo && (
            <div className="mt-2 text-xs text-gray-600">
              <div>Status: {auth.migration.isUsingEnterprise ? 'Enterprise' : 'Legacy'}</div>
              <div>Security Level: {auth.migration.config.securityLevel}</div>
              <div>Errors: {auth.migration.errors.length}</div>
              <div>Performance: {auth.migration.performance.enterpriseHookTime.toFixed(2)}ms</div>
            </div>
          )}
        </div>
      )}

      {/* Auth Status */}
      {auth.isAuthenticated && auth.user && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="font-medium text-green-800">Authenticated</div>
          <div className="text-sm text-green-600">
            Welcome, {auth.user.email || auth.user.username}!
          </div>
          <div className="text-xs text-green-500 mt-1">
            User ID: {auth.user.userId}
          </div>
        </div>
      )}

      {/* Security Status */}
      {auth.isAuthenticated && (
        <SecurityStatus
          requiresTwoFactor={auth.requiresTwoFactor}
          deviceTrusted={auth.deviceTrusted}
          sessionExpiry={auth.sessionExpiry}
          onTrustDevice={auth.trustDevice}
        />
      )}

      {/* Two-Factor Auth */}
      {auth.isAuthenticated && auth.requiresTwoFactor && (
        <TwoFactorAuth
          onVerify={auth.verifyTwoFactor}
          isLoading={auth.isLoading}
        />
      )}

      {/* Auth Forms */}
      {!auth.isAuthenticated && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Mode Toggle */}
          <div className="flex border-b">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 px-4 py-3 font-medium ${
                mode === 'login' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 px-4 py-3 font-medium ${
                mode === 'signup' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="p-6">
            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={auth.isLoading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                  {auth.isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={signupForm.firstName}
                      onChange={handleSignupChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={signupForm.lastName}
                      onChange={handleSignupChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={signupForm.username}
                    onChange={handleSignupChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={auth.isLoading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                  {auth.isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {auth.isLoading && <LoadingSpinner />}

      {/* Error State */}
      {auth.error && (
        <ErrorMessage 
          error={auth.error} 
          onRetry={auth.retry}
          onClear={auth.clearError}
        />
      )}

      {/* Authenticated Actions */}
      {auth.isAuthenticated && (
        <div className="mt-6 space-y-3">
          <button
            onClick={auth.refreshToken}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Refresh Token
          </button>
          <button
            onClick={auth.checkSession}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Check Session
          </button>
          <button
            onClick={auth.logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-gray-100 rounded text-xs">
          <div className="font-medium mb-2">Debug Information:</div>
          <div>Authenticated: {auth.isAuthenticated.toString()}</div>
          <div>Loading: {auth.isLoading.toString()}</div>
          <div>Error: {auth.error || 'None'}</div>
          <div>Login Attempts: {auth.loginAttempts}</div>
          <div>Requires 2FA: {auth.requiresTwoFactor.toString()}</div>
          <div>Device Trusted: {auth.deviceTrusted.toString()}</div>
          {auth.user && <div>User ID: {auth.user.userId}</div>}
          {auth.sessionExpiry && (
            <div>Session Expires: {auth.sessionExpiry.toLocaleString()}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnterpriseAuthExample;
