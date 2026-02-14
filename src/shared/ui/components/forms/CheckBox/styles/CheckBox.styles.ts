/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getBorderWidth, getTransition } from '../../utils';

/**
 * CheckBox wrapper styles
 */
export const CheckBoxWrapper = (theme: any) => css`
  display: flex;
  align-items: center;
  margin: ${getSpacing(theme, 'xs')} 0;
  position: relative;
`;

/**
 * CheckBox input styles
 */
export const CheckBoxInput = (theme: any, size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md', error: boolean = false) => css`
  appearance: none;
  background: ${getColor(theme, 'background.primary')};
  border: ${getBorderWidth(theme, 'sm')} solid ${error ? getColor(theme, 'semantic.error') : getColor(theme, 'border.medium')};
  border-radius: ${getRadius(theme, 'sm')};
  outline: none;
  cursor: pointer;
  margin-right: ${getSpacing(theme, 'sm')};
  position: relative;
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  
  /* Size variants */
  ${(() => {
    switch (size) {
      case 'xs':
        return css`
          width: ${getSpacing(theme, 12)};
          height: ${getSpacing(theme, 12)};
        `;
      case 'sm':
        return css`
          width: ${getSpacing(theme, 16)};
          height: ${getSpacing(theme, 16)};
        `;
      case 'md':
        return css`
          width: ${getSpacing(theme, 20)};
          height: ${getSpacing(theme, 20)};
        `;
      case 'lg':
        return css`
          width: ${getSpacing(theme, 24)};
          height: ${getSpacing(theme, 24)};
        `;
      case 'xl':
        return css`
          width: ${getSpacing(theme, 28)};
          height: ${getSpacing(theme, 28)};
        `;
      default:
        return css`
          width: ${getSpacing(theme, 20)};
          height: ${getSpacing(theme, 20)};
        `;
    }
  })()};
  
  &:hover {
    border-color: ${error ? getColor(theme, 'semantic.error') : getColor(theme, 'border.dark')};
  }
  
  &:focus {
    outline: 2px solid ${getColor(theme, 'brand.300')};
    outline-offset: 2px;
  }
  
  &:checked {
    background: ${getColor(theme, 'brand.500')};
    border-color: ${getColor(theme, 'brand.500')};
  }
  
  &:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${getColor(theme, 'text.inverse')};
    font-size: ${(() => {
      switch (size) {
        case 'xs':
          return getSpacing(theme, 8);
        case 'sm':
          return getSpacing(theme, 10);
        case 'md':
          return getSpacing(theme, 12);
        case 'lg':
          return getSpacing(theme, 14);
        case 'xl':
          return getSpacing(theme, 16);
        default:
          return getSpacing(theme, 12);
      }
    })()};
    font-weight: bold;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${getColor(theme, 'background.disabled')};
  }
  
  &:disabled:checked {
    background: ${getColor(theme, 'text.disabled')};
    border-color: ${getColor(theme, 'text.disabled')};
  }
`;
