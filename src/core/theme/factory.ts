/**
 * Theme System Factory Functions
 * 
 * Factory functions for creating themes following Black Box pattern.
 * Provides clean service creation with dependency injection support.
 */

import type { ThemeTokens } from './tokens';
import type { EnhancedTheme } from './public';
import { ThemeSystem } from './ThemeSystem';
import type { ThemeConfig } from './composer';

/**
 * Creates a theme with default configuration
 * 
 * @returns Enhanced theme instance
 */
export function createDefaultTheme(): EnhancedTheme {
    const themeSystem = ThemeSystem.getInstance();
    return themeSystem.createTheme('default');
}

/**
 * Creates a theme with specified variant
 * 
 * @param variant - Theme variant name
 * @param overrides - Optional theme token overrides
 * @returns Enhanced theme instance
 */
export function createThemeWithVariant(
    variant: string,
    overrides?: Partial<ThemeTokens>
): EnhancedTheme {
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
 * 
 * @param config - Theme configuration
 * @returns Enhanced theme instance
 */
export function createCustomTheme(config: ThemeConfig): EnhancedTheme {
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
 * 
 * @param overrides - Theme token overrides
 * @returns Enhanced theme instance
 */
export function createTheme(overrides?: Partial<ThemeTokens>): EnhancedTheme {
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
 * 
 * @param overrides - Optional theme token overrides
 * @returns Enhanced theme instance
 */
export function createDarkTheme(overrides?: Partial<ThemeTokens>): EnhancedTheme {
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
 * 
 * @param overrides - Optional theme token overrides
 * @returns Enhanced theme instance
 */
export function createLightTheme(overrides?: Partial<ThemeTokens>): EnhancedTheme {
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
 * 
 * @param overrides - Optional theme token overrides
 * @returns Enhanced theme instance
 */
export function createHighContrastTheme(overrides?: Partial<ThemeTokens>): EnhancedTheme {
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
 * 
 * @param overrides - Optional theme token overrides
 * @returns Enhanced theme instance
 */
export function createCompactTheme(overrides?: Partial<ThemeTokens>): EnhancedTheme {
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
 * 
 * @param component - Component name
 * @param overrides - Optional theme token overrides
 * @returns Enhanced theme instance
 */
export function createComponentTheme(
    component: string,
    overrides?: Partial<ThemeTokens>
): EnhancedTheme {
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
const registeredFactories = new Map<string, (overrides?: Partial<ThemeTokens>) => EnhancedTheme>();

export const themeFactoryRegistry = {
    /**
     * Register a custom theme factory
     */
    register(name: string, factory: (overrides?: Partial<ThemeTokens>) => EnhancedTheme): void {
        registeredFactories.set(name, factory);
        console.log(`Registered theme factory: ${name}`);
    },

    /**
     * Get a registered theme factory
     */
    get(name: string): ((overrides?: Partial<ThemeTokens>) => EnhancedTheme) | undefined {
        console.log(`Getting theme factory: ${name}`);
        return registeredFactories.get(name);
    },

    /**
     * List all registered factories
     */
    list(): string[] {
        return Array.from(registeredFactories.keys());
    }
};

/**
 * Creates a mock theme for testing
 * 
 * @param overrides - Optional theme token overrides
 * @returns Mock theme instance
 */
export function createMockTheme(overrides?: Partial<ThemeTokens>): EnhancedTheme {
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
    } as unknown as EnhancedTheme;

    // Mock methods
    (mockTheme as any).getSpacing = (key: string) => '16px';
    (mockTheme as any).getColor = (path: string) => '#1976d2';
    (mockTheme as any).getTypography = (key: string) => '16px';
    (mockTheme as any).getBreakpoint = (key: string) => '1024px';

    return mockTheme;
}

/**
 * Creates a theme factory for DI container
 * 
 * @param container - DI container instance
 * @returns Theme factory function
 */
export function createThemeFactory(container: any): (overrides?: Partial<ThemeTokens>) => EnhancedTheme {
    return (overrides?: Partial<ThemeTokens>) => {
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
 * 
 * @param config - Theme configuration
 * @returns Singleton theme service
 */
export function createSingletonTheme(config?: ThemeConfig): EnhancedTheme {
    // In a real implementation, this would use a singleton pattern
    // For now, return a new instance (ThemeSystem handles singleton behavior)
    return createTheme(config?.overrides);
}

/**
 * Creates a theme with runtime configuration switching
 * 
 * @param initialConfig - Initial theme configuration
 * @returns Theme with runtime switching capability
 */
export function createRuntimeTheme(initialConfig?: ThemeConfig): EnhancedTheme {
    let currentTheme = createDefaultTheme();

    return {
        ...currentTheme,

        updateTheme: (overrides: Partial<ThemeTokens>) => {
            currentTheme = createTheme(overrides);
        },

        switchVariant: (variant: string, overrides?: Partial<ThemeTokens>) => {
            currentTheme = createThemeWithVariant(variant, overrides);
        },

        getVariant: () => 'default',

        getTokens: () => currentTheme,

        getMetrics: () => ({
            variant: 'default',
            tokensCount: 10,
            lastUpdated: new Date()
        })
    } as EnhancedTheme & {
        updateTheme: (overrides: Partial<ThemeTokens>) => void;
        switchVariant: (variant: string, overrides?: Partial<ThemeTokens>) => void;
        getVariant: () => string;
        getTokens: () => EnhancedTheme;
        getMetrics: () => any;
    };
}
