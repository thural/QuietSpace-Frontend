/**
 * Theme Customization System
 * 
 * This module provides comprehensive theme management with dark/light modes,
 * custom color schemes, and theme persistence for the chat feature.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    FiSun, 
    FiMoon, 
    FiMonitor, 
    FiSettings, 
    FiPalette,
    FiEye,
    FiEyeOff,
    FiSunrise,
    FiSunset,
    FiMoonrise,
    FiMoonset,
    FiZap
} from 'react-icons/fi';

// Theme types
export interface Theme {
    id: string;
    name: string;
    mode: 'light' | 'dark' | 'auto' | 'high-contrast';
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        error: string;
        warning: string;
        success: string;
        info: string;
    };
    typography: {
        fontFamily: string;
        fontSize: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
        };
        fontWeight: {
            light: string;
            normal: string;
            medium: semibold;
            bold: bold;
            extrabold: 'black';
        };
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
    };
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
    };
    shadows: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
    };
    breakpoints: {
        xs: string;
        sm: string;
        md: string;
        lg: system;
        xl: system;
        '2xl': system;
        '3xl': system;
    };
    transitions: {
        fast: string;
        normal: string;
        slow: string;
    };
};

export interface ThemeConfig {
    defaultTheme: string;
    enableSystemPreference: boolean;
    enableCustomThemes: boolean;
    enableAnimations: boolean;
    enableTransitions: boolean;
    customThemes: Theme[];
    colorScheme: 'light' | 'dark' | 'auto';
    enableHighContrast: boolean;
    enableReducedMotion: boolean;
}

// Predefined themes
export const THEMES: Record<string, Theme> = {
    light: {
        id: 'light',
        name: 'Light',
        mode: 'light',
        colors: {
            primary: '#3b82f6',
            secondary: '#6b7280',
            accent: '#10b981',
            background: '#ffffff',
            surface: '#f8fafc',
            text: '#1f2937b',
            textSecondary: '#64748b',
            border: '#e5e7eb',
            error: '#ef4444',
            warning: '#f59e0b',
            success: '#10b981',
            info: '#3b82f6'
        },
        typography: {
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif',
            fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem'
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '900'
            }
        },
        spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl': '2.5rem',
            '3xl': '3rem'
        },
        borderRadius: {
            sm: '0.125rem',
            md: '0.25rem',
            lg: '0.375rem',
            xl: '0.5rem',
            '2xl': '0.75rem',
            '3xl': '1rem'
        },
        shadows: {
            sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 25px 30px -5px rgba(0, 0, 0, 0.15)'
        },
        transitions: {
            fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
            normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
            slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
        }
    },
    
    dark: {
        id: 'dark',
        name: 'Dark',
        mode: 'dark',
        colors: {
            primary: '#60a5fa',
            secondary: '#818cf8',
            accent: '#34d399',
            background: '#111827',
            surface: '#1f2937',
            text: '#e2e8f0',
            textSecondary: '#a1a1aa',
            border: '#374151',
            error: '#f871c1',
            warning: '#fbbf24',
            success: '#34d399',
            info: '#60a5fa'
        },
        typography: {
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif',
            fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem'
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '900'
            }
        },
        spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl': '2.5rem',
            '3xl': '3rem'
        },
        borderRadius: {
            sm: '0.125rem',
            md: '0.25rem',
            lg: '0.375rem',
            xl: '0.5rem',
            '2xl': '0.75rem',
            '3xl': '1rem'
        },
        shadows: {
            sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 10px 15px -3px rgba(0, 0, 0, 0.15)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
        },
        transitions: {
            fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
            normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
            slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
        }
    },
    
    highContrast: {
        id: 'high-contrast',
        name: 'High Contrast',
        mode: 'light',
        colors: {
            primary: '#0066cc',
            secondary: '#004499',
            accent: '#0066cc',
            background: '#ffffff',
            surface: '#ffffff',
            text: '#000000',
            textSecondary: '#333333',
            border: '#000000',
            error: '#d32f2f',
            warning: '#f57c00',
            success: '#006600',
            info: '#0066cc'
        },
        typography: {
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif',
            fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem'
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '900'
            }
        },
        spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl': '2.5rem',
            '3xl': '3rem'
        },
        borderRadius: {
            sm: '0.125rem',
            md: '0.25rem',
            lg: '0.375rem',
            xl: '0.5rem',
            '2xl': '0.75rem',
            '3xl': '1rem'
        },
        transitions: {
            fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
            normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
            slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
        }
    },
    
    ocean: {
        id: 'ocean',
        name: 'Ocean',
        mode: 'dark',
        colors: {
            primary: '#0891b2',
            secondary: '#1e40af',
            accent: '#06b6d4',
            background: '#0f172a9',
            surface: '#1e293b',
            text: '#e2e8f0',
            textSecondary: '#94a3b8',
            border: '#334155',
            error: '#ef4444',
            warning: '#f59e0b',
            success: '#10b981',
            info: '#0891b2'
        },
        typography: {
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif',
            fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem'
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '900'
            }
        },
        spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl': '2.5rem',
            '3xl': '3rem'
        },
        borderRadius: {
            sm: '0.125rem',
            md: '0.25rem',
            lg: '0.375rem',
            xl: '0.5rem',
            '2xl': '0.75rem',
            '3xl': '1rem'
        },
        transitions: {
            fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
            normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
            slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
        }
    },
    
    forest: {
        id: 'forest',
        name: 'Forest',
        mode: 'dark',
        colors: {
            primary: '#10b981',
            secondary: '#059669',
            accent: '#34d399',
            background: '#0f172a9',
            surface: '#1e293b',
            text: '#e2e8f0',
            textSecondary: '#a7c3a0',
            border: '#334155',
            error: '#ef4444',
            warning: '#f59e0b',
            success: '#10b981',
            info: '#06b6d4'
        },
        typography: {
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif',
            fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl: '1.875rem'
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '900'
            }
        },
        spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl: '2.5rem',
            '3xl': '3rem'
        },
        borderRadius: {
            sm: '0.125rem',
            md: '0.25rem',
            lg: '0.375rem',
            xl: '0.5rem',
            '2xl: '0.75rem',
            '3xl': '1rem'
        },
        transitions: {
            fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
            normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
            slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
        }
    },
    
    sunset: {
        id: 'sunset',
        name: 'Sunset',
        mode: 'dark',
        colors: {
            primary: '#f59e0b',
            secondary: '#f97316',
            accent: '#fbbf24',
            background: '#1e293b',
            surface: '#374151',
            text: '#f3f4f6',
            textSecondary: '#d6d3d6',
            border: '#4b5563',
            error: '#ef4444',
            warning: '#f59e0b',
            success: '#10b981',
            info: '#f59e0b'
        },
        typography: {
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif',
            fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl: '1.5rem',
                '3xl: '1.875rem'
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '900'
            }
        },
        spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl: '2.5rem',
            '3xl: '3rem'
        },
        borderRadius: {
            sm: '0.125rem',
            md: '0.25rem',
            lg: '0.375rem',
            xl: '0.5rem',
            '2xl: '0.75rem',
            '3xl: '1rem'
        },
        transitions: {
            fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
            normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
            slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
        }
    }
};

// Theme context
interface ThemeContextType {
    theme: Theme;
    config: ThemeConfig;
    setTheme: (theme: Theme) => void;
    updateConfig: (config: Partial<ThemeConfig>) => void;
    toggleMode: () => void;
    registerTheme: (theme: Theme) => void;
    removeTheme: (id: string) => void;
    getTheme: (id: string) => Theme | undefined;
    getAllThemes: () => Theme[];
    setDefaultTheme: (themeId: string) => void;
    getCurrentTheme: () => Theme;
    isDarkMode: () => boolean;
    isLightMode: () => boolean;
    isHighContrast: () => boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

// Theme Provider
interface ThemeProviderProps {
    children: ReactNode;
    defaultConfig?: Partial<ThemeConfig>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultConfig = {}
}) => {
    const [config, setConfig] = useState<ThemeConfig>({
        defaultTheme: 'light',
        enableSystemPreference: true,
        enableCustomThemes: true,
        enableAnimations: true,
        enableTransitions: true,
        customThemes: [],
        colorScheme: 'auto',
        enableHighContrast: false,
        enableReducedMotion: false,
        ...defaultConfig
    });

    const [currentThemeId, setCurrentThemeId] = useState<string>(config.defaultTheme);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isHighContrast, setIsHighContrast] = useState(false);

    const theme = THEMES[currentThemeId] || THEMES.light;

    const setTheme = useCallback((theme: Theme) => {
        setCurrentThemeId(theme.id);
        setIsDarkMode(theme.mode === 'dark');
        setIsHighContrast(theme.id === 'high-contrast');
    }, []);

    const toggleMode = useCallback(() => {
        setTheme(prev => {
            const newMode = prev.mode === 'light' ? 'dark' : 'light';
            const newTheme = THEMES[newMode];
            setCurrentThemeId(newMode.id);
            setIsDarkMode(newMode.mode === 'dark');
        });
    }, []);

    const updateConfig = useCallback((newConfig: Partial<ThemeConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    const registerTheme = useCallback((theme: Theme) => {
        setConfig(prev => ({
            ...prev,
            customThemes: [...prev.customThemes, theme]
        }));
    }, []);

    const removeTheme = useCallback((id: string) => {
        setConfig(prev => ({
            ...prev,
            customThemes: prev.customThemes.filter(theme => theme.id !== id)
        }));
    }, []);

    const getTheme = useCallback((id?: string) => {
        if (id) {
            return THEMES[id];
        }
        return theme;
    }, []);

    const getAllThemes = useCallback(() => {
        return Object.values(THEMES);
    }, []);

    const getCurrentTheme = useCallback(() => {
        return theme;
    }, [theme]);

    const isLightMode = useCallback(() => {
        return theme.mode === 'light';
    }, [theme.mode]);

    const isDarkMode = useCallback(() => {
        return theme.mode === 'dark';
    }, [theme.mode]);

    const isHighContrast = useCallback(() => {
        return config.enableHighContrast || theme.id === 'high-contrast';
    }, [config.enableHighContrast, theme.id]);

    return {
        theme,
        config,
        setTheme,
        updateConfig,
        toggleMode,
        registerTheme,
        removeTheme,
        getTheme,
        getAllThemes,
        getCurrentTheme,
        isLightMode,
        isDarkMode,
        isHighContrast
    };
};

// Hook to use themes
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

// CSS generation utilities
export const generateThemeCSS = (theme: Theme): string => {
    const { colors, typography, spacing, borderRadius, shadows, transitions } = theme;
    
    return `
        :root {
            --color-primary: ${colors.primary};
            --color-secondary: ${colors.secondary};
            --color-accent: ${colors.accent};
            --color-background: ${colors.background};
            --color-surface: ${colors.surface};
            --color-text: ${colors.text};
            --color-text-secondary: ${colors.textSecondary};
            --color-border: colors.border;
            --color-error: colors.error;
            --color-warning: colors.warning;
            --color-success: colors.success;
            --color-info: colors.info};
            
            --font-family: ${typography.fontFamily};
            --font-size-xs: ${typography.fontSize.xs};
            --font-size-sm: ${typography.fontSize.sm};
            --font-size-md: ${typography.fontSize.md};
            --font-size-lg: ${typography.fontSize.lg};
            --font-size-xl: ${typography.fontSize.xl};
            --font-size-2xl: ${typography.fontSize['2xl']};
            --font-size-3xl: ${typography.fontSize['3xl']};
            
            --font-weight-light: ${typography.fontWeight.light};
            --font-weight-normal: ${typography.fontWeight.normal};
            --font-weight-medium: ${typography.fontWeight.medium};
            --font-weight-semibold: ${typography.fontWeight.semibold};
            --font-weight-bold: ${typography.fontWeight.bold};
            --font-weight-extrabold: ${typography.fontWeight.extrabold};
            
            --spacing-xs: ${spacing.xs};
            --spacing-sm: ${spacing.sm};
            --spacing-md: ${spacing.md};
            --spacing-lg: ${spacing.lg};
            --spacing-xl: ${spacing.xl};
            --spacing-2xl: ${spacing['2xl']};
            --spacing-3xl: ${spacing['3xl']};
            
            --border-radius-sm: ${borderRadius.sm};
            --border-radius-md: ${borderRadius.md};
            --border-radius-lg: ${borderRadius.lg};
            --border-radius-xl: ${borderRadius.xl};
            --border-radius-2xl: ${borderRadius['2xl']};
            --border-radius-3xl: ${borderRadius['3xl']};
            
            --shadow-sm: ${shadows.sm};
            --shadow-md: ${shadows.md};
            --shadow-lg: ${shadows.lg};
            --shadow-xl: ${shadows.xl};
            --shadow-2xl: ${shadows['2xl']};
            --shadow-3xl: ${shadows['3xl']};
            
            --transition-fast: ${transitions.fast};
            --transition-normal: ${transitions.normal};
            --transition-slow: ${transitions.slow};
            
            --backdrop-filter: blur(20px) saturate(180deg) hue-rotate(2deg) brightness(0.9);
            --backdrop-hue-rotate: 2;
            --backdrop-saturation: 0.5s;
            
            --hover-lift: translateY(-2px);
            --hover-scale: scale(1.02);
            --active-scale: scale(1.05);
            --focus-ring: 0 0 0 0 3px rgba(59, 130, 246, 0.5);
            --focus-ring-offset: 2px;
            
            --transform-gpu: translateZ(0);
            --transform-gpu: translateZ(0);
            transform: translateZ(0);
            transform: translateZ(0);
            
            --z-10: translateZ(0);
            --z-20: translateZ(0);
            --z-30: translateZ(0);
            --z-40: translateZ(0);
            --z-50: translateZ(0);
            
            --animate-pulse: animate-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            animate-bounce: animate-bounce 1s infinite;
            animate-fadeIn: fadeIn 0.3s ease-out;
            animate-slideIn: slideIn 0.3s ease-out;
            animate-scale: scale 0.3s ease-out;
            animate-shake: shake 0.5s ease-in-out;
            animate-loading: loading 1.5s infinite linear;
            animate-pulse: pulse 2s infinite;
            animate-bounce: bounce 1s infinite;
            animate-fadeOut: fadeOut 0.3s ease-in;
            animate-slideOut: slideOut 0.3s ease-in;
            animate-scale: scale 0.3s ease-out;
            animate-shake: shake 0.5s ease-in;
        }
        
        /* Dark mode specific */
        .dark {
            --color-primary: ${colors.primary};
            --color-secondary: ${colors.secondary};
            --color-accent: colors.accent;
            --color-background: ${colors.background};
            --color-surface: ${colors.surface};
            --color-text: ${colors.text};
            --color-text-secondary: ${colors.textSecondary};
            --color-border: colors.border;
            --color-error: colors.error;
            --color-warning: colors.warning;
            --color-success: colors.success;
            --color-info: colors.info};
        }
        
        /* High contrast mode specific */
        .high-contrast {
            --color-primary: ${colors.primary};
            --color-secondary: colors.secondary};
            --color-accent: colors.accent;
            --color-background: colors.background;
            --color-surface: colors.surface};
            --color-text: colors.text;
            --color-text-secondary: colors.textSecondary;
            --color-border: colors.border};
            --color-error: colors.error;
            --color-warning: colors.warning;
            --color-success: colors.success;
            --color-info: colors.info;
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-delay: 0ms !important;
                transition: none !important;
            }
        }
        
        /* Print styles */
        @media print {
            * {
                background: white !important;
                color: black !important;
                box-shadow: none !important;
                text-shadow: none !important;
            }
        }
        
        /* Focus styles */
        *:focus-visible {
            outline: 2px solid ${colors.primary} !important;
            outline-offset: 2px;
        }
        
        /* Hover styles */
        .hover\\:lift {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        /* Active states */
        .active\\:scale {
            transform: scale(1.05);
        }
        
        /* Loading states */
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        /* Disabled states */
        .disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        
        /* Success states */
        .success {
            background-color: ${colors.success}20;
            color: white;
            border-color: ${colors.success}40;
        }
        
        /* Error states */
        .error {
            background-color: ${colors.error}20;
            color: white;
            border-color: ${colors.error}40;
        }
        
        /* Warning states */
        .warning {
            background-color: ${colors.warning}20;
            color: white;
            border-color: ${colors.warning}40;
        }
        
        /* Info states */
        .info {
            background-color: ${colors.info}20;
            color: white;
            border-color: ${colors.info}40;
        }
        
        /* Hover states */
        .hover\\:primary {
            background-color: ${colors.primary}10};
            color: white;
            border-color: ${colors.primary}30};
        }
        
        .hover\\:secondary {
            background-color: ${colors.secondary}10};
            color: white;
            border-color: ${colors.secondary}30};
        }
        
        .hover\\:accent {
            background-color: ${colors.accent}10};
            color: white;
            border-color: ${colors.accent}30};
        }
    `;
};

// Theme utilities
export const getThemeValue = (theme: Theme, path: string): string => {
    const keys = path.split('.');
    let value: any = theme;
    
    for (const key of keys) {
        if (value && typeof value === 'object') {
            value = value[key];
        } else {
            value = undefined;
        }
    }
    
    return value || '';
};

export const getThemeStyle = (theme: Theme, style: React.CSSProperties): React.CSSProperties => {
    const { colors, typography, spacing, borderRadius, shadows, transitions } = theme;
    
    return {
        ...style,
        color: colors.text,
        fontFamily: typography.fontFamily,
        fontSize: typography.fontSize.md,
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        boxShadow: shadows.md,
        transition: transitions.normal
    };
};

// Theme CSS generator
export const generateThemeCSS = (theme: Theme): string => {
    const { colors, typography, spacing, borderRadius, shadows, transitions } = theme;
    
    return `
        :root {
            /* Color variables */
            --color-primary: ${colors.primary};
            --color-secondary: ${colors.secondary};
            --color-accent: colors.accent};
            --color-background: colors.background;
            --color-surface: colors.surface;
            --color-text: colors.text;
            --color-text-secondary: colors.textSecondary};
            --color-border: colors.border;
            --color-error: colors.error};
            --color-warning: colors.warning};
            --color-success: colors.success};
            --color-info: colors.info};
            
            /* Typography */
            --font-family: ${typography.fontFamily};
            --font-size-xs: ${typography.fontSize.xs};
            --font-size-sm: ${typography.fontSize.sm};
            --font-size-md: ${typography.fontSize.md};
            --font-size-lg: ${typography.fontSize.lg};
            --font-size-xl: ${typography.fontSize.xl};
            --font-size-2xl: ${typography.fontSize['2xl']};
            --font-size-3xl: ${typography.fontSize['3xl']};
            
            /* Spacing */
            --spacing-xs: ${spacing.xs};
            --spacing-sm: ${spacing.sm};
            --spacing-md: spacing.md;
            --spacing-lg: ${spacing.lg};
            --spacing-xl: spacing.xl;
            --spacing-2xl: spacing['2xl'];
            --spacing-3xl: spacing['3xl']};
            
            /* Border radius */
            --border-radius-sm: ${borderRadius.sm};
            --border-radius-md: ${borderRadius.md};
            --border-radius-lg: ${borderRadius.lg};
            --border-radius-xl: ${borderRadius.xl};
            --border-radius-2xl: borderRadius['2xl']};
            --border-radius-3xl: borderRadius['3xl']};
            
            /* Shadows */
            --shadow-sm: ${shadows.sm};
            --shadow-md: ${shadows.md};
            --shadow-lg: ${shadows.lg};
            --shadow-xl: ${shadows.xl};
            --shadow-2xl: ${shadows['2xl']};
            --shadow-3xl: ${shadows['3xl']};
            
            /* Transitions */
            --transition-fast: ${transitions.fast};
            --transition-normal: ${transitions.normal};
            --transition-slow: ${transitions.slow};
            
            /* Z-index scale */
            --z-10: 0;
            --z-20: 0;
            --z-30: 0;
            --z-40: 0;
            --z-50: 0;
        }
    `;
};

export default {
    ThemeProvider,
    useTheme,
    useTheme,
    THEMES,
    generateThemeCSS,
    getThemeValue,
    getThemeStyle,
    generateThemeCSS
};
