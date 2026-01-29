import React, { Component, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, AuthState } from '@/core/store/zustand';
import LoadingFallback from '@/app/LoadingFallback';
import ErrorFallback from '@/shared/ui/components/feedback/ErrorFallback';

// Define strict TypeScript interfaces
interface IAuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

interface IAuthGuardState {
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
 * - Unauthenticated users (requireAuth=true) -> /signin
 * - Authenticated users on auth pages (requireAuth=false) -> /feed
 */
export class AuthGuard extends Component<IAuthGuardProps, IAuthGuardState> {
  // Use private properties for services
  private unsubscribe?: () => void;

  // Constructor with method binding
  constructor(props: IAuthGuardProps) {
    super(props);

    // Initialize state properly
    this.state = {
      isAuthenticated: false,
      isLoading: true,
      isError: false,
      isInitialized: false,
      location: null
    };
  }

  // Group lifecycle methods
  componentDidMount(): void {
    this.initializeAuth();
  }

  componentWillUnmount(): void {
    // Cleanup subscriptions
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // Extract complex logic into private methods
  private initializeAuth = (): void => {
    // Get initial auth state using the hook directly
    const authState = useAuthStore.getState();

    this.setState({
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      isError: authState.isError,
      isInitialized: true,
      location: window.location
    });

    // Subscribe to auth changes using Zustand's subscribe method
    this.unsubscribe = useAuthStore.subscribe((state) => {
      this.setState({
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        isError: state.isError
      });
    });
  };

  // Extract render helpers for clean JSX
  private renderLoadingState = (): ReactNode => {
    const { fallback } = this.props;
    return fallback || <LoadingFallback />;
  };

  private renderErrorState = (): ReactNode => {
    const { fallback } = this.props;
    return fallback || <ErrorFallback error="Authentication service unavailable" />;
  };

  private renderRedirectToSignIn = (): ReactNode => {
    const { redirectTo } = this.props;
    const { location } = this.state;

    return (
      <Navigate to={redirectTo} state={{ from: location }} replace />
    );
  };

  private renderRedirectToFeed = (): ReactNode => {
    return <Navigate to="/feed" replace />;
  };

  private renderChildren = (): ReactNode => {
    const { children } = this.props;
    return <>{children}</>;
  };

  // Keep render method clean and focused
  render(): ReactNode {
    // Destructure props and state for readability
    const { requireAuth } = this.props;
    const { isAuthenticated, isLoading, isError, isInitialized } = this.state;

    // Handle initialization state
    if (!isInitialized) {
      return this.renderLoadingState();
    }

    // Loading state
    if (isLoading) {
      return this.renderLoadingState();
    }

    // Error state
    if (isError) {
      return this.renderErrorState();
    }

    // Authentication required but not authenticated
    if (requireAuth && !isAuthenticated) {
      return this.renderRedirectToSignIn();
    }

    // Authentication not required but authenticated (for login/register pages)
    if (!requireAuth && isAuthenticated) {
      return this.renderRedirectToFeed();
    }

    // All checks passed - render children
    return this.renderChildren();
  }
}

export default AuthGuard;
