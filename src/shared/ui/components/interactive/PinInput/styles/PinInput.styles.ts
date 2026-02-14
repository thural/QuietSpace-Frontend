/**
 * PinInput Component Styles
 * 
 * Emotion CSS styles for the PinInput component with PIN code functionality.
 */

import { css } from '@emotion/react';
import { getColor, getTypography, getRadius, getBorderWidth, getTransition, getSizeBasedSpacing } from '../../../utils';

/**
 * Create pin input container styles using theme tokens
 */
export const createPinInputContainerStyles = (theme: any, size: 'sm' | 'md' | 'lg') => css`
  display: flex;
  gap: ${getSizeBasedSpacing(theme, size)};
`;

/**
 * Create pin input field styles using theme tokens
 */
export const createPinInputFieldStyles = (theme: any, size: 'sm' | 'md' | 'lg') => {
    const sizeStyles = {
        sm: { width: '2.5rem', height: '2.5rem', fontSize: getTypography(theme, 'fontSize.base') },
        lg: { width: '3.5rem', height: '3.5rem', fontSize: getTypography(theme, 'fontSize.xl') },
        md: { width: '3rem', height: '3rem', fontSize: getTypography(theme, 'fontSize.lg') }
    };
    
    const currentSize = sizeStyles[size] || sizeStyles.md;
    
    return css`
        width: ${currentSize.width};
        height: ${currentSize.height};
        font-size: ${currentSize.fontSize};
        text-align: center;
        border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
        border-radius: ${getRadius(theme, 'md')};
        background: ${getColor(theme, 'background.primary')};
        color: ${getColor(theme, 'text.primary')};
        transition: ${getTransition(theme, 'all', 'normal', 'ease')};
        outline: none;
        
        &:focus {
            border-color: ${getColor(theme, 'brand.500')};
            box-shadow: 0 0 0 3px ${getColor(theme, 'brand.200')};
        }
        
        &:disabled {
            background: ${getColor(theme, 'background.tertiary')};
            color: ${getColor(theme, 'text.tertiary')};
            cursor: not-allowed;
        }
    `;
};
