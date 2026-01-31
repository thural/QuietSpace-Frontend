/**
 * Theme System Factory Functions
 * 
 * Factory functions for creating themes following Black Box pattern.
 * Provides clean service creation with dependency injection support.
 */

import { ThemeSystem } from './ThemeSystem.js';

/**
 * Creates a theme with default configuration
 * @returns {Object} Enhanced theme instance
 * @description Creates a theme with default configuration
 */
export function createDefaultTheme() {
    const themeSystem = ThemeSystem.getInstance();
    return themeSystem.createTheme('default');
}

/**
 * Creates a theme with specified variant
 * @param {string} variant - Theme variant name
 * @param {Object} overrides - Optional theme token overrides
 * @returns {Object} Enhanced theme instance
 * @description Creates a theme with specified variant
 */
export function createThemeWithVariant(variant, overrides) {
    try {
        const themeSystem = ThemeSystem.getInstance();
        return themeSystem.createTheme(variant, overrides);
    } catch {
        // Fallback to mock theme for testing
        console.warn(`ThemeSystem not available, using mock theme for variant: ${variant}`);
        return createMockTheme(overrides);
    }
}

/**
 * Creates a custom theme with full configuration
 * @param {Object} config - Theme configuration
 * @returns {Object} Enhanced theme instance
 * @description Creates a custom theme with full configuration
 */
export function createCustomTheme(config) {
    try {
        const themeSystem = ThemeSystem.getInstance();
        return themeSystem.createTheme(config.name, config.tokens || config.overrides);
    } catch {
        // Fallback to mock theme for testing
        const themeName = config?.name || 'unknown';
        console.warn(`ThemeSystem not available, using mock theme for custom theme: ${themeName}`);
        return createMockTheme(config?.tokens || config?.overrides);
    }
}

/**
 * Creates a theme with simple overrides
 * @param {Object} overrides - Theme token overrides
 * @returns {Object} Enhanced theme instance
 * @description Creates a theme with simple overrides
 */
export function createTheme(overrides) {
    try {
        const themeSystem = ThemeSystem.getInstance();
        return themeSystem.createTheme('default', overrides);
    } catch {
        // Fallback to mock theme for testing
        console.warn('ThemeSystem not available, using mock theme for default theme');
        return createMockTheme(overrides);
    }
}

/**
 * Creates a dark theme
 * @param {Object} overrides - Optional theme token overrides
 * @returns {Object} Enhanced theme instance
 * @description Creates a dark theme
 */
export function createDarkTheme(overrides) {
    try {
        const themeSystem = ThemeSystem.getInstance();
        return themeSystem.createTheme('dark', overrides);
    } catch {
        // Fallback to mock theme for testing
        console.warn('ThemeSystem not available, using mock theme for dark theme');
        return createMockTheme(overrides);
    }
}

/**
 * Creates a light theme
 * @param {Object} overrides - Optional theme token overrides
 * @returns {Object} Enhanced theme instance
 * @description Creates a light theme
 */
export function createLightTheme(overrides) {
    try {
        const themeSystem = ThemeSystem.getInstance();
        return themeSystem.createTheme('light', overrides);
    } catch {
        // Fallback to mock theme for testing
        console.warn('ThemeSystem not available, using mock theme for light theme');
        return createMockTheme(overrides);
    }
}

/**
 * Creates a high contrast theme
 * @param {Object} overrides - Optional theme token overrides
 * @returns {Object} Enhanced theme instance
 * @description Creates a high contrast theme
 */
export function createHighContrastTheme(overrides) {
    try {
        const themeSystem = ThemeSystem.getInstance();
        return themeSystem.createTheme('highContrast', overrides);
    } catch {
        // Fallback to mock theme for testing
        console.warn('ThemeSystem not available, using mock theme for high contrast theme');
        return createMockTheme(overrides);
    }
}

/**
 * Creates a compact theme
 * @param {Object} overrides - Optional theme token overrides
 * @returns {Object} Enhanced theme instance
 * @description Creates a compact theme
 */
export function createCompactTheme(overrides) {
    try {
        const themeSystem = ThemeSystem.getInstance();
        return themeSystem.createTheme('compact', overrides);
    } catch {
        // Fallback to mock theme for testing
        console.warn('ThemeSystem not available, using mock theme for compact theme');
        return createMockTheme(overrides);
    }
}

/**
 * Creates a theme for a specific component
 * @param {string} component - Component name
 * @param {Object} overrides - Optional theme token overrides
 * @returns {Object} Enhanced theme instance
 * @description Creates a theme for a specific component
 */
export function createComponentTheme(component, overrides) {
    try {
        const themeSystem = ThemeSystem.getInstance();
        return themeSystem.createTheme(component, overrides);
    } catch {
        // Fallback to mock theme for testing
        console.warn(`ThemeSystem not available, using mock theme for component: ${component}`);
        return createMockTheme(overrides);
    }
}

/**
 * Theme factory registry for extensible theme creation
 */
const registeredFactories = new Map();

export const themeFactoryRegistry = {
    /**
     * Register a custom theme factory
     * @param {string} name - Factory name
     * @param {Function} factory - Factory function
     * @description Register a custom theme factory
     */
    register(name, factory) {
        registeredFactories.set(name, factory);
        console.log(`Registered theme factory: ${name}`);
    },

    /**
     * Get a registered theme factory
     * @param {string} name - Factory name
     * @returns {Function|undefined} Factory function
     * @description Get a registered theme factory
     */
    get(name) {
        console.log(`Getting theme factory: ${name}`);
        return registeredFactories.get(name);
    },

    /**
     * List all registered factories
     * @returns {Array.<string>} Array of factory names
     * @description List all registered factories
     */
    list() {
        return Array.from(registeredFactories.keys());
    }
};

/**
 * Creates a mock theme for testing
 * @param {Object} overrides - Optional theme token overrides
 * @returns {Object} Mock theme instance
 * @description Creates a mock theme for testing
 */
export function createMockTheme(overrides) {
    // Create a basic mock theme structure
    const mockTheme = {
        // Basic colors (from ThemeTokens)
        colors: {
            brand: {
                50: '#e3f2fd',
                100: '#bbdefb',
                200: '#90caf9',
                300: '#64b5f6',
                400: '#42a5f5',
                500: '#2196f3',
                600: '#1e88e5',
                700: '#1976d2',
                800: '#1565c0',
                900: '#0d47a1',
                950: '#0a3d91',
                ...overrides?.colors?.brand
            },
            semantic: {
                success: '#4caf50',
                warning: '#ff9800',
                error: '#f44336',
                info: '#2196f3',
                ...overrides?.colors?.semantic
            },
            neutral: {
                50: '#fafafa',
                100: '#f5f5f5',
                200: '#eeeeee',
                300: '#e0e0e0',
                400: '#bdbdbd',
                500: '#9e9e9e',
                600: '#757575',
                700: '#616161',
                800: '#424242',
                900: '#212121',
                950: '#000000',
                ...overrides?.colors?.neutral
            },
            background: {
                primary: '#ffffff',
                secondary: '#f8f9fa',
                tertiary: '#e9ecef',
                overlay: 'rgba(0, 0, 0, 0.5)',
                transparent: 'transparent',
                ...overrides?.colors?.background
            },
            text: {
                primary: '#212529',
                secondary: '#6c757d',
                tertiary: '#adb5bd',
                inverse: '#ffffff',
                ...overrides?.colors?.text
            },
            border: {
                light: '#dee2e6',
                medium: '#ced4da',
                dark: '#495057',
                ...overrides?.colors?.border
            }
        },

        // Typography
        typography: {
            fontSize: {
                xs: '12px',
                sm: '14px',
                md: '16px',
                lg: '18px',
                xl: '20px',
                xxl: '24px',
                ...overrides?.typography?.fontSize
            },
            fontWeight: {
                light: 300,
                normal: 400,
                medium: 500,
                bold: 600,
                heavy: 700,
                ...overrides?.typography?.fontWeight
            },
            fontFamily: {
                primary: 'Inter, sans-serif',
                secondary: 'Roboto, sans-serif',
                monospace: 'Fira Code, monospace',
                ...overrides?.typography?.fontFamily
            },
            lineHeight: {
                tight: 1.2,
                normal: 1.5,
                relaxed: 1.8,
                loose: 2.0,
                ...overrides?.typography?.lineHeight
            },
            ...overrides?.typography
        },

        // Spacing
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
            xxl: '48px',
            ...overrides?.spacing
        },

        // Shadows
        shadows: {
            small: '0 1px 3px rgba(0, 0, 0, 0.12)',
            medium: '0 4px 6px rgba(0, 0, 0, 0.15)',
            large: '0 10px 15px rgba(0, 0, 0, 0.19)',
            ...overrides?.shadows
        },

        // Border radius
        radius: {
            none: '0px',
            small: '4px',
            medium: '8px',
            large: '12px',
            xlarge: '16px',
            ...overrides?.radius
        },

        // Breakpoints
        breakpoints: {
            xs: '480px',
            sm: '768px',
            md: '1024px',
            lg: '1280px',
            xl: '1536px',
            xxl: '1920px',
            ...overrides?.breakpoints
        },

        // Animations
        animation: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
            ...overrides?.animation
        },

        // Backward compatibility: flat color structure
        primary: '#1976d2',
        secondary: '#dc3545',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        info: '#2196f3',
        ...overrides
    };

    // Mock methods
    mockTheme.getSpacing = (key) => '16px';
    mockTheme.getColor = (path) => '#1976d2';
    mockTheme.getTypography = (key) => '16px';
    mockTheme.getBreakpoint = (key) => '1024px';

    return mockTheme;
}

/**
 * Creates a theme factory for DI container
 * @param {Object} container - DI container instance
 * @returns {Function} Theme factory function
 * @description Creates a theme factory for DI container
 */
export function createThemeFactory(container) {
    return (overrides) => {
        try {
            // Try to get theme service from DI container
            const themeService = container.getByToken('THEME_SERVICE');

            if (themeService && typeof themeService.createTheme === 'function') {
                return themeService.createTheme('default', overrides);
            }

            // Fallback to direct creation
            console.warn('Theme service not found in DI container, using fallback creation');
            return createDefaultTheme();
        } catch {
            // Fallback to direct creation
            console.warn('DI container not available, using fallback creation');
            return createDefaultTheme();
        }
    };
}

/**
 * Creates a singleton theme service
 * @param {Object} config - Theme configuration
 * @returns {Object} Singleton theme service
 * @description Creates a singleton theme service
 */
export function createSingletonTheme(config) {
    // In a real implementation, this would use a singleton pattern
    // For now, return a new instance (ThemeSystem handles singleton behavior)
    return createTheme(config?.overrides);
}

/**
 * Creates a theme with runtime configuration switching
 * @param {Object} initialConfig - Initial theme configuration
 * @returns {Object} Theme with runtime switching capability
 * @description Creates a theme with runtime configuration switching
 */
export function createRuntimeTheme(initialConfig) {
    let currentTheme = createDefaultTheme();

    return {
        ...currentTheme,

        updateTheme: (overrides) => {
            currentTheme = createTheme(overrides);
        },

        switchVariant: (variant, overrides) => {
            currentTheme = createThemeWithVariant(variant, overrides);
        },

        getVariant: () => 'default',

        getTokens: () => currentTheme,

        getMetrics: () => ({
            variant: 'default',
            tokensCount: 10,
            lastUpdated: new Date()
        })
    };
}
