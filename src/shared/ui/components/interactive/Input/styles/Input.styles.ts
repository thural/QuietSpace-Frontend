/**
 * Input Component Styles
 * 
 * Emotion CSS styles for the Input component with various states.
 */

import { css, SerializedStyles } from '@emotion/react';
import { EnhancedTheme } from '@/core/modules/theming';
import {
    getInputFieldStyles,
    getFocusStyles
} from '../../../utils';

/**
 * Create input styles using theme tokens
 */
export const createInputStyles = (
    theme: EnhancedTheme,
    size: 'sm' | 'md' | 'lg' = 'md',
    options?: {
        error?: boolean;
        disabled?: boolean;
        multiline?: boolean;
    }
): SerializedStyles => {
    const baseInputStyles = getInputFieldStyles(theme, size);

    return css`
        ${Object.entries(baseInputStyles).map(([property, value]) => `${property}: ${value}`).join('; ')};
        
        ${options?.error && css`
            border-color: ${theme.colors?.semantic?.error || '#dc3545'};
            box-shadow: 0 0 0 3px ${theme.colors?.semantic?.error || '#dc3545'}20;
        `}
        
        ${options?.disabled && css`
            opacity: 0.6;
            cursor: not-allowed;
            background-color: ${theme.colors?.background?.tertiary || '#f8f9fa'};
        `}
        
        &:focus:not(:disabled) {
            ${getFocusStyles(theme, 'brand.500')}
        }
        
        ${options?.multiline && css`
            min-height: 100px;
            resize: vertical;
        `}
    `;
};
