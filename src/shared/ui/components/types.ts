/**
 * Enterprise Component Types
 * 
 * Base type definitions for all enterprise UI components
 * extending the existing Theme system.
 */

import { EnhancedTheme } from '@/core/theme';

// Base component props interface
export interface BaseComponentProps {
    theme?: EnhancedTheme;
    className?: string;
    children?: React.ReactNode;
    testId?: string;
    id?: string | number;
    onClick?: (event: React.MouseEvent) => void;
    style?: React.CSSProperties;
    ref?: React.Ref<HTMLElement>;
}

// Layout component props
export interface LayoutProps extends BaseComponentProps {
    display?: 'block' | 'flex' | 'grid' | 'inline' | 'inline-block' | 'none';
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
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

// Flex layout props
export interface FlexProps extends LayoutProps {
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
    gap?: string | number;
    rowGap?: string | number;
    columnGap?: string | number;
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: string | number;
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    order?: number;
}

// Typography component props
export interface TypographyProps extends BaseComponentProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
    size?: string | number;
    weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    color?: string;
    lineHeight?: string | number;
    letterSpacing?: string | number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
    fontFamily?: string;
    truncate?: 'end' | 'start' | boolean;
    lineClamp?: number;
}

// Interactive component props
export interface InteractiveProps extends BaseComponentProps {
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    onClick?: (event: React.MouseEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
}

// Button specific props
export interface ButtonProps extends InteractiveProps {
    type?: 'button' | 'submit' | 'reset';
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    fullWidth?: boolean;
    rounded?: boolean;
    outlined?: boolean;
    gradient?: boolean;
}

// Input component props
export interface InputProps extends InteractiveProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    name?: string;
    id?: string;
    required?: boolean;
    readOnly?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Component variant types
export type ComponentVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'light'
    | 'dark';

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Theme-aware component styles
export interface ComponentStyles {
    // Layout styles
    container: (props: LayoutProps) => string;
    flex: (props: FlexProps) => string;
    center: (props: LayoutProps) => string;

    // Typography styles
    text: (props: TypographyProps) => string;
    title: (props: TypographyProps) => string;

    // Interactive styles
    button: (props: ButtonProps) => string;
    input: (props: InputProps) => string;
}

// Enterprise component configuration
export interface ComponentConfig {
    // Default props
    defaultProps?: Partial<BaseComponentProps>;

    // Style variants
    variants?: Record<string, ComponentStyles>;

    // Theme integration
    themeIntegration?: {
        useThemeColors?: boolean;
        useThemeSpacing?: boolean;
        useThemeTypography?: boolean;
        useThemeRadius?: boolean;
    };

    // Accessibility features
    accessibility?: {
        ariaLabels?: boolean;
        keyboardNavigation?: boolean;
        screenReaderSupport?: boolean;
        highContrast?: boolean;
    };

    // Performance features
    performance?: {
        lazyLoading?: boolean;
        memoization?: boolean;
        virtualization?: boolean;
    };
}

// Export all types for easy importing
