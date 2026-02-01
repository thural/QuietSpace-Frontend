import React, { useState } from 'react';
import { useEnterpriseAuthWithSecurity } from '@features/auth/application/hooks/useEnterpriseAuthWithSecurity';
import { useAuthMigration } from '@features/auth/application/hooks/useAuthMigration';
import { LoginBody, SignupBody } from '@shared/types/auth.dto';

// Import reusable components from shared UI
import { 
  LoadingSpinner,
  ErrorMessage,
  TwoFactorAuth,
  AuthStatus,
  SecurityStatus,
  AuthenticatedActions,
  MigrationInfo
} from '@shared/ui/components';

/**
 * Enterprise Auth Example Props
 */
interface EnterpriseAuthExampleProps {
  className?: string;
  enableMigrationMode?: boolean;
  securityLevel?: 'basic' | 'enhanced' | 'maximum';
}

/**
 * User interface for authentication user data
 */
interface IAuthUser {
  userId: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
}

/**
 * Migration Status interface
 */
interface IMigrationStatus {
  isUsingEnterprise: boolean;
  config: {
    securityLevel: 'basic' | 'enhanced' | 'maximum';
  };
  errors: Array<{
    message: string;
    timestamp: Date;
    severity: 'low' | 'medium' | 'high';
  }>;
  performance: {
    enterpriseHookTime: number;
    legacyHookTime: number;
    migrationTime: number;
  };
}

/**
 * Refactored Enterprise Authentication Example Component
 * 
 * This component demonstrates how to use the decoupled reusable components
 * from the shared UI library to build a comprehensive authentication interface.
 * 
 * Key improvements:
 * - Uses reusable class-based components from shared/ui
 * - Cleaner separation of concerns
 * - Better maintainability and reusability
 * - Consistent styling and behavior across the application
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

  // Convert auth user to our interface
  const authUser: IAuthUser | null = auth.user ? {
    userId: auth.user.userId,
    email: auth.user.email,
    username: auth.user.username,
    firstName: auth.user.firstName,
    lastName: auth.user.lastName,
    avatar: auth.user.avatar,
    role: auth.user.role
  } : null;

  // Create migration status object
  const migrationStatus: IMigrationStatus | null = enableMigrationMode ? {
    isUsingEnterprise: auth.migration.isUsingEnterprise,
    config: auth.migration.config,
    errors: auth.migration.errors.map(error => ({
      message: error.message,
      timestamp: error.timestamp,
      severity: error.severity
    })),
    performance: auth.migration.performance
  } : null;

  return (
    <div className={`enterprise-auth-example max-w-md mx-auto ${className}`}>
      {/* Migration Info */}
      {enableMigrationMode && migrationStatus && (
        <div className="mb-4">
          <MigrationInfo
            migration={migrationStatus}
            showDetails={showMigrationInfo}
            showPerformance={true}
            showErrors={true}
            variant="default"
          />
        </div>
      )}

      {/* Auth Status */}
      {auth.isAuthenticated && authUser && (
        <div className="mb-6">
          <AuthStatus
            isAuthenticated={auth.isAuthenticated}
            user={authUser}
            showUserId={true}
            showRole={true}
            showAvatar={true}
            variant="default"
          />
        </div>
      )}

      {/* Security Status */}
      {auth.isAuthenticated && (
        <div className="mb-6">
          <SecurityStatus
            requiresTwoFactor={auth.requiresTwoFactor}
            deviceTrusted={auth.deviceTrusted}
            sessionExpiry={auth.sessionExpiry}
            onTrustDevice={auth.trustDevice}
            showSessionExpiry={true}
            variant="default"
          />
        </div>
      )}

      {/* Two-Factor Auth */}
      {auth.isAuthenticated && auth.requiresTwoFactor && (
        <div className="mb-6">
          <TwoFactorAuth
            onVerify={auth.verifyTwoFactor}
            isLoading={auth.isLoading}
            maxLength={6}
            placeholder="Enter 6-digit code"
            title="Two-Factor Authentication"
            description="Enter the verification code from your authenticator app"
            variant="default"
          />
        </div>
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
      {auth.isLoading && (
        <div className="mt-4">
          <LoadingSpinner
            size="md"
            color="primary"
          />
        </div>
      )}

      {/* Error State */}
      {auth.error && (
        <div className="mt-4">
          <ErrorMessage
            error={auth.error}
            onRetry={auth.retry}
            onClear={auth.clearError}
            showRetry={true}
            showClear={true}
            variant="default"
          />
        </div>
      )}

      {/* Authenticated Actions */}
      {auth.isAuthenticated && (
        <div className="mt-6">
          <AuthenticatedActions
            onRefreshToken={auth.refreshToken}
            onCheckSession={auth.checkSession}
            onLogout={auth.logout}
            variant="default"
            showLabels={true}
            disabled={false}
          />
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
