/**
 * User Profile Avatar Component
 * 
 * A reusable user avatar component with online status indicators and
 * flexible display options for user profiles and social features.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { useTheme } from '@/shared/hooks/useTheme';
import { IUserProfileAvatarProps, IUserProfileAvatarState, UserStatusType } from './interfaces/IUserProfileAvatar';
import {
  avatarContainerStyles,
  avatarImageStyles,
  avatarFallbackStyles,
  statusContainerStyles,
  statusStyles,
  userInfoStyles,
  userNameStyles,
  usernameStyles,
  clickableStyles,
  shapeStyles
} from './styles/UserProfileAvatar.styles';

/**
 * User Profile Avatar Component
 * 
 * Provides user avatar display with:
 * - Online status indicators with multiple positions
 * - Multiple size options and shapes
 * - Fallback to initials when image fails
 * - Click interactions and hover effects
 * - Flexible display options (name, username)
 * - Accessibility features and ARIA labels
 * - Responsive design and animations
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class UserProfileAvatar extends BaseClassComponent<IUserProfileAvatarProps, IUserProfileAvatarState> {

  protected override getInitialState(): Partial<IUserProfileAvatarState> {
    return {
      imageError: false,
      isHovered: false
    };
  }

  /**
   * Handle image error
   */
  private handleImageError = (): void => {
    this.safeSetState({ imageError: true });
  };

  /**
   * Handle mouse enter
   */
  private handleMouseEnter = (): void => {
    this.safeSetState({ isHovered: true });
  };

  /**
   * Handle mouse leave
   */
  private handleMouseLeave = (): void => {
    this.safeSetState({ isHovered: false });
  };

  /**
   * Handle click
   */
  private handleClick = (): void => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  };

  /**
   * Get initials from name
   */
  private getInitials = (name: string): string => {
    if (!name || name.trim() === '') {
      return '?';
    }

    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      const first = parts[0]?.charAt(0) || '';
      const last = parts[parts.length - 1]?.charAt(0) || '';
      return `${first}${last}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  /**
   * Get status color
   */
  private getStatusColor = (status: UserStatusType): string => {
    const colors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
      invisible: 'bg-transparent'
    };

    return colors[status] || colors.offline;
  };

  /**
   * Get avatar size styles
   */
  private getAvatarSizeStyles = (): { container: string; image: string; status: string } => {
    const { size = 'md', customSize } = this.props;

    // Handle custom size
    if (customSize) {
      return {
        container: `w-[${customSize}] h-[${customSize}]`,
        image: `w-[${customSize}] h-[${customSize}]`,
        status: 'w-3 h-3'
      };
    }

    // Handle numeric size
    if (typeof size === 'number') {
      return {
        container: `w-[${size}px] h-[${size}px]`,
        image: `w-[${size}px] h-[${size}px]`,
        status: 'w-3 h-3'
      };
    }

    // Handle string size with pixels
    if (typeof size === 'string' && size.includes('px')) {
      return {
        container: `w-[${size}] h-[${size}]`,
        image: `w-[${size}] h-[${size}]`,
        status: 'w-3 h-3'
      };
    }

    const sizes = {
      xs: {
        container: 'w-6 h-6',
        image: 'w-6 h-6',
        status: 'w-2 h-2'
      },
      sm: {
        container: 'w-8 h-8',
        image: 'w-8 h-8',
        status: 'w-2.5 h-2.5'
      },
      md: {
        container: 'w-10 h-10',
        image: 'w-10 h-10',
        status: 'w-3 h-3'
      },
      lg: {
        container: 'w-12 h-12',
        image: 'w-12 h-12',
        status: 'w-3.5 h-3.5'
      },
      xl: {
        container: 'w-16 h-16',
        image: 'w-16 h-16',
        status: 'w-4 h-4'
      }
    };

    const sizeKey = size as keyof typeof sizes;
    return sizes[sizeKey] || sizes.md;
  };

  /**
   * Get avatar shape styles
   */
  private getAvatarShapeStyles = (): string => {
    const { shape = 'circle' } = this.props;

    const shapes = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-lg'
    };

    return shapes[shape];
  };

  /**
   * Get status position styles
   */
  private getStatusPositionStyles = (): string => {
    const { statusPosition = 'bottom-right' } = this.props;

    // Simple approach with explicit mapping
    switch (statusPosition) {
      case 'bottom-right':
        return 'bottom-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'top-right':
        return 'top-0 right-0';
      case 'top-left':
        return 'top-0 left-0';
      default:
        return 'bottom-0 right-0';
    }
  };

  /**
   * Get container styles
   */
  private getContainerStyles = (): string => {
    const { clickable = false, className = '' } = this.props;
    const { isHovered } = this.state;

    const baseStyles = 'flex items-center space-x-3';
    const interactionStyles = clickable
      ? isHovered ? 'cursor-pointer opacity-80' : 'cursor-pointer'
      : '';

    return `${baseStyles} ${interactionStyles} ${className || ''}`;
  };

  /**
   * Render avatar image or fallback
   */
  private renderAvatar = (): React.ReactNode => {
    const { src, alt, fallback, name } = this.props;
    const { imageError } = this.state;
    const sizeStyles = this.getAvatarSizeStyles();
    const shapeStyles = this.getAvatarShapeStyles();

    // Show fallback if image error or no src
    if (imageError || !src) {
      const displayName = fallback || name || 'User';
      const initials = this.getInitials(displayName);
      const bgColor = this.getInitialsBackgroundColor(displayName);

      return (
        <div
          className={`${sizeStyles.container} ${shapeStyles} ${bgColor} flex items-center justify-center text-white font-medium`}
        >
          <span className={`${sizeStyles.image === 'w-6 h-6' ? 'text-xs' :
            sizeStyles.image === 'w-8 h-8' ? 'text-sm' :
              sizeStyles.image === 'w-10 h-10' ? 'text-base' :
                sizeStyles.image === 'w-12 h-12' ? 'text-lg' : 'text-xl'}`}>
            {initials}
          </span>
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        onError={this.handleImageError}
        className={`${sizeStyles.image} ${shapeStyles} object-cover`}
      />
    );
  };

  /**
   * Get initials background color
   */
  private getInitialsBackgroundColor = (name: string): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-gray-500'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length] as string;
  };

  /**
   * Render status indicator
   */
  private renderStatus = (): React.ReactNode => {
    const { status, showStatus = true } = this.props;

    if (!showStatus || !status || status === 'invisible') {
      return null;
    }

    const sizeStyles = this.getAvatarSizeStyles();
    const positionStyles = this.getStatusPositionStyles();
    const statusColor = this.getStatusColor(status);

    return (
      <div
        className={`absolute ${positionStyles} ${sizeStyles.status} ${statusColor} rounded-full border-2 border-white`}
        title={`Status: ${status}`}
      />
    );
  };

  /**
   * Render user info
   */
  private renderUserInfo = (): React.ReactNode => {
    const { name, username, showName = true, showUsername = false } = this.props;

    if (!showName && !showUsername) {
      return null;
    }

    return (
      <div className="flex flex-col">
        {showName && (
          <div className="text-sm font-medium text-gray-900">
            {name}
          </div>
        )}
        {showUsername && username && (
          <div className="text-xs text-gray-500">
            @{username}
          </div>
        )}
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const { clickable = false } = this.props;
    const sizeStyles = this.getAvatarSizeStyles();

    return (
      <div
        className={this.getContainerStyles()}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={clickable ? (e) => e.key === 'Enter' && this.handleClick() : undefined}
        aria-label={`${this.props.name} ${this.props.status ? `(${this.props.status})` : ''}`}
      >
        {/* Avatar Container */}
        <div className={`relative ${sizeStyles.container}`}>
          {this.renderAvatar()}
          {this.renderStatus()}
        </div>

        {/* User Info */}
        {this.renderUserInfo()}
      </div>
    );
  }
}

export default UserProfileAvatar;
