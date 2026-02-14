/**
 * User Query Item Component
 * 
 * Enterprise-grade class-based component for displaying user query items
 * with comprehensive theme integration, responsive design, and animations.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { BaseClassComponent } from '@shared/components/base/BaseClassComponent';
import { IUserQueryItemProps, IUserQueryItemState } from './interfaces/IUserQueryItem';
import {
  userQueryItemContainerStyles,
  avatarContainerStyles,
  detailsContainerStyles,
  loadingStyles,
  disabledStyles,
  responsiveStyles
} from './styles/UserQueryItem.styles';

// Import decoupled components
import { UserAvatarPhoto } from '../UserAvatar';
import { UserDetails } from '../UserDetails';

/**
 * User Query Item Component Class
 * 
 * Displays a user query item with avatar, details, and optional follow toggle.
 * Follows enterprise patterns with theme integration and accessibility support.
 */
export class UserQueryItem extends BaseClassComponent<IUserQueryItemProps, IUserQueryItemState> {

  /**
   * Get initial state for component
   */
  protected override getInitialState(): Partial<IUserQueryItemState> {
    return {
      signedUser: {
        id: 'current-user',
        name: 'Current User',
        email: 'current@example.com'
      }
    };
  }

  /**
   * Handle click event to navigate to user profile
   */
  private handleClick = (event: React.MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    const { data, handleItemClick } = this.props;
    const { signedUser } = this.state;

    if (!signedUser) return;

    if (data.id === signedUser.id) {
      // Prevent navigating to own profile
      return;
    }

    // Invoke custom click handler if provided
    if (handleItemClick) {
      handleItemClick(event);
    }

    // Navigate to user profile (in real implementation, this would use router)
    window.location.href = `/profile/${data.id}`;
  };

  /**
   * Get container styles based on state
   */
  private getContainerStyles = () => {
    const { data } = this.props;
    const { signedUser } = this.state;

    const baseStyles = [
      userQueryItemContainerStyles(undefined),
      responsiveStyles(undefined)
    ];

    // Add disabled styles for own profile
    if (signedUser && data.id === signedUser.id) {
      baseStyles.push(disabledStyles(undefined));
    }

    return baseStyles;
  };

  /**
   * Render loading state
   */
  private renderLoading = () => (
    <div css={loadingStyles(undefined)}>
      Loading...
    </div>
  );

  /**
   * Render user information with theme integration
   */
  private renderUserInfo = () => {
    const { data } = this.props;

    return (
      <>
        <div css={avatarContainerStyles(undefined)}>
          <UserAvatarPhoto userId={data.id} />
          `}>
          {data.username?.charAt(0).toUpperCase()}
        </div>
      </div >

        <div css={styles.details as any}>
          {/* UserDetails component would be imported and used here */}
          <div css={css`
            font-weight: 600;
            color: ${theme.colors?.text?.primary || '#333'};
            margin-bottom: 4px;
          `}>
            {data.username}
          </div>
          {data.email && (
            <div css={css`
              font-size: 14px;
              color: ${theme.colors?.text?.secondary || '#666'};
            `}>
              {data.email}
            </div>
          )}
        </div>

    if (!signedUser) {
      return this.renderLoading();
    }

    return (
      <div
        css={this.getContainerStyles() as any}
        className="user-query-item"
        onClick={this.handleClick}
        role="button"
        tabIndex={0}
        aria-label={`View profile for ${data.name}`}
        data-testid={`user-query-item-${data.id}`}
      >
        <div css={avatarContainerStyles(undefined)}>
          <UserAvatarPhoto userId={data.id} />
        </div>

        <div css={detailsContainerStyles(undefined)}>
          <UserDetails scale={4} user={data} />
        </div>

        {children && (
          <div className="user-query-item-children">
            {children}
          </div>
        )}
      </div>
    );
  }

  /**
   * Render main content
   */
  protected override renderContent(): React.ReactNode {
    const { data, children } = this.props;
    const { signedUser } = this.state;

    // Show loading state if no signed user
    if (!signedUser) {
      return this.renderLoading();
    }

    return (
      <div
        css={this.getContainerStyles() as any}
        className="user-query-item"
        onClick={this.handleClick}
        role="button"
        tabIndex={0}
        aria-label={`View profile for ${data.name}`}
        data-testid={`user-query-item-${data.id}`}
      >
        <div css={avatarContainerStyles(undefined)}>
          <UserAvatarPhoto userId={data.id} />
        </div>

        <div css={detailsContainerStyles(undefined)}>
          <UserDetails scale={4} user={data} />
        </div>

        {children && (
          <div className="user-query-item-children">
            {children}
          </div>
        )}
      </div>
    );
  }
}

export default UserQueryItem;

/**
 * Theme wrapper component for accessing theme context
 */
interface ThemeWrapperProps {
  children: (theme: any) => React.ReactNode;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  // In a real implementation, this would use the actual theme hook
  const theme = {
    colors: {
      background: { primary: '#ffffff', secondary: '#f8f9fa' },
      text: { primary: '#333333', secondary: '#666666' },
      border: { light: '#e0e0e0', medium: '#cccccc' }
    },
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
    radius: { md: '8px' },
    transition: { fast: '0.2s ease' }
  };
  return <>{children(theme)}</>;
};

export default UserQueryItem;
