/**
 * Enterprise Styled Components Utilities
 * 
 * Utility functions for creating styled-components that integrate
 * with the QuietSpace enterprise theme system.
 */

import { css, CSSObject } from 'styled-components';
import { Theme } from '@/app/theme';
import {
    EnterpriseComponentProps,
    EnterpriseStyledProps,
    ResponsiveProps,
    SpacingProps,
    ColorProps,
    TypographyProps,
    ThemeFunction,
    CSSInterpolation
} from './types';

/**
 * Get theme spacing value
 */
export const getSpacing = (theme: Theme, factor: number): string => {
    return theme.spacing(factor);
};

/**
 * Get theme spacing by factor name
 */
export const getSpacingByName = (theme: Theme, factorName: keyof Theme['spacingFactor']): string => {
    return theme.spacing(theme.spacingFactor[factorName]);
};

/**
 * Get theme color by path
 */
export const getThemeColor = (theme: Theme, path: string): string => {
    const keys = path.split('.');
    let value: any = theme.colors;

    for (const key of keys) {
        value = value?.[key];
    }

    return value || '#000000';
};

/**
 * Get theme typography value
 */
export const getTypography = (theme: Theme, variant: keyof Theme['typography']): any => {
    return theme.typography[variant];
};

/**
 * Get theme radius value
 */
export const getRadius = (theme: Theme, size: keyof Theme['radius']): string => {
    return theme.radius[size];
};

/**
 * Get theme shadow value
 */
export const getShadow = (theme: Theme, type: keyof Theme['shadows']): string => {
    return theme.shadows[type];
};

/**
 * Get theme transition value
 */
export const getTransition = (theme: Theme, type: keyof Theme['transitions'] = 'default'): string => {
    return theme.transitions[type];
};

/**
 * Get theme z-index value
 */
export const getZIndex = (theme: Theme, type: keyof Theme['zIndex']): number => {
    return theme.zIndex[type];
};

/**
 * Create responsive styles using theme breakpoints
 */
export const responsive = (
    theme: Theme,
    styles: Partial<ResponsiveProps>
): CSSObject => {
    const responsiveStyles: CSSObject = {};

    if (styles.mobile) {
        responsiveStyles[`@media (max-width: ${theme.breakpoints.sm})`] = {
            css: styles.mobile
        };
    }

    if (styles.tablet) {
        responsiveStyles[`@media (min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.lg})`] = {
            css: styles.tablet
        };
    }

    if (styles.desktop) {
        responsiveStyles[`@media (min-width: ${theme.breakpoints.lg})`] = {
            css: styles.desktop
        };
    }

    return responsiveStyles;
};

/**
 * Create spacing styles from props
 */
export const createSpacingStyles = (
    theme: Theme,
    props: Partial<SpacingProps>
): CSSObject => {
    const styles: CSSObject = {};

    const spacingProps: (keyof SpacingProps)[] = [
        'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
        'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'
    ];

    spacingProps.forEach(prop => {
        const value = props[prop];
        if (value !== undefined) {
            const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();

            if (typeof value === 'number') {
                styles[cssProp] = getSpacing(theme, value);
            } else {
                styles[cssProp] = value;
            }
        }
    });

    return styles;
};

/**
 * Create color styles from props
 */
export const createColorStyles = (
    theme: Theme,
    props: Partial<ColorProps>
): CSSObject => {
    const styles: CSSObject = {};

    if (props.color) {
        styles.color = props.color.startsWith('theme.')
            ? getThemeColor(theme, props.color.replace('theme.', ''))
            : props.color;
    }

    if (props.backgroundColor) {
        styles.backgroundColor = props.backgroundColor.startsWith('theme.')
            ? getThemeColor(theme, props.backgroundColor.replace('theme.', ''))
            : props.backgroundColor;
    }

    if (props.borderColor) {
        styles.borderColor = props.borderColor.startsWith('theme.')
            ? getThemeColor(theme, props.borderColor.replace('theme.', ''))
            : props.borderColor;
    }

    if (props.opacity !== undefined) {
        styles.opacity = props.opacity;
    }

    return styles;
};

/**
 * Create typography styles from props
 */
export const createTypographyStyles = (
    theme: Theme,
    props: Partial<TypographyProps>
): CSSObject => {
    const styles: CSSObject = {};

    if (props.fontSize) {
        styles.fontSize = typeof props.fontSize === 'number'
            ? getSpacing(theme, props.fontSize)
            : props.fontSize;
    }

    if (props.fontWeight) {
        styles.fontWeight = props.fontWeight;
    }

    if (props.fontFamily) {
        styles.fontFamily = props.fontFamily;
    }

    if (props.lineHeight) {
        styles.lineHeight = typeof props.lineHeight === 'number'
            ? props.lineHeight
            : props.lineHeight;
    }

    if (props.textAlign) {
        styles.textAlign = props.textAlign;
    }

    if (props.textTransform) {
        styles.textTransform = props.textTransform;
    }

    return styles;
};

/**
 * Combine multiple style utilities
 */
export const combineStyles = (
    theme: Theme,
    props: Partial<EnterpriseComponentProps>
): CSSObject => {
    return {
        ...createSpacingStyles(theme, props),
        ...createColorStyles(theme, props),
        ...createTypographyStyles(theme, props),
        ...responsive(theme, props),
    };
};

/**
 * Create CSS function with theme integration
 */
export const themedCSS = <T = {}>(styles: ThemeFunction<T>) => css<T & EnterpriseStyledProps>;

/**
 * Create accessibility styles
 */
export const createAccessibilityStyles = (
    props: Partial<EnterpriseComponentProps>
): CSSObject => {
    const styles: CSSObject = {};

    if (props['aria-label']) {
        styles['&[aria-label]'] = {};
    }

    if (props.role) {
        styles['&[role]'] = {};
    }

    if (props.tabIndex !== undefined) {
        styles['&[tabindex]'] = {};
    }

    return styles;
};

/**
 * Create focus styles for accessibility
 */
export const createFocusStyles = (theme: Theme): CSSObject => {
    return {
        '&:focus': {
            outline: `2px solid ${getThemeColor(theme, 'focus')}`,
            outlineOffset: '2px',
        },
        '&:focus-visible': {
            outline: `2px solid ${getThemeColor(theme, 'focus')}`,
            outlineOffset: '2px',
        },
    };
};

/**
 * Create hover styles with theme transitions
 */
export const createHoverStyles = (
    theme: Theme,
    hoverStyles: CSSObject
): CSSObject => {
    return {
        '&:hover': {
            ...hoverStyles,
            transition: getTransition(theme, 'fast'),
        },
    };
};

/**
 * Create active styles for interaction feedback
 */
export const createActiveStyles = (
    theme: Theme,
    activeStyles: CSSObject
): CSSObject => {
    return {
        '&:active': {
            ...activeStyles,
            transition: getTransition(theme, 'fast'),
        },
    };
};

/**
 * Create disabled styles
 */
export const createDisabledStyles = (theme: Theme): CSSObject => {
    return {
        '&:disabled, &[disabled]': {
            opacity: 0.6,
            cursor: 'not-allowed',
            pointerEvents: 'none',
        },
    };
};
