/**
 * DefaultContainer Component Styles
 * 
 * Enterprise Emotion CSS styles for the DefaultContainer component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getBorderWidth } from '../../../utils';

/**
 * Generates styles for default container wrapper
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const defaultContainerWrapperStyles = (theme?: any) => css`
  padding-top: ${getSpacing(theme, 'xl')};
  
  & hr {
    border: none;
    height: 0.1px;
    background: ${getColor(theme, 'border.medium')};
    margin-top: ${getSpacing(theme, 'md')};
  }
  
  &:not(:last-child) {
    border-bottom: ${getBorderWidth(theme, 'hairline')} solid ${getColor(theme, 'border.light')};
  }
  
  // Responsive design
  @media (max-width: 768px) {
    padding-top: ${getSpacing(theme, 'lg')};
  }
`;
