/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getBorderWidth, getTransition } from '../utils';

// Enterprise Emotion CSS styles for checkbox styling
export const CheckboxWrapper = (theme: any) => css`
  display: flex;
  align-items: center;
  margin: ${getSpacing(theme, 'xs')} 0;
`;

export const CheckboxInput = (theme: any, variant?: 'default' | 'primary' | 'secondary') => css`
  width: ${getSpacing(theme, 20)};
  height: ${getSpacing(theme, 20)};
  appearance: none;
  background: ${getColor(theme, 'background.primary')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
  border-radius: ${getRadius(theme, 'full')};
  outline: none;
  cursor: pointer;
  margin-right: ${getSpacing(theme, 'sm')};
  position: relative;
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  
  &:hover {
    border-color: ${getColor(theme, 'border.dark')};
  }
  
  &:focus {
    outline: 2px solid ${getColor(theme, 'brand.300')};
    outline-offset: 2px;
  }
  
  &:checked {
    background: ${(() => {
    switch (variant) {
      case 'primary':
        return getColor(theme, 'brand.500');
      case 'secondary':
        return getColor(theme, 'background.secondary');
      default:
        return getColor(theme, 'brand.500');
    }
  })()};
    border-color: ${(() => {
    switch (variant) {
      case 'primary':
        return getColor(theme, 'brand.500');
      case 'secondary':
        return getColor(theme, 'border.medium');
      default:
        return getColor(theme, 'brand.500');
    }
  })()};
  }
  
  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${getSpacing(theme, 6)};
    height: ${getSpacing(theme, 6)};
    background: ${getColor(theme, 'text.inverse')};
    border-radius: 50%;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CheckboxLabel = (theme: any) => css`
  font-size: ${getSpacing(theme, 14)};
  color: ${getColor(theme, 'text.primary')};
  cursor: pointer;
  user-select: none;
  
  &:hover {
    color: ${getColor(theme, 'text.secondary')};
  }
`;
