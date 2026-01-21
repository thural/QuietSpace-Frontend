interface Theme {
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
    colors?: {
        background?: string;
        backgroundSecondary?: string;
        backgroundTransparent?: string;
        backgroundTransparentMax?: string;
        backgroundMax?: string;
        text?: string;
        textSecondary?: string;
        textMax?: string;
        primary?: string;
        secondary?: string;
        inputField?: string;
        checkBox?: string;
        border?: string;
        borderSecondary?: string;
        borderExtra?: string;
        danger?: string;
        warning?: string;
        info?: string;
        success?: string;
        hrDivider?: string;
        buttonBorder?: string;
        gradient?: string;
    };
}

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
        wide: 'rgb(0 0 0 / 16%) 0px 0px 32px -4px',
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
        backgroundSecondary: "#e9ecef", // #f0f2f5Light muted gray
        backgroundTransparent: 'rgba(255, 255, 255, 0.85)',
        backgroundTransparentMax: 'rgba(255, 255, 255, 0)',
        backgroundMax: 'white',
        text: '#333333', // Dark gray
        textSecondary: '#5a5a5a', // Medium gray
        textMax: "black",
        primary: '#ff6f61', // Warmer blue (Coral)
        secondary: '#ffb74d', // Warmer green (Peach)
        inputField: '#ffe0b2', // Warmer light blue-gray (Peach)
        checkBox: '#ff6f61', // Warmer blue (Coral)
        border: '#dcdcdc', // Gray
        borderSecondary: "#f1f1f1", // Light gray
        borderExtra: "#bbbbbb", // Medium gray
        danger: '#e57373', // Soft red
        warning: '#ffb74d', // Warmer orange (Peach)
        info: '#ff8a65', // Warmer blue (Coral)
        success: '#ffb74d', // Warmer green (Peach)
        hrDivider: '#cccccc', // Soft silver
        buttonBorder: '#888888', // Slate gray
        gradient: 'linear-gradient(45deg, #ff6f61, #ffb74d)' // Warmer gradient
    }
} as Theme;

export const darkTheme: Theme = {
    ...sharedTheme,
    colors: {
        background: '#1a1a1a', // Dark background
        backgroundSecondary: '#1f1f1f', // Slightly lighter dark background
        backgroundTransparent: 'rgba(18, 18, 18, 0.85)',
        backgroundTransparentMax: 'rgba(18, 18, 18, 0)',
        backgroundMax: '#0d0d0d', // Darkest background
        text: '#f5f5f5', // Light text
        textSecondary: '#bbbbbb', // Lighter gray text
        textMax: "#ffffff", // White text
        primary: '#bb86fc', // Purple
        secondary: '#03dac6', // Teal
        inputField: '#333333', // Dark input field
        checkBox: '#bb86fc', // Purple
        border: '#444444', // Dark gray border
        borderSecondary: "#666666", // Lighter dark gray border
        borderExtra: "#888888", // Medium gray border
        danger: '#cf6679', // Soft red
        warning: '#ffb74d', // Orange
        info: '#2196f3', // Blue
        success: '#4caf50', // Green
        hrDivider: '#4d4d4d', // Dark gray divider
        buttonBorder: '#666666', // Dark slate gray
        gradient: 'linear-gradient(45deg, #bb86fc, #03dac6)' // Purple to teal gradient
    }
} as Theme;
