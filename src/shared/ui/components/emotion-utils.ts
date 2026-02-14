/**
 * Emotion CSS Utilities
 * 
 * Utility functions for Emotion CSS integration with the existing theme system.
 * Provides Emotion-specific styling functions that work seamlessly with
 * the EnhancedTheme system and maintain compatibility with existing components.
 */

import { css, SerializedStyles } from '@emotion/react';
import { EnhancedTheme } from '@/core/modules/theming';
import {
    LayoutProps,
    FlexProps,
    TypographyProps,
    ComponentVariant,
    ComponentSize
} from './types';
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
    layoutPropsToStyles,
    flexPropsToStyles,
    typographyPropsToStyles,
    getFocusStyles,
    getInputFieldStyles,
    getContainerStyles
} from './utils';

/**
 * Create Emotion CSS styles from theme tokens
 */
export const createEmotionStyles = (theme: EnhancedTheme) => ({
    // Spacing utilities
    spacing: (value?: string | number) => css`
        ${getSpacing(theme, value)}
    `,

    // Color utilities
    color: (colorPath?: string) => css`
        color: ${getColor(theme, colorPath)};
    `,
    backgroundColor: (colorPath?: string) => css`
        background-color: ${getColor(theme, colorPath)};
    `,
    borderColor: (colorPath?: string) => css`
        border-color: ${getColor(theme, colorPath)};
    `,

    // Typography utilities
    fontSize: (size?: string) => css`
        font-size: ${getTypography(theme, `fontSize.${size}`) || getSpacing(theme, size)};
    `,
    fontWeight: (weight?: string) => css`
        font-weight: ${getTypography(theme, `fontWeight.${weight}`) || weight};
    `,
    fontFamily: (family?: string) => css`
        font-family: ${getTypography(theme, `fontFamily.${family}`) || family};
    `,

    // Layout utilities
    padding: (value?: string | number) => css`
        padding: ${getSpacing(theme, value)};
    `,
    margin: (value?: string | number) => css`
        margin: ${getSpacing(theme, value)};
    `,

    // Border utilities
    borderRadius: (size?: string) => css`
        border-radius: ${getRadius(theme, size)};
    `,
    borderWidth: (size?: string) => css`
        border-width: ${getBorderWidth(theme, size)};
    `,

    // Shadow utilities
    boxShadow: (type?: string) => css`
        box-shadow: ${getShadow(theme, type)};
    `,

    // Transition utilities
    transition: (properties?: string, duration?: string, easing?: string) => css`
        transition: ${getTransition(theme, properties, duration, easing)};
    `
});

/**
 * Create responsive Emotion styles
 */
export const createResponsiveStyles = (
    theme: EnhancedTheme,
    baseStyles: SerializedStyles,
    responsive?: {
        xs?: SerializedStyles;
        sm?: SerializedStyles;
        md?: SerializedStyles;
        lg?: SerializedStyles;
        xl?: SerializedStyles;
    }
): SerializedStyles => {
    let styles = baseStyles;

    if (responsive?.xs) {
        styles = css`
            ${styles}
            @media (max-width: ${theme.breakpoints.xs}) {
                ${responsive.xs}
            }
        `;
    }
    if (responsive?.sm) {
        styles = css`
            ${styles}
            @media (max-width: ${theme.breakpoints.sm}) {
                ${responsive.sm}
            }
        `;
    }
    if (responsive?.md) {
        styles = css`
            ${styles}
            @media (max-width: ${theme.breakpoints.md}) {
                ${responsive.md}
            }
        `;
    }
    if (responsive?.lg) {
        styles = css`
            ${styles}
            @media (max-width: ${theme.breakpoints.lg}) {
                ${responsive.lg}
            }
        `;
    }
    if (responsive?.xl) {
        styles = css`
            ${styles}
            @media (max-width: ${theme.breakpoints.xl}) {
                ${responsive.xl}
            }
        `;
    }

    return styles;
};

/**
 * Create button styles using Emotion CSS
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

/**
 * Create input field styles using Emotion CSS
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
            border-color: ${getColor(theme, 'semantic.error')};
            &:focus {
                border-color: ${getColor(theme, 'semantic.error')};
                box-shadow: 0 0 0 2px ${getColor(theme, 'semantic.error')}20;
            }
        `}
        
        ${options?.disabled && css`
            background-color: ${getColor(theme, 'background.tertiary')};
            color: ${getColor(theme, 'text.secondary')};
            cursor: not-allowed;
        `}
        
        ${options?.multiline && css`
            resize: vertical;
            min-height: 100px;
        `}
    `;
};

/**
 * Create container styles using Emotion CSS
 */
export const createContainerStyles = (
    theme: EnhancedTheme,
    variant: 'card' | 'modal' | 'panel' = 'card',
    options?: {
        centered?: boolean;
        fullWidth?: boolean;
        padding?: string | number;
    }
): SerializedStyles => {
    const baseContainerStyles = getContainerStyles(theme, variant);

    return css`
        ${Object.entries(baseContainerStyles).map(([property, value]) => `${property}: ${value}`).join('; ')};
        
        ${options?.centered && css`
            display: flex;
            justify-content: center;
            align-items: center;
        `}
        
        ${options?.fullWidth && css`
            width: 100%;
        `}
        
        ${options?.padding && css`
            padding: ${getSpacing(theme, options.padding)};
        `}
    `;
};

/**
 * Create layout styles using Emotion CSS
 */
export const createLayoutStyles = (
    theme: EnhancedTheme,
    props: LayoutProps
): SerializedStyles => {
    return css`
        ${layoutPropsToStyles(props, theme)}
    `;
};

/**
 * Create flex styles using Emotion CSS
 */
export const createFlexStyles = (
    theme: EnhancedTheme,
    props: FlexProps
): SerializedStyles => {
    return css`
        ${flexPropsToStyles(props, theme)}
    `;
};

/**
 * Create typography styles using Emotion CSS
 */
export const createTypographyStyles = (
    theme: EnhancedTheme,
    props: TypographyProps
): SerializedStyles => {
    return css`
        ${typographyPropsToStyles(props, theme)}
    `;
};

/**
 * Create skeleton styles using Emotion CSS
 */
export const createSkeletonStyles = (theme: EnhancedTheme): SerializedStyles => {
    return css`
        background: linear-gradient(90deg, ${getColor(theme, 'background.tertiary')} 25%, ${getColor(theme, 'background.secondary')} 50%, ${getColor(theme, 'background.tertiary')} 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        ${getSpacing(theme, 'skeleton.minWidth')}
        height: ${getSpacing(theme, 'skeleton.height')};
    `;
};

/**
 * Create loading spinner styles using Emotion CSS
 */
export const createLoadingSpinnerStyles = (
    _theme: EnhancedTheme,
    size: 'sm' | 'md' | 'lg' = 'md'
): SerializedStyles => {
    const sizeMap = {
        sm: '16px',
        md: '24px',
        lg: '32px'
    };

    return css`
        width: ${sizeMap[size]};
        height: ${sizeMap[size]};
        border: ${getBorderWidth(_theme, 'sm')} solid ${getColor(_theme, 'background.tertiary')};
        border-top: ${getBorderWidth(_theme, 'sm')} solid ${getColor(_theme, 'brand.500')};
        border-radius: 50%;
        animation: spin 1s linear infinite;
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
};

/**
 * Create modal styles using Emotion CSS
 */
export const createModalStyles = (theme: EnhancedTheme): SerializedStyles => {
    return css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${getColor(theme, 'background.overlay')};
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        
        .modal-content {
            ${createContainerStyles(theme, 'modal')}
            max-width: 90vw;
            max-height: 90vh;
            overflow: auto;
        }
    `;
};

/**
 * Create toast notification styles using Emotion CSS
 */
export const createToastStyles = (
    theme: EnhancedTheme,
    variant: 'success' | 'error' | 'warning' | 'info' = 'info'
): SerializedStyles => {
    const variantColors = {
        success: getColor(theme, 'semantic.success'),
        error: getColor(theme, 'semantic.error'),
        warning: getColor(theme, 'semantic.warning'),
        info: getColor(theme, 'semantic.info')
    };

    return css`
        background-color: ${variantColors[variant]};
        color: ${getColor(theme, 'text.inverse')};
        padding: ${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')};
        border-radius: ${getRadius(theme, 'md')};
        box-shadow: ${getShadow(theme, 'md')};
        margin-bottom: ${getSpacing(theme, 'sm')};
        ${getTransition(theme, 'all')};
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: ${getShadow(theme, 'lg')};
        }
    `;
};

/**
 * Create focus ring styles using Emotion CSS
 */
export const createFocusRingStyles = (
    theme: EnhancedTheme,
    color: string = 'brand.500',
    width: string = '2px'
): SerializedStyles => {
    return css`
        &:focus {
            outline: ${width} solid ${getColor(theme, color)};
            outline-offset: 2px;
        }
        
        &:focus-visible {
            outline: ${width} solid ${getColor(theme, color)};
            outline-offset: 2px;
        }
    `;
};

/**
 * Create disabled styles using Emotion CSS
 */
export const createDisabledStyles = (_theme: EnhancedTheme): SerializedStyles => {
    return css`
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
        }
    `;
};

/**
 * Create hover effects using Emotion CSS
 */
export const createHoverStyles = (
    _theme: EnhancedTheme,
    hoverStyles: SerializedStyles
): SerializedStyles => {
    return css`
        &:hover {
            ${hoverStyles}
        }
    `;
};

/**
 * Create active states using Emotion CSS
 */
export const createActiveStyles = (
    _theme: EnhancedTheme,
    activeStyles: SerializedStyles
): SerializedStyles => {
    return css`
        &:active {
            ${activeStyles}
        }
    `;
};

/**
 * Combine multiple Emotion styles
 */
export const combineStyles = (...styles: (SerializedStyles | undefined)[]): SerializedStyles => {
    return css`
        ${styles.filter(Boolean).join(' ')}
    `;
};

/**
 * Create conditional styles based on props
 */
export const createConditionalStyles = (
    condition: boolean,
    styles: SerializedStyles
): SerializedStyles | undefined => {
    return condition ? styles : undefined;
};

/**
 * Create theme-aware styles with fallback
 */
export const createThemeAwareStyles = (
    theme: EnhancedTheme | undefined,
    styles: SerializedStyles,
    fallbackStyles?: SerializedStyles
): SerializedStyles => {
    return theme ? styles : (fallbackStyles || css``);
};
