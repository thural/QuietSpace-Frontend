/**
 * Clickable Component Styles
 * 
 * Enterprise Emotion CSS styles for the Clickable component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getTypography } from '../../../utils';

/**
 * Generates styles for clickable text
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const clickableTextStyles = (theme?: any) => css`
  margin: 0;
  padding: ${getSpacing(theme, 'xs')} 0;
  font-size: ${getTypography(theme, 'fontSize.sm')};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  color: ${getColor(theme, 'text.primary')};
  line-height: 1.4;
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    font-size: ${getTypography(theme, 'fontSize.xs')};
  }
`;
