/**
 * UserAvatarPhoto Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the UserAvatarPhoto component
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
 * Base container styles for user avatar photo
 */
export const userAvatarPhotoContainerStyles = (
  theme?: any,
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md',
  isLoading: boolean = false
) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  opacity: ${isLoading ? '0.6' : '1'};
  transition: ${getTransition(theme, 'opacity', 'fast', 'ease')};
`;

/**
 * Loading overlay styles for user avatar photo
 */
export const userAvatarPhotoLoadingStyles = (
  theme?: any,
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
) => css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${getColor(theme, 'background.overlay')};
  border-radius: ${getUserAvatarPhotoRadius(theme, 'round')};
  z-index: 1;
`;

/**
 * Loading spinner styles for user avatar photo
 */
export const userAvatarPhotoSpinnerStyles = (theme?: any) => css`
  width: 20px;
  height: 20px;
  border: ${getSpacing(theme, 'border.width.md')} solid ${getColor(theme, 'border.light')};
  border-top: ${getSpacing(theme, 'border.width.md')} solid ${getColor(theme, 'brand.500')};
  border-radius: 50%;
  animation: userAvatarPhotoSpin 1s linear infinite;
`;

/**
 * Get user avatar photo size based on size variant
 */
const getUserAvatarPhotoSize = (
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
 * Get user avatar photo border radius based on radius prop
 */
const getUserAvatarPhotoRadius = (
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
 * Responsive styles for mobile devices
 */
export const userAvatarPhotoResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.sm')}) {
    ${userAvatarPhotoContainerStyles(theme, 'md', false)} {
      width: ${getUserAvatarPhotoSize(theme, 'sm')};
      height: ${getUserAvatarPhotoSize(theme, 'sm')};
    }
  }
`;

/**
 * Keyframes for loading spinner animation
 */
export const userAvatarPhotoKeyframes = css`
  @keyframes userAvatarPhotoSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
