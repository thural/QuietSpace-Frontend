/**
 * FormStyled Styles
 * 
 * Enterprise Emotion CSS styles for the FormStyled component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getShadow, getTransition, getBorderWidth } from '../../../utils';

/**
 * Generates styles for form container
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const formContainerStyles = (theme?: any) => css`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme || {} as any, 'md')};
  padding: ${getSpacing(theme || {} as any, 'lg')};
  background: ${getColor(theme || {} as any, 'background.primary')};
  border: ${getBorderWidth(theme || {} as any, 'sm')} solid ${getColor(theme || {} as any, 'border.medium')};
  border-radius: ${getRadius(theme || {} as any, 'md')};
  box-shadow: ${getShadow(theme || {} as any, 'sm')};
  transition: ${getTransition(theme || {} as any, 'all', 'normal', 'ease')};
  
  &:hover {
    border-color: ${getColor(theme || {} as any, 'border.dark')};
  }
  
  &:focus-within {
    border-color: ${getColor(theme || {} as any, 'brand.500')};
    box-shadow: 0 0 0 3px ${getColor(theme || {} as any, 'brand.200')};
  }
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    padding: ${getSpacing(theme || {} as any, 'md')};
    gap: ${getSpacing(theme || {} as any, 'sm')};
  }
`;
