/**
 * TextAreaStyled Component Styles
 * 
 * Emotion CSS styles for the TextAreaStyled component.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getTypography, getRadius, getBorderWidth, getTransition } from '../../../utils';

/**
 * Create text area container styles using theme tokens
 */
export const createTextAreaContainerStyles = (theme?: any, error?: boolean) => css`
  position: relative;
  width: 100%;
  
  .textarea-field {
    width: 100%;
    resize: none;
    outline: none;
    box-sizing: border-box;
    border-radius: ${getRadius(theme, 'md')};
    padding: ${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')};
    font-size: ${getTypography(theme, 'fontSize.base')};
    font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    font-weight: ${theme?.typography?.fontWeight?.normal || '400'};
    color: ${getColor(theme, 'text.primary')};
    background: ${getColor(theme, 'background.primary')};
    border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
    transition: ${getTransition(theme, 'all', 'normal', 'ease')};
    
    &::placeholder {
      color: ${getColor(theme, 'text.tertiary')};
    }
    
    &:focus {
      border-color: ${getColor(theme, 'brand.500')};
      box-shadow: 0 0 0 3px ${getColor(theme, 'brand.200')};
      outline: none;
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
    
    ${error && css`
      border-color: ${getColor(theme, 'semantic.error')};
      box-shadow: 0 0 0 3px ${getColor(theme, 'semantic.error')}20;
      
      &:focus {
        border-color: ${getColor(theme, 'semantic.error')};
        box-shadow: 0 0 0 3px ${getColor(theme, 'semantic.error')}30;
      }
    `}
  }
  
  /* Responsive design */
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    .textarea-field {
      padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')};
      font-size: ${getTypography(theme, 'fontSize.sm')};
    }
  }
`;
