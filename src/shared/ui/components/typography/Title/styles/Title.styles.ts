/**
 * Title Component Styles
 * 
 * Enterprise Emotion CSS styles for the Title component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { TypographyProps } from '../../../types';
import { typographyPropsToStyles } from '../../../utils';

/**
 * Generates styles for title component
 * 
 * @param theme - Enhanced theme object
 * @param typographyProps - Typography properties for styling
 * @returns CSS object for styled component
 */
export const titleStyles = (theme?: any, typographyProps?: TypographyProps) => css`
  margin: 0;
  box-sizing: border-box;
  font-weight: bold;
  ${typographyProps ? typographyPropsToStyles(typographyProps, theme) : ''}
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    font-size: ${typographyProps?.size ? 
      `calc(${typeof typographyProps.size === 'number' ? typographyProps.size + 'px' : typographyProps.size} * 0.9)` : 
      'inherit'
    };
  }
  
  // Accessibility improvements
  &:focus {
    outline: 2px solid ${theme?.colors?.brand?.[500] || '#007bff'};
    outline-offset: 2px;
  }
`;
