/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * FileUploader container styles
 */
export const FileUploaderContainer = (theme: any) => css`
  display: flex;
  flex-direction: column;
  gap: ${theme?.spacing?.md || '12px'};
  padding: ${theme?.spacing?.lg || '16px'};
  border: 1px solid ${theme?.colors?.border?.medium || '#ccc'};
  border-radius: ${theme?.radius?.md || '6px'};
  background: ${theme?.colors?.background?.primary || '#fff'};
`;

/**
 * File info styles
 */
export const FileInfoStyles = (theme: any) => css`
  padding: ${theme?.spacing?.sm || '8px'};
  background: ${theme?.colors?.background?.secondary || '#f8f9fa'};
  border-radius: ${theme?.radius?.sm || '4px'};
  font-size: ${theme?.typography?.fontSize?.sm || '14px'};
  color: ${theme?.colors?.text?.secondary || '#666'};
`;

/**
 * Status message styles
 */
export const StatusStyles = (theme: any, status: 'success' | 'error' | 'uploading') => css`
  padding: ${theme?.spacing?.sm || '8px'};
  border-radius: ${theme?.radius?.sm || '4px'};
  font-size: ${theme?.typography?.fontSize?.sm || '14px'};
  font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
  
  ${status === 'success' && css`
    background: ${theme?.colors?.semantic?.successBg || '#d4edda'};
    color: ${theme?.colors?.semantic?.success || '#155724'};
    border: 1px solid ${theme?.colors?.semantic?.success || '#c3e6cb'};
  `}
  
  ${status === 'error' && css`
    background: ${theme?.colors?.semantic?.errorBg || '#f8d7da'};
    color: ${theme?.colors?.semantic?.error || '#721c24'};
    border: 1px solid ${theme?.colors?.semantic?.error || '#f5c6cb'};
  `}
  
  ${status === 'uploading' && css`
    background: ${theme?.colors?.semantic?.warningBg || '#fff3cd'};
    color: ${theme?.colors?.semantic?.warning || '#856404'};
    border: 1px solid ${theme?.colors?.semantic?.warning || '#ffeaa7'};
  `}
`;
