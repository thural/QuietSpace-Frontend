/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * FormField container styles
 */
export const FormFieldContainer = (theme: any, layout: 'vertical' | 'horizontal' | 'inline' = 'vertical') => css`
  display: ${layout === 'inline' ? 'inline-flex' : 'flex'};
  flex-direction: ${layout === 'horizontal' ? 'row' : 'column'};
  gap: ${theme?.spacing?.sm || '8px'};
  margin-bottom: ${theme?.spacing?.md || '12px'};
  
  ${layout === 'horizontal' && css`
    align-items: center;
  `}
  
  ${layout === 'inline' && css`
    align-items: center;
    margin-right: ${theme?.spacing?.md || '12px'};
    margin-bottom: 0;
  `}
`;

/**
 * FormField label styles
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
 * FormField input styles
 */
export const InputStyles = (theme: any, size: 'small' | 'medium' | 'large' = 'medium', hasError: boolean = false) => css`
  padding: ${(() => {
    switch (size) {
      case 'small': return theme?.spacing?.xs || '4px';
      case 'large': return theme?.spacing?.md || '12px';
      default: return theme?.spacing?.sm || '8px';
    }
  })()};
  border: 1px solid ${hasError ? theme?.colors?.semantic?.error : theme?.colors?.border?.medium};
  border-radius: ${theme?.radius?.sm || '4px'};
  font-size: ${(() => {
    switch (size) {
      case 'small': return theme?.typography?.fontSize?.sm || '14px';
      case 'large': return theme?.typography?.fontSize?.lg || '18px';
      default: return theme?.typography?.fontSize?.base || '16px';
    }
  })()};
  background: ${theme?.colors?.background?.primary || '#fff'};
  color: ${theme?.colors?.text?.primary || '#000'};
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
 * FormField error message styles
 */
export const ErrorStyles = (theme: any) => css`
  font-size: ${theme?.typography?.fontSize?.xs || '12px'};
  color: ${theme?.colors?.semantic?.error || '#dc3545'};
  margin-top: ${theme?.spacing?.xs || '4px'};
`;

/**
 * FormField help text styles
 */
export const HelpTextStyles = (theme: any) => css`
  font-size: ${theme?.typography?.fontSize?.xs || '12px'};
  color: ${theme?.colors?.text?.secondary || '#666'};
  margin-top: ${theme?.spacing?.xs || '4px'};
`;
