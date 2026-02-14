/**
 * PhotoDisplay Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the PhotoDisplay component
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
 * Base container styles for photo display
 */
export const photoDisplayContainerStyles = (
  theme?: any
) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: ${getColor(theme, 'background.secondary')};
  border: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  border-radius: ${getRadius(theme, 'md')};
  padding: ${getSpacing(theme, 'lg')};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
`;

/**
 * Photo image container styles
 */
export const photoDisplayImageContainerStyles = (
  theme?: any
) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${getRadius(theme, 'md')};
  overflow: hidden;
  box-shadow: `0 ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')} ${getColor(theme, 'shadow.medium')}`;
`;

/**
 * Photo image styles
 */
export const photoDisplayImageStyles = (
  theme?: any
) => css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${getRadius(theme, 'md')};
  transition: ${getTransition(theme, 'transform', 'fast', 'ease')};

  &:hover {
    transform: scale(1.02);
  }
`;

/**
 * No photo message styles
 */
export const photoDisplayNoPhotoStyles = (
  theme?: any
) => css`
  text-align: center;
  color: ${getColor(theme, 'text.secondary')};
  font-size: ${getTypography(theme, 'fontSize.base')};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  padding: ${getSpacing(theme, 'md')};
  border: ${getSpacing(theme, 'border.width.dashed')} solid ${getColor(theme, 'border.light')};
  border-radius: ${getRadius(theme, 'md')};
  background-color: ${getColor(theme, 'background.tertiary')};
`;

/**
 * Loading placeholder styles
 */
export const photoDisplayLoadingStyles = (
  theme?: any
) => css`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${getColor(theme, 'background.secondary')};
  border-radius: ${getRadius(theme, 'md')};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: ${getSpacing(theme, 'border.width.md')} solid ${getColor(theme, 'border.light')};
    border-top: ${getSpacing(theme, 'border.width.md')} solid ${getColor(theme, 'brand.500')};
    border-radius: 50%;
    animation: photoDisplaySpin 1s linear infinite;
  }
`;

/**
 * Responsive styles for mobile devices
 */
export const photoDisplayResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.sm')}) {
    ${photoDisplayContainerStyles(theme)} {
      min-height: 150px;
      padding: ${getSpacing(theme, 'md')};
    }
    
    ${photoDisplayImageContainerStyles(theme)} {
      max-width: 100%;
    }
  }
`;

/**
 * Keyframes for loading animation
 */
export const photoDisplayKeyframes = css`
  @keyframes photoDisplaySpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
