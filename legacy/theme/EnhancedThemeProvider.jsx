/**
 * Enhanced Theme Provider
 * 
 * Advanced React theme provider with enhanced features including
 * theme switching, persistence, and dynamic updates.
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Create theme context
const ThemeContext = createContext();

/**
 * Default theme configuration
 */
const defaultTheme = {
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40'
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
        fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
            lg: '18px',
            xl: '20px'
        }
    }
};

/**
 * Enhanced Theme Provider Component
 */
export const EnhancedThemeProvider = ({ 
    children, 
    theme = defaultTheme, 
    persistTheme = true,
    storageKey = 'app-theme'
}) => {
    const [currentTheme, setCurrentTheme] = useState(theme);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load theme from storage on mount
    useEffect(() => {
        if (persistTheme && typeof window !== 'undefined') {
            try {
                const savedTheme = localStorage.getItem(storageKey);
                const savedDarkMode = localStorage.getItem(`${storageKey}-dark-mode`);
                
                if (savedTheme) {
                    setCurrentTheme(JSON.parse(savedTheme));
                }
                if (savedDarkMode) {
                    setIsDarkMode(JSON.parse(savedDarkMode));
                }
            } catch (error) {
                console.warn('Failed to load theme from storage:', error);
            }
        }
    }, [persistTheme, storageKey]);

    // Save theme to storage whenever it changes
    useEffect(() => {
        if (persistTheme && typeof window !== 'undefined') {
            try {
                localStorage.setItem(storageKey, JSON.stringify(currentTheme));
                localStorage.setItem(`${storageKey}-dark-mode`, JSON.stringify(isDarkMode));
            } catch (error) {
                console.warn('Failed to save theme to storage:', error);
            }
        }
    }, [currentTheme, isDarkMode, persistTheme, storageKey]);

    // Memoize theme value to prevent unnecessary re-renders
    const themeValue = useMemo(() => ({
        theme: currentTheme,
        isDarkMode,
        setTheme: setCurrentTheme,
        toggleDarkMode: () => setIsDarkMode(prev => !prev),
        setDarkMode: setIsDarkMode,
        updateTheme: (updates) => {
            setCurrentTheme(prev => ({
                ...prev,
                ...updates
            }));
        },
        resetTheme: () => {
            setCurrentTheme(defaultTheme);
            setIsDarkMode(false);
        }
    }), [currentTheme, isDarkMode]);

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
        throw new Error('useTheme must be used within an EnhancedThemeProvider');
    }
    
    return context;
};

/**
 * Hook to get theme utilities
 */
export const useThemeUtils = () => {
    const { theme, isDarkMode } = useTheme();
    
    return {
        getColor: (colorName) => theme.colors[colorName] || colorName,
        getSpacing: (sizeName) => theme.spacing[sizeName] || sizeName,
        getFontSize: (sizeName) => theme.typography.fontSize[sizeName] || sizeName,
        isDark: isDarkMode
    };
};

export default EnhancedThemeProvider;
