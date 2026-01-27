/**
 * Theme Factory Test Suite
 * 
 * Comprehensive tests for theme factory functions including:
 * - Theme creation with available variants
 * - Custom theme creation
 * - Error handling and edge cases
 * - Performance and memory management
 */

import {
  createThemeWithVariant,
  createCustomTheme,
  createTheme,
  createDarkTheme,
  createLightTheme,
  createHighContrastTheme,
  createCompactTheme,
  createComponentTheme,
  themeFactoryRegistry
} from '../../../../src/core/theme/factory';

// Helper function to create complete ColorTokens for testing
const createCompleteColorTokens = (overrides?: any) => ({
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
    ...overrides?.brand
  },
  semantic: {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    ...overrides?.semantic
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
    ...overrides?.neutral
  },
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#e9ecef',
    overlay: 'rgba(0, 0, 0, 0.5)',
    transparent: 'transparent',
    ...overrides?.background
  },
  text: {
    primary: '#212529',
    secondary: '#6c757d',
    tertiary: '#adb5bd',
    inverse: '#ffffff',
    ...overrides?.text
  },
  border: {
    light: '#dee2e6',
    medium: '#ced4da',
    dark: '#495057',
    ...overrides?.border
  }
});

describe('Theme Factory', () => {
  describe('createThemeWithVariant', () => {
    test('should create theme with light variant', () => {
      const theme = createThemeWithVariant('light');

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors).toBeDefined();
    });

    test('should create theme with dark variant', () => {
      const theme = createThemeWithVariant('dark');

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors).toBeDefined();
    });

    test('should create theme with high-contrast variant', () => {
      const theme = createThemeWithVariant('high-contrast');

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors).toBeDefined();
    });

    test('should create theme with brand variant', () => {
      const theme = createThemeWithVariant('brand');

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors).toBeDefined();
    });

    test('should create theme with accessibility variant', () => {
      const theme = createThemeWithVariant('accessibility');

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors).toBeDefined();
    });

    test('should create theme with mobile-first variant', () => {
      const theme = createThemeWithVariant('mobile-first');

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors).toBeDefined();
    });

    test('should handle custom variant', () => {
      const theme = createThemeWithVariant('custom');

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
    });

    test('should apply overrides when provided', () => {
      const overrides = {
        colors: {
          brand: {
            50: '#e3f2fd',
            100: '#bbdefb',
            200: '#90caf9',
            300: '#64b5f6',
            400: '#42a5f5',
            500: '#ff0000',
            600: '#1e88e5',
            700: '#1976d2',
            800: '#1565c0',
            900: '#0d47a1',
            950: '#0a3d91'
          },
          semantic: {
            success: '#4caf50',
            warning: '#ff9800',
            error: '#f44336',
            info: '#2196f3'
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
            950: '#000000'
          },
          background: {
            primary: '#ffffff',
            secondary: '#f8f9fa',
            tertiary: '#e9ecef',
            overlay: 'rgba(0, 0, 0, 0.5)',
            transparent: 'transparent'
          },
          text: {
            primary: '#212529',
            secondary: '#6c757d',
            tertiary: '#adb5bd',
            inverse: '#ffffff'
          },
          border: {
            light: '#dee2e6',
            medium: '#ced4da',
            dark: '#495057'
          }
        }
      };

      const theme = createThemeWithVariant('light', overrides);

      expect(theme.colors.brand[500]).toBe('#ff0000');
    });

    test('should merge overrides with existing tokens', () => {
      const overrides = {
        colors: {
          brand: {
            50: '#e3f2fd',
            100: '#bbdefb',
            200: '#90caf9',
            300: '#64b5f6',
            400: '#42a5f5',
            500: '#ff0000',
            600: '#1e88e5',
            700: '#1976d2',
            800: '#1565c0',
            900: '#0d47a1',
            950: '#0a3d91'
          },
          semantic: {
            success: '#4caf50',
            warning: '#ff9800',
            error: '#f44336',
            info: '#2196f3'
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
            950: '#000000'
          },
          background: {
            primary: '#ffffff',
            secondary: '#f8f9fa',
            tertiary: '#e9ecef',
            overlay: 'rgba(0, 0, 0, 0.5)',
            transparent: 'transparent'
          },
          text: {
            primary: '#212529',
            secondary: '#6c757d',
            tertiary: '#adb5bd',
            inverse: '#ffffff'
          },
          border: {
            light: '#dee2e6',
            medium: '#ced4da',
            dark: '#495057'
          }
        }
      };

      const theme = createThemeWithVariant('light', overrides);

      expect(theme.colors.brand[500]).toBe('#ff0000');
      expect(theme.colors.brand).toHaveProperty('600');
    });
  });

  describe('createCustomTheme', () => {
    test('should create custom theme with config', () => {
      const config = {
        name: 'my-theme',
        version: '1.0.0',
        extends: ['light'],
        tokens: {
          colors: createCompleteColorTokens({
            brand: { 500: '#00ff00' }
          })
        }
      };

      const theme = createCustomTheme(config);

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors.brand[500]).toBe('#00ff00');
    });

    test('should handle config with extends', () => {
      const config = {
        name: 'extended-theme',
        version: '1.0.0',
        extends: ['light'],
        tokens: {
          colors: createCompleteColorTokens({
            brand: { 500: '#ff0000' }
          })
        }
      };

      const theme = createCustomTheme(config);

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors.brand[500]).toBe('#ff0000');
    });

    test('should handle config without tokens', () => {
      const config = {
        name: 'simple-theme',
        version: '1.0.0',
        extends: ['light']
      };

      const theme = createCustomTheme(config);

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
    });

    test('should handle empty config', () => {
      const config = {
        name: '',
        version: '1.0.0',
        extends: ['light']
      };

      const theme = createCustomTheme(config);

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
    });

    test('should handle complex overrides', () => {
      const config = {
        name: 'complex-theme',
        version: '1.0.0',
        extends: ['light'],
        tokens: {
          colors: createCompleteColorTokens({
            brand: {
              500: '#ff0000',
              600: '#00ff00'
            },
            text: {
              primary: '#333333'
            }
          })
        }
      };

      const theme = createCustomTheme(config);

      expect(theme.colors.brand[500]).toBe('#ff0000');
      expect(theme.colors.brand[600]).toBe('#00ff00');
      expect(theme.colors.text.primary).toBe('#333333');
    });
  });

  describe('createTheme', () => {
    test('should create theme with simple overrides', () => {
      const overrides = {
        colors: createCompleteColorTokens({
          brand: { 500: '#ff0000' }
        })
      };

      const theme = createTheme(overrides);

      expect(theme).toBeDefined();
      expect(theme.colors.brand[500]).toBe('#ff0000');
    });

    test('should merge overrides with default theme', () => {
      const overrides = {
        colors: createCompleteColorTokens({
          brand: { 500: '#ff0000' }
        })
      };

      const theme = createTheme(overrides);

      expect(theme.colors.brand[500]).toBe('#ff0000');
      expect(theme.colors.brand).toHaveProperty('600');
    });

    test('should handle empty overrides', () => {
      const overrides = {};

      const theme = createTheme(overrides);

      expect(theme).toBeDefined();
      expect(theme.colors).toBeDefined();
    });

    test('should handle null overrides', () => {
      const theme = createTheme(null as any);

      expect(theme).toBeDefined();
      expect(theme.colors).toBeDefined();
    });
  });

  describe('createLightTheme', () => {
    test('should create light theme', () => {
      const theme = createLightTheme();

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors).toBeDefined();
    });

    test('should have light theme characteristics', () => {
      const theme = createLightTheme();

      expect(theme.colors).toBeDefined();
      expect(theme.typography).toBeDefined();
      expect(theme.spacing).toBeDefined();
    });

    test('should accept overrides', () => {
      const overrides = {
        colors: createCompleteColorTokens({
          brand: { 500: '#ff0000' }
        })
      };

      const theme = createLightTheme(overrides);

      expect(theme.colors.brand[500]).toBe('#ff0000');
    });
  });

  describe('createDarkTheme', () => {
    test('should create dark theme', () => {
      const theme = createDarkTheme();

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors).toBeDefined();
    });

    test('should have dark theme characteristics', () => {
      const theme = createDarkTheme();

      expect(theme.colors).toBeDefined();
      expect(theme.typography).toBeDefined();
      expect(theme.spacing).toBeDefined();
    });

    test('should accept overrides', () => {
      const overrides = {
        colors: createCompleteColorTokens({
          brand: { 500: '#00ff00' }
        })
      };

      const theme = createDarkTheme(overrides);

      expect(theme.colors.brand[500]).toBe('#00ff00');
    });
  });

  describe('createHighContrastTheme', () => {
    test('should create high contrast theme', () => {
      const theme = createHighContrastTheme();

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors).toBeDefined();
    });

    test('should accept overrides', () => {
      const overrides = {
        colors: createCompleteColorTokens({
          brand: { 500: '#ff00ff' }
        })
      };

      const theme = createHighContrastTheme(overrides);

      expect(theme.colors.brand[500]).toBe('#ff00ff');
    });
  });

  describe('createCompactTheme', () => {
    test('should create compact theme', () => {
      const theme = createCompactTheme();

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors).toBeDefined();
    });

    test('should accept overrides', () => {
      const overrides = {
        colors: createCompleteColorTokens({
          brand: { 500: '#00ffff' }
        })
      };

      const theme = createCompactTheme(overrides);

      expect(theme.colors.brand[500]).toBe('#00ffff');
    });
  });

  describe('createComponentTheme', () => {
    test('should create component theme', () => {
      const theme = createComponentTheme('button');

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme.colors).toBeDefined();
    });

    test('should accept overrides', () => {
      const overrides = {
        colors: createCompleteColorTokens({
          brand: { 500: '#ffff00' }
        })
      };

      const theme = createComponentTheme('button', overrides);

      expect(theme.colors.brand[500]).toBe('#ffff00');
    });

    test('should handle empty component name', () => {
      const theme = createComponentTheme('');

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
    });
  });

  describe('themeFactoryRegistry', () => {
    test('should have registry methods', () => {
      expect(typeof themeFactoryRegistry.register).toBe('function');
      expect(typeof themeFactoryRegistry.get).toBe('function');
      expect(typeof themeFactoryRegistry.list).toBe('function');
    });

    test('should register custom factory', () => {
      const customFactory = (overrides?: any) => createLightTheme(overrides);

      expect(() => {
        themeFactoryRegistry.register('custom', customFactory);
      }).not.toThrow();
    });

    test('should get registered factory', () => {
      const customFactory = (overrides?: any) => createDarkTheme(overrides);
      themeFactoryRegistry.register('custom', customFactory);

      const retrieved = themeFactoryRegistry.get('custom');

      expect(typeof retrieved).toBe('function');
    });

    test('should list registered factories', () => {
      themeFactoryRegistry.register('test1', () => createLightTheme());
      themeFactoryRegistry.register('test2', () => createDarkTheme());

      const list = themeFactoryRegistry.list();

      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe('Performance', () => {
    test('should create themes efficiently', () => {
      const startTime = Date.now();

      for (let i = 0; i < 100; i++) {
        createThemeWithVariant('light');
        createThemeWithVariant('dark');
        createLightTheme();
        createDarkTheme();
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should not cause memory leaks on repeated creation', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      for (let i = 0; i < 100; i++) {
        createThemeWithVariant('light', {
          colors: createCompleteColorTokens({
            brand: { 500: '#ff0000' }
          })
        });
        createCustomTheme({
          name: `test-theme-${i}`,
          version: '1.0.0',
          extends: ['light'],
          tokens: {
            colors: createCompleteColorTokens({
              brand: { 500: '#00ff00', 600: '#ff00ff' }
            })
          }
        });
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid variant names', () => {
      expect(() => {
        createThemeWithVariant(null as any);
      }).not.toThrow();

      expect(() => {
        createThemeWithVariant(undefined as any);
      }).not.toThrow();
    });

    test('should handle invalid overrides', () => {
      expect(() => {
        createThemeWithVariant('light', null as any);
      }).not.toThrow();

      expect(() => {
        createThemeWithVariant('light', undefined as any);
      }).not.toThrow();

      expect(() => {
        createThemeWithVariant('light', 'invalid' as any);
      }).not.toThrow();
    });

    test('should handle invalid config', () => {
      expect(() => {
        createCustomTheme(null as any);
      }).not.toThrow();

      expect(() => {
        createCustomTheme(undefined as any);
      }).not.toThrow();

      expect(() => {
        createCustomTheme('invalid' as any);
      }).not.toThrow();
    });
  });

  describe('Integration', () => {
    test('should support complete theme creation workflow', () => {
      // Create themed variants
      const lightTheme = createLightTheme();
      const darkTheme = createDarkTheme();
      const highContrastTheme = createHighContrastTheme();

      expect(typeof lightTheme).toBe('object');
      expect(typeof darkTheme).toBe('object');
      expect(typeof highContrastTheme).toBe('object');

      // Create custom theme with overrides
      const customTheme = createThemeWithVariant('custom', {
        colors: createCompleteColorTokens({
          brand: {
            500: '#ff0000',
            600: '#00ff00'
          }
        })
      });
      expect(typeof customTheme).toBe('object');
      expect(customTheme.colors.brand[500]).toBe('#ff0000');
      expect(customTheme.colors.brand[600]).toBe('#00ff00');

      // Create fully custom theme
      const fullCustomTheme = createCustomTheme({
        name: 'enterprise',
        version: '1.0.0',
        extends: ['light'],
        tokens: {
          colors: createCompleteColorTokens({
            brand: {
              500: '#0066cc',
              600: '#ff6600'
            }
          })
        }
      });
      expect(typeof fullCustomTheme).toBe('object');
      expect(fullCustomTheme.colors.brand[500]).toBe('#0066cc');
      expect(fullCustomTheme.colors.brand[600]).toBe('#ff6600');
    });

    test('should support theme inheritance and composition', () => {
      const baseTheme = createLightTheme();
      const extendedTheme = createTheme({
        colors: createCompleteColorTokens({
          brand: { 500: '#ff0000' }
        })
      });

      expect(baseTheme.colors).toHaveProperty('brand');
      expect(extendedTheme.colors.brand[500]).toBe('#ff0000');
      expect(extendedTheme.colors.brand).toHaveProperty('600');
    });

    test('should support theme switching workflow', () => {
      const themes = [
        createLightTheme(),
        createDarkTheme(),
        createThemeWithVariant('high-contrast'),
        createThemeWithVariant('accessibility')
      ];

      themes.forEach(theme => {
        expect(theme).toBeDefined();
        expect(theme.colors).toBeDefined();
        expect(theme.typography).toBeDefined();
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle very large override objects', () => {
      const largeOverrides = {
        colors: {},
        typography: {},
        spacing: {}
      };

      // Add many properties
      for (let i = 0; i < 100; i++) {
        (largeOverrides.colors as any)[`color${i}`] = `#${i.toString(16).padStart(6, '0')}`;
        (largeOverrides.typography as any)[`font${i}`] = `${i}px`;
        (largeOverrides.spacing as any)[`space${i}`] = `${i}px`;
      }

      expect(() => {
        createTheme(largeOverrides);
      }).not.toThrow();
    });

    test('should handle circular references in overrides', () => {
      const circular: any = {};
      circular.self = circular;

      expect(() => {
        createTheme(circular);
      }).not.toThrow();
    });

    test('should handle special characters in theme names', () => {
      const configs = [
        { name: 'theme-with-dashes', version: '1.0.0', extends: ['light'], tokens: { colors: createCompleteColorTokens() } },
        { name: 'theme_with_underscores', version: '1.0.0', extends: ['light'], tokens: { colors: createCompleteColorTokens() } },
        { name: 'theme.with.dots', version: '1.0.0', extends: ['light'], tokens: { colors: createCompleteColorTokens() } },
        { name: 'theme with spaces', version: '1.0.0', extends: ['light'], tokens: { colors: createCompleteColorTokens() } }
      ];

      configs.forEach(config => {
        expect(() => {
          createCustomTheme(config);
        }).not.toThrow();
      });
    });
  });
});
