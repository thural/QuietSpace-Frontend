export interface Colors {
    background: string;
    backgroundSecondary: string;
    backgroundMax: string;
    text: string;
    textSecondary: string;
    textMax: string;
    primary: string;
    secondary: string;
    inputField: string;
    checkBox: string;
    border: string;
    borderSecondary: string;
    danger: string;
    warning: string;
    info: string;
    success: string;
    gradient: string;
}

export interface FontSize {
    primary: string;
    secondary: string;
    small: string;
    large: string;
}

export interface Typography {
    fontFamily: string;
    fontSize: FontSize;
    fontWeightThin: number;
    fontWeightRegular: number;
    fontWeightBold: number;
    lineHeight: string;
    h1: { fontSize: string; fontWeight: number };
    h2: { fontSize: string; fontWeight: number };
    body1: { fontSize: string; fontWeight: number };
    body2: { fontSize: string; fontWeight: number };
}

export interface Shadows {
    light: string;
    medium: string;
    dark: string;
    extra: string;
}

export interface Transitions {
    default: string;
    fast: string;
}

export interface Animations {
    fadeIn: string;
    slideUp: string;
}

export interface Keyframes {
    fadeIn: {
        from: { opacity: number };
        to: { opacity: number };
    };
    slideUp: {
        from: { transform: string };
        to: { transform: string };
    };
}

export interface SizesByString {
    xs: string;
    sm: string;
    ms: string;
    md: string;
    lg: string;
    xl: string;
}

export interface SizesByNumber {
    xs: number;
    sm: number;
    ms: number;
    md: number;
    lg: number;
    xl: number;
}

export interface Breakpoints extends SizesByString { }

export interface SpacingFactor extends SizesByNumber { }

export interface ZIndex {
    modal: number;
    tooltip: number;
}

export interface Radius extends SizesByString {
    square: string;
    round: string;
}

export interface BaseTheme {
    colors: Colors;
    spacing: (factor: number) => string;
    spacingFactor: SpacingFactor;
    breakpoints: Breakpoints;
    radius: Radius;
    zIndex: ZIndex;
    transitions: Transitions;
    animations: Animations;
    keyframes: Keyframes;
    shadows: Shadows;
    typography: Typography;
}

declare module 'react-jss' { interface Theme extends BaseTheme { } }