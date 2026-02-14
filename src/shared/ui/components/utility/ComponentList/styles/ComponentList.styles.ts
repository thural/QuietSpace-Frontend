/**
 * ComponentList Component Styles
 * 
 * Enterprise Emotion CSS styles for the ComponentList component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor } from '../../../utils';

/**
 * Generates styles for component list container
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const componentListContainerStyles = (theme?: any) => css`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme, 'md')};
  padding: ${getSpacing(theme, 'sm')};
  background: ${getColor(theme, 'background.primary')};
  border-radius: ${getSpacing(theme, 'xs')};
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    gap: ${getSpacing(theme, 'sm')};
    padding: ${getSpacing(theme, 'xs')};
  }
`;

/**
 * Generates styles for component list item
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const componentListItemStyles = (theme?: any) => css`
  padding: ${getSpacing(theme, 'sm')};
  border-bottom: 1px solid ${getColor(theme, 'border.light')};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${getColor(theme, 'background.secondary')};
  }
`;
