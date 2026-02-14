/**
 * PassInput Component Styles
 * 
 * Emotion CSS styles for the PassInput password input component.
 */

import { css } from '@emotion/react';
import { getBorderWidth, getBreakpoint, getColor, getRadius, getSpacing, getTransition, getTypography } from '../../../utils';

/**
 * Create password input styles using theme tokens
 */
export const createPasswordInputStyles = (theme?: any) => css`
  width: 100%;
  padding: ${getSpacing(theme, 'md')};
  font-size: ${getTypography(theme, 'fontSize.base')};
  font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  color: ${getColor(theme, 'text.primary')};
  background: ${getColor(theme, 'background.primary')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
  border-radius: ${getRadius(theme, 'md')};
  transition: ${getTransition(theme, 'all', 'normal', 'ease')};
  
  &::placeholder {
    color: ${getColor(theme, 'text.tertiary')};
  }
  
  &:focus {
    outline: none;
    border-color: ${getColor(theme, 'brand.500')};
    box-shadow: 0 0 0 ${getSpacing(theme, 3)} solid ${getColor(theme, 'brand.200')};
  }
  
  &:hover:not(:focus) {
    border-color: ${getColor(theme, 'border.dark')};
  }
  
  &:disabled {
    background: ${getColor(theme, 'background.tertiary')};
    color: ${getColor(theme, 'text.tertiary')};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  // Responsive design
  @media (max-width: ${getBreakpoint(theme, 'sm')}) {
    padding: ${getSpacing(theme, 'sm')};
    font-size: ${getTypography(theme, 'fontSize.sm')};
  }
`;
