/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { IUserAvatarProps } from './interfaces';
import {
  userAvatarContainerStyles,
  userAvatarImageStyles,
  userAvatarTextStyles,
  userAvatarResponsiveStyles
} from './styles';

/**
 * UserAvatar Component
 * 
 * Enterprise-grade avatar component with comprehensive theme integration,
 * size variants, colors, and responsive design.
 */
export class UserAvatar extends PureComponent<IUserAvatarProps> {
  static defaultProps: Partial<IUserAvatarProps> = {
    size: 'md',
    color: 'black',
    radius: 'round',
    chars: 'U',
  };

  override render(): ReactNode {
    const {
      forwardedRef,
      size = 'md',
      color = 'black',
      radius = 'round',
      src = '',
      chars = 'U',
      className,
      testId,
      id,
      onClick,
      style
    } = this.props;

    const theme = useTheme();
    const hasImage = !!src;

    return (
      <div
        ref={forwardedRef}
        css={[
          userAvatarContainerStyles(theme, size, color, radius, hasImage),
          userAvatarResponsiveStyles(theme)
        ]}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
      >
        {hasImage ? (
          <img 
            src={src} 
            alt="User avatar"
            css={userAvatarImageStyles(theme, size)}
          />
        ) : (
          <span css={userAvatarTextStyles(theme, size)}>
            {chars}
          </span>
        )}
      </div>
    );
  }
}

export default UserAvatar;
