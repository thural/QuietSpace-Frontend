/**
 * Enterprise Component Utilities
 * 
 * Utility functions for theme integration and component styling
 * that work with the existing Theme system.
 */

import { Theme } from '@/app/theme';
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
 * Get spacing value from theme or fallback
 */
export const getSpacing = (theme: Theme, value?: string | number): string => {
    if (value === undefined || value === null) return '0';

    if (typeof value === 'number') {
        return theme.spacing(value);
    }

    if (typeof value === 'string') {
        // Handle theme spacing function calls
        if (value.includes('theme.spacing')) {
            const match = value.match(/theme\.spacing\(([^)]+)\)/);
            if (match) {
                const factor = parseFloat(match[1]);
                return theme.spacing(factor);
            }
        }

        // Handle theme spacing factor references
        if (value.includes('spacingFactor')) {
            const match = value.match(/spacingFactor\.(\w+)/);
            if (match) {
                const factor = theme.spacingFactor[match[1] as keyof typeof theme.spacingFactor];
                return theme.spacing(factor);
            }
        }
    }

    return String(value);
};

/**
 * Get color value from theme or fallback
 */
export const getColor = (theme: Theme, color?: string): string => {
    if (!color) return 'inherit';

    // Handle theme color references
    if (color.includes('theme.colors')) {
        const match = color.match(/theme\.colors\.([^)}]+)/);
        if (match) {
            const colorPath = match[1];
            const keys = colorPath.split('.');
            let colorValue: any = theme.colors;

            for (const key of keys) {
                colorValue = colorValue?.[key];
            }

            return colorValue || color;
        }
    }

    return color;
};

/**
 * Get typography value from theme or fallback
 */
export const getTypography = (theme: Theme, path?: string): any => {
    if (!path) return theme.typography;

    if (path.includes('theme.typography')) {
        const match = path.match(/theme\.typography\.([^)}]+)/);
        if (match) {
            const typoPath = match[1];
            const keys = typoPath.split('.');
            let typoValue: any = theme.typography;

            for (const key of keys) {
                typoValue = typoValue?.[key];
            }

            return typoValue || path;
        }
    }

    return path;
};

/**
 * Get radius value from theme or fallback
 */
export const getRadius = (theme: Theme, size?: string): string => {
    if (!size) return theme.radius.md;

    if (size.includes('theme.radius')) {
        const match = size.match(/theme\.radius\.([^)}]+)/);
        if (match) {
            const radiusSize = match[1];
            return theme.radius[radiusSize as keyof typeof theme.radius] || size;
        }
    }

    return size;
};

/**
 * Get shadow value from theme or fallback
 */
export const getShadow = (theme: Theme, type?: string): string => {
    if (!type) return theme.shadows.medium;

    if (type.includes('theme.shadows')) {
        const match = type.match(/theme\.shadows\.([^)}]+)/);
        if (match) {
            const shadowType = match[1];
            return theme.shadows[shadowType as keyof typeof theme.shadows] || type;
        }
    }

    return type;
};

/**
 * Get transition value from theme or fallback
 */
export const getTransition = (theme: Theme, type?: string): string => {
    if (!type) return theme.transitions.default;

    if (type.includes('theme.transitions')) {
        const match = type.match(/theme\.transitions\.([^)}]+)/);
        if (match) {
            const transitionType = match[1];
            return theme.transitions[transitionType as keyof typeof theme.transitions] || type;
        }
    }

    return type;
};

/**
 * Get z-index value from theme or fallback
 */
export const getZIndex = (theme: Theme, type?: string): number => {
    if (!type) return 0;

    if (type.includes('theme.zIndex')) {
        const match = type.match(/theme\.zIndex\.([^)}]+)/);
        if (match) {
            const zIndexType = match[1];
            return theme.zIndex[zIndexType as keyof typeof theme.zIndex] || parseInt(type);
        }
    }

    return parseInt(type) || 0;
};

/**
 * Convert layout props to CSS styles
 */
export const layoutPropsToStyles = (props: LayoutProps, theme: Theme): string => {
    const styles: string[] = [];

    if (props.display) styles.push(`display: ${props.display}`);
    if (props.position) styles.push(`position: ${props.position}`);
    if (props.width) styles.push(`width: ${getSpacing(theme, props.width)}`);
    if (props.height) styles.push(`height: ${getSpacing(theme, props.height)}`);
    if (props.minWidth) styles.push(`min-width: ${getSpacing(theme, props.minWidth)}`);
    if (props.minHeight) styles.push(`min-height: ${getSpacing(theme, props.minHeight)}`);
    if (props.maxWidth) styles.push(`max-width: ${getSpacing(theme, props.maxWidth)}`);
    if (props.maxHeight) styles.push(`max-height: ${getSpacing(theme, props.maxHeight)}`);
    if (props.margin) styles.push(`margin: ${getSpacing(theme, props.margin)}`);
    if (props.marginTop) styles.push(`margin-top: ${getSpacing(theme, props.marginTop)}`);
    if (props.marginRight) styles.push(`margin-right: ${getSpacing(theme, props.marginRight)}`);
    if (props.marginBottom) styles.push(`margin-bottom: ${getSpacing(theme, props.marginBottom)}`);
    if (props.marginLeft) styles.push(`margin-left: ${getSpacing(theme, props.marginLeft)}`);
    if (props.padding) styles.push(`padding: ${getSpacing(theme, props.padding)}`);
    if (props.paddingTop) styles.push(`padding-top: ${getSpacing(theme, props.paddingTop)}`);
    if (props.paddingRight) styles.push(`padding-right: ${getSpacing(theme, props.paddingRight)}`);
    if (props.paddingBottom) styles.push(`padding-bottom: ${getSpacing(theme, props.paddingBottom)}`);
    if (props.paddingLeft) styles.push(`padding-left: ${getSpacing(theme, props.paddingLeft)}`);

    return styles.join('; ');
};

/**
 * Convert flex props to CSS styles
 */
export const flexPropsToStyles = (props: FlexProps, theme: Theme): string => {
    const layoutStyles = layoutPropsToStyles(props, theme);
    const flexStyles: string[] = [];

    if (props.flexDirection) flexStyles.push(`flex-direction: ${props.flexDirection}`);
    if (props.flexWrap) flexStyles.push(`flex-wrap: ${props.flexWrap}`);
    if (props.justifyContent) flexStyles.push(`justify-content: ${props.justifyContent}`);
    if (props.alignItems) flexStyles.push(`align-items: ${props.alignItems}`);
    if (props.alignContent) flexStyles.push(`align-content: ${props.alignContent}`);
    if (props.gap) flexStyles.push(`gap: ${getSpacing(theme, props.gap)}`);
    if (props.rowGap) flexStyles.push(`row-gap: ${getSpacing(theme, props.rowGap)}`);
    if (props.columnGap) flexStyles.push(`column-gap: ${getSpacing(theme, props.columnGap)}`);
    if (props.flexGrow !== undefined) flexStyles.push(`flex-grow: ${props.flexGrow}`);
    if (props.flexShrink !== undefined) flexStyles.push(`flex-shrink: ${props.flexShrink}`);
    if (props.flexBasis) flexStyles.push(`flex-basis: ${getSpacing(theme, props.flexBasis)}`);
    if (props.alignSelf) flexStyles.push(`align-self: ${props.alignSelf}`);
    if (props.order !== undefined) flexStyles.push(`order: ${props.order}`);

    return layoutStyles ? `${layoutStyles}; ${flexStyles.join('; ')}` : flexStyles.join('; ');
};

/**
 * Convert typography props to CSS styles
 */
export const typographyPropsToStyles = (props: TypographyProps, theme: Theme): string => {
    const styles: string[] = [];

    // Handle variant
    if (props.variant) {
        const variantStyles = getTypography(theme, `theme.typography.${props.variant}`);
        if (variantStyles.fontSize) styles.push(`font-size: ${variantStyles.fontSize}`);
        if (variantStyles.fontWeight) styles.push(`font-weight: ${variantStyles.fontWeight}`);
    }

    if (props.size) styles.push(`font-size: ${getSpacing(theme, props.size)}`);
    if (props.weight) styles.push(`font-weight: ${props.weight}`);
    if (props.color) styles.push(`color: ${getColor(theme, props.color)}`);
    if (props.lineHeight) styles.push(`line-height: ${props.lineHeight}`);
    if (props.letterSpacing) styles.push(`letter-spacing: ${props.letterSpacing}`);
    if (props.textAlign) styles.push(`text-align: ${props.textAlign}`);
    if (props.textTransform) styles.push(`text-transform: ${props.textTransform}`);
    if (props.textDecoration) styles.push(`text-decoration: ${props.textDecoration}`);
    if (props.fontFamily) styles.push(`font-family: ${props.fontFamily}`);

    return styles.join('; ');
};

/**
 * Get variant-specific styles for buttons
 */
export const getButtonVariantStyles = (variant: ComponentVariant, theme: Theme): string => {
    const variants = {
        primary: `
      background-color: ${getColor(theme, 'theme.colors.primary')};
      color: white;
      border: 1px solid ${getColor(theme, 'theme.colors.primary')};
    `,
        secondary: `
      background-color: ${getColor(theme, 'theme.colors.backgroundSecondary')};
      color: ${getColor(theme, 'theme.colors.text')};
      border: 1px solid ${getColor(theme, 'theme.colors.border')};
    `,
        success: `
      background-color: ${getColor(theme, 'theme.colors.success')};
      color: white;
      border: 1px solid ${getColor(theme, 'theme.colors.success')};
    `,
        warning: `
      background-color: ${getColor(theme, 'theme.colors.warning')};
      color: white;
      border: 1px solid ${getColor(theme, 'theme.colors.warning')};
    `,
        danger: `
      background-color: ${getColor(theme, 'theme.colors.danger')};
      color: white;
      border: 1px solid ${getColor(theme, 'theme.colors.danger')};
    `,
        info: `
      background-color: ${getColor(theme, 'theme.colors.info')};
      color: white;
      border: 1px solid ${getColor(theme, 'theme.colors.info')};
    `,
        light: `
      background-color: ${getColor(theme, 'theme.colors.background')};
      color: ${getColor(theme, 'theme.colors.text')};
      border: 1px solid ${getColor(theme, 'theme.colors.border')};
    `,
        dark: `
      background-color: ${getColor(theme, 'theme.colors.text')};
      color: white;
      border: 1px solid ${getColor(theme, 'theme.colors.text')};
    `,
    };

    return variants[variant] || variants.primary;
};

/**
 * Get size-specific styles for components
 */
export const getSizeStyles = (size: ComponentSize, theme: Theme): string => {
    const sizes = {
        xs: `
      padding: ${theme.spacing(theme.spacingFactor.xs)} ${theme.spacing(theme.spacingFactor.sm)};
      font-size: ${theme.typography.fontSize.small};
      border-radius: ${theme.radius.xs};
    `,
        sm: `
      padding: ${theme.spacing(theme.spacingFactor.sm)} ${theme.spacing(theme.spacingFactor.md)};
      font-size: ${theme.typography.fontSize.secondary};
      border-radius: ${theme.radius.sm};
    `,
        md: `
      padding: ${theme.spacing(theme.spacingFactor.md)} ${theme.spacing(theme.spacingFactor.lg)};
      font-size: ${theme.typography.fontSize.primary};
      border-radius: ${theme.radius.md};
    `,
        lg: `
      padding: ${theme.spacing(theme.spacingFactor.lg)} ${theme.spacing(theme.spacingFactor.xl)};
      font-size: ${theme.typography.fontSize.large};
      border-radius: ${theme.radius.lg};
    `,
        xl: `
      padding: ${theme.spacing(theme.spacingFactor.xl)} ${theme.spacing(theme.spacingFactor.xl * 1.5)};
      font-size: ${theme.typography.fontSize.xLarge};
      border-radius: ${theme.radius.xl};
    `,
    };

    return sizes[size] || sizes.md;
};

/**
 * Generate responsive styles
 */
export const generateResponsiveStyles = (
    baseStyles: string,
    theme: Theme,
    responsive?: {
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
    }
): string => {
    let styles = baseStyles;

    if (responsive?.sm) {
        styles += ` @media (min-width: ${theme.breakpoints.sm}) { ${responsive.sm} }`;
    }
    if (responsive?.md) {
        styles += ` @media (min-width: ${theme.breakpoints.md}) { ${responsive.md} }`;
    }
    if (responsive?.lg) {
        styles += ` @media (min-width: ${theme.breakpoints.lg}) { ${responsive.lg} }`;
    }
    if (responsive?.xl) {
        styles += ` @media (min-width: ${theme.breakpoints.xl}) { ${responsive.xl} }`;
    }

    return styles;
};
