import { Theme } from "react-jss";

const sharedTheme: Omit<Theme, 'colors'> = {
    spacing: (factor: number) => `${factor}rem`,
    spacingFactor: {
        xs: 0.25,
        sm: 0.5,
        ms: 0.75,
        md: 1,
        lg: 1.25,
        xl: 1.5,
    },
    breakpoints: {
        xs: '0px',
        sm: '600px',
        ms: '720px',
        md: '960px',
        lg: '1280px',
        xl: '1920px',
    },
    radius: {
        xs: '.25rem',
        sm: '.5rem',
        ms: '.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '2rem',
        square: '0',
        round: '50%'
    },
    zIndex: {
        modal: 1000,
        tooltip: 2000,
    },
    transitions: {
        default: 'all 0.3s ease',
        fast: 'all 0.15s ease',
    },
    animations: {
        fadeIn: 'fade-in 0.5s ease-in-out',
        slideUp: 'slide-up 0.3s ease',
    },
    keyframes: {
        fadeIn: {
            from: { opacity: 0 },
            to: { opacity: 1 },
        },
        slideUp: {
            from: { transform: 'translateY(100%)' },
            to: { transform: 'translateY(0)' },
        },
    },
    shadows: {
        light: '0 1px 3px rgba(0, 0, 0, 0.1)',
        medium: '0 3px 6px rgba(0, 0, 0, 0.15)',
        dark: '0 10px 20px rgba(0, 0, 0, 0.2)',
        inset: '0px 0px 0px 1px #dee2e6 inset',
        paper: '0 4px 8px -4px rgba(72, 72, 72, 0.3)',
        extra: 'rgb(0 0 0 / 16%) 0px 0px 24px -6px',
    },
    typography: {
        lineHeight: '1.5',
        fontWeightThin: 300,
        fontWeightBold: 700,
        fontWeightRegular: 400,
        fontFamily: '"Roboto", sans-serif',
        h1: { fontSize: '2rem', fontWeight: 700 },
        h2: { fontSize: '1.75rem', fontWeight: 700 },
        body1: { fontSize: '1rem', fontWeight: 400 },
        body2: { fontSize: '0.875rem', fontWeight: 400 },
        fontSize: {
            primary: '1rem',
            secondary: '1.25rem',
            small: '0.75rem',
            large: '1.5rem',
            xLarge: '1.75rem'
        },
    },
};

export const lightTheme: Theme = {
    ...sharedTheme,
    colors: {
        background: '#fafafa', // Light gray
        backgroundSecondary: "#E9EFEE", // #f0f2f5Light muted gray
        backgroundMax: 'white',
        text: '#333333', // Dark gray
        textSecondary: '#5a5a5a', // Medium gray
        textMax: "black",
        primary: '#3b82f6', // Blue
        secondary: '#10b981', // Green
        inputField: '#e2e8f0', // Light blue-gray
        checkBox: '#3b82f6', // Blue
        border: '#dcdcdc', // Gray
        borderSecondary: "#f1f1f1", // Light gray
        borderExtra: "#909090", // Medium gray
        danger: '#e57373', // Soft red
        warning: '#ffa726', // Soft orange
        info: '#64b5f6', // Soft blue
        success: '#81c784', // Soft green
        hrDivider: '#cccccc', // Soft silver
        buttonBorder: '#888888', // Slate gray
        gradient: 'linear-gradient(45deg, #3b82f6, #10b981)' // Muted gradient
    }
} as Theme;

export const darkTheme: Theme = {
    ...sharedTheme,
    colors: {
        background: '#343a40', // Dark gray
        backgroundSecondary: '#4b5563', // Darker gray
        backgroundMax: 'black',
        text: '#f8f9fa', // Almost white
        textSecondary: '#ced4da', // Light gray
        textMax: 'white',
        primary: '#6c757d', // Muted gray
        secondary: '#adb5bd', // Light gray
        inputField: '#495057', // Dark gray
        checkBox: '#6c757d', // Muted gray
        border: '#6c757d', // Gray
        borderSecondary: '#4a4b4b', // Dark gray
        borderExtra: "#404040", // Smoky gray
        danger: '#e57373', // Soft red
        warning: '#ffa726', // Soft orange
        info: '#64b5f6', // Soft blue
        success: '#81c784', // Soft green
        hrDivider: '#333333', // Midnight gray
        buttonBorder: "#111111", // Eclipse black
        gradient: 'linear-gradient(45deg, #495057, #adb5bd)' // Muted gradient
    }
} as Theme;
