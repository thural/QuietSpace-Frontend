/**
 * InputStyled Component Styles
 * 
 * Emotion CSS styles for the InputStyled component with enhanced styling.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getTypography, getRadius, getBorderWidth, getTransition } from '../../../utils';
import { ComponentSize } from '../../../types';

/**
 * Create input styled container styles using theme tokens
 */
export const createInputStyledContainerStyles = (theme?: any, variant?: 'default' | 'outlined' | 'filled', size?: ComponentSize, error?: boolean) => css`
  position: relative;
  display: flex;
  align-items: center;
  
  .input-field {
    width: 100%;
    font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    font-weight: ${theme?.typography?.fontWeight?.normal || '400'};
    color: ${getColor(theme, 'text.primary')};
    background: ${getColor(theme, 'background.primary')};
    border: ${getBorderWidth(theme, 'xs')} solid ${getColor(theme, 'border.medium')};
    border-radius: ${getRadius(theme, 'md')};
    transition: ${getTransition(theme, 'all', 'normal', 'ease')};
    outline: none;
    
    /* Size variants using theme spacing tokens */
    ${(() => {
    const currentSize = size || 'md';
    const paddingMap = {
      xs: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')}`,
      sm: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')}`,
      md: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')}`,
      lg: `${getSpacing(theme, 'lg')} ${getSpacing(theme, 'xl')}`,
      xl: `${getSpacing(theme, 'xl')} ${getSpacing(theme, '2xl')}`
    };
    return css`padding: ${paddingMap[currentSize]};`;
  })()}
    
    /* Font size using theme typography tokens */
    ${(() => {
    const currentSize = size || 'md';
    const fontSizeMap = {
      xs: getTypography(theme, 'fontSize.xs'),
      sm: getTypography(theme, 'fontSize.sm'),
      md: getTypography(theme, 'fontSize.base'),
      lg: getTypography(theme, 'fontSize.lg'),
      xl: getTypography(theme, 'fontSize.xl')
    };
    return css`font-size: ${fontSizeMap[currentSize]};`;
  })()}
    
    &::placeholder {
      color: ${getColor(theme, 'text.tertiary')};
    }
    
    &:focus {
      border-color: ${getColor(theme, 'brand.500')};
      box-shadow: 0 0 0 3px ${theme?.colors?.brand?.[200] || '#80bdff'};
    }
    
    &:hover:not(:focus):not(:disabled) {
      border-color: ${getColor(theme, 'border.dark')};
    }
    
    &:disabled {
      background: ${getColor(theme, 'background.tertiary')};
      color: ${getColor(theme, 'text.tertiary')};
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    /* Error state using theme semantic tokens */
    ${error && css`
      border-color: ${getColor(theme, 'semantic.error')};
      
      &:focus {
        border-color: ${getColor(theme, 'semantic.error')};
        box-shadow: 0 0 0 3px ${getColor(theme, 'semantic.error')};
      }
    `}
    
    /* Variant styles */
    ${variant === 'outlined' && css`
      background: transparent;
      border-width: ${getBorderWidth(theme, 'sm')};
    `}
    
    ${variant === 'filled' && css`
      background: ${getColor(theme, 'background.tertiary')};
      border: none;
      
      &:focus {
        background: ${getColor(theme, 'background.primary')};
        border: ${getBorderWidth(theme, 'xs')} solid ${getColor(theme, 'brand.500')};
      }
    `}
  }
  
  /* Responsive design using theme breakpoints */
  @media (max-width: ${theme?.breakpoints?.sm || '768px'}) {
    .input-field {
      ${(() => {
    const currentSize = size || 'md';
    const paddingMap = {
      xs: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'xs')}`,
      sm: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')}`,
      md: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')}`,
      lg: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')}`,
      xl: `${getSpacing(theme, 'lg')} ${getSpacing(theme, 'lg')}`
    };
    return css`padding: ${paddingMap[currentSize]};`;
  })()}
        
        font-size: ${getTypography(theme, 'fontSize.sm')};
    }
  }
`;
