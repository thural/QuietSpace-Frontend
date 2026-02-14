/**
 * Security Status Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for SecurityStatus component
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
 * Main SecurityStatus container styles
 */
export const securityStatusContainerStyles = (theme?: EnhancedTheme, variant: string = 'default') => css`
  padding: ${getSpacing(theme, 1.5)};
  background-color: ${getThemeColor(theme, 'background.primary')};
  border-radius: ${getRadius(theme, 'lg')};
  border: 1px solid ${getThemeColor(theme, 'border.light')};
  transition: all ${getTransition(theme, 'fast')};

  ${variant === 'compact' && css`
    padding: ${getSpacing(theme, 1)};
  `}

  ${variant === 'detailed' && css`
    padding: ${getSpacing(theme, 2)};
  `}
`;

/**
 * Header styles
 */
export const headerStyles = (theme?: EnhancedTheme) => css`
  font-size: 18px;
  font-weight: 600;
  color: ${getThemeColor(theme, 'text.primary')};
  margin-bottom: ${getSpacing(theme, 1)};
`;

/**
 * Status item container styles
 */
export const statusItemStyles = (theme?: EnhancedTheme) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${getSpacing(theme, 0.75)};
`;

/**
 * Status label styles
 */
export const statusLabelStyles = (theme?: EnhancedTheme) => css`
  font-size: 14px;
  font-weight: 500;
  color: ${getThemeColor(theme, 'text.secondary')};
`;

/**
 * Status badge styles
 */
export const statusBadgeStyles = (theme?: EnhancedTheme, status: string, isActive: boolean = false) => css`
  padding: ${getSpacing(theme, 0.25)} ${getSpacing(theme, 0.5)};
  border-radius: ${getRadius(theme, 'md')};
  font-size: 12px;
  font-weight: 600;
  transition: all ${getTransition(theme, 'fast')};

  ${status === 'required' && css`
    background-color: ${getThemeColor(theme, 'warning')};
    color: ${getThemeColor(theme, 'text.inverse')};
  `}

  ${status === 'trusted' && css`
    background-color: ${getThemeColor(theme, 'success')};
    color: ${getThemeColor(theme, 'text.inverse')};
  `}

  ${!isActive && css`
    background-color: ${getThemeColor(theme, 'background.secondary')};
    color: ${getThemeColor(theme, 'text.secondary')};
  `}
`;

/**
 * Session expiry container styles
 */
export const sessionExpiryStyles = (theme?: EnhancedTheme) => css`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme, 0.5)};
  margin-bottom: ${getSpacing(theme, 1)};
`;

/**
 * Expiry time styles
 */
export const expiryTimeStyles = (theme?: EnhancedTheme, isExpiring: boolean = false) => css`
  font-size: 14px;
  font-weight: 500;
  color: ${isExpiring ? getThemeColor(theme, 'warning') : getThemeColor(theme, 'text.primary')};
  text-align: right;
`;

/**
 * Expiry date styles
 */
export const expiryDateStyles = (theme?: EnhancedTheme) => css`
  font-size: 12px;
  color: ${getThemeColor(theme, 'text.secondary')};
`;

/**
 * Trust device button styles
 */
export const trustDeviceButtonStyles = (theme?: EnhancedTheme) => css`
  padding: ${getSpacing(theme, 0.75)} ${getSpacing(theme, 1)};
  background-color: ${getThemeColor(theme, 'primary')};
  border: none;
  border-radius: ${getRadius(theme, 'md')};
  color: ${getThemeColor(theme, 'text.inverse')};
  font-weight: 500;
  cursor: pointer;
  transition: all ${getTransition(theme, 'fast')};

  &:hover {
    background-color: ${getThemeColor(theme, 'primary.hover')};
  }

  &:focus {
    outline: 2px solid ${getThemeColor(theme, 'primary')};
    outline-offset: 2px;
  }
`;

/**
 * Expiry warning styles
 */
export const expiryWarningStyles = (theme?: EnhancedTheme) => css`
  padding: ${getSpacing(theme, 0.5)} ${getSpacing(theme, 0.75)};
  background-color: ${getThemeColor(theme, 'warning')};
  border: 1px solid ${getThemeColor(theme, 'border.warning')};
  border-radius: ${getRadius(theme, 'md')};
  font-size: 12px;
  color: ${getThemeColor(theme, 'text.warning')};
  text-align: center;
`;

/**
 * Responsive styles for mobile devices
 */
export const responsiveStyles = (theme?: EnhancedTheme) => css`
  @media (max-width: 768px) {
    padding: ${getSpacing(theme, 1)};
  }
`;
