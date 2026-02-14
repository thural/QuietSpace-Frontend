/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { IUserCardProps, IUserCardState, IUserCardData } from './interfaces';
import {
  userCardContainerStyles,
  userCardHeaderStyles,
  userCardContentStyles,
  userCardAvatarContainerStyles,
  userCardDetailsContainerStyles,
  userCardDetailsStyles,
  userCardNameStyles,
  userCardEmailStyles,
  userCardRoleStyles,
  userCardChildrenStyles,
  userCardLoadingOverlayStyles,
  userCardLoadingSpinnerStyles,
  userCardResponsiveStyles,
  userCardKeyframes
} from './styles';

/**
 * UserCard Component
 * 
 * Enterprise-grade user card component with comprehensive theme integration,
 * data fetching, loading states, and responsive design.
 */
export class UserCard extends BaseClassComponent<IUserCardProps, IUserCardState> {
  static defaultProps: Partial<IUserCardProps> = {
    isDisplayEmail: true,
    isDisplayName: true,
    isIgnoreNavigation: false,
  };

  protected override getInitialState(): Partial<IUserCardState> {
    return {
      isLoading: true,
      user: undefined,
      signedUser: this.getMockSignedUser()
    };
  }

  /**
   * Get mock signed in user data
   */
  private getMockSignedUser = (): IUserCardData => {
    return {
      id: 'signed-user',
      username: 'Signed User',
      email: 'signed@example.com',
      avatar: undefined,
      role: 'Authenticated'
    };
  };

  /**
   * Mock data fetching for user
   */
  private fetchUserData = (): void => {
    const { userId } = this.props;

    // Simulate API call
    setTimeout(() => {
      const mockUser = userId ? {
        id: userId,
        username: 'Mock User',
        email: 'mock@example.com',
        avatar: undefined,
        role: 'User'
      } : undefined;

      this.safeSetState({
        isLoading: false,
        user: mockUser,
        signedUser: this.getMockSignedUser()
      });
    }, 100);
  };

  /**
   * Handle user navigation
   */
  private handleUserNavigation = (e: React.MouseEvent): void => {
    e.stopPropagation();

    const { isIgnoreNavigation, userId } = this.props;
    const { signedUser } = this.state;

    if (isIgnoreNavigation) return;

    if (userId === signedUser?.id) {
      // Navigate to signed user's profile
      window.location.href = '/profile';
    } else if (userId) {
      // Navigate to specific user's profile
      window.location.href = `/profile/${userId}`;
    }
  };

  override componentDidMount(): void {
    this.fetchUserData();
  }

  override componentDidUpdate(prevProps: IUserCardProps): void {
    const { userId } = this.props;
    const { userId: prevUserId } = prevProps;

    if (userId !== prevUserId) {
      this.fetchUserData();
    }
  }

  override render(): ReactNode {
    const {
      user,
      isDisplayEmail = true,
      isDisplayName = true,
      isIgnoreNavigation = false,
      children,
      className,
      testId,
      id,
      onClick,
      style
    } = this.props;
    const { isLoading, signedUser } = this.state;
    const theme = useTheme();

    // Show loading overlay while fetching data
    if (isLoading || !user) {
      return (
        <div
          css={[
            userCardContainerStyles(theme, true),
            userCardResponsiveStyles(theme)
          ]}
          className={className}
          data-testid={testId}
          id={id?.toString()}
          onClick={onClick}
          style={style}
        >
          <div css={userCardLoadingOverlayStyles(theme)}>
            <div css={userCardLoadingSpinnerStyles(theme)} />
          </div>
        </div>
      );
    }

    return (
      <div
        css={[
          userCardContainerStyles(theme, false),
          userCardResponsiveStyles(theme)
        ]}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        onClick={this.handleUserNavigation}
        style={style}
      >
        <div css={userCardHeaderStyles(theme)}>
          <div css={userCardAvatarContainerStyles(theme)}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: user?.avatar ? 'transparent' : theme.colors?.primary || '#000',
              color: user?.avatar ? 'transparent' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              userSelect: 'none'
            }}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 'inherit'
                  }}
                />
              ) : (
                <span>{user.username.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>

          <div css={userCardDetailsContainerStyles(theme)}>
            <div css={userCardDetailsStyles(theme)}>
              {isDisplayName && (
                <div css={userCardNameStyles(theme)}>
                  {user.username}
                </div>
              )}

              {isDisplayEmail && user.email && (
                <div css={userCardEmailStyles(theme)}>
                  {user.email}
                </div>
              )}

              {user.role && (
                <div css={userCardRoleStyles(theme)}>
                  {user.role}
                </div>
              )}
            </div>
          </div>

          {children && (
            <div css={userCardChildrenStyles(theme)}>
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default UserCard;
