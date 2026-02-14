/**
 * SwitchStyled Component Styles
 * 
 * Emotion CSS styles for the SwitchStyled component.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getTypography, getRadius, getTransition } from '../../../utils';

/**
 * Create switch styled container styles using theme tokens
 */
export const createSwitchStyledContainerStyles = (theme?: any, size?: 'md' | 'sm' | 'lg', disabled?: boolean) => css`
  display: flex;
  align-items: center;
  gap: ${getSpacing(theme, 'sm')};
  opacity: ${disabled ? 0.6 : 1};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  
  .switch-label {
    font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    font-size: ${size === 'sm' ? getTypography(theme || {}, 'fontSize.sm') : size === 'lg' ? getTypography(theme || {}, 'fontSize.lg') : getTypography(theme || {}, 'fontSize.base')};
    font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
    color: ${getColor(theme, disabled ? 'text.tertiary' : 'text.primary')};
    user-select: none;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    transition: ${getTransition(theme, 'color', 'fast', 'ease')};
  }
  
  .switch-input {
    position: relative;
    display: inline-block;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    
    input[type="checkbox"] {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .switch-slider {
      position: relative;
      display: inline-block;
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      background: ${getColor(theme, disabled ? 'border.light' : 'border.medium')};
      border-radius: ${size === 'sm' ? getRadius(theme || {}, 'sm') : size === 'lg' ? getRadius(theme || {}, 'lg') : getRadius(theme || {}, 'md')};
      transition: ${getTransition(theme, 'all', 'normal', 'ease')};
      
      &:before {
        position: absolute;
        content: "";
        height: ${size === 'sm' ? getSpacing(theme || {}, 12) : size === 'lg' ? getSpacing(theme || {}, 24) : getSpacing(theme || {}, 18)};
        width: ${size === 'sm' ? getSpacing(theme || {}, 12) : size === 'lg' ? getSpacing(theme || {}, 24) : getSpacing(theme || {}, 18)};
        left: ${size === 'sm' ? getSpacing(theme || {}, 2) : size === 'lg' ? getSpacing(theme || {}, 3) : getSpacing(theme || {}, 2)};
        bottom: ${size === 'sm' ? getSpacing(theme || {}, 2) : size === 'lg' ? getSpacing(theme || {}, 3) : getSpacing(theme || {}, 2)};
        background-color: ${getColor(theme, 'text.inverse')};
        border-radius: 50%;
        transition: ${getTransition(theme, 'all', 'normal', 'ease')};
      }
    }
    
    input:checked + .switch-slider {
      background-color: ${getColor(theme, disabled ? 'border.light' : 'brand.500')};
      
      &:before {
        transform: translateX(${size === 'sm' ? getSpacing(theme || {}, 16) : size === 'lg' ? getSpacing(theme || {}, 32) : getSpacing(theme || {}, 24)});
      }
    }
    
    input:focus + .switch-slider {
      box-shadow: 0 0 0 3px ${getColor(theme, 'brand.200')};
    }
    
    input:disabled + .switch-slider {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;
