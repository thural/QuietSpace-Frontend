/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * TextInputStyled input styles
 */
export const TextInputStyles = (theme: any) => css`
  width: 100%;
  padding: ${theme?.spacing?.md || '12px'};
  font-size: ${theme?.typography?.fontSize?.base || '16px'};
  font-family: ${theme?.typography?.fontFamily?.sans?.join(',') || 'system-ui, sans-serif'};
  color: ${theme?.colors?.text?.primary || '#000'};
  background: ${theme?.colors?.background?.primary || '#fff'};
  border: 1px solid ${theme?.colors?.border?.medium || '#ccc'};
  border-radius: ${theme?.radius?.md || '6px'};
  transition: all ${theme?.animation?.duration?.normal || '0.2s'} ${theme?.animation?.easing?.ease || 'ease'};
  
  &::placeholder {
    color: ${theme?.colors?.text?.tertiary || '#999'};
  }
  
  &:focus {
    outline: none;
    border-color: ${theme?.colors?.brand?.[500] || '#007bff'};
    box-shadow: 0 0 0 3px ${theme?.colors?.brand?.[200] || '#b3d9ff'};
  }
  
  &:hover:not(:focus) {
    border-color: ${theme?.colors?.border?.dark || '#999'};
  }
  
  &:disabled {
    background: ${theme?.colors?.background?.tertiary || '#f5f5f5'};
    color: ${theme?.colors?.text?.tertiary || '#999'};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  /* Responsive design */
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    padding: ${theme?.spacing?.sm || '8px'};
    font-size: ${theme?.typography?.fontSize?.sm || '14px'};
  }
`;
