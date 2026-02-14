/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { IUserAvatarPhotoProps, IUserAvatarPhotoState, IUserAvatarPhotoData } from './interfaces';
import {
  userAvatarPhotoContainerStyles,
  userAvatarPhotoLoadingStyles,
  userAvatarPhotoSpinnerStyles,
  userAvatarPhotoResponsiveStyles,
  userAvatarPhotoKeyframes
} from './styles';

/**
 * UserAvatarPhoto Component
 * 
 * Enterprise-grade avatar photo component with comprehensive theme integration,
 * data fetching, loading states, and responsive design.
 */
export class UserAvatarPhoto extends PureComponent<IUserAvatarPhotoProps, IUserAvatarPhotoState> {
  static defaultProps: Partial<IUserAvatarPhotoProps> = {
    size: 'md',
  };

  private getUserById = (id: string): { data?: IUserAvatarPhotoData } => {
    // Mock implementation - in real scenario this would use the hook
    return {
      data: {
        id,
        username: 'MockUser',
        photo: undefined
      }
    };
  };

  constructor(props: IUserAvatarPhotoProps) {
    super(props);

    this.state = {
      user: undefined,
      photoData: null,
      username: 'U'
    };
  }

  override componentDidMount(): void {
    this.fetchUserData();
  }

  override componentDidUpdate(prevProps: IUserAvatarPhotoProps): void {
    const { userId } = this.props;
    const { userId: prevUserId } = prevProps;

    if (userId !== prevUserId) {
      this.fetchUserData();
    }
  }

  /**
   * Fetch user data and update state
   */
  private fetchUserData = (): void => {
    const { userId } = this.props;

    // Simulate data fetching
    setTimeout(() => {
      const user = this.getUserById(userId).data;
      const photoData = !user?.photo ? null : this.formatPhotoData(user.photo?.type, user.photo?.data);
      const username = !user ? "U" : this.toUpperFirstChar(user.username);

      this.setState({
        user,
        photoData,
        username
      });
    }, 50);
  };

  /**
   * Format photo data for display
   */
  private formatPhotoData = (type?: string, data?: string): string | null => {
    if (!type || !data) return null;
    // Mock implementation - would format based on type
    return `data:${type},${data}`;
  };

  /**
   * Convert first character to uppercase
   */
  private toUpperFirstChar = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  override render(): ReactNode {
    const { size = 'md', className, testId, id, onClick, style } = this.props;
    const { photoData, username } = this.state;
    const theme = useTheme();
    const isLoading = !photoData && !this.state.user;

    return (
      <div
        css={[
          userAvatarPhotoContainerStyles(theme, size, isLoading),
          userAvatarPhotoResponsiveStyles(theme)
        ]}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
      >
        {isLoading ? (
          <div css={userAvatarPhotoLoadingStyles(theme, size)}>
            <div css={userAvatarPhotoSpinnerStyles(theme)} />
          </div>
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: photoData ? 'transparent' : theme.colors?.primary || '#000',
            color: photoData ? 'transparent' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size === 'xs' ? '12px' : size === 'sm' ? '14px' : size === 'md' ? '16px' : size === 'lg' ? '18px' : '20px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            userSelect: 'none'
          }}>
            {photoData ? (
              <img 
                src={photoData} 
                alt="User avatar"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: 'inherit'
                }} 
              />
            ) : (
              <span>{username}</span>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default UserAvatarPhoto;
