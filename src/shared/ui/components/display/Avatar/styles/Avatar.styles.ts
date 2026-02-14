/**
 * Avatar Component Styles
 * 
 * Emotion CSS styles for the Avatar component with various shapes and sizes.
 */

import { css } from '@emotion/react';
import { getComponentSize, getRadius, getColor, getSpacing, getTransition, getShadow } from '../../../utils';

/**
 * Create avatar container styles using theme tokens
 */
export const createAvatarContainerStyles = (theme: any, size: string | number | undefined, variant?: string, radius?: string, color?: string) => {
    const finalSize = getAvatarSize(theme, size);
    const finalRadius = getAvatarRadius(theme, variant, radius);
    const avatarColor = color || getColor(theme, 'brand.500');

    return css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${finalSize};
        height: ${finalSize};
        border-radius: ${finalRadius};
        background-color: ${avatarColor};
        color: ${getColor(theme, 'text.inverse')};
        font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
        font-size: calc(${finalSize} * 0.4);
        font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
        overflow: hidden;
        position: relative;
        transition: ${getTransition(theme, 'transform', 'fast', 'ease')};
        
        &:hover {
            transform: scale(1.05);
            box-shadow: ${getShadow(theme, 'md')};
        }
    `;
};

/**
 * Create avatar image styles using theme tokens
 */
export const createAvatarImageStyles = (radius: string, theme: any) => css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${radius};
    transition: ${getTransition(theme, 'all', 'fast', 'ease')};
`;

/**
 * Create avatar placeholder styles using theme tokens
 */
export const createAvatarPlaceholderStyles = (theme: any, color?: string) => {
    const placeholderColor = color || getColor(theme, 'brand.500');
    
    return css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${placeholderColor};
        color: ${getColor(theme, 'text.inverse')};
        font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
        text-transform: uppercase;
        font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    `;
};

/**
 * Get avatar size using theme tokens
 */
export const getAvatarSize = (theme: any, size: string | number | undefined): string => {
    const sizeMap = {
        xs: '24px',
        sm: '32px',
        md: '40px',
        lg: '48px',
        xl: '64px'
    };
    
    if (typeof size === 'number') return getSpacing(theme, size);
    if (typeof size === 'string' && sizeMap[size]) return getSpacing(theme, sizeMap[size]);
    
    try {
        return getComponentSize(theme, 'avatar', 'md');
    } catch {
        return getSpacing(theme, sizeMap.md);
    }
};

/**
 * Get avatar radius using theme tokens
 */
export const getAvatarRadius = (theme: any, variant?: string, radius?: string): string => {
    if (radius) return getRadius(theme, radius);
    
    const radiusMap = {
        circle: 'round',
        square: 'none',
        rounded: 'md'
    };
    
    const radiusVariant = radiusMap[variant || 'circle'] || 'round';
    return getRadius(theme, radiusVariant);
};
