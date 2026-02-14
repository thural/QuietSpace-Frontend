/**
 * Switch Component Styles
 * 
 * Emotion CSS styles for the Switch component with toggle functionality.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getTransition, getTypography, getShadow } from '../../../utils';

/**
 * Create switch container styles using theme tokens
 */
export const createSwitchContainerStyles = (theme: any, size: 'sm' | 'md' | 'lg' = 'md') => css`
  display: flex;
  align-items: center;
  gap: ${getSpacing(theme, 'sm')};
  
  .switch-label {
    font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    font-size: ${size === 'sm' ? getTypography(theme, 'fontSize.sm') : size === 'lg' ? getTypography(theme, 'fontSize.lg') : getTypography(theme, 'fontSize.base')};
    color: ${getColor(theme, 'text.primary')};
    user-select: none;
  }
  
  .switch-input {
    position: relative;
    display: inline-block;
    width: ${size === 'sm' ? '2rem' : size === 'lg' ? '3rem' : '2.5rem'};
    height: ${size === 'sm' ? '1rem' : size === 'lg' ? '1.5rem' : '1.25rem'};
    
    input[type="checkbox"] {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .switch-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${getColor(theme, 'border.medium')};
      transition: ${getTransition(theme, 'all', 'normal', 'ease')};
      border-radius: ${size === 'sm' ? getRadius(theme, 'sm') : size === 'lg' ? getRadius(theme, 'lg') : getRadius(theme, 'md')};
      
      &:before {
        position: absolute;
        content: "";
        height: ${size === 'sm' ? '0.75rem' : size === 'lg' ? '1.125rem' : '0.9375rem'};
        width: ${size === 'sm' ? '0.75rem' : size === 'lg' ? '1.125rem' : '0.9375rem'};
        left: ${size === 'sm' ? '0.125rem' : size === 'lg' ? '0.1875rem' : '0.15625rem'};
        bottom: ${size === 'sm' ? '0.125rem' : size === 'lg' ? '0.1875rem' : '0.15625rem'};
        background-color: ${getColor(theme, 'text.inverse')};
        transition: ${getTransition(theme, 'all', 'normal', 'ease')};
        border-radius: 50%;
      }
    }
    
    input:checked + .switch-slider {
      background-color: ${getColor(theme, 'brand.500')};
      
      &:before {
        transform: translateX(${size === 'sm' ? '1rem' : size === 'lg' ? '1.5rem' : '1.25rem'});
      }
    }
    
    input:focus + .switch-slider {
      box-shadow: 0 0 0 3px ${getColor(theme, 'brand.200')};
    }
  }
`;
