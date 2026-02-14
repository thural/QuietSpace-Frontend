/**
 * AnchorStyled Component Styles
 * 
 * Enterprise Emotion CSS styles for the AnchorStyled component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getColor, getTransition } from '../../../utils';

/**
 * Generates styles for anchor element
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const anchorStyles = (theme?: any) => css`
  text-decoration: none;
  color: ${getColor(theme, 'text.primary')};
  cursor: pointer;
  transition: ${getTransition(theme, 'color', 'fast', 'ease')};
  font-weight: inherit;
  font-size: inherit;
  
  &:hover {
    color: ${getColor(theme, 'brand.500')};
    text-decoration: underline;
  }
  
  &:focus {
    outline: 2px solid ${getColor(theme, 'brand.200')};
    outline-offset: 2px;
  }
  
  &:visited {
    color: ${getColor(theme, 'text.secondary')};
  }
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    font-size: 0.9em;
  }
`;
