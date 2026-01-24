/**
 * Theme Enhancer
 * 
 * This component provides advanced theme customization options including
 * dynamic themes, color schemes, dark/light modes, and user preference management.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FiSun, FiMoon, FiSettings, FiPalette, FiDownload, FiUpload } from 'react-icons/fi';

export interface ThemeConfig {
    enableDarkMode: boolean;
    enableSystemPreference: boolean;
    enableCustomThemes: boolean;
    enableThemePersistence: boolean;
    defaultTheme: string;
    transitionDuration: number;
}

export interface Theme {
    id: string;
    name: string;
    displayName: string;
    type: 'light' | 'dark' | 'auto' | 'custom';
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        textInverse: string;
        border: string;
        error: string;
        warning: string;
        success: string;
        info: string;
    };
}

interface ThemeEnhancerContextType {
    config: ThemeConfig;
    currentTheme: Theme | null;
    availableThemes: Theme[];
    isDarkMode: boolean;
    systemPreference: 'light' | 'dark' | 'no-preference';
    
    setTheme: (themeId: string) => void;
    toggleDarkMode: () => void;
    toggleSystemPreference: () => void;
    exportTheme: (themeId: string) => string;
    importTheme: (themeData: string) => void;
    resetToDefault: () => void;
}

const ThemeEnhancerContext = createContext<ThemeEnhancerContextType | null>(null);

interface ThemeEnhancerProviderProps {
    children: React.ReactNode;
    config?: Partial<ThemeConfig>;
}

export const ThemeEnhancerProvider: React.FC<ThemeEnhancerProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config, setConfig] = useState<ThemeConfig>({
        enableDarkMode: false,
        enableSystemPreference: true,
        enableCustomThemes: true,
        enableThemePersistence: true,
        defaultTheme: 'default-light',
        transitionDuration: 300,
        ...userConfig
    });

    const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [systemPreference, setSystemPreference] = useState<'light' | 'dark' | 'no-preference'>('no-preference');

    const [availableThemes] = useState<Theme[]>([
        {
            id: 'default-light',
            name: 'default-light',
            displayName: 'Default Light',
            type: 'light',
            colors: {
                primary: '#3b82f6',
                secondary: '#64748b',
                accent: '#06b6d4',
                background: '#ffffff',
                surface: '#f8fafc',
                text: '#1e293b',
                textSecondary: '#64748b',
                textInverse: '#ffffff',
                border: '#e2e8f0',
                error: '#ef4444',
                warning: '#f59e0b',
                success: '#10b981',
                info: '#3b82f6'
            }
        },
        {
            id: 'default-dark',
            name: 'default-dark',
            displayName: 'Default Dark',
            type: 'dark',
            colors: {
                primary: '#60a5fa',
                secondary: '#94a3b8',
                accent: '#22d3ee',
                background: '#0f172a',
                surface: '#1e293b',
                text: '#f1f5f9',
                textSecondary: '#94a3b8',
                textInverse: '#0f172a',
                border: '#334155',
                error: '#f87171',
                warning: '#fbbf24',
                success: '#34d399',
                info: '#60a5fa'
            }
        },
        {
            id: 'ocean-blue',
            name: 'ocean-blue',
            displayName: 'Ocean Blue',
            type: 'light',
            colors: {
                primary: '#0ea5e9',
                secondary: '#0c4a6e',
                accent: '#06b6d4',
                background: '#f0f9ff',
                surface: '#e0f2fe',
                text: '#0c4a6e',
                textSecondary: '#0e7490',
                textInverse: '#ffffff',
                border: '#bae6fd',
                error: '#f87171',
                warning: '#fbbf24',
                success: '#10b981',
                info: '#0ea5e9'
            }
        }
    ]);

    // Apply theme to DOM
    const applyThemeToDOM = useCallback((theme: Theme) => {
        const root = document.documentElement;
        
        // Apply CSS custom properties
        root.style.setProperty('--color-primary', theme.colors.primary);
        root.style.setProperty('--color-secondary', theme.colors.secondary);
        root.style.setProperty('--color-accent', theme.colors.accent);
        root.style.setProperty('--color-background', theme.colors.background);
        root.style.setProperty('--color-surface', theme.colors.surface);
        root.style.setProperty('--color-text', theme.colors.text);
        root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
        root.style.setProperty('--color-text-inverse', theme.colors.textInverse);
        root.style.setProperty('--color-border', theme.colors.border);
        root.style.setProperty('--color-error', theme.colors.error);
        root.style.setProperty('--color-warning', theme.colors.warning);
        root.style.setProperty('--color-success', theme.colors.success);
        root.style.setProperty('--color-info', theme.colors.info);
        
        // Set theme class
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme.name}`);
        
        // Set dark mode class
        if (theme.type === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, []);

    // Set theme
    const setTheme = useCallback((themeId: string) => {
        const theme = availableThemes.find(t => t.id === themeId);
        if (!theme) return;
        
        setCurrentTheme(theme);
        applyThemeToDOM(theme);
        setIsDarkMode(theme.type === 'dark');
        
        // Save preference if enabled
        if (config.enableThemePersistence && typeof localStorage !== 'undefined') {
            localStorage.setItem('preferred-theme', themeId);
        }
    }, [availableThemes, applyThemeToDOM, config.enableThemePersistence]);

    // Toggle dark mode
    const toggleDarkMode = useCallback((): void => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        
        const targetTheme = newDarkMode ? 'default-dark' : 'default-light';
        setTheme(targetTheme);
        
        setConfig(prev => ({ ...prev, enableDarkMode: newDarkMode }));
    }, [isDarkMode, setTheme]);

    // Toggle system preference
    const toggleSystemPreference = useCallback((): void => {
        setConfig(prev => ({ ...prev, enableSystemPreference: !prev.enableSystemPreference }));
    }, []);

    // Export theme
    const exportTheme = useCallback((themeId: string): string => {
        const theme = availableThemes.find(t => t.id === themeId);
        if (!theme) {
            throw new Error(`Theme "${themeId}" not found`);
        }
        
        return JSON.stringify(theme, null, 2);
    }, [availableThemes]);

    // Import theme
    const importTheme = useCallback((themeData: string): void => {
        try {
            const theme = JSON.parse(themeData) as Theme;
            
            if (!theme.id || !theme.name || !theme.colors) {
                throw new Error('Invalid theme structure');
            }
            
            console.log('Imported theme:', theme);
            setTheme(theme.id);
        } catch (error) {
            console.error('Failed to import theme:', error);
            throw error;
        }
    }, [setTheme]);

    // Reset to default
    const resetToDefault = useCallback((): void => {
        setTheme(config.defaultTheme);
        
        document.documentElement.style.removeProperty('filter');
        
        setConfig({
            enableDarkMode: false,
            enableSystemPreference: true,
            enableCustomThemes: true,
            enableThemePersistence: true,
            defaultTheme: 'default-light',
            transitionDuration: 300
        });
    }, [config.defaultTheme, setTheme]);

    // Check system preference
    useEffect(() => {
        if (config.enableSystemPreference && window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleChange = (e: MediaQueryListEvent) => {
                const preference = e.matches ? 'dark' : 'light';
                setSystemPreference(preference);
                
                if (config.enableSystemPreference) {
                    const targetTheme = preference === 'dark' ? 'default-dark' : 'default-light';
                    setTheme(targetTheme);
                }
            };
            
            setSystemPreference(mediaQuery.matches ? 'dark' : 'light');
            mediaQuery.addEventListener('change', handleChange);
            
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [config.enableSystemPreference, setTheme]);

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = config.enableThemePersistence && typeof localStorage !== 'undefined' 
            ? localStorage.getItem('preferred-theme') 
            : null;
        
        if (savedTheme && availableThemes.find(t => t.id === savedTheme)) {
            setTheme(savedTheme);
        } else {
            setTheme(config.defaultTheme);
        }
    }, [loadThemePreference, availableThemes, config.defaultTheme, setTheme, config.enableThemePersistence]);

    const value: ThemeEnhancerContextType = {
        config,
        currentTheme: currentTheme || availableThemes[0],
        availableThemes,
        isDarkMode,
        systemPreference,
        setTheme,
        toggleDarkMode,
        toggleSystemPreference,
        exportTheme,
        importTheme,
        resetToDefault
    };

    return (
        <ThemeEnhancerContext.Provider value={value}>
            {children}
        </ThemeEnhancerContext.Provider>
    );
};

// Hook to use theme enhancer
export const useThemeEnhancer = () => {
    const context = useContext(ThemeEnhancerContext);
    if (!context) {
        throw new Error('useThemeEnhancer must be used within ThemeEnhancerProvider');
    }
    return context;
};

// Theme Dashboard Component
interface ThemeDashboardProps {
    className?: string;
}

export const ThemeDashboard: React.FC<ThemeDashboardProps> = ({ 
    className = '' 
}) => {
    const { 
        config, 
        currentTheme, 
        availableThemes, 
        isDarkMode, 
        systemPreference,
        setTheme, 
        toggleDarkMode, 
        toggleSystemPreference,
        exportTheme,
        resetToDefault
    } = useThemeEnhancer();

    return (
        <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            <div className=\"flex items-center justify-between mb-6\">
                <h2 className=\"text-2xl font-bold text-gray-900\">Theme Enhancer</h2>
                <div className=\"flex items-center space-x-2\">
                    {isDarkMode && <FiMoon className=\"text-purple-500\" />}
                    {!isDarkMode && <FiSun className=\"text-yellow-500\" />}
                    {systemPreference !== 'no-preference' && (
                        <div className=\"text-sm text-gray-600\">System: {systemPreference}</div>
                    )}
                </div>
            </div>

            {/* Theme Selection */}
            <div className=\"mb-6\">
                <h3 className=\"text-lg font-semibold mb-3\">Available Themes</h3>
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">
                    {availableThemes.map(theme => (
                        <div
                            key={theme.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                currentTheme?.id === theme.id 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setTheme(theme.id)}
                        >
                            <div className=\"flex items-center justify-between mb-2\">
                                <div className=\"font-medium\">{theme.displayName}</div>
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                                    theme.type === 'dark' ? 'from-gray-700 to-gray-900' : 'from-blue-400 to-blue-600'
                                }`} />
                            </div>
                            <div className=\"text-sm text-gray-600 mb-2\">{theme.type}</div>
                            <div className=\"flex space-x-2\">
                                <div 
                                    className=\"w-6 h-6 rounded\" 
                                    style={{ backgroundColor: theme.colors.primary }}
                                />
                                <div 
                                    className=\"w-6 h-6 rounded\" 
                                    style={{ backgroundColor: theme.colors.secondary }}
                                />
                                <div 
                                    className=\"w-6 h-6 rounded\" 
                                    style={{ backgroundColor: theme.colors.accent }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Theme Controls */}
            <div className=\"mb-6 p-4 bg-gray-50 rounded-lg\">
                <h3 className=\"text-lg font-semibold mb-3\">Theme Controls</h3>
                <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">
                    <button
                        onClick={toggleDarkMode}
                        className={`flex items-center space-x-2 px-3 py-2 rounded ${
                            isDarkMode ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                        {isDarkMode ? <FiMoon /> : <FiSun />}
                        <span>{isDarkMode ? 'Dark' : 'Light'}</span>
                    </button>
                    
                    <button
                        onClick={toggleSystemPreference}
                        className={`flex items-center space-x-2 px-3 py-2 rounded ${
                            config.enableSystemPreference ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        <FiSettings />
                        <span>System</span>
                    </button>
                    
                    <button
                        onClick={() => exportTheme(currentTheme?.id || '')}
                        className=\"flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200\"
                    >
                        <FiDownload />
                        <span>Export</span>
                    </button>
                    
                    <button
                        onClick={resetToDefault}
                        className=\"flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200\"
                    >
                        <FiPalette />
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            {/* Current Theme Info */}
            {currentTheme && (
                <div className=\"mb-6\">
                    <h3 className=\"text-lg font-semibold mb-3\">Current Theme</h3>
                    <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 text-sm\">
                        <div>
                            <div className=\"text-gray-600\">Name</div>
                            <div className=\"font-medium\">{currentTheme.displayName}</div>
                        </div>
                        <div>
                            <div className=\"text-gray-600\">Type</div>
                            <div className=\"font-medium capitalize\">{currentTheme.type}</div>
                        </div>
                        <div>
                            <div className=\"text-gray-600\">Primary</div>
                            <div className=\"flex items-center space-x-2\">
                                <div 
                                    className=\"w-4 h-4 rounded\" 
                                    style={{ backgroundColor: currentTheme.colors.primary }}
                                />
                                <span>{currentTheme.colors.primary}</span>
                            </div>
                        </div>
                        <div>
                            <div className=\"text-gray-600\">Background</div>
                            <div className=\"flex items-center space-x-2\">
                                <div 
                                    className=\"w-4 h-4 rounded border\" 
                                    style={{ backgroundColor: currentTheme.colors.background }}
                                />
                                <span>{currentTheme.colors.background}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeEnhancerProvider;
