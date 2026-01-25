/**
 * JSS to Styled-Components Migration Utilities
 * 
 * Utilities to help migrate from JSS createUseStyles to styled-components
 * while maintaining the same styling behavior and theme integration.
 */

import { Theme } from '@/app/theme';
import { JSSStyleObject } from './types';

/**
 * Convert JSS style object to styled-components CSS string
 */
export const convertJSSToStyled = (jssStyles: JSSStyleObject): string => {
    let cssString = '';

    const processStyleObject = (styles: any, prefix = ''): void => {
        for (const [key, value] of Object.entries(styles)) {
            if (typeof value === 'object' && value !== null) {
                // Handle nested styles (like '&:hover')
                if (key.startsWith('&')) {
                    cssString += `${key} {`;
                    processStyleObject(value);
                    cssString += '}';
                } else {
                    // Handle media queries and other at-rules
                    cssString += `${key} {`;
                    processStyleObject(value);
                    cssString += '}';
                }
            } else if (value !== undefined && value !== null) {
                // Convert camelCase to kebab-case
                const cssProperty = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                cssString += `${cssProperty}: ${value};`;
            }
        }
    };

    processStyleObject(jssStyles);
    return cssString;
};

/**
 * Extract theme function from JSS styles
 */
export const extractThemeFunction = (jssStyles: JSSStyleObject): ((theme: Theme) => JSSStyleObject) | null => {
    if (typeof jssStyles === 'function') {
        return jssStyles as (theme: Theme) => JSSStyleObject;
    }
    return null;
};

/**
 * Convert JSS spacing values to theme spacing
 */
export const convertSpacing = (value: any, theme: Theme): string => {
    if (typeof value === 'number') {
        return theme.spacing(value);
    }

    if (typeof value === 'string' && value.includes('theme.spacing')) {
        // Extract factor from theme.spacing(factor) calls
        const match = value.match(/theme\.spacing\(([^)]+)\)/);
        if (match) {
            const factor = parseFloat(match[1]);
            return theme.spacing(factor);
        }
    }

    return value;
};

/**
 * Convert JSS color values to theme colors
 */
export const convertColors = (value: any, theme: Theme): string => {
    if (typeof value === 'string' && value.includes('theme.colors')) {
        // Extract color path from theme.colors.path calls
        const match = value.match(/theme\.colors\.([^)}]+)/);
        if (match) {
            const colorPath = match[1];
            const keys = colorPath.split('.');
            let colorValue: any = theme.colors;

            for (const key of keys) {
                colorValue = colorValue?.[key];
            }

            return colorValue || value;
        }
    }

    return value;
};

/**
 * Convert JSS typography values to theme typography
 */
export const convertTypography = (value: any, theme: Theme): any => {
    if (typeof value === 'string' && value.includes('theme.typography')) {
        // Extract typography path from theme.typography.path calls
        const match = value.match(/theme\.typography\.([^)}]+)/);
        if (match) {
            const typoPath = match[1];
            const keys = typoPath.split('.');
            let typoValue: any = theme.typography;

            for (const key of keys) {
                typoValue = typoValue?.[key];
            }

            return typoValue || value;
        }
    }

    return value;
};

/**
 * Convert JSS radius values to theme radius
 */
export const convertRadius = (value: any, theme: Theme): string => {
    if (typeof value === 'string' && value.includes('theme.radius')) {
        // Extract radius size from theme.radius.size calls
        const match = value.match(/theme\.radius\.([^)}]+)/);
        if (match) {
            const radiusSize = match[1];
            return theme.radius[radiusSize as keyof typeof theme.radius] || value;
        }
    }

    return value;
};

/**
 * Convert JSS shadow values to theme shadows
 */
export const convertShadows = (value: any, theme: Theme): string => {
    if (typeof value === 'string' && value.includes('theme.shadows')) {
        // Extract shadow type from theme.shadows.type calls
        const match = value.match(/theme\.shadows\.([^)}]+)/);
        if (match) {
            const shadowType = match[1];
            return theme.shadows[shadowType as keyof typeof theme.shadows] || value;
        }
    }

    return value;
};

/**
 * Convert JSS transition values to theme transitions
 */
export const convertTransitions = (value: any, theme: Theme): string => {
    if (typeof value === 'string' && value.includes('theme.transitions')) {
        // Extract transition type from theme.transitions.type calls
        const match = value.match(/theme\.transitions\.([^)}]+)/);
        if (match) {
            const transitionType = match[1];
            return theme.transitions[transitionType as keyof typeof theme.transitions] || value;
        }
    }

    return value;
};

/**
 * Convert JSS z-index values to theme z-index
 */
export const convertZIndex = (value: any, theme: Theme): number => {
    if (typeof value === 'string' && value.includes('theme.zIndex')) {
        // Extract z-index type from theme.zIndex.type calls
        const match = value.match(/theme\.zIndex\.([^)}]+)/);
        if (match) {
            const zIndexType = match[1];
            return theme.zIndex[zIndexType as keyof typeof theme.zIndex] || parseInt(value);
        }
    }

    return typeof value === 'string' ? parseInt(value) : value;
};

/**
 * Process JSS style object and convert theme references
 */
export const processJSSStyles = (styles: JSSStyleObject, theme: Theme): JSSStyleObject => {
    const processedStyles: JSSStyleObject = {};

    const processObject = (obj: any): any => {
        const result: any = {};

        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                result[key] = processObject(value);
            } else if (typeof value === 'string') {
                // Convert various theme references
                result[key] = convertSpacing(
                    convertColors(
                        convertTypography(
                            convertRadius(
                                convertShadows(
                                    convertTransitions(
                                        value,
                                        theme
                                    ),
                                    theme
                                ),
                                theme
                            ),
                            theme
                        ),
                        theme
                    ),
                    theme
                );
            } else {
                result[key] = value;
            }
        }

        return result;
    };

    return processObject(styles);
};

/**
 * Migration helper for common JSS patterns
 */
export const migrateCommonPatterns = {
    // Convert padding: theme.spacing(theme.spacingFactor.md)
    padding: (value: any, theme: Theme) => convertSpacing(value, theme),

    // Convert margin: theme.spacing(theme.spacingFactor.sm)
    margin: (value: any, theme: Theme) => convertSpacing(value, theme),

    // Convert backgroundColor: theme.colors.background
    backgroundColor: (value: any, theme: Theme) => convertColors(value, theme),

    // Convert color: theme.colors.text
    color: (value: any, theme: Theme) => convertColors(value, theme),

    // Convert fontSize: theme.typography.fontSize.primary
    fontSize: (value: any, theme: Theme) => convertTypography(value, theme),

    // Convert borderRadius: theme.radius.md
    borderRadius: (value: any, theme: Theme) => convertRadius(value, theme),

    // Convert boxShadow: theme.shadows.medium
    boxShadow: (value: any, theme: Theme) => convertShadows(value, theme),

    // Convert transition: theme.transitions.default
    transition: (value: any, theme: Theme) => convertTransitions(value, theme),

    // Convert zIndex: theme.zIndex.modal
    zIndex: (value: any, theme: Theme) => convertZIndex(value, theme),
};

/**
 * Create a styled component from JSS styles
 */
export const createStyledFromJSS = (
    componentName: string,
    jssStyles: JSSStyleObject | ((theme: Theme) => JSSStyleObject)
) => {
    const styleFunction = typeof jssStyles === 'function'
        ? jssStyles
        : () => jssStyles;

    return (theme: Theme) => {
        const styles = styleFunction(theme);
        return processJSSStyles(styles, theme);
    };
};
