/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * TwoFactorAuth container styles
 */
export const TwoFactorAuthContainer = (theme: any) => css`
  display: flex;
  flex-direction: column;
  gap: ${theme?.spacing?.md || '12px'};
  padding: ${theme?.spacing?.lg || '16px'};
  border: 1px solid ${theme?.colors?.border?.medium || '#ccc'};
  border-radius: ${theme?.radius?.md || '6px'};
  background: ${theme?.colors?.background?.primary || '#fff'};
  max-width: 400px;
`;

/**
 * Input field styles
 */
export const InputStyles = (theme: any, hasError: boolean = false) => css`
  width: 100%;
  padding: ${theme?.spacing?.sm || '8px'};
  border: 1px solid ${hasError ? theme?.colors?.semantic?.error : theme?.colors?.border?.medium};
  border-radius: ${theme?.radius?.sm || '4px'};
  font-size: ${theme?.typography?.fontSize?.lg || '18px'};
  font-family: ${theme?.typography?.fontFamily?.mono?.join(',') || 'monospace'};
  text-align: center;
  background: ${hasError ? theme?.colors?.semantic?.errorBg : theme?.colors?.background?.primary};
  color: ${theme?.colors?.text?.primary || '#000'};
  
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
`;

/**
 * Button styles
 */
export const ButtonStyles = (theme: any, disabled: boolean = false) => css`
  padding: ${theme?.spacing?.sm || '8px'} ${theme?.spacing?.md || '12px'};
  border: none;
  border-radius: ${theme?.radius?.sm || '4px'};
  font-size: ${theme?.typography?.fontSize?.sm || '14px'};
  font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  background: ${disabled ? theme?.colors?.background?.tertiary : theme?.colors?.brand?.[500]};
  color: ${disabled ? theme?.colors?.text?.tertiary : theme?.colors?.text?.inverse};
  transition: all ${theme?.animation?.duration?.fast || '0.15s'} ${theme?.animation?.easing?.ease || 'ease'};
  
  &:not(:disabled):hover {
    background: ${theme?.colors?.brand?.[600] || '#0056b3'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme?.colors?.brand?.[200] || '#b3d9ff'};
  }
`;
