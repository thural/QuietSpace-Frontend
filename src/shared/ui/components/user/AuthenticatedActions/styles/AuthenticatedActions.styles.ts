/**
 * Authenticated Actions Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the AuthenticatedActions component
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
 * Main AuthenticatedActions container styles
 */
export const authenticatedActionsContainerStyles = (theme?: EnhancedTheme, variant: string = 'default') => css`
  display: flex;
  align-items: center;
  gap: ${getSpacing(theme, 1)};
  padding: ${getSpacing(theme, 1.5)};
  background-color: ${getThemeColor(theme, 'background.primary')};
  border-radius: ${getRadius(theme, 'md')};
  border: 1px solid ${getThemeColor(theme, 'border.light')};
  transition: all ${getTransition(theme, 'fast')};

  ${variant === 'compact' && css`
    padding: ${getSpacing(theme, 0.75)};
    gap: ${getSpacing(theme, 0.5)};
  `}

  ${variant === 'horizontal' && css`
    flex-direction: row;
    justify-content: space-between;
  `}

  &:hover {
    border-color: ${getThemeColor(theme, 'border.medium')};
    box-shadow: ${getShadow(theme, 'sm')};
  }
`;

/**
 * Individual action button styles
 */
export const actionButtonStyles = (theme?: EnhancedTheme, disabled: boolean = false) => css`
  display: flex;
  align-items: center;
  gap: ${getSpacing(theme, 0.5)};
  padding: ${getSpacing(theme, 0.75)};
  background-color: ${getThemeColor(theme, 'background.secondary')};
  border: none;
  border-radius: ${getRadius(theme, 'sm')};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  transition: all ${getTransition(theme, 'fast')};
  color: ${getThemeColor(theme, 'text.primary')};

  &:hover:not(:disabled) {
    background-color: ${getThemeColor(theme, 'background.hover')};
    color: ${getThemeColor(theme, 'text.primary')};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/**
 * Action button icon styles
 */
export const actionIconStyles = (theme?: EnhancedTheme) => css`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

/**
 * Action button label styles
 */
export const actionLabelStyles = (theme?: EnhancedTheme) => css`
  font-size: 14px;
  font-weight: 500;
  color: ${getThemeColor(theme, 'text.primary')};
  white-space: nowrap;
`;

/**
 * Loading state styles
 */
export const loadingStyles = (theme?: EnhancedTheme) => css`
  opacity: 0.7;
  pointer-events: none;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 0.7;
    }
    50% {
      opacity: 0.4;
    }
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
