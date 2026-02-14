/**
 * User Profile Avatar Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the UserProfileAvatar component
 * with comprehensive theme integration, responsive design, and animations.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import { EnhancedTheme } from '@core/modules/theming';
import {
  getSpacing,
  getThemeColor,
  getRadius,
  getShadow,
  getTransition
} from '../../../../styles/utils';

/**
 * Main avatar container styles
 */
export const avatarContainerStyles = (theme?: EnhancedTheme) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all ${getTransition(theme, 'fast')};
`;

/**
 * Avatar image styles
 */
export const avatarImageStyles = (theme?: EnhancedTheme, size: string = 'md') => css`
  width: ${size};
  height: ${size};
  object-fit: cover;
  border-radius: ${getRadius(theme, 'md')};
  border: 2px solid ${getThemeColor(theme, 'border.light')};
  transition: all ${getTransition(theme, 'fast')};
`;

/**
 * Avatar fallback (initials) styles
 */
export const avatarFallbackStyles = (theme?: EnhancedTheme, size: string = 'md') => css`
  width: ${size};
  height: ${size};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${getThemeColor(theme, 'primary')};
  color: ${getThemeColor(theme, 'text.inverse')};
  font-weight: 600;
  border-radius: ${getRadius(theme, 'md')};
  font-size: ${size === 'w-6 h-6' ? '12px' : size === 'w-8 h-8' ? '14px' : '16px'};
`;

/**
 * Status indicator container styles
 */
export const statusContainerStyles = (theme?: EnhancedTheme, position: string = 'bottom-right') => css`
  position: absolute;
  ${position}: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${getThemeColor(theme, 'background.primary')};
  transition: all ${getTransition(theme, 'fast')};
`;

/**
 * Status indicator styles by status type
 */
export const statusStyles = (status: string, theme?: EnhancedTheme) => {
  const statusColors = {
    online: getThemeColor(theme, 'success'),
    offline: getThemeColor(theme, 'text.secondary'),
    away: getThemeColor(theme, 'warning'),
    busy: getThemeColor(theme, 'danger'),
    invisible: 'transparent'
  };

  return css`
    background-color: ${statusColors[status as keyof typeof statusColors] || statusColors.offline};
    border-color: ${getThemeColor(theme, 'background.primary')};
  `;
};

/**
 * User info container styles
 */
export const userInfoStyles = (theme?: EnhancedTheme) => css`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme, 0.5)};
  margin-left: ${getSpacing(theme, 1)};
`;

/**
 * User name styles
 */
export const userNameStyles = (theme?: EnhancedTheme) => css`
  font-size: 14px;
  font-weight: 500;
  color: ${getThemeColor(theme, 'text.primary')};
  line-height: 1.2;
`;

/**
 * Username styles
 */
export const usernameStyles = (theme?: EnhancedTheme) => css`
  font-size: 12px;
  color: ${getThemeColor(theme, 'text.secondary')};
  line-height: 1.4;
`;

/**
 * Hover effects
 */
export const hoverStyles = (theme?: EnhancedTheme) => css`
  &:hover {
    transform: scale(1.05);
    box-shadow: ${getShadow(theme, 'md')};
  }
`;

/**
 * Clickable cursor styles
 */
export const clickableStyles = (theme?: EnhancedTheme, isHovered: boolean = false) => css`
  cursor: pointer;
  ${isHovered ? 'opacity: 0.8;' : ''}
  ${hoverStyles(theme)}
`;

/**
 * Shape styles
 */
export const shapeStyles = (shape: string = 'circle') => {
  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg'
  };

  return shapes[shape as keyof typeof shapes] || shapes.circle;
};
