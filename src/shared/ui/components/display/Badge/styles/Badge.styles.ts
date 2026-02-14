/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ComponentSize } from '../../../utils/themeTokenHelpers';
import { getSpacing, getColor, getTypography, getRadius, getBorderWidth, getShadow, getTransition } from '../../utils';

/**
 * Get badge color using theme tokens
 */
export const getBadgeColor = (theme: any, color?: string): string => {
    if (color) return getColor(theme, color);
    // Default to brand color from theme
    return getColor(theme, 'brand.500');
};

/**
 * Create badge container styles
 */
export const createBadgeStyles = (
    theme: any,
    variant: 'filled' | 'outline' | 'light',
    color: string,
    size: ComponentSize,
    leftSection?: ReactNode,
    rightSection?: ReactNode
) => {
    const badgeColor = getBadgeColor(theme, color);
    const sizeValue = size || 'md';

    // Size variants using theme spacing tokens
    const gapMap = {
        xs: getSpacing(theme, 'xs'),
        sm: getSpacing(theme, 'sm'),
        md: getSpacing(theme, 'md'),
        lg: getSpacing(theme, 'lg'),
        xl: getSpacing(theme, 'xl')
    };
    const paddingMap = {
        xs: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')}`,
        sm: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')}`,
        md: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'lg')}`,
        lg: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'xl')}`,
        xl: `${getSpacing(theme, 'lg')} ${getSpacing(theme, 'xl')}`
    };
    const fontSizeMap = {
        xs: getTypography(theme, 'fontSize.xs'),
        sm: getTypography(theme, 'fontSize.sm'),
        md: getTypography(theme, 'fontSize.base'),
        lg: getTypography(theme, 'fontSize.lg'),
        xl: getTypography(theme, 'fontSize.xl')
    };
    const radiusMap = {
        xs: getRadius(theme, 'sm'),
        sm: getRadius(theme, 'sm'),
        md: getRadius(theme, 'md'),
        lg: getRadius(theme, 'lg'),
        xl: getRadius(theme, 'lg')
    };

    // Variant styles using theme tokens
    const getBackgroundColor = () => {
        switch (variant) {
            case 'filled':
                return getColor(theme, badgeColor);
            case 'outline':
                return 'transparent';
            case 'light':
                return `${getColor(theme, badgeColor)}15`;
            default:
                return getColor(theme, badgeColor);
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'filled':
                return getColor(theme, 'text.inverse');
            case 'outline':
                return getColor(theme, badgeColor);
            case 'light':
                return getColor(theme, badgeColor);
            default:
                return getColor(theme, 'text.inverse');
        }
    };

    const getBorder = () => {
        if (variant === 'outline') {
            return `${getBorderWidth(theme, 'sm')} solid ${getColor(theme, badgeColor)}`;
        }
        return 'none';
    };

    return css`
        display: inline-flex;
        align-items: center;
        font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
        font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
        transition: ${getTransition(theme, 'all', 'fast', 'ease')};
        
        /* Size variants using theme spacing tokens */
        gap: ${gapMap[sizeValue]};
        padding: ${paddingMap[sizeValue]};
        font-size: ${fontSizeMap[sizeValue]};
        border-radius: ${radiusMap[sizeValue]};
        
        /* Variant styles using theme tokens */
        background-color: ${getBackgroundColor()};
        color: ${getTextColor()};
        border: ${getBorder()};
        
        /* Hover states */
        &:hover {
            transform: translateY(-1px);
            box-shadow: ${getShadow(theme, 'sm')};
        }
    `;
};
