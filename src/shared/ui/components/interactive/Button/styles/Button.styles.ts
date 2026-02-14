/**
 * Button Component Styles
 * 
 * Emotion CSS styles for the Button component with multiple variants.
 */

import { css, SerializedStyles } from '@emotion/react';
import { EnhancedTheme } from '@/core/modules/theming';
import { ComponentVariant, ComponentSize } from '../../../types';
import {
    getSpacing,
    getColor,
    getTypography,
    getRadius,
    getShadow,
    getTransition,
    getBorderWidth,
    getButtonVariantStyles,
    getSizeStyles,
    getFocusStyles
} from '../../../utils';

/**
 * Create button styles using theme tokens
 */
export const createButtonStyles = (
    theme: EnhancedTheme,
    variant: ComponentVariant = 'primary',
    size: ComponentSize = 'md',
    options?: {
        fullWidth?: boolean;
        rounded?: boolean;
        outlined?: boolean;
        gradient?: boolean;
        disabled?: boolean;
    }
): SerializedStyles => {
    const baseStyles = css`
        box-sizing: border-box;
        border: none;
        cursor: pointer;
        font-family: inherit;
        ${getTransition(theme, 'all', 'fast', 'ease')};
        outline: none;
        
        ${options?.disabled && css`
            opacity: 0.6;
            cursor: not-allowed;
        `}
        
        &:focus:not(:disabled) {
            ${getFocusStyles(theme, 'brand.500')}
        }
        
        ${getButtonVariantStyles(variant, theme)}
        ${getSizeStyles(size, theme)}
        
        ${options?.fullWidth && css`
            width: 100%;
        `}
        
        ${options?.rounded && css`
            border-radius: ${getRadius(theme, 'full')};
        `}
        
        ${options?.outlined && css`
            background: transparent;
            border: ${getBorderWidth(theme, 'sm')} solid;
        `}
        
        ${options?.gradient && css`
            background: linear-gradient(45deg, ${getColor(theme, 'brand.500')}, ${getColor(theme, 'brand.600')});
            color: white;
            border: none;
        `}
    `;

    return baseStyles;
};
