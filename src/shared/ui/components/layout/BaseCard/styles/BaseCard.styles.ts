/**
 * BaseCard Component Styles
 * 
 * Enterprise Emotion CSS styles for the BaseCard component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getColor, getBorderWidth, getRadius, getSpacing, getShadow, getTransition, getBreakpoint } from '../../../utils';

/**
 * Generates styles for base card container
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const baseCardContainerStyles = (theme?: any) => css`
  background: ${getColor(theme, 'background.primary')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
  border-radius: ${getRadius(theme, 'md')};
  padding: ${getSpacing(theme, 'md')};
  box-shadow: ${getShadow(theme, 'sm')};
  transition: ${getTransition(theme, 'all', 'normal', 'ease')};
  
  &:hover {
    box-shadow: ${getShadow(theme, 'md')};
    border-color: ${getColor(theme, 'border.dark')};
  }
  
  // Responsive design
  @media (max-width: ${getBreakpoint(theme, 'sm')}) {
    padding: ${getSpacing(theme, 'sm')};
  }
`;
