/**
 * Text Component Styles
 * 
 * Enterprise Emotion CSS styles for the Text component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { TypographyProps } from '../../../types';
import { typographyPropsToStyles } from '../../../utils';

/**
 * Generates styles for text component
 * 
 * @param theme - Enhanced theme object
 * @param typographyProps - Typography properties for styling
 * @returns CSS object for styled component
 */
export const textStyles = (theme?: any, typographyProps?: TypographyProps) => css`
  margin: 0;
  box-sizing: border-box;
  ${typographyProps ? typographyPropsToStyles(typographyProps, theme) : ''}
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    font-size: ${typographyProps?.size ? 
      `calc(${typeof typographyProps.size === 'number' ? typographyProps.size + 'px' : typographyProps.size} * 0.9)` : 
      'inherit'
    };
  }
`;
