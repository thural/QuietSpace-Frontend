/**
 * Typography Component Styles
 * 
 * Enterprise Emotion CSS styles for the Typography component.
 * Since this is a wrapper component, minimal styling is provided
 * for consistency with the enterprise pattern.
 */

import { css } from '@emotion/react';

/**
 * Generates styles for typography wrapper
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const typographyWrapperStyles = (theme?: any) => css`
  display: contents;
  
  // Ensure proper accessibility and semantic structure
  &:not(:empty) {
    display: block;
  }
  
  // Responsive font sizing
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    font-size: 0.9em;
  }
`;
