import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Authenticated Actions Props
 */
export interface IAuthenticatedActionsProps extends IBaseComponentProps {
  onRefreshToken?: () => void;
  onCheckSession?: () => void;
  onLogout?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  variant?: 'default' | 'compact' | 'horizontal';
  showLabels?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Authenticated Actions State
 */
export interface IAuthenticatedActionsState extends IBaseComponentState {
  isRefreshing: boolean;
  isCheckingSession: boolean;
  isLoggingOut: boolean;
  lastAction: string | null;
}

/**
 * Reusable Authenticated Actions Component
 * 
 * Provides common actions for authenticated users like refresh token,
 * check session, logout, profile, and settings.
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class AuthenticatedActions extends BaseClassComponent<IAuthenticatedActionsProps, IAuthenticatedActionsState> {
  
  protected override getInitialState(): Partial<IAuthenticatedActionsState> {
    return {
      isRefreshing: false,
      isCheckingSession: false,
      isLoggingOut: false,
      lastAction: null
    };
  }

  /**
   * Handle refresh token action
   */
  private handleRefreshToken = async (): Promise<void> => {
    const { onRefreshToken } = this.props;
    
    if (!onRefreshToken || this.state.isRefreshing) {
      return;
    }

    this.safeSetState({ isRefreshing: true, lastAction: 'refreshToken' });

    try {
      await onRefreshToken();
      this.safeSetState({ isRefreshing: false, lastAction: 'refreshToken-success' });
    } catch (error) {
      this.safeSetState({ isRefreshing: false, lastAction: 'refreshToken-error' });
    }
  };

  /**
   * Handle check session action
   */
  private handleCheckSession = async (): Promise<void> => {
    const { onCheckSession } = this.props;
    
    if (!onCheckSession || this.state.isCheckingSession) {
      return;
    }

    this.safeSetState({ isCheckingSession: true, lastAction: 'checkSession' });

    try {
      await onCheckSession();
      this.safeSetState({ isCheckingSession: false, lastAction: 'checkSession-success' });
    } catch (error) {
      this.safeSetState({ isCheckingSession: false, lastAction: 'checkSession-error' });
    }
  };

  /**
   * Handle logout action
   */
  private handleLogout = async (): Promise<void> => {
    const { onLogout } = this.props;
    
    if (!onLogout || this.state.isLoggingOut) {
      return;
    }

    this.safeSetState({ isLoggingOut: true, lastAction: 'logout' });

    try {
      await onLogout();
      this.safeSetState({ isLoggingOut: false, lastAction: 'logout-success' });
    } catch (error) {
      this.safeSetState({ isLoggingOut: false, lastAction: 'logout-error' });
    }
  };

  /**
   * Handle profile action
   */
  private handleProfile = (): void => {
    const { onProfile } = this.props;
    
    if (onProfile) {
      onProfile();
      this.safeSetState({ lastAction: 'profile' });
    }
  };

  /**
   * Handle settings action
   */
  private handleSettings = (): void => {
    const { onSettings } = this.props;
    
    if (onSettings) {
      onSettings();
      this.safeSetState({ lastAction: 'settings' });
    }
  };

  /**
   * Get button classes based on action and state
   */
  private getButtonClasses(action: string, isLoading: boolean): string {
    const { variant = 'default', disabled = false } = this.props;
    const baseClasses = 'font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1';
    
    const isDisabled = disabled || isLoading;
    
    // Action-specific colors
    const actionColors = {
      refreshToken: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
      checkSession: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
      logout: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
      profile: 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500',
      settings: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500'
    };

    // Variant-specific sizing
    const variantSizes = {
      default: 'w-full px-4 py-2',
      compact: 'w-full px-3 py-1.5 text-sm',
      horizontal: 'px-3 py-2 text-sm'
    };

    return `${baseClasses} ${actionColors[action as keyof typeof actionColors]} ${variantSizes[variant]} ${
      isDisabled ? 'opacity-50 cursor-not-allowed' : ''
    }`;
  }

  /**
   * Get action status indicator
   */
  private getActionStatus(action: string): React.ReactNode {
    const { lastAction } = this.state;
    
    if (lastAction === `${action}-success`) {
      return <span className="ml-1 text-green-400">✓</span>;
    }
    
    if (lastAction === `${action}-error`) {
      return <span className="ml-1 text-red-400">✗</span>;
    }
    
    return null;
  }

  protected override renderContent(): React.ReactNode {
    const { 
      variant = 'default', 
      showLabels = true,
      disabled = false,
      className = '' 
    } = this.props;
    const { 
      isRefreshing, 
      isCheckingSession, 
      isLoggingOut 
    } = this.state;

    const isHorizontal = variant === 'horizontal';
    const containerClasses = isHorizontal 
      ? 'flex space-x-2' 
      : 'space-y-3';

    return (
      <div className={`authenticated-actions ${containerClasses} ${className}`} data-testid="authenticated-actions">
        {/* Refresh Token Button */}
        {this.props.onRefreshToken && (
          <button
            onClick={this.handleRefreshToken}
            disabled={disabled || isRefreshing}
            className={this.getButtonClasses('refreshToken', isRefreshing)}
            data-testid="refresh-token-button"
          >
            {isRefreshing ? (
              <>
                <span className="inline-block animate-spin mr-1">⟳</span>
                Refreshing...
              </>
            ) : (
              <>
                <span className="mr-1">🔄</span>
                {showLabels && 'Refresh Token'}
              </>
            )}
            {this.getActionStatus('refreshToken')}
          </button>
        )}

        {/* Check Session Button */}
        {this.props.onCheckSession && (
          <button
            onClick={this.handleCheckSession}
            disabled={disabled || isCheckingSession}
            className={this.getButtonClasses('checkSession', isCheckingSession)}
            data-testid="check-session-button"
          >
            {isCheckingSession ? (
              <>
                <span className="inline-block animate-pulse mr-1">⚡</span>
                Checking...
              </>
            ) : (
              <>
                <span className="mr-1">🔍</span>
                {showLabels && 'Check Session'}
              </>
            )}
            {this.getActionStatus('checkSession')}
          </button>
        )}

        {/* Profile Button */}
        {this.props.onProfile && (
          <button
            onClick={this.handleProfile}
            disabled={disabled}
            className={this.getButtonClasses('profile', false)}
            data-testid="profile-button"
          >
            <span className="mr-1">👤</span>
            {showLabels && 'Profile'}
          </button>
        )}

        {/* Settings Button */}
        {this.props.onSettings && (
          <button
            onClick={this.handleSettings}
            disabled={disabled}
            className={this.getButtonClasses('settings', false)}
            data-testid="settings-button"
          >
            <span className="mr-1">⚙️</span>
            {showLabels && 'Settings'}
          </button>
        )}

        {/* Logout Button */}
        {this.props.onLogout && (
          <button
            onClick={this.handleLogout}
            disabled={disabled || isLoggingOut}
            className={this.getButtonClasses('logout', isLoggingOut)}
            data-testid="logout-button"
          >
            {isLoggingOut ? (
              <>
                <span className="inline-block animate-pulse mr-1">👋</span>
                Logging out...
              </>
            ) : (
              <>
                <span className="mr-1">🚪</span>
                {showLabels && 'Logout'}
              </>
            )}
            {this.getActionStatus('logout')}
          </button>
        )}

        {/* Action Status Display */}
        {this.state.lastAction && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            Last action: {this.state.lastAction}
          </div>
        )}
      </div>
    );
  }
}

export default AuthenticatedActions;
