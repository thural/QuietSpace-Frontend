/**
 * ThemeService Tests
 * 
 * Comprehensive tests for the ThemeService implementation
 * Tests theme management, persistence, and state transitions
 */

import { ThemeService, createThemeService } from '../../../../src/core/services/ThemeService';

// Mock localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
};

// Mock console.log
const mockConsoleLog = jest.fn();

// Store original localStorage and console
const originalLocalStorage = global.localStorage;
const originalConsoleLog = console.log;

describe('ThemeService', () => {
    let themeService: ThemeService;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            writable: true
        });

        // Mock console.log
        console.log = mockConsoleLog;

        themeService = new ThemeService();
    });

    afterEach(() => {
        // Restore original localStorage and console
        Object.defineProperty(window, 'localStorage', {
            value: originalLocalStorage,
            writable: true
        });
        console.log = originalConsoleLog;
    });

    describe('Basic Theme Operations', () => {
        it('should create theme service instance', () => {
            expect(themeService).toBeDefined();
            expect(typeof themeService.getCurrentTheme).toBe('function');
            expect(typeof themeService.setTheme).toBe('function');
            expect(typeof themeService.getThemeVariant).toBe('function');
            expect(typeof themeService.isDarkMode).toBe('function');
        });

        it('should implement ThemeService interface', () => {
            const service: ThemeService = themeService;

            expect(typeof service.getCurrentTheme).toBe('function');
            expect(typeof service.setTheme).toBe('function');
            expect(typeof service.getThemeVariant).toBe('function');
            expect(typeof service.isDarkMode).toBe('function');
        });

        it('should initialize with default theme', () => {
            expect(themeService.getCurrentTheme()).toBe('light');
            expect(themeService.getThemeVariant()).toBe('default');
            expect(themeService.isDarkMode()).toBe(false);
        });
    });

    describe('Theme Management', () => {
        it('should set and get theme', () => {
            themeService.setTheme('dark');

            expect(themeService.getCurrentTheme()).toBe('dark');
            expect(themeService.isDarkMode()).toBe(true);
            expect(mockConsoleLog).toHaveBeenCalledWith('Theme changed to: dark');
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'theme',
                JSON.stringify({ theme: 'dark', variant: 'default' })
            );
        });

        it('should set and get theme variant', () => {
            themeService.setThemeVariant('blue');

            expect(themeService.getThemeVariant()).toBe('blue');
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'theme',
                JSON.stringify({ theme: 'light', variant: 'blue' })
            );
        });

        it('should handle theme changes correctly', () => {
            themeService.setTheme('dark');
            themeService.setThemeVariant('purple');

            expect(themeService.getCurrentTheme()).toBe('dark');
            expect(themeService.getThemeVariant()).toBe('purple');
            expect(themeService.isDarkMode()).toBe(true);
        });

        it('should detect dark mode correctly', () => {
            themeService.setTheme('light');
            expect(themeService.isDarkMode()).toBe(false);

            themeService.setTheme('dark');
            expect(themeService.isDarkMode()).toBe(true);

            themeService.setTheme('custom');
            expect(themeService.isDarkMode()).toBe(false);
        });
    });

    describe('Storage Integration', () => {
        it('should load theme from localStorage on initialization', () => {
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
                theme: 'dark',
                variant: 'blue'
            }));

            const newThemeService = new ThemeService();

            expect(newThemeService.getCurrentTheme()).toBe('dark');
            expect(newThemeService.getThemeVariant()).toBe('blue');
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('theme');
        });

        it('should handle corrupted localStorage data gracefully', () => {
            mockLocalStorage.getItem.mockReturnValue('invalid-json');

            const newThemeService = new ThemeService();

            expect(newThemeService.getCurrentTheme()).toBe('light');
            expect(newThemeService.getThemeVariant()).toBe('default');
        });

        it('should handle empty localStorage', () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            const newThemeService = new ThemeService();

            expect(newThemeService.getCurrentTheme()).toBe('light');
            expect(newThemeService.getThemeVariant()).toBe('default');
        });

        it('should handle localStorage errors gracefully', () => {
            mockLocalStorage.getItem.mockImplementation(() => {
                throw new Error('Storage error');
            });

            expect(() => {
                new ThemeService();
            }).not.toThrow();
        });

        it('should save theme to localStorage', () => {
            themeService.setTheme('dark');
            themeService.setThemeVariant('green');

            expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
            expect(mockLocalStorage.setItem).toHaveBeenNthCalledWith(
                1,
                'theme',
                JSON.stringify({ theme: 'dark', variant: 'default' })
            );
            expect(mockLocalStorage.setItem).toHaveBeenNthCalledWith(
                2,
                'theme',
                JSON.stringify({ theme: 'dark', variant: 'green' })
            );
        });

        it('should handle localStorage save errors gracefully', () => {
            mockLocalStorage.setItem.mockImplementation(() => {
                throw new Error('Save error');
            });

            expect(() => {
                themeService.setTheme('dark');
            }).not.toThrow();
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty theme name', () => {
            themeService.setTheme('');

            expect(themeService.getCurrentTheme()).toBe('');
            expect(themeService.isDarkMode()).toBe(false);
        });

        it('should handle null theme name', () => {
            themeService.setTheme(null as any);

            expect(themeService.getCurrentTheme()).toBe(null);
            expect(themeService.isDarkMode()).toBe(false);
        });

        it('should handle undefined theme name', () => {
            themeService.setTheme(undefined as any);

            expect(themeService.getCurrentTheme()).toBe(undefined);
            expect(themeService.isDarkMode()).toBe(false);
        });

        it('should handle empty variant name', () => {
            themeService.setThemeVariant('');

            expect(themeService.getThemeVariant()).toBe('');
        });

        it('should handle rapid theme changes', () => {
            for (let i = 0; i < 100; i++) {
                themeService.setTheme(i % 2 === 0 ? 'light' : 'dark');
            }

            expect(themeService.getCurrentTheme()).toBe('dark');
            expect(themeService.isDarkMode()).toBe(true);
        });
    });

    describe('Performance', () => {
        it('should handle rapid theme operations without performance issues', () => {
            const startTime = performance.now();

            for (let i = 0; i < 1000; i++) {
                themeService.setTheme(`theme-${i % 10}`);
                themeService.setThemeVariant(`variant-${i % 5}`);
                themeService.getCurrentTheme();
                themeService.getThemeVariant();
                themeService.isDarkMode();
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete 1000 operations in under 100ms
            expect(duration).toBeLessThan(100);
        });

        it('should not block execution on storage operations', () => {
            mockLocalStorage.setItem.mockImplementation(() => {
                // Simulate slow storage
                const start = Date.now();
                while (Date.now() - start < 10) {
                    // Wait 10ms
                }
            });

            const startTime = performance.now();
            themeService.setTheme('dark');
            const endTime = performance.now();

            // Storage operations should be fast
            expect(endTime - startTime).toBeLessThan(50);
        });
    });

    describe('Singleton Behavior', () => {
        it('should maintain separate instances', () => {
            const theme1 = new ThemeService();
            const theme2 = new ThemeService();

            expect(theme1).not.toBe(theme2);
            expect(theme1.getCurrentTheme()).toBe(theme2.getCurrentTheme());
        });

        it('should not interfere with each other', () => {
            const theme1 = new ThemeService();
            const theme2 = new ThemeService();

            theme1.setTheme('dark');
            theme2.setTheme('blue');

            expect(theme1.getCurrentTheme()).toBe('dark');
            expect(theme2.getCurrentTheme()).toBe('blue');
        });
    });

    describe('Integration Tests', () => {
        it('should work with complete theme workflow', () => {
            // Start with default
            expect(themeService.getCurrentTheme()).toBe('light');

            // Change to dark mode
            themeService.setTheme('dark');
            expect(themeService.isDarkMode()).toBe(true);

            // Change variant
            themeService.setThemeVariant('purple');
            expect(themeService.getThemeVariant()).toBe('purple');

            // Change back to light
            themeService.setTheme('light');
            expect(themeService.isDarkMode()).toBe(false);
            expect(themeService.getThemeVariant()).toBe('purple'); // Variant should persist
        });

        it('should handle complex theme names', () => {
            const complexTheme = 'custom-dark-pro-2024';
            const complexVariant = 'gradient-blue-v2';

            themeService.setTheme(complexTheme);
            themeService.setThemeVariant(complexVariant);

            expect(themeService.getCurrentTheme()).toBe(complexTheme);
            expect(themeService.getThemeVariant()).toBe(complexVariant);
        });
    });
});
