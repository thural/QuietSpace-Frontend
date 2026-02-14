import React from 'react';
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { IAuthStatusProps, IAuthStatusState } from './interfaces';
import {
  unauthenticatedStyles,
  authenticatedStyles,
  variantSpacing,
  headerContainer,
  userInfoContainer,
  avatarContainer,
  avatarImage,
  avatarPlaceholder,
  userName,
  userEmail,
  userId,
  toggleButton,
  expandedDetails,
  detailRow,
  detailLabel,
  detailValue,
  statusBadge,
  timestamp,
  successIndicator,
  successText
} from './styles';

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
          css={[unauthenticatedStyles, variantSpacing[variant]]}
          className={className}
          data-testid="auth-status-unauthenticated"
        >
          <div>Not Authenticated</div>
        </div>
      );
    }

    const displayName = this.getUserDisplayName();
    const initials = this.getUserInitials();

    return (
      <div 
        css={[authenticatedStyles, variantSpacing[variant]]}
        className={className}
        data-testid="auth-status-authenticated"
      >
        {/* Header */}
        <div css={headerContainer}>
          <div css={userInfoContainer}>
            {/* Avatar */}
            {showAvatar && (
              <div css={avatarContainer}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    css={avatarImage}
                    data-testid="user-avatar"
                  />
                ) : (
                  <div 
                    css={avatarPlaceholder}
                    data-testid="user-avatar-placeholder"
                  >
                    {initials}
                  </div>
                )}
              </div>
            )}

            {/* User Info */}
            <div>
              <div css={userName}>
                {displayName}
              </div>
              <div css={userEmail}>
                {user.email || user.username}
              </div>
            </div>
          </div>

          {/* Expand Toggle */}
          {variant === 'detailed' && (
            <button
              onClick={this.toggleExpanded}
              css={toggleButton}
              data-testid="auth-status-toggle"
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          )}
        </div>

        {/* User ID */}
        {showUserId && (
          <div css={userId} data-testid="user-id">
            User ID: {user.userId}
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && variant === 'detailed' && (
          <div css={expandedDetails}>
            {/* Role */}
            {showRole && user.role && (
              <div css={detailRow}>
                <span css={detailLabel}>Role:</span>
                <span css={detailValue}>{user.role}</span>
              </div>
            )}

            {/* Additional Info */}
            <div css={detailRow}>
              <span css={detailLabel}>Status:</span>
              <span css={statusBadge}>
                Active
              </span>
            </div>

            {/* Timestamp */}
            <div css={detailRow}>
              <span css={detailLabel}>Session:</span>
              <span css={timestamp}>
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Success Indicator */}
        <div css={successIndicator}>
          <svg css={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span css={successText}>Authenticated</span>
        </div>
      </div>
    );
  }
}
