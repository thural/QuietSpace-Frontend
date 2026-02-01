/**
 * Basic Theme Provider
 * 
 * Simple React theme provider component for theming support.
 * This was the older version that was replaced by EnhancedThemeProvider.tsx.
 * 
 * Original removal date: February 1, 2026
 * Reason: Replaced by enhanced TypeScript implementation
 */

import React, { createContext, useContext, useState } from 'react';

// Create theme context
const ThemeContext = createContext();

/**
 * Basic Theme Provider Component
 */
export const ThemeProvider = ({ children, theme = {} }) => {
    const [currentTheme, setCurrentTheme] = useState({
        colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            ...theme.colors
        },
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
            ...theme.spacing
        },
        ...theme
    });

    const themeValue = {
        theme: currentTheme,
        setTheme: setCurrentTheme,
        updateTheme: (updates) => {
            setCurrentTheme(prev => ({
                ...prev,
                ...updates
            }));
        }
    };

    return (
        <ThemeContext.Provider value={themeValue}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to use theme context
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    
    return context;
};

export default ThemeProvider;
