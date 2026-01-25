/**
 * Enterprise Styled Components Types
 * 
 * Type definitions for enterprise styled-components that integrate
 * with the QuietSpace theme system.
 */

import { Theme } from '@/app/theme';

/**
 * Base props for enterprise styled components
 */
export interface EnterpriseStyledProps {
    theme: Theme;
}

/**
 * Responsive design props
 */
export interface ResponsiveProps {
    mobile?: string;
    tablet?: string;
    desktop?: string;
}

/**
 * Accessibility props for components
 */
export interface AccessibilityProps {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-expanded'?: boolean;
    'aria-hidden'?: boolean;
    role?: string;
    tabIndex?: number;
}

/**
 * Animation props for enterprise components
 */
export interface AnimationProps {
    animation?: string;
    transition?: string;
    duration?: string;
    easing?: string;
    delay?: string;
}

/**
 * Layout props for flexible component design
 */
export interface LayoutProps {
    display?: string;
    position?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    zIndex?: number;
}

/**
 * Spacing props using theme spacing system
 */
export interface SpacingProps {
    margin?: string | number;
    marginTop?: string | number;
    marginRight?: string | number;
    marginBottom?: string | number;
    marginLeft?: string | number;
    padding?: string | number;
    paddingTop?: string | number;
    paddingRight?: string | number;
    paddingBottom?: string | number;
    paddingLeft?: string | number;
}

/**
 * Color props using theme color system
 */
export interface ColorProps {
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    opacity?: number;
}

/**
 * Typography props using theme typography system
 */
export interface TypographyProps {
    fontSize?: string | number;
    fontWeight?: string | number;
    fontFamily?: string;
    lineHeight?: string | number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
}

/**
 * Combined props for enterprise styled components
 */
export type EnterpriseComponentProps = EnterpriseStyledProps &
    Partial<ResponsiveProps> &
    Partial<AccessibilityProps> &
    Partial<AnimationProps> &
    Partial<LayoutProps> &
    Partial<SpacingProps> &
    Partial<ColorProps> &
    Partial<TypographyProps>;

/**
 * JSS style object type for migration
 */
export interface JSSStyleObject {
    [key: string]: any;
}

/**
 * Theme function type for styled-components
 */
export type ThemeFunction<T = {}> = (props: EnterpriseStyledProps & T) => string;

/**
 * CSS Interpolation type for styled-components
 */
export type CSSInterpolation = string | number | TemplateStringsArray | CSSInterpolation[];
