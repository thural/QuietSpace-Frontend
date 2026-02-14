/**
 * CountdownTimer Styles
 * 
 * Enterprise Emotion CSS styles for the CountdownTimer component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getTypography, getRadius } from '../../../utils';

/**
 * Generates styles for countdown timer container
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const countdownContainerStyles = (theme?: any) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${getSpacing(theme, 'md')};
  border-radius: ${getRadius(theme, 'md')};
  background: ${getColor(theme, 'background.primary')};
  border: 1px solid ${getColor(theme, 'border.medium')};
  font-family: ${getTypography(theme, 'fontFamily.mono')};
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    padding: ${getSpacing(theme, 'sm')};
  }
`;

/**
 * Generates styles for countdown timer display
 * 
 * @param theme - Enhanced theme object
 * @param hasTimedOut - Whether the timer has timed out
 * @returns CSS object for styled component
 */
export const countdownDisplayStyles = (theme?: any, hasTimedOut?: boolean) => css`
  font-size: ${getTypography(theme, 'fontSize.xl')};
  font-weight: bold;
  color: ${hasTimedOut ? getColor(theme, 'semantic.error') : getColor(theme, 'text.primary')};
  margin: ${getSpacing(theme, 'xs')} 0;
  transition: color ${theme?.animation?.duration?.normal || '300ms'} ${theme?.animation?.easing?.ease || 'ease'};
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    font-size: ${getTypography(theme, 'fontSize.lg')};
  }
`;

/**
 * Generates styles for countdown timer message
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const countdownMessageStyles = (theme?: any) => css`
  font-size: ${getTypography(theme, 'fontSize.sm')};
  color: ${getColor(theme, 'text.secondary')};
  text-align: center;
  margin-top: ${getSpacing(theme, 'xs')};
`;
