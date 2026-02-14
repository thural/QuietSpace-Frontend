/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * DateRangePicker container styles
 */
export const DateRangePickerContainer = (theme: any) => css`
  display: flex;
  flex-direction: column;
  gap: ${theme?.spacing?.md || '12px'};
  padding: ${theme?.spacing?.md || '12px'};
  border: 1px solid ${theme?.colors?.border?.medium || '#ccc'};
  border-radius: ${theme?.radius?.md || '6px'};
  background: ${theme?.colors?.background?.primary || '#fff'};
`;

/**
 * Date input styles
 */
export const DateInputStyles = (theme: any, hasError: boolean = false) => css`
  padding: ${theme?.spacing?.sm || '8px'};
  border: 1px solid ${hasError ? theme?.colors?.semantic?.error : theme?.colors?.border?.medium};
  border-radius: ${theme?.radius?.sm || '4px'};
  font-size: ${theme?.typography?.fontSize?.base || '16px'};
  background: ${theme?.colors?.background?.primary || '#fff'};
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
