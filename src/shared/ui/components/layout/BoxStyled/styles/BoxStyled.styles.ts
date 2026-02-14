/**
 * BoxStyled Component Styles
 * 
 * Enterprise Emotion CSS styles for the BoxStyled component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getBorderWidth } from '../../../utils';

/**
 * Generates styles for box container
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const boxContainerStyles = (theme?: any) => css`
  display: block;
  padding: ${getSpacing(theme, 'md')};
  background: ${getColor(theme, 'background.primary')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
  border-radius: ${getRadius(theme, 'md')};
  box-shadow: 0 2px 8px ${getColor(theme, 'shadow.light')};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${getColor(theme, 'border.dark')};
    box-shadow: 0 4px 12px ${getColor(theme, 'shadow.medium')};
  }
  
  &:focus-within {
    border-color: ${getColor(theme, 'brand.500')};
    box-shadow: 0 0 0 3px ${getColor(theme, 'brand.200')};
  }
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    padding: ${getSpacing(theme, 'sm')};
  }
`;
