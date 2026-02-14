/**
 * User Query Item Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the UserQueryItem component
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
 * Main UserQueryItem container styles
 */
export const userQueryItemContainerStyles = (theme?: EnhancedTheme) => css`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme, 1)};
  padding: ${getSpacing(theme, 1.5)};
  background-color: ${getThemeColor(theme, 'background.primary')};
  border-radius: ${getRadius(theme, 'md')};
  border: 1px solid ${getThemeColor(theme, 'border.light')};
  transition: all ${getTransition(theme, 'fast')};
  cursor: pointer;
  position: relative;

  &:hover {
    border-color: ${getThemeColor(theme, 'border.medium')};
    box-shadow: ${getShadow(theme, 'sm')};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

/**
 * User avatar container styles
 */
export const avatarContainerStyles = (theme?: EnhancedTheme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${getSpacing(theme, 1)};
`;

/**
 * User details container styles
 */
export const detailsContainerStyles = (theme?: EnhancedTheme) => css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme, 0.5)};
`;

/**
 * Loading state styles
 */
export const loadingStyles = (theme?: EnhancedTheme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${getSpacing(theme, 2)};
  color: ${getThemeColor(theme, 'text.secondary')};
  font-style: italic;
`;

/**
 * Disabled state styles (for own profile)
 */
export const disabledStyles = (theme?: EnhancedTheme) => css`
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;

  &:hover {
    transform: none;
    box-shadow: none;
    border-color: ${getThemeColor(theme, 'border.light')};
  }
`;

/**
 * Responsive styles for mobile devices
 */
export const responsiveStyles = (theme?: EnhancedTheme) => css`
  @media (max-width: 768px) {
    padding: ${getSpacing(theme, 1)};
    gap: ${getSpacing(theme, 0.75)};
  }
`;
