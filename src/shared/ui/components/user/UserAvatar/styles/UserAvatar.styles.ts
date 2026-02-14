/**
 * UserAvatar Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the UserAvatar component
 * with theme integration, animations, and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import { 
  getSpacing, 
  getColor, 
  getRadius, 
  getTransition,
  getTypography
} from '../../utils';

/**
 * Base container styles for user avatar
 */
export const userAvatarContainerStyles = (
  theme?: any,
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md',
  color: string = 'black',
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full' | 'round' = 'round',
  hasImage: boolean = false
) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${getUserAvatarSize(theme, size)};
  height: ${getUserAvatarSize(theme, size)};
  background-color: ${hasImage ? 'transparent' : getUserAvatarColor(theme, color)};
  color: ${hasImage ? 'transparent' : getUserAvatarTextColor(theme, color)};
  border-radius: ${getUserAvatarRadius(theme, radius)};
  font-size: ${getUserAvatarFontSize(theme, size)};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  border: ${hasImage ? `${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')}` : 'none'};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  user-select: none;

  &:hover {
    transform: scale(1.05);
    box-shadow: ${hasImage ? 
      `0 ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')} ${getColor(theme, 'shadow.medium')}` : 
      'none'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${getSpacing(theme, '2')} ${getColor(theme, 'brand.200')};
  }
`;

/**
 * Get user avatar size based on size variant
 */
const getUserAvatarSize = (
  theme?: any,
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
) => {
  const sizeMap = {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px'
  };
  return sizeMap[size] || sizeMap.md;
};

/**
 * Get user avatar color based on color prop
 */
const getUserAvatarColor = (theme?: any, color: string) => {
  const colorMap: { [key: string]: string } = {
    black: getColor(theme, 'text.primary'),
    white: getColor(theme, 'text.inverse'),
    primary: getColor(theme, 'brand.500'),
    secondary: getColor(theme, 'background.secondary'),
    success: getColor(theme, 'success.500'),
    warning: getColor(theme, 'warning.500'),
    error: getColor(theme, 'error.500'),
    info: getColor(theme, 'info.500')
  };
  return colorMap[color] || colorMap.black;
};

/**
 * Get user avatar text color based on background color
 */
const getUserAvatarTextColor = (theme?: any, color: string) => {
  const textColorMap: { [key: string]: string } = {
    black: getColor(theme, 'text.inverse'),
    white: getColor(theme, 'text.primary'),
    primary: getColor(theme, 'text.inverse'),
    secondary: getColor(theme, 'text.primary'),
    success: getColor(theme, 'text.inverse'),
    warning: getColor(theme, 'text.inverse'),
    error: getColor(theme, 'text.inverse'),
    info: getColor(theme, 'text.inverse')
  };
  return textColorMap[color] || textColorMap.black;
};

/**
 * Get user avatar border radius based on radius prop
 */
const getUserAvatarRadius = (
  theme?: any,
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full' | 'round'
) => {
  const radiusMap = {
    none: '0',
    sm: getRadius(theme, 'sm'),
    md: getRadius(theme, 'md'),
    lg: getRadius(theme, 'lg'),
    full: getRadius(theme, 'lg'),
    round: '50%'
  };
  return radiusMap[radius] || radiusMap.round;
};

/**
 * Get user avatar font size based on size variant
 */
const getUserAvatarFontSize = (
  theme?: any,
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
) => {
  const fontSizeMap = {
    xs: getTypography(theme, 'fontSize.xs'),
    sm: getTypography(theme, 'fontSize.sm'),
    md: getTypography(theme, 'fontSize.base'),
    lg: getTypography(theme, 'fontSize.lg'),
    xl: getTypography(theme, 'fontSize.xl')
  };
  return fontSizeMap[size] || fontSizeMap.md;
};

/**
 * User avatar image styles
 */
export const userAvatarImageStyles = (
  theme?: any,
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
) => css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

/**
 * User avatar text styles
 */
export const userAvatarTextStyles = (
  theme?: any,
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
) => css`
  font-size: ${getUserAvatarFontSize(theme, size)};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/**
 * Responsive styles for mobile devices
 */
export const userAvatarResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.sm')}) {
    ${userAvatarContainerStyles(theme, 'md', 'black', 'round', false)} {
      width: ${getUserAvatarSize(theme, 'sm')};
      height: ${getUserAvatarSize(theme, 'sm')};
      font-size: ${getUserAvatarFontSize(theme, 'sm')};
    }
  }
`;
