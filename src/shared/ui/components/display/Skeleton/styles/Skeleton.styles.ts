/**
 * Skeleton Component Styles
 * 
 * Emotion CSS styles for the Skeleton component with loading animations.
 */

import { css } from '@emotion/react';
import { getSpacing, getRadius, getTypography, getSkeletonStyles } from '../../../utils';

/**
 * Create skeleton container styles using theme tokens
 */
export const createSkeletonContainerStyles = (
    theme: any,
    width?: string | number,
    height?: string | number,
    variant?: string,
    size?: string,
    radius?: string
) => {
    // Convert dimensions using theme tokens
    const convertDimension = (value: string | number | undefined): string | undefined => {
        if (typeof value === 'number') return getSpacing(theme, value);
        return value;
    };

    // Get default dimensions using theme tokens
    const getDefaultDimensions = (variant?: string): { width?: string; height?: string } => {
        switch (variant) {
            case 'text':
                return { width: '60%', height: getTypography(theme, 'fontSize.base') };
            case 'circular':
                return { width: getSpacing(theme, 40), height: getSpacing(theme, 40) };
            case 'rectangular':
            default:
                return { width: '100%', height: getSpacing(theme, 20) };
        }
    };

    const widthValue = convertDimension(width);
    const heightValue = convertDimension(height);
    const defaultDimensions = getDefaultDimensions(variant);

    // Size-based dimensions using theme tokens
    let sizeStyles = '';
    if (size) {
        const sizeMap = {
            xs: { width: getSpacing(theme, 'xs'), height: getSpacing(theme, 'xs') },
            sm: { width: getSpacing(theme, 'sm'), height: getSpacing(theme, 'sm') },
            md: { width: getSpacing(theme, 'md'), height: getSpacing(theme, 'md') },
            lg: { width: getSpacing(theme, 'lg'), height: getSpacing(theme, 'lg') },
            xl: { width: getSpacing(theme, 'xl'), height: getSpacing(theme, 'xl') }
        };
        const dimensions = sizeMap[size];
        if (dimensions) {
            sizeStyles = `
                        width: ${dimensions.width};
                        height: ${dimensions.height};
                    `;
        }
    }

    // Text variant styles
    let textStyles = '';
    if (variant === 'text') {
        textStyles = `
                        height: ${getTypography(theme, 'fontSize.base')};
                        width: 60%;
                        margin-bottom: ${getSpacing(theme, 'sm')};
                    `;
    }

    // Border radius styles
    const getRadiusValue = () => {
        if (variant === 'circular') return getRadius(theme, 'round');
        if (variant === 'text') return getRadius(theme, 'sm');
        return getRadius(theme, radius || 'md');
    };

    return css`
            width: ${widthValue || defaultDimensions.width};
            height: ${heightValue || defaultDimensions.height};
            border-radius: ${getRadiusValue()};
            
            ${sizeStyles}
            ${textStyles}
            
            /* Use getSkeletonStyles utility for consistent skeleton appearance */
            ${getSkeletonStyles(theme || {} as any)}
            
            /* Subtle animation on hover */
            &:hover {
                opacity: 0.8;
            }
        `;
};
