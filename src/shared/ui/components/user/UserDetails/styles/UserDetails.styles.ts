/**
 * UserDetails Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the UserDetails component
 * with comprehensive theme integration, responsive design, and animations.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import type { EnhancedTheme } from '@core/modules/theming';
import {
  getSpacing,
  getThemeColor,
  getRadius,
  getShadow,
  getTransition
} from '../../../../styles/utils';

/**
 * Main UserDetails container styles
 */
export const userDetailsContainerStyles = (theme?: EnhancedTheme) => css`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme, 1)};
  padding: ${getSpacing(theme, 2)};
  background-color: ${getThemeColor(theme, 'background.primary')};
  border-radius: ${getRadius(theme, 'md')};
  border: 1px solid ${getThemeColor(theme, 'border.light')};
  transition: all ${getTransition(theme, 'fast')};

  &:hover {
    border-color: ${getThemeColor(theme, 'border.medium')};
    box-shadow: ${getShadow(theme, 'sm')};
  }
`;

/**
 * User name display styles
 */
export const userNameStyles = (theme?: EnhancedTheme, scale: number = 1) => css`
  font-size: calc(16px * ${scale});
  font-weight: 600;
  color: ${getThemeColor(theme, 'text.primary')};
  margin: 0;
  line-height: 1.2;
`;

/**
 * User email display styles
 */
export const userEmailStyles = (theme?: EnhancedTheme, scale: number = 1) => css`
  font-size: calc(14px * ${scale});
  font-weight: 500;
  color: ${getThemeColor(theme, 'text.secondary')};
  margin: 0;
  line-height: 1.4;
`;

/**
 * User details wrapper styles
 */
export const userDetailsWrapperStyles = (theme?: EnhancedTheme) => css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

/**
 * Responsive styles for mobile devices
 */
export const userDetailsResponsiveStyles = (theme?: EnhancedTheme) => css`
  @media (max-width: 768px) {
    padding: ${getSpacing(theme, 1)};
    gap: ${getSpacing(theme, 0.5)};
  }
`;

/**
 * Scale variant styles
 */
export const userDetailsScaleStyles = (theme?: EnhancedTheme, scale: number = 3) => {
  const scaleMap = {
    1: css`
      padding: ${getSpacing(theme, 0.5)};
      gap: ${getSpacing(theme, 0.5)};
    `,
    2: css`
      padding: ${getSpacing(theme, 1)};
      gap: ${getSpacing(theme, 1)};
    `,
    3: css`
      padding: ${getSpacing(theme, 2)};
      gap: ${getSpacing(theme, 1)};
    `,
    4: css`
      padding: ${getSpacing(theme, 3)};
      gap: ${getSpacing(theme, 2)};
    `,
    5: css`
      padding: ${getSpacing(theme, 4)};
      gap: ${getSpacing(theme, 2)};
    `
  };

  return scaleMap[scale as keyof typeof scaleMap] || scaleMap[3];
};

/**
 * Animation styles for user details
 */
export const userDetailsAnimationStyles = (theme?: EnhancedTheme) => css`
  animation: userDetailsFadeIn 0.3s ease;

  @keyframes userDetailsFadeIn {
    from {
      opacity: 0;
      transform: translateY(${getSpacing(theme, 0.5)});
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
