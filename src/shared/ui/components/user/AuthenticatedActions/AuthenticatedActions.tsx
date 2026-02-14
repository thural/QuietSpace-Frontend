/**
 * Authenticated Actions Component
 * 
 * Enterprise-grade class-based component for authenticated user actions
 * with comprehensive theme integration, responsive design, and animations.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { Component } from 'react';
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { useTheme } from '@/shared/hooks/useTheme';
import { IAuthenticatedActionsProps, IAuthenticatedActionsState } from './interfaces/IAuthenticatedActions';
import {
  authenticatedActionsContainerStyles,
  actionButtonStyles,
  actionIconStyles,
  actionLabelStyles,
  loadingStyles,
  responsiveStyles
} from './styles/AuthenticatedActions.styles';

/**
 * Authenticated Actions Component Class
 * 
 * Provides common actions for authenticated users like refresh token,
 * check session, logout, profile, and settings.
 * Follows enterprise patterns with theme integration and accessibility support.
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
    
    if (!onRefreshToken || this.state.isRefreshing) return;
    
    this.setState({ isRefreshing: true, lastAction: 'refreshToken' });
    
    try {
      await onRefreshToken();
    } catch (error) {
      console.error('Token refresh failed:', error);
    } finally {
      this.setState({ isRefreshing: false });
    }
  };

  /**
   * Handle check session action
   */
  private handleCheckSession = async (): Promise<void> => {
    const { onCheckSession } = this.props;
    
    if (!onCheckSession || this.state.isCheckingSession) return;
    
    this.setState({ isCheckingSession: true, lastAction: 'checkSession' });
    
    try {
      await onCheckSession();
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      this.setState({ isCheckingSession: false });
    }
  };

  /**
   * Handle logout action
   */
  private handleLogout = async (): Promise<void> => {
    const { onLogout } = this.props;
    
    if (!onLogout || this.state.isLoggingOut) return;
    
    this.setState({ isLoggingOut: true, lastAction: 'logout' });
    
    try {
      await onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.setState({ isLoggingOut: false });
    }
  };

  /**
   * Handle profile action
   */
  private handleProfile = (): void => {
    const { onProfile } = this.props;
    if (onProfile) {
      this.setState({ lastAction: 'profile' });
      onProfile();
    }
  };

  /**
   * Handle settings action
   */
  private handleSettings = (): void => {
    const { onSettings } = this.props;
    if (onSettings) {
      this.setState({ lastAction: 'settings' });
      onSettings();
    }
  };

  /**
   * Get button loading state
   */
  private getButtonLoadingState = (action: string): boolean => {
    switch (action) {
      case 'refreshToken':
        return this.state.isRefreshing;
      case 'checkSession':
        return this.state.isCheckingSession;
      case 'logout':
        return this.state.isLoggingOut;
      default:
        return false;
    }
  };

  /**
   * Render action button with loading state
   */
  private renderActionButton = (
    theme: any,
    action: string,
    icon: React.ReactNode,
    label: string,
    onClick: () => void
  ) => {
    const { showLabels = true, disabled = false } = this.props;
    const isLoading = this.getButtonLoadingState(action);
    
    return (
      <button
        css={[
          actionButtonStyles(theme, disabled || isLoading),
          isLoading && loadingStyles(theme)
        ]}
        onClick={onClick}
        disabled={disabled || isLoading}
        aria-label={label}
        title={label}
      >
        <span css={actionIconStyles(theme)}>{icon}</span>
        {showLabels && (
          <span css={actionLabelStyles(theme)}>{label}</span>
        )}
      </button>
    );
  };

  /**
   * Main render method with theme integration
   */
  public override render() {
    const { variant = 'default', className = '', testId } = this.props;
    
    return (
      <ThemeWrapper>
        {(theme: any) => {
          const containerStyles = [
            authenticatedActionsContainerStyles(theme, variant),
            responsiveStyles(theme)
          ];
          
          return (
            <div
              css={containerStyles as any}
              className={`authenticated-actions ${className}`}
              data-testid={testId || 'authenticated-actions'}
              role="toolbar"
              aria-label="User actions"
            >
              {this.renderActionButton(
                theme,
                'refreshToken',
                <RefreshIcon />,
                'Refresh Token',
                this.handleRefreshToken
              )}
              
              {this.renderActionButton(
                theme,
                'checkSession',
                <CheckIcon />,
                'Check Session',
                this.handleCheckSession
              )}
              
              {this.renderActionButton(
                theme,
                'profile',
                <ProfileIcon />,
                'Profile',
                this.handleProfile
              )}
              
              {this.renderActionButton(
                theme,
                'settings',
                <SettingsIcon />,
                'Settings',
                this.handleSettings
              )}
              
              {this.renderActionButton(
                theme,
                'logout',
                <LogoutIcon />,
                'Logout',
                this.handleLogout
              )}
            </div>
          );
        }}
      </ThemeWrapper>
    );
  }
}

/**
 * Theme wrapper component for accessing theme context
 */
interface ThemeWrapperProps {
  children: (theme: any) => React.ReactNode;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const theme = useTheme();
  return <>{children(theme)}</>;
};

// Icon components (simplified for example)
const RefreshIcon = () => <span>🔄</span>;
const CheckIcon = () => <span>✓</span>;
const ProfileIcon = () => <span>👤</span>;
const SettingsIcon = () => <span>⚙️</span>;
const LogoutIcon = () => <span>🚪</span>;

export default AuthenticatedActions;
