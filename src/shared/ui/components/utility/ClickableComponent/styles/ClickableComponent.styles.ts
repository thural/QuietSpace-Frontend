/**
 * ClickableComponent Styles
 * 
 * Enterprise Emotion CSS styles for the ClickableComponent
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getTransition } from '../../../utils';

/**
 * Generates styles for clickable container
 * 
 * @param theme - Enhanced theme object
 * @param variant - Visual variant of the component
 * @param disabled - Whether the component is disabled
 * @returns CSS object for styled component
 */
export const clickableContainerStyles = (
  theme?: any,
  variant?: 'default' | 'primary' | 'secondary',
  disabled?: boolean
) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  border-radius: ${getRadius(theme, 'sm')};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  user-select: none;
  
  ${variant === 'primary' ? css`
    background: ${disabled ? getColor(theme, 'border.light') : getColor(theme, 'brand.500')};
    color: ${getColor(theme, 'text.inverse')};
    border: 1px solid ${getColor(theme, 'brand.500')};
    
    &:hover:not(:disabled) {
      background: ${getColor(theme, 'brand.600')};
      border-color: ${getColor(theme, 'brand.600')};
    }
  ` : variant === 'secondary' ? css`
    background: ${getColor(theme, 'background.secondary')};
    color: ${getColor(theme, 'text.primary')};
    border: 1px solid ${getColor(theme, 'border.medium')};
    
    &:hover:not(:disabled) {
      background: ${getColor(theme, 'background.tertiary')};
      border-color: ${getColor(theme, 'border.dark')};
    }
  ` : css`
    background: transparent;
    color: ${getColor(theme, 'text.primary')};
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background: ${getColor(theme, 'background.secondary')};
    }
  `}
  
  &:active {
    transform: scale(0.98);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${getColor(theme, 'brand.200')};
  }
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    padding: ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')};
  }
`;
