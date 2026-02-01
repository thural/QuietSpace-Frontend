import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * User interface for authentication user data
 */
export interface IAuthUser {
  userId: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
}

/**
 * Auth Status Props
 */
export interface IAuthStatusProps extends IBaseComponentProps {
  isAuthenticated: boolean;
  user?: IAuthUser | null;
  showUserId?: boolean;
  showRole?: boolean;
  showAvatar?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * Auth Status State
 */
export interface IAuthStatusState extends IBaseComponentState {
  isExpanded: boolean;
}

/**
 * Reusable Authentication Status Component
 * 
 * Displays current authentication status and user information.
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class AuthStatus extends BaseClassComponent<IAuthStatusProps, IAuthStatusState> {
  
  protected override getInitialState(): Partial<IAuthStatusState> {
    return {
      isExpanded: false
    };
  }

  /**
   * Toggle expanded state
   */
  private toggleExpanded = (): void => {
    this.safeSetState(prev => ({ isExpanded: !prev.isExpanded }));
  };

  /**
   * Get user display name
   */
  private getUserDisplayName(): string {
    const { user } = this.props;
    if (!user) return '';

    // Try different name fields in order of preference
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.username) {
      return user.username;
    }
    if (user.email) {
      return user.email;
    }
    return 'Unknown User';
  }

  /**
   * Get user initials for avatar
   */
  private getUserInitials(): string {
    const { user } = this.props;
    if (!user) return '?';

    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return '??';
  }

  /**
   * Get variant classes
   */
  private getVariantClasses(): string {
    const { variant = 'default' } = this.props;
    const variantMap = {
      default: 'p-4',
      compact: 'p-3',
      detailed: 'p-6'
    };
    return variantMap[variant];
  }

  protected override renderContent(): React.ReactNode {
    const { 
      isAuthenticated, 
      user, 
      showUserId = true,
      showRole = true,
      showAvatar = true,
      variant = 'default',
      className = '' 
    } = this.props;
    const { isExpanded } = this.state;

    if (!isAuthenticated || !user) {
      return (
        <div 
          className={`auth-status ${this.getVariantClasses()} bg-gray-50 border border-gray-200 rounded-lg ${className}`}
          data-testid="auth-status-unauthenticated"
        >
          <div className="text-gray-600">Not Authenticated</div>
        </div>
      );
    }

    const displayName = this.getUserDisplayName();
    const initials = this.getUserInitials();

    return (
      <div 
        className={`auth-status ${this.getVariantClasses()} bg-green-50 border border-green-200 rounded-lg ${className}`}
        data-testid="auth-status-authenticated"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            {showAvatar && (
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="h-10 w-10 rounded-full object-cover"
                    data-testid="user-avatar"
                  />
                ) : (
                  <div 
                    className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium"
                    data-testid="user-avatar-placeholder"
                  >
                    {initials}
                  </div>
                )}
              </div>
            )}

            {/* User Info */}
            <div>
              <div className="font-medium text-green-800">
                {displayName}
              </div>
              <div className="text-sm text-green-600">
                {user.email || user.username}
              </div>
            </div>
          </div>

          {/* Expand Toggle */}
          {variant === 'detailed' && (
            <button
              onClick={this.toggleExpanded}
              className="text-green-600 hover:text-green-800 focus:outline-none"
              data-testid="auth-status-toggle"
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          )}
        </div>

        {/* User ID */}
        {showUserId && (
          <div className="text-xs text-green-500 mt-1" data-testid="user-id">
            User ID: {user.userId}
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && variant === 'detailed' && (
          <div className="mt-4 space-y-2 text-sm">
            {/* Role */}
            {showRole && user.role && (
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium">{user.role}</span>
              </div>
            )}

            {/* Additional Info */}
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                Active
              </span>
            </div>

            {/* Timestamp */}
            <div className="flex justify-between">
              <span className="text-gray-600">Session:</span>
              <span className="text-xs text-gray-500">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Success Indicator */}
        <div className="mt-2 flex items-center text-green-600">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Authenticated</span>
        </div>
      </div>
    );
  }
}

export default AuthStatus;
