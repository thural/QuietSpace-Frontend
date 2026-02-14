/**
 * CloseButtonStyled Styles
 * 
 * Enterprise Emotion CSS styles for the CloseButtonStyled component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getTransition, getTypography } from '../../../utils';

/**
 * Generates styles for close button
 * 
 * @param theme - Enhanced theme object
 * @param variant - Visual variant of the component
 * @param disabled - Whether the component is disabled
 * @returns CSS object for styled component
 */
export const getCloseButtonStyles = (theme?: any, variant?: string, disabled?: boolean) => css`
  display: none;
  position: fixed;
  top: ${getSpacing(theme, 'xs')};
  right: ${getSpacing(theme, 'sm')};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  font-size: ${getTypography(theme, 'fontSize.xl')};
  background: none;
  border: none;
  color: ${getColor(theme, 'text.primary')};
  padding: ${getSpacing(theme, 'sm')};
  border-radius: ${getRadius(theme, 'md')};
  transition: all ${getTransition(theme, 'all', 'fast', 'ease')};
  z-index: 1000;
  
  ${variant === 'primary' ? css`
    color: ${getColor(theme, 'brand.500')};
    
    &:hover {
      background: ${getColor(theme, 'brand.100')};
      color: ${getColor(theme, 'brand.600')};
    }
  ` : variant === 'danger' ? css`
    color: ${getColor(theme, 'semantic.error')};
    
    &:hover {
      background: ${getColor(theme, 'semantic.error')};
      color: ${getColor(theme, 'semantic.error')};
    }
  ` : css`
    &:hover {
      background: ${getColor(theme, 'background.tertiary')};
      color: ${getColor(theme, 'text.secondary')};
    }
  `}
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:focus {
    outline: 2px solid ${getColor(theme, 'brand.500')};
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  // Responsive design - show on mobile
  @media (max-width: 768px) {
    display: block;
  }
`;
