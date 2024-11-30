import { useState } from 'react';

const lightTheme = {
    colors: {
        background: '#ffffff',
        text: '#000000',
        primary: '#3498db',
        secondary: '#2ecc71',
        border: '#dcdcdc',
        danger: '#e74c3c',
        warning: '#f39c12',
        info: '#8e44ad',
        success: '#27ae60',
        gradient: 'linear-gradient(45deg, #3498db, #2ecc71)',
    },
    typography: {
        fontFamily: '"Roboto", sans-serif',
        fontSize: '16px',
        fontWeightRegular: 400,
        fontWeightBold: 700,
        lineHeight: '1.5',
        h1: { fontSize: '2rem', fontWeight: 700 },
        h2: { fontSize: '1.75rem', fontWeight: 700 },
        body1: { fontSize: '1rem', fontWeight: 400 },
        body2: { fontSize: '0.875rem', fontWeight: 400 },
    },
    spacing: (factor: number) => `${factor}rem`,
    breakpoints: {
        xs: '0px',
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1920px',
    },
    shadows: {
        light: '0 1px 3px rgba(0, 0, 0, 0.1)',
        medium: '0 3px 6px rgba(0, 0, 0, 0.15)',
        dark: '0 10px 20px rgba(0, 0, 0, 0.2)',
    },
    borderRadius: '4px',
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
};

const darkTheme = {
    colors: {
        background: '#1e1e1e',
        text: '#ffffff',
        primary: '#9b59b6',
        secondary: '#e74c3c',
        border: '#444444',
        danger: '#e74c3c',
        warning: '#f39c12',
        info: '#8e44ad',
        success: '#27ae60',
        gradient: 'linear-gradient(45deg, #9b59b6, #e74c3c)',
    },
    typography: {
        fontFamily: '"Roboto", sans-serif',
        fontSize: '16px',
        fontWeightRegular: 400,
        fontWeightBold: 700,
        lineHeight: '1.5',
        h1: { fontSize: '2rem', fontWeight: 700 },
        h2: { fontSize: '1.75rem', fontWeight: 700 },
        body1: { fontSize: '1rem', fontWeight: 400 },
        body2: { fontSize: '0.875rem', fontWeight: 400 },
    },
    spacing: (factor: number) => `${factor}rem`,
    breakpoints: {
        xs: '0px',
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1920px',
    },
    shadows: {
        light: '0 1px 3px rgba(0, 0, 0, 0.1)',
        medium: '0 3px 6px rgba(0, 0, 0, 0.15)',
        dark: '0 10px 20px rgba(0, 0, 0, 0.2)',
    },
    borderRadius: '4px',
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
};

const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    const theme = isDarkMode ? darkTheme : lightTheme;
    return { theme, toggleTheme };
};

export default useTheme;
