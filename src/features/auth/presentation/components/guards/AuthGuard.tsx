import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/core/store/zustand';
import LoadingFallback from '@/app/LoadingFallback';
import ErrorFallback from '@/shared/ErrorFallback';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
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
  const { isAuthenticated, isLoading, isError } = useAuthStore();
  const location = useLocation();

  // Loading state
  if (isLoading) {
    return fallback || <LoadingFallback />;
  }

  // Error state
  if (isError) {
    return fallback || <ErrorFallback error="Authentication service unavailable" />;
  }

  // Authentication required but not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Authentication not required but authenticated (for login/register pages)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
};

export default AuthGuard;
