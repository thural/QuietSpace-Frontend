/**
 * FileInput Component Styles
 * 
 * Emotion CSS styles for the FileInput component with file handling.
 */

import { css } from '@emotion/react';
import { getBorderWidth, getColor, getRadius, getSpacing, getTransition, getTypography } from '../../../utils';

/**
 * Create file input container styles using theme tokens
 */
export const createFileInputContainerStyles = (theme: any) => css`
  position: relative;
  display: inline-block;
  width: 100%;
`;

/**
 * Create file input button styles using theme tokens
 */
export const createFileInputButtonStyles = (theme: any, size: 'sm' | 'md' | 'lg' = 'md', disabled?: boolean) => {
    const sizeStyles = {
        sm: { padding: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')}`, fontSize: getTypography(theme, 'fontSize.sm') },
        md: { padding: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')}`, fontSize: getTypography(theme, 'fontSize.base') },
        lg: { padding: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')}`, fontSize: getTypography(theme, 'fontSize.lg') }
    };
    
    const currentSize = sizeStyles[size] || sizeStyles.md;
    
    return css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: ${currentSize.padding};
        font-size: ${currentSize.fontSize};
        font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
        color: ${getColor(theme, 'text.primary')};
        background: ${getColor(theme, 'background.primary')};
        border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
        border-radius: ${getRadius(theme, 'md')};
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
        transition: ${getTransition(theme, 'all', 'normal', 'ease')};
        outline: none;
        
        &:hover:not(:disabled) {
            background: ${getColor(theme, 'background.secondary')};
            border-color: ${getColor(theme, 'border.dark')};
        }
        
        &:focus {
            border-color: ${getColor(theme, 'brand.500')};
            box-shadow: 0 0 0 3px ${getColor(theme, 'brand.200')};
        }
        
        ${disabled && css`
            opacity: 0.6;
            cursor: not-allowed;
            background: ${getColor(theme, 'background.tertiary')};
            color: ${getColor(theme, 'text.tertiary')};
        `}
    `;
};

/**
 * Create file input hidden styles
 */
export const createFileInputHiddenStyles = css`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;
