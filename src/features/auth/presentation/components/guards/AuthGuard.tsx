import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFeatureAuth } from '@/core/hooks/useAuthentication';
import LoadingFallback from '@/app/LoadingFallback';
import ErrorFallback from '@/shared/ui/components/feedback/ErrorFallback';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

interface AuthGuardState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  isInitialized: boolean;
  location: Location | null;
}

/**
 * Enterprise-grade authentication guard component
 * 
 * Provides layered authentication checking with proper fallbacks
 * and enterprise-standard error handling.
 * 
 * Redirects:
 * - Unauthenticated users (requireAuth=true) → /signin
 * - Authenticated users on auth pages (requireAuth=false) → /feed
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/signin',
  fallback
}) => {
  const { isAuthenticated } = useFeatureAuth();
  const location = useLocation();

  // Enhanced state management for robustness
  const [state, setState] = useState<AuthGuardState>({
    isAuthenticated: false,
    isLoading: true,
    isError: false,
    isInitialized: false,
    location: null
  });

  // Initialize authentication state with proper error handling
  useEffect(() => {
    try {
      setState({
        isAuthenticated,
        isLoading: false,
        isError: false,
        isInitialized: true,
        location: window.location
      });
    } catch (error) {
      console.error('AuthGuard initialization error:', error);
      setState({
        isAuthenticated: false,
        isLoading: false,
        isError: true,
        isInitialized: true,
        location: window.location
      });
    }
  }, [isAuthenticated]);

  // Loading state during initialization
  if (!state.isInitialized) {
    return fallback || <LoadingFallback />;
  }

  // Loading state
  if (state.isLoading) {
    return fallback || <LoadingFallback />;
  }

  // Error state
  if (state.isError) {
    return fallback || <ErrorFallback error="Authentication service unavailable" />;
  }

  // Authentication required but not authenticated
  if (requireAuth && !state.isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: state.location || location }} replace />;
  }

  // Authentication not required but authenticated (for login/register pages)
  if (!requireAuth && state.isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
};

export default AuthGuard;
