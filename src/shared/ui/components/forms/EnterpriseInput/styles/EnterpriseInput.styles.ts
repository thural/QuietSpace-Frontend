/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * Enterprise Input container styles
 */
export const InputContainer = (theme: any) => css`
  position: relative;
  display: flex;
  flex-direction: column;
`;

/**
 * Input field styles
 */
export const InputStyles = (theme: any, variant: 'default' | 'outlined' | 'filled' = 'default', size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md', state: 'default' | 'error' | 'success' | 'warning' = 'default', hasError: boolean = false) => css`
  ${(() => {
    switch (size) {
      case 'xs':
        return css`padding: 4px 8px; font-size: 12px;`;
      case 'sm':
        return css`padding: 6px 12px; font-size: 14px;`;
      case 'lg':
        return css`padding: 10px 20px; font-size: 18px;`;
      case 'xl':
        return css`padding: 12px 24px; font-size: 20px;`;
      default:
        return css`padding: 8px 16px; font-size: 16px;`;
    }
  })()};
  
  border-radius: ${theme?.radius?.md || '6px'};
  border: 1px solid ${(() => {
    if (hasError) return theme?.colors?.semantic?.error || '#dc3545';
    if (state === 'success') return theme?.colors?.semantic?.success || '#28a745';
    if (state === 'warning') return theme?.colors?.semantic?.warning || '#ffc107';
    return theme?.colors?.border?.medium || '#ccc';
  })()};
  
  ${(() => {
    switch (variant) {
      case 'outlined':
        return css`
          background: transparent;
          color: ${theme?.colors?.text?.primary || '#000'};
        `;
      case 'filled':
        return css`
          background: ${theme?.colors?.background?.secondary || '#f8f9fa'};
          border-color: transparent;
          color: ${theme?.colors?.text?.primary || '#000'};
        `;
      default:
        return css`
          background: ${theme?.colors?.background?.primary || '#fff'};
          color: ${theme?.colors?.text?.primary || '#000'};
        `;
    }
  })()};
  
  transition: all ${theme?.animation?.duration?.fast || '0.15s'} ${theme?.animation?.easing?.ease || 'ease'};
  
  &:focus {
    outline: none;
    border-color: ${theme?.colors?.brand?.[500] || '#007bff'};
    box-shadow: 0 0 0 2px ${theme?.colors?.brand?.[200] || '#b3d9ff'};
  }
  
  &:disabled {
    background: ${theme?.colors?.background?.tertiary || '#f5f5f5'};
    color: ${theme?.colors?.text?.tertiary || '#999'};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${theme?.colors?.text?.tertiary || '#999'};
  }
`;

/**
 * Input label styles
 */
export const LabelStyles = (theme: any, required: boolean = false) => css`
  font-size: ${theme?.typography?.fontSize?.sm || '14px'};
  font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
  color: ${theme?.colors?.text?.primary || '#000'};
  margin-bottom: ${theme?.spacing?.xs || '4px'};
  
  ${required && css`
    &::after {
      content: ' *';
      color: ${theme?.colors?.semantic?.error || '#dc3545'};
    }
  `}
`;

/**
 * Helper text styles
 */
export const HelperTextStyles = (theme: any, state: 'default' | 'error' | 'success' | 'warning' = 'default') => css`
  font-size: ${theme?.typography?.fontSize?.xs || '12px'};
  margin-top: ${theme?.spacing?.xs || '4px'};
  
  ${() => {
    switch (state) {
      case 'error':
        return css`color: ${theme?.colors?.semantic?.error || '#dc3545'};`;
      case 'success':
        return css`color: ${theme?.colors?.semantic?.success || '#28a745'};`;
      case 'warning':
        return css`color: ${theme?.colors?.semantic?.warning || '#ffc107'};`;
      default:
        return css`color: ${theme?.colors?.text?.secondary || '#666'};`;
    }
  })()};
`;

/**
 * Icon container styles
 */
export const IconStyles = (theme: any, position: 'left' | 'right' = 'left') => css`
  position: absolute;
  ${position === 'left' ? 'left: 12px;' : 'right: 12px;'}
  top: 50%;
  transform: translateY(-50%);
  color: ${theme?.colors?.text?.tertiary || '#999'};
  pointer-events: none;
`;
