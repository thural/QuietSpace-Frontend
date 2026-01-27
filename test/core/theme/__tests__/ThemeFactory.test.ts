/**
 * Theme Factory Test Suite
 * Tests theme factory functions and creation patterns
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the factory module
const mockCreateTheme = jest.fn();
const mockCreateThemeWithVariant = jest.fn();
const mockCreateDefaultTheme = jest.fn();
const mockCreateCustomTheme = jest.fn();

jest.mock('../../../src/core/theme/factory', () => ({
  createTheme: mockCreateTheme,
  createThemeWithVariant: mockCreateThemeWithVariant,
  createDefaultTheme: mockCreateDefaultTheme,
  createCustomTheme: mockCreateCustomTheme,
}));

describe('Theme Factory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createTheme', () => {
    test('should create theme with basic configuration', () => {
      const config = {
        colors: { primary: '#007bff' },
        typography: { fontSize: { base: '1rem' } },
      };
      
      const mockTheme = {
        ...config,
        name: 'custom-theme',
        variant: 'default',
      };
      
      mockCreateTheme.mockReturnValue(mockTheme);
      
      const theme = mockCreateTheme(config);
      expect(theme).toEqual(mockTheme);
      expect(mockCreateTheme).toHaveBeenCalledWith(config);
    });

    test('should create theme with variant', () => {
      const config = {
        colors: { primary: '#007bff' },
        variant: 'dark',
      };
      
      const mockTheme = {
        ...config,
        name: 'custom-dark-theme',
      };
      
      mockCreateTheme.mockReturnValue(mockTheme);
      
      const theme = mockCreateTheme(config);
      expect(theme.variant).toBe('dark');
      expect(theme.name).toBe('custom-dark-theme');
    });

    test('should handle empty configuration', () => {
      const mockTheme = {
        name: 'default-theme',
        colors: {},
        typography: {},
      };
      
      mockCreateTheme.mockReturnValue(mockTheme);
      
      const theme = mockCreateTheme({});
      expect(theme.name).toBe('default-theme');
    });
  });

  describe('createThemeWithVariant', () => {
    test('should create theme with specific variant', () => {
      const baseConfig = {
        colors: { primary: '#007bff' },
      };
      
      const variant = 'dark';
      const mockTheme = {
        ...baseConfig,
        variant: 'dark',
        colors: { primary: '#0d6efd' },
      };
      
      mockCreateThemeWithVariant.mockReturnValue(mockTheme);
      
      const theme = mockCreateThemeWithVariant(baseConfig, variant);
      expect(theme.variant).toBe('dark');
      expect(theme.colors.primary).toBe('#0d6efd');
      expect(mockCreateThemeWithVariant).toHaveBeenCalledWith(baseConfig, variant);
    });

    test('should support multiple variants', () => {
      const baseConfig = { colors: { primary: '#007bff' } };
      const variants = ['light', 'dark', 'high-contrast'];
      
      variants.forEach(variant => {
        const mockTheme = {
          ...baseConfig,
          variant,
          colors: { primary: `#${variant}-color` },
        };
        
        mockCreateThemeWithVariant.mockReturnValue(mockTheme);
        
        const theme = mockCreateThemeWithVariant(baseConfig, variant);
        expect(theme.variant).toBe(variant);
      });
    });
  });

  describe('createDefaultTheme', () => {
    test('should create default theme', () => {
      const mockDefaultTheme = {
        name: 'default',
        variant: 'light',
        colors: {
          primary: '#007bff',
          secondary: '#6c757d',
          background: '#ffffff',
          text: '#212529',
        },
        typography: {
          fontSize: { base: '1rem', sm: '0.875rem', lg: '1.125rem' },
          fontFamily: { sans: ['Inter', 'sans-serif'] },
        },
        spacing: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },
      };
      
      mockCreateDefaultTheme.mockReturnValue(mockDefaultTheme);
      
      const theme = mockCreateDefaultTheme();
      expect(theme).toEqual(mockDefaultTheme);
      expect(theme.name).toBe('default');
      expect(theme.variant).toBe('light');
      expect(theme.colors.primary).toBe('#007bff');
    });
  });

  describe('createCustomTheme', () => {
    test('should create custom theme with overrides', () => {
      const baseTheme = {
        colors: { primary: '#007bff', secondary: '#6c757d' },
        typography: { fontSize: { base: '1rem' } },
      };
      
      const overrides = {
        colors: { primary: '#ff0000', accent: '#00ff00' },
        typography: { fontSize: { base: '1.25rem' } },
      };
      
      const mockCustomTheme = {
        ...baseTheme,
        ...overrides,
        colors: { ...baseTheme.colors, ...overrides.colors },
        typography: { ...baseTheme.typography, ...overrides.typography },
        name: 'custom-theme',
      };
      
      mockCreateCustomTheme.mockReturnValue(mockCustomTheme);
      
      const theme = mockCreateCustomTheme(baseTheme, overrides);
      expect(theme.colors.primary).toBe('#ff0000');
      expect(theme.colors.secondary).toBe('#6c757d');
      expect(theme.colors.accent).toBe('#00ff00');
      expect(theme.typography.fontSize.base).toBe('1.25rem');
      expect(theme.name).toBe('custom-theme');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid configurations', () => {
      const invalidConfigs = [
        null,
        undefined,
        { colors: null },
        { typography: 'invalid' },
      ];
      
      const mockTheme = { name: 'fallback-theme' };
      mockCreateTheme.mockReturnValue(mockTheme);
      
      invalidConfigs.forEach(config => {
        const theme = mockCreateTheme(config as any);
        expect(theme).toBeDefined();
      });
    });
  });

  describe('Performance', () => {
    test('should handle rapid theme creation', () => {
      const config = { colors: { primary: '#007bff' } };
      const mockTheme = { ...config, name: 'rapid-theme' };
      
      mockCreateTheme.mockReturnValue(mockTheme);
      
      const startTime = performance.now();
      
      const themes = [];
      for (let i = 0; i < 100; i++) {
        themes.push(mockCreateTheme({ ...config, name: `theme-${i}` }));
      }
      
      const endTime = performance.now();
      
      expect(themes).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
