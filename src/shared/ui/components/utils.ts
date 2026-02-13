/**
 * Enterprise Component Utilities
 * 
 * Modern utility functions for theme integration and component styling
 * that work directly with the EnhancedTheme system.
 * No legacy adapters or migration code - pure modern theme integration.
 */

import { EnhancedTheme } from '@/core/theme';
import {
    LayoutProps,
    FlexProps,
    TypographyProps,
    ButtonProps,
    InputProps,
    ComponentVariant,
    ComponentSize
} from './types';

/**
 * Get spacing value from theme tokens or fallback
 */
export const getSpacing = (theme: EnhancedTheme, value?: string | number): string => {
    if (value === undefined || value === null) return '0';

    if (typeof value === 'string') {
        // Handle direct token references
        if (theme.spacing[value as keyof typeof theme.spacing]) {
            return theme.spacing[value as keyof typeof theme.spacing];
        }
        return value;
    }

    return `${value}px`;
};

/**
 * Get color value from theme tokens or fallback
 */
export const getColor = (theme: EnhancedTheme, colorPath?: string): string => {
    if (!colorPath) return 'inherit';

    // Handle brand colors (e.g., "brand.500")
    if (colorPath.startsWith('brand.')) {
        const shade = colorPath.split('.')[1] as keyof typeof theme.colors.brand;
        return theme.colors.brand[shade] || colorPath;
    }

    // Handle semantic colors
    if (colorPath.startsWith('semantic.')) {
        const semanticType = colorPath.split('.')[1] as keyof typeof theme.colors.semantic;
        return theme.colors.semantic[semanticType] || colorPath;
    }

    // Handle direct color paths
    const parts = colorPath.split('.');
    let colorValue: any = theme.colors;

    for (const part of parts) {
        if (colorValue && typeof colorValue === 'object' && part in colorValue) {
            colorValue = colorValue[part];
        } else {
            return colorPath; // Return original if path not found
        }
    }

    return typeof colorValue === 'string' ? colorValue : colorPath;
};

/**
 * Get typography value from theme tokens
 */
export const getTypography = (theme: EnhancedTheme, path?: string): any => {
    if (!path) return theme.typography;

    const parts = path.split('.');
    let typoValue: any = theme.typography;

    for (const part of parts) {
        if (typoValue && typeof typoValue === 'object' && part in typoValue) {
            typoValue = typoValue[part];
        } else {
            return path;
        }
    }

    return typoValue || path;
};

/**
 * Get radius value from theme tokens
 */
export const getRadius = (theme: EnhancedTheme, size?: string): string => {
    if (!size) return theme.radius.md;

    if (size === 'round') return '50%';

    if (theme.radius[size as keyof typeof theme.radius]) {
        return theme.radius[size as keyof typeof theme.radius];
    }

    return size;
};

/**
 * Get shadow value from theme tokens
 */
export const getShadow = (theme: EnhancedTheme, type?: string): string => {
    if (!type) return theme.shadows.md;

    if (theme.shadows[type as keyof typeof theme.shadows]) {
        return theme.shadows[type as keyof typeof theme.shadows];
    }

    return theme.shadows.md;
};

/**
 * Get animation duration from theme tokens
 */
export const getAnimationDuration = (theme: EnhancedTheme, duration?: string): string => {
    if (!duration) return theme.animation.duration.normal;

    if (theme.animation.duration[duration as keyof typeof theme.animation.duration]) {
        return theme.animation.duration[duration as keyof typeof theme.animation.duration];
    }

    return theme.animation.duration.normal;
};

/**
 * Get animation easing from theme tokens
 */
export const getAnimationEasing = (theme: EnhancedTheme, easing?: string): string => {
    if (!easing) return theme.animation.easing.ease;

    if (theme.animation.easing[easing as keyof typeof theme.animation.easing]) {
        return theme.animation.easing[easing as keyof typeof theme.animation.easing];
    }

    return theme.animation.easing.ease;
};

/**
 * Get transition value from theme animation tokens
 */
export const getTransition = (
    theme: EnhancedTheme,
    properties: string = 'all',
    duration?: string,
    easing?: string
): string => {
    const durationValue = getAnimationDuration(theme, duration);
    const easingValue = getAnimationEasing(theme, easing);
    return `${properties} ${durationValue} ${easingValue}`;
};

/**
 * Convert layout props to CSS styles using modern theme tokens
 */
export const layoutPropsToStyles = (props: LayoutProps, theme: EnhancedTheme): string => {
    const styles: string[] = [];

    if (props.display) styles.push(`display: ${props.display}`);
    if (props.position) styles.push(`position: ${props.position}`);
    if (props.width) styles.push(`width: ${getSpacing(theme, props.width)}`);
    if (props.height) styles.push(`height: ${getSpacing(theme, props.height)}`);
    if (props.minWidth) styles.push(`min-width: ${getSpacing(theme, props.minWidth)}`);
    if (props.minHeight) styles.push(`min-height: ${getSpacing(theme, props.minHeight)}`);
    if (props.maxWidth) styles.push(`max-width: ${getSpacing(theme, props.maxWidth)}`);
    if (props.maxHeight) styles.push(`max-height: ${getSpacing(theme, props.maxHeight)}`);

    // Margin properties
    if (props.margin) styles.push(`margin: ${getSpacing(theme, props.margin)}`);
    if (props.marginTop) styles.push(`margin-top: ${getSpacing(theme, props.marginTop)}`);
    if (props.marginRight) styles.push(`margin-right: ${getSpacing(theme, props.marginRight)}`);
    if (props.marginBottom) styles.push(`margin-bottom: ${getSpacing(theme, props.marginBottom)}`);
    if (props.marginLeft) styles.push(`margin-left: ${getSpacing(theme, props.marginLeft)}`);

    // Padding properties
    if (props.padding) styles.push(`padding: ${getSpacing(theme, props.padding)}`);
    if (props.paddingTop) styles.push(`padding-top: ${getSpacing(theme, props.paddingTop)}`);
    if (props.paddingRight) styles.push(`padding-right: ${getSpacing(theme, props.paddingRight)}`);
    if (props.paddingBottom) styles.push(`padding-bottom: ${getSpacing(theme, props.paddingBottom)}`);
    if (props.paddingLeft) styles.push(`padding-left: ${getSpacing(theme, props.paddingLeft)}`);

    return styles.join('; ');
};

/**
 * Convert flex props to CSS styles using modern theme tokens
 */
export const flexPropsToStyles = (props: FlexProps, theme: EnhancedTheme): string => {
    const layoutStyles = layoutPropsToStyles(props, theme);
    const flexStyles: string[] = [];

    if (props.flexDirection) flexStyles.push(`flex-direction: ${props.flexDirection}`);
    if (props.flexWrap) flexStyles.push(`flex-wrap: ${props.flexWrap}`);
    if (props.justifyContent) flexStyles.push(`justify-content: ${props.justifyContent}`);
    if (props.alignItems) flexStyles.push(`align-items: ${props.alignItems}`);
    if (props.alignContent) flexStyles.push(`align-content: ${props.alignContent}`);
    if (props.alignSelf) flexStyles.push(`align-self: ${props.alignSelf}`);
    if (props.gap) flexStyles.push(`gap: ${getSpacing(theme, props.gap)}`);
    if (props.rowGap) flexStyles.push(`row-gap: ${getSpacing(theme, props.rowGap)}`);
    if (props.columnGap) flexStyles.push(`column-gap: ${getSpacing(theme, props.columnGap)}`);
    if (props.flexBasis) flexStyles.push(`flex-basis: ${getSpacing(theme, props.flexBasis)}`);
    if (props.flexGrow !== undefined) flexStyles.push(`flex-grow: ${props.flexGrow}`);
    if (props.flexShrink !== undefined) flexStyles.push(`flex-shrink: ${props.flexShrink}`);
    if (props.order !== undefined) flexStyles.push(`order: ${props.order}`);

    return layoutStyles ? `${layoutStyles}; ${flexStyles.join('; ')}` : flexStyles.join('; ');
};

/**
 * Convert typography props to CSS styles using modern theme tokens
 */
export const typographyPropsToStyles = (props: TypographyProps, theme: EnhancedTheme): string => {
    const styles: string[] = [];

    // Handle variant
    if (props.variant) {
        const variantStyles = getTypography(theme, props.variant);
        if (variantStyles.fontSize) styles.push(`font-size: ${variantStyles.fontSize}`);
        if (variantStyles.fontWeight) styles.push(`font-weight: ${variantStyles.fontWeight}`);
        if (variantStyles.lineHeight) styles.push(`line-height: ${variantStyles.lineHeight}`);
        if (variantStyles.fontFamily) styles.push(`font-family: ${variantStyles.fontFamily}`);
    }

    // Handle individual typography properties
    if (props.size) styles.push(`font-size: ${getSpacing(theme, props.size)}`);
    if (props.weight) styles.push(`font-weight: ${props.weight}`);
    if (props.height) styles.push(`line-height: ${props.height}`);
    if (props.family) styles.push(`font-family: ${props.family}`);
    if (props.color) styles.push(`color: ${getColor(theme, props.color)}`);
    if (props.align) styles.push(`text-align: ${props.align}`);
    if (props.transform) styles.push(`text-transform: ${props.transform}`);
    if (props.decoration) styles.push(`text-decoration: ${props.decoration}`);

    // Handle text overflow
    if (props.truncate) {
        styles.push('white-space: nowrap');
        styles.push('overflow: hidden');
        styles.push('text-overflow: ellipsis');
    }

    if (props.lineClamp) {
        styles.push(`display: -webkit-box`);
        styles.push(`-webkit-line-clamp: ${props.lineClamp}`);
        styles.push('-webkit-box-orient: vertical');
        styles.push('overflow: hidden');
    }

    return styles.join('; ');
};

/**
 * Get variant-specific styles for buttons using modern theme tokens
 */
export const getButtonVariantStyles = (variant: ComponentVariant, theme: EnhancedTheme): string => {
    const variants = {
        primary: `
            background-color: ${getColor(theme, 'brand.500')};
            color: ${getColor(theme, 'text.inverse')};
            border: 1px solid ${getColor(theme, 'brand.500')};
            &:hover {
                background-color: ${getColor(theme, 'brand.600')};
                border-color: ${getColor(theme, 'brand.600')};
            }
            &:active {
                background-color: ${getColor(theme, 'brand.700')};
                border-color: ${getColor(theme, 'brand.700')};
            }
        `,
        secondary: `
            background-color: ${getColor(theme, 'background.secondary')};
            color: ${getColor(theme, 'text.primary')};
            border: 1px solid ${getColor(theme, 'border.light')};
            &:hover {
                background-color: ${getColor(theme, 'background.tertiary')};
                border-color: ${getColor(theme, 'border.medium')};
            }
        `,
        outline: `
            background-color: transparent;
            color: ${getColor(theme, 'brand.500')};
            border: 1px solid ${getColor(theme, 'brand.500')};
            &:hover {
                background-color: ${getColor(theme, 'brand.50')};
            }
        `,
        ghost: `
            background-color: transparent;
            color: ${getColor(theme, 'text.primary')};
            border: 1px solid transparent;
            &:hover {
                background-color: ${getColor(theme, 'background.secondary')};
            }
        `,
        danger: `
            background-color: ${getColor(theme, 'semantic.error')};
            color: ${getColor(theme, 'text.inverse')};
            border: 1px solid ${getColor(theme, 'semantic.error')};
            &:hover {
                background-color: ${getColor(theme, 'semantic.error')};
                opacity: 0.9;
            }
        `
    };

    return variants[variant] || variants.primary;
};

/**
 * Get size-specific styles for components using modern theme tokens
 */
export const getSizeStyles = (size: ComponentSize, theme: EnhancedTheme): string => {
    const sizes = {
        xs: `
            padding: ${theme.spacing.xs} ${theme.spacing.sm};
            font-size: ${theme.typography.fontSize.xs};
            border-radius: ${theme.radius.xs};
            border-width: ${theme.border.hairline};
        `,
        sm: `
            padding: ${theme.spacing.sm} ${theme.spacing.md};
            font-size: ${theme.typography.fontSize.sm};
            border-radius: ${theme.radius.sm};
            border-width: ${theme.border.xs};
        `,
        md: `
            padding: ${theme.spacing.md} ${theme.spacing.lg};
            font-size: ${theme.typography.fontSize.base};
            border-radius: ${theme.radius.md};
            border-width: ${theme.border.sm};
        `,
        lg: `
            padding: ${theme.spacing.lg} ${theme.spacing.xl};
            font-size: ${theme.typography.fontSize.lg};
            border-radius: ${theme.radius.lg};
            border-width: ${theme.border.md};
        `,
        xl: `
            padding: ${theme.spacing.xl} ${theme.spacing.xxl};
            font-size: ${theme.typography.fontSize.xl};
            border-radius: ${theme.radius.xl};
            border-width: ${theme.border.lg};
        `
    };

    return sizes[size] || sizes.md;
};

/**
 * Generate responsive styles using modern theme breakpoints
 */
export const generateResponsiveStyles = (
    baseStyles: string,
    theme: EnhancedTheme,
    responsive?: {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
    }
): string => {
    let styles = baseStyles;

    if (responsive?.xs) {
        styles += ` @media (max-width: ${theme.breakpoints.xs}) { ${responsive.xs} }`;
    }
    if (responsive?.sm) {
        styles += ` @media (max-width: ${theme.breakpoints.sm}) { ${responsive.sm} }`;
    }
    if (responsive?.md) {
        styles += ` @media (max-width: ${theme.breakpoints.md}) { ${responsive.md} }`;
    }
    if (responsive?.lg) {
        styles += ` @media (max-width: ${theme.breakpoints.lg}) { ${responsive.lg} }`;
    }
    if (responsive?.xl) {
        styles += ` @media (max-width: ${theme.breakpoints.xl}) { ${responsive.xl} }`;
    }

    return styles;
};

/**
 * Create focus styles using modern theme tokens
 */
export const getFocusStyles = (theme: EnhancedTheme, color: string = 'brand.500'): string => {
    return `
        &:focus {
            outline: 2px solid ${getColor(theme, color)};
            outline-offset: 2px;
        }
        &:focus-visible {
            outline: 2px solid ${getColor(theme, color)};
            outline-offset: 2px;
        }
    `;
};

/**
 * Create disabled styles using modern theme tokens
 */
export const getDisabledStyles = (theme: EnhancedTheme): string => {
    return `
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
        }
    `;
};

/**
 * Get border width value from theme tokens
 */
export const getBorderWidth = (theme: EnhancedTheme, width?: string): string => {
    if (!width) return theme.border.md;

    if (theme.border[width as keyof typeof theme.border]) {
        return theme.border[width as keyof typeof theme.border];
    }

    return width;
};

/**
 * Get micro-spacing value for precise spacing adjustments
 */
export const getMicroSpacing = (theme: EnhancedTheme, value?: string | number): string => {
    if (value === undefined || value === null) return '0';

    if (typeof value === 'string') {
        // Handle direct token references
        if (theme.spacing[value as keyof typeof theme.spacing]) {
            return theme.spacing[value as keyof typeof theme.spacing];
        }
        return value;
    }

    // For micro-spacing, use smaller increments
    if (typeof value === 'number') {
        // Convert to rem for smaller values (assuming base 16px)
        if (value < 8) {
            return `${value / 16}rem`;
        }
        return `${value}px`;
    }

    return `${value}px`;
};

/**
 * Get component-specific size from theme tokens
 */
export const getComponentSize = (theme: EnhancedTheme, component: keyof typeof theme.size, size?: string): string => {
    const componentSizes = theme.size[component];

    if (!componentSizes) {
        console.warn(`Component size not found: ${component}`);
        return 'md';
    }

    if (!size) {
        // Return default size for component
        if (component === 'avatar') return componentSizes.md;
        if (component === 'skeleton') return componentSizes.height;
        return 'md';
    }

    if (componentSizes[size as keyof typeof componentSizes]) {
        return componentSizes[size as keyof typeof componentSizes];
    }

    return size;
};

/**
 * Get skeleton component styles using theme tokens
 */
export const getSkeletonStyles = (theme: EnhancedTheme, variant?: 'default' | 'circle' | 'text'): string => {
    const baseStyles = `
        background: linear-gradient(90deg, 
            ${getColor(theme, 'background.tertiary')} 25%, 
            ${getColor(theme, 'background.secondary')} 50%, 
            ${getColor(theme, 'background.tertiary')} 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
        border-radius: ${theme.radius.md};
    `;

    const variantStyles = {
        default: `
            ${baseStyles}
            min-width: ${theme.size.skeleton.minWidth};
            height: ${theme.size.skeleton.height};
        `,
        circle: `
            ${baseStyles}
            border-radius: ${theme.radius.full};
            width: 40px;
            height: 40px;
        `,
        text: `
            ${baseStyles}
            height: 1rem;
            border-radius: ${theme.radius.sm};
            margin-bottom: ${theme.spacing.xs};
        `
    };

    return variantStyles[variant || 'default'] || variantStyles.default;
};
