/**
 * Enterprise Base Styled Components
 * 
 * Base styled components that integrate with the QuietSpace enterprise theme system.
 * These components provide consistent styling patterns and accessibility features.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';
import {
    EnterpriseComponentProps,
    AccessibilityProps,
    LayoutProps,
    SpacingProps,
    ColorProps,
    TypographyProps
} from './types';
import {
    combineStyles,
    createFocusStyles,
    createHoverStyles,
    createActiveStyles,
    createDisabledStyles,
    getSpacing,
    getThemeColor,
    getRadius,
    getShadow,
    getTransition
} from './utils';

/**
 * Base container component with theme integration
 */
export const BaseContainer = styled.div<Partial<EnterpriseComponentProps>>`
  box-sizing: border-box;
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createFocusStyles}
  ${createDisabledStyles}
`;

/**
 * Base section component
 */
export const BaseSection = styled.section<Partial<EnterpriseComponentProps>>`
  box-sizing: border-box;
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createFocusStyles}
  ${createDisabledStyles}
`;

/**
 * Base article component
 */
export const BaseArticle = styled.article<Partial<EnterpriseComponentProps>>`
  box-sizing: border-box;
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createFocusStyles}
  ${createDisabledStyles}
`;

/**
 * Base header component
 */
export const BaseHeader = styled.header<Partial<EnterpriseComponentProps>>`
  box-sizing: border-box;
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createFocusStyles}
  ${createDisabledStyles}
`;

/**
 * Base footer component
 */
export const BaseFooter = styled.footer<Partial<EnterpriseComponentProps>>`
  box-sizing: border-box;
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createFocusStyles}
  ${createDisabledStyles}
`;

/**
 * Base main component
 */
export const BaseMain = styled.main<Partial<EnterpriseComponentProps>>`
  box-sizing: border-box;
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createFocusStyles}
  ${createDisabledStyles}
`;

/**
 * Base nav component
 */
export const BaseNav = styled.nav<Partial<EnterpriseComponentProps>>`
  box-sizing: border-box;
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createFocusStyles}
  ${createDisabledStyles}
`;

/**
 * Base aside component
 */
export const BaseAside = styled.aside<Partial<EnterpriseComponentProps>>`
  box-sizing: border-box;
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createFocusStyles}
  ${createDisabledStyles}
`;

/**
 * Base button component with enterprise styling
 */
export const BaseButton = styled.button<Partial<EnterpriseComponentProps> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}>`
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
  border-radius: ${({ theme }) => getRadius(theme, 'md')};
  transition: ${({ theme }) => getTransition(theme, 'default')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  
  /* Size variants */
  ${({ theme, size = 'md' }) => {
        switch (size) {
            case 'sm':
                return {
                    padding: `${getSpacing(theme, 0.5)} ${getSpacing(theme, 1)}`,
                    fontSize: theme.typography.fontSize.small,
                };
            case 'lg':
                return {
                    padding: `${getSpacing(theme, 1.5)} ${getSpacing(theme, 3)}`,
                    fontSize: theme.typography.fontSize.large,
                };
            default:
                return {
                    padding: `${getSpacing(theme, 0.75)} ${getSpacing(theme, 1.5)}`,
                    fontSize: theme.typography.fontSize.primary,
                };
        }
    }}
  
  /* Color variants */
  ${({ theme, variant = 'primary' }) => {
        switch (variant) {
            case 'secondary':
                return {
                    backgroundColor: getThemeColor(theme, 'secondary'),
                    color: getThemeColor(theme, 'textMax'),
                    ...createHoverStyles(theme, {
                        backgroundColor: getThemeColor(theme, 'secondary'),
                        opacity: 0.8,
                    }),
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    color: getThemeColor(theme, 'primary'),
                    border: `1px solid ${getThemeColor(theme, 'primary')}`,
                    ...createHoverStyles(theme, {
                        backgroundColor: getThemeColor(theme, 'primary'),
                        color: getThemeColor(theme, 'textMax'),
                    }),
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    color: getThemeColor(theme, 'text'),
                    ...createHoverStyles(theme, {
                        backgroundColor: getThemeColor(theme, 'backgroundSecondary'),
                    }),
                };
            default:
                return {
                    backgroundColor: getThemeColor(theme, 'primary'),
                    color: getThemeColor(theme, 'textMax'),
                    ...createHoverStyles(theme, {
                        backgroundColor: getThemeColor(theme, 'primary'),
                        opacity: 0.8,
                    }),
                };
        }
    }}
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createFocusStyles}
  ${createActiveStyles(theme, {})}
  ${createDisabledStyles}
`;

/**
 * Base input component with enterprise styling
 */
export const BaseInput = styled.input<Partial<EnterpriseComponentProps> & {
    variant?: 'outlined' | 'filled' | 'underlined';
    error?: boolean;
}>`
  box-sizing: border-box;
  border: 1px solid;
  border-radius: ${({ theme }) => getRadius(theme, 'sm')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.primary};
  padding: ${({ theme }) => `${getSpacing(theme, 0.75)} ${getSpacing(theme, 1)}`};
  transition: ${({ theme }) => getTransition(theme, 'default')};
  background-color: ${({ theme }) => getThemeColor(theme, 'inputField')};
  color: ${({ theme }) => getThemeColor(theme, 'text')};
  
  /* Variant styles */
  ${({ theme, variant = 'outlined', error }) => {
        const borderColor = error
            ? getThemeColor(theme, 'danger')
            : getThemeColor(theme, 'border');

        switch (variant) {
            case 'filled':
                return {
                    border: 'none',
                    backgroundColor: getThemeColor(theme, 'inputField'),
                    borderBottom: `2px solid ${borderColor}`,
                    borderRadius: '0',
                };
            case 'underlined':
                return {
                    border: 'none',
                    borderBottom: `2px solid ${borderColor}`,
                    borderRadius: '0',
                    backgroundColor: 'transparent',
                };
            default:
                return {
                    borderColor,
                    backgroundColor: getThemeColor(theme, 'inputField'),
                };
        }
    }}
  
  /* Focus styles */
  &:focus {
    outline: none;
    border-color: ${({ theme, error }) =>
        error ? getThemeColor(theme, 'danger') : getThemeColor(theme, 'primary')
    };
    box-shadow: ${({ theme }) => `0 0 0 2px ${getThemeColor(theme, 'primary')}20`};
  }
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createDisabledStyles}
`;

/**
 * Base text component with typography integration
 */
export const BaseText = styled.span<Partial<EnterpriseComponentProps> & {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
}>`
  box-sizing: border-box;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => getThemeColor(theme, 'text')};
  
  /* Typography variants */
  ${({ theme, variant = 'body1' }) => {
        switch (variant) {
            case 'h1':
                return theme.typography.h1;
            case 'h2':
                return theme.typography.h2;
            case 'h3':
                return {
                    fontSize: '1.5rem',
                    fontWeight: theme.typography.fontWeightBold,
                };
            case 'h4':
                return {
                    fontSize: '1.25rem',
                    fontWeight: theme.typography.fontWeightBold,
                };
            case 'h5':
                return {
                    fontSize: '1.125rem',
                    fontWeight: theme.typography.fontWeightBold,
                };
            case 'h6':
                return {
                    fontSize: '1rem',
                    fontWeight: theme.typography.fontWeightBold,
                };
            case 'body2':
                return theme.typography.body2;
            case 'caption':
                return {
                    fontSize: '0.75rem',
                    fontWeight: theme.typography.fontWeightRegular,
                };
            default:
                return theme.typography.body1;
        }
    }}
  
  ${({ theme }) => combineStyles(theme, props)}
`;

/**
 * Base flex container component
 */
export const BaseFlex = styled.div<Partial<EnterpriseComponentProps> & {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    gap?: string | number;
}>`
  box-sizing: border-box;
  display: flex;
  
  /* Flex properties */
  ${({ direction = 'row' }) => ({ flexDirection: direction })}
  ${({ wrap = 'nowrap' }) => ({ flexWrap: wrap })}
  ${({ justify = 'flex-start' }) => ({ justifyContent: justify })}
  ${({ align = 'stretch' }) => ({ alignItems: align })}
  
  /* Gap */
  ${({ theme, gap }) => gap && ({ gap: typeof gap === 'number' ? getSpacing(theme, gap) : gap })}
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createFocusStyles}
  ${createDisabledStyles}
`;

/**
 * Base grid container component
 */
export const BaseGrid = styled.div<Partial<EnterpriseComponentProps> & {
    columns?: number | string;
    rows?: number | string;
    gap?: string | number;
    areas?: string;
}>`
  box-sizing: border-box;
  display: grid;
  
  /* Grid properties */
  ${({ columns }) => columns && ({ gridTemplateColumns: columns })}
  ${({ rows }) => rows && ({ gridTemplateRows: rows })}
  ${({ theme, gap }) => gap && ({ gap: typeof gap === 'number' ? getSpacing(theme, gap) : gap })}
  ${({ areas }) => areas && ({ gridTemplateAreas: areas })}
  
  ${({ theme }) => combineStyles(theme, props)}
  ${createFocusStyles}
  ${createDisabledStyles}
`;
