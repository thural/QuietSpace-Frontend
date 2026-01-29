/**
 * Shared Theme interface for react-jss styling
 * This interface defines the structure of the theme object used throughout the application
 */

export interface Theme {
    spacing: (factor: number) => string;
    spacingFactor: {
        xs: number;
        sm: number;
        ms: number;
        md: number;
        lg: number;
        xl: number;
    };
    breakpoints: {
        xs: string;
        sm: string;
        ms: string;
        md: string;
        lg: string;
        xl: string;
    };
    radius: {
        xs: string;
        sm: string;
        ms: string;
        md: string;
        lg: string;
        xl: string;
        square: string;
        round: string;
    };
    zIndex: {
        modal: number;
        tooltip: number;
    };
    transitions: {
        default: string;
        fast: string;
    };
    animations: {
        fadeIn: string;
        slideUp: string;
    };
    keyframes: {
        fadeIn: {
            from: { opacity: number };
            to: { opacity: number };
        };
        slideUp: {
            from: { transform: string };
            to: { transform: string };
        };
    };
    shadows: {
        light: string;
        medium: string;
        dark: string;
        inset: string;
        paper: string;
        extra: string;
        wide: string;
    };
    typography: {
        lineHeight: string;
        fontWeightThin: number;
        fontWeightBold: number;
        fontWeightRegular: number;
        fontFamily: string;
        h1: { fontSize: string; fontWeight: number };
        h2: { fontSize: string; fontWeight: number };
        body1: { fontSize: string; fontWeight: number };
        body2: { fontSize: string; fontWeight: number };
        fontSize: {
            primary: string;
            secondary: string;
            small: string;
            large: string;
            xLarge: string;
        };
    };
    colors: {
        background: string;
        backgroundSecondary: string;
        backgroundTransparent: string;
        backgroundTransparentMax: string;
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
        borderExtra: string;
        danger: string;
        warning: string;
        info: string;
        success: string;
        hrDivider: string;
        buttonBorder: string;
        gradient: string;
    };
}
