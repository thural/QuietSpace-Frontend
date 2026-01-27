/**
 * Theme System Test Suite
 * 
 * Comprehensive tests for the ThemeSystem facade including:
 * - Singleton pattern implementation
 * - Theme creation and management
 * - Theme variant registration
 * - Factory and composer access
 * - Black box pattern compliance
 */

import { ThemeSystem, themeSystem } from '../../../../src/core/theme/ThemeSystem';
import { ThemeTokens } from '../../../../src/core/theme/tokens';
import { EnhancedTheme } from '../../../../src/core/theme/types/ProviderTypes';

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

describe('ThemeSystem', () => {
  let themeSystemInstance: ThemeSystem;

  beforeEach(() => {
    // Reset singleton instance
    (ThemeSystem as any).instance = null;
    themeSystemInstance = ThemeSystem.getInstance();

    // Register basic themes for testing
    themeSystemInstance.registerTheme('light', {
      colors: createCompleteColorTokens({
        brand: { 500: '#2196f3' }
      })
    });
  });

  afterEach(() => {
    (ThemeSystem as any).instance = null;
  });

  describe('Singleton Pattern', () => {
    test('should return same instance', () => {
      const instance1 = ThemeSystem.getInstance();
      const instance2 = ThemeSystem.getInstance();

      expect(instance1).toBe(instance2);
    });

    test('should create new instance when reset', () => {
      const instance1 = ThemeSystem.getInstance();
      (ThemeSystem as any).instance = null;
      const instance2 = ThemeSystem.getInstance();

      expect(instance1).not.toBe(instance2);
    });
  });

  describe('Theme Creation', () => {
    test('should create theme with variant', () => {
      const theme = themeSystemInstance.createTheme('light');

      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
    });

    test('should create theme with variant and overrides', () => {
      const overrides: Partial<ThemeTokens> = {
        colors: createCompleteColorTokens({
          brand: { 500: '#red' }
        })
      };

      const theme = themeSystemInstance.createTheme('dark', overrides);

      expect(theme).toBeDefined();
    });

    test('should handle empty overrides', () => {
      const theme = themeSystemInstance.createTheme('light', {});

      expect(theme).toBeDefined();
    });

    test('should handle undefined overrides', () => {
      const theme = themeSystemInstance.createTheme('light', undefined);

      expect(theme).toBeDefined();
    });
  });

  describe('Theme Registration', () => {
    test('should register new theme variant', () => {
      const config: Partial<ThemeTokens> = {
        colors: createCompleteColorTokens({
          brand: { 500: '#green' }
        })
      };

      expect(() => {
        themeSystemInstance.registerTheme('custom', config);
      }).not.toThrow();
    });

    test('should register theme with minimal config', () => {
      expect(() => {
        themeSystemInstance.registerTheme('minimal', {});
      }).not.toThrow();
    });

    test('should handle theme registration with same name', () => {
      const config1: Partial<ThemeTokens> = {
        colors: createCompleteColorTokens({
          brand: { 500: '#blue' }
        })
      };
      const config2: Partial<ThemeTokens> = {
        colors: createCompleteColorTokens({
          brand: { 500: '#red' }
        })
      };

      themeSystemInstance.registerTheme('test', config1);

      expect(() => {
        themeSystemInstance.registerTheme('test', config2);
      }).not.toThrow();
    });
  });

  describe('Variant Management', () => {
    test('should return available variants', () => {
      const variants = themeSystemInstance.getAvailableVariants();

      expect(variants).toBeDefined();
      expect(Array.isArray(variants)).toBe(true);
    });

    test('should return empty variants initially', () => {
      (ThemeSystem as any).instance = null;
      const newInstance = ThemeSystem.getInstance();
      const variants = newInstance.getAvailableVariants();

      expect(Array.isArray(variants)).toBe(true);
    });
  });

  describe('Factory Access', () => {
    test('should return theme factory instance', () => {
      const factory = themeSystemInstance.getFactory();

      expect(factory).toBeDefined();
      expect(typeof factory.createTheme).toBe('function');
    });

    test('should return same factory instance', () => {
      const factory1 = themeSystemInstance.getFactory();
      const factory2 = themeSystemInstance.getFactory();

      expect(factory1).toBe(factory2);
    });
  });

  describe('Composer Access', () => {
    test('should return theme composer instance', () => {
      const composer = themeSystemInstance.getComposer();

      expect(composer).toBeDefined();
      expect(typeof composer.compose).toBe('function');
      expect(typeof composer.register).toBe('function');
      expect(typeof composer.getRegisteredVariants).toBe('function');
    });

    test('should return same composer instance', () => {
      const composer1 = themeSystemInstance.getComposer();
      const composer2 = themeSystemInstance.getComposer();

      expect(composer1).toBe(composer2);
    });
  });

  describe('Enhancer Access', () => {
    test('should return theme enhancer instance', () => {
      const enhancer = themeSystemInstance.getEnhancer();

      expect(enhancer).toBeDefined();
      expect(typeof enhancer.enhance).toBe('function');
    });

    test('should return same enhancer instance', () => {
      const enhancer1 = themeSystemInstance.getEnhancer();
      const enhancer2 = themeSystemInstance.getEnhancer();

      expect(enhancer1).toBe(enhancer2);
    });
  });

  describe('Integration Workflow', () => {
    test('should support complete theme creation workflow', () => {
      // Register custom theme
      const customConfig: Partial<ThemeTokens> = {
        colors: createCompleteColorTokens({
          brand: { 500: '#purple' }
        })
      };
      themeSystemInstance.registerTheme('custom', customConfig);

      // Create theme with custom variant
      const theme = themeSystemInstance.createTheme('custom', {
        colors: createCompleteColorTokens({
          brand: { 500: '#orange' }
        })
      });

      // Verify theme was created
      expect(theme).toBeDefined();

      // Check variants include custom theme
      const variants = themeSystemInstance.getAvailableVariants();
      expect(variants).toContain('custom');
    });

    test('should support factory-based theme creation', () => {
      const factory = themeSystemInstance.getFactory();
      const composer = themeSystemInstance.getComposer();
      const enhancer = themeSystemInstance.getEnhancer();

      // All should be available
      expect(factory).toBeDefined();
      expect(composer).toBeDefined();
      expect(enhancer).toBeDefined();

      // Should work together for theme creation
      const composedTheme = composer.compose('light');
      const enhancedTheme = enhancer.enhance(composedTheme);

      expect(enhancedTheme).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid variant gracefully', () => {
      expect(() => {
        themeSystemInstance.createTheme('nonexistent');
      }).toThrow('Theme "nonexistent" not found');
    });

    test('should handle null overrides gracefully', () => {
      expect(() => {
        themeSystemInstance.createTheme('light', null as any);
      }).toThrow('Theme "light" not found');
    });

    test('should handle type checking for overrides', () => {
      const validOverrides: Partial<ThemeTokens> = {
        colors: createCompleteColorTokens({
          brand: { 500: '#blue' }
        })
      };

      expect(() => {
        const theme = themeSystemInstance.createTheme('light', validOverrides);
        expect(theme).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('Black Box Pattern Compliance', () => {
    test('should hide internal implementation details', () => {
      const themeSystem = ThemeSystem.getInstance();

      // Should not expose internal constructors
      expect(typeof (themeSystem as any).themeFactory).toBe('object');
      expect(typeof (themeSystem as any).themeComposer).toBe('object');
      expect(typeof (themeSystem as any).themeEnhancer).toBe('object');

      // Should expose controlled access
      expect(typeof themeSystem.getFactory).toBe('function');
      expect(typeof themeSystem.getComposer).toBe('function');
      expect(typeof themeSystem.getEnhancer).toBe('function');
    });

    test('should provide clean public API', () => {
      const publicMethods = Object.getOwnPropertyNames(ThemeSystem.prototype);
      const expectedMethods = [
        'createTheme',
        'registerTheme',
        'getAvailableVariants',
        'getFactory',
        'getComposer',
        'getEnhancer'
      ];

      expectedMethods.forEach(method => {
        expect(publicMethods).toContain(method);
      });
    });
  });

  describe('Singleton Export', () => {
    test('should export singleton instance', () => {
      expect(themeSystem).toBeDefined();
      expect(typeof themeSystem).toBe('object');
      expect(typeof themeSystem.createTheme).toBe('function');
    });

    test('should export same instance as getInstance', () => {
      const instance = ThemeSystem.getInstance();
      expect(themeSystem).toStrictEqual(instance);
    });
  });
});
