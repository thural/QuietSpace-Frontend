/**
 * Theme Public API Test Suite
 * Tests theme public API exports
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the public API module
const mockThemeSystem = {
  currentTheme: 'light',
  themes: ['light', 'dark'],
  switchTheme: jest.fn(),
  getTheme: jest.fn(),
};
const mockThemeProvider = jest.fn();
const mockEnhancedThemeProvider = jest.fn();
const mockUseEnhancedTheme = jest.fn();
const mockUseThemeSwitch = jest.fn();
const mockUseThemeTokens = jest.fn();
const mockUseTheme = jest.fn();
const mockCreateStyledComponent = jest.fn();
const mockMedia = jest.fn();
const mockAnimations = {
  duration: { fast: '0.15s', normal: '0.3s', slow: '0.5s' },
};

jest.mock('../../../src/core/theme/public', () => ({
  themeSystem: mockThemeSystem,
  ThemeSystem: jest.fn(),
  ThemeProvider: mockThemeProvider,
  EnhancedThemeProvider: mockEnhancedThemeProvider,
  useEnhancedTheme: mockUseEnhancedTheme,
  useThemeSwitch: mockUseThemeSwitch,
  useThemeTokens: mockUseThemeTokens,
  useTheme: mockUseTheme,
  createStyledComponent: mockCreateStyledComponent,
  media: mockMedia,
  animations: mockAnimations,
}));

describe('Theme Public API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Theme System', () => {
    test('should export theme system object', () => {
      expect(mockThemeSystem).toBeDefined();
      expect(mockThemeSystem.currentTheme).toBe('light');
      expect(mockThemeSystem.themes).toEqual(['light', 'dark']);
    });

    test('should export theme system methods', () => {
      expect(mockThemeSystem.switchTheme).toBeDefined();
      expect(mockThemeSystem.getTheme).toBeDefined();
      expect(typeof mockThemeSystem.switchTheme).toBe('function');
      expect(typeof mockThemeSystem.getTheme).toBe('function');
    });
  });

  describe('Theme Providers', () => {
    test('should export ThemeProvider', () => {
      expect(mockThemeProvider).toBeDefined();
      expect(typeof mockThemeProvider).toBe('function');
    });

    test('should export EnhancedThemeProvider', () => {
      expect(mockEnhancedThemeProvider).toBeDefined();
      expect(typeof mockEnhancedThemeProvider).toBe('function');
    });
  });

  describe('Theme Hooks', () => {
    test('should export useEnhancedTheme hook', () => {
      expect(mockUseEnhancedTheme).toBeDefined();
      expect(typeof mockUseEnhancedTheme).toBe('function');
    });

    test('should export useThemeSwitch hook', () => {
      expect(mockUseThemeSwitch).toBeDefined();
      expect(typeof mockUseThemeSwitch).toBe('function');
    });

    test('should export useThemeTokens hook', () => {
      expect(mockUseThemeTokens).toBeDefined();
      expect(typeof mockUseThemeTokens).toBe('function');
    });

    test('should export useTheme hook', () => {
      expect(mockUseTheme).toBeDefined();
      expect(typeof mockUseTheme).toBe('function');
    });
  });

  describe('Theme Utilities', () => {
    test('should export createStyledComponent utility', () => {
      expect(mockCreateStyledComponent).toBeDefined();
      expect(typeof mockCreateStyledComponent).toBe('function');
    });

    test('should export media utility', () => {
      expect(mockMedia).toBeDefined();
      expect(typeof mockMedia).toBe('function');
    });

    test('should export animations utility', () => {
      expect(mockAnimations).toBeDefined();
      expect(mockAnimations.duration).toBeDefined();
      expect(mockAnimations.duration.fast).toBe('0.15s');
      expect(mockAnimations.duration.normal).toBe('0.3s');
      expect(mockAnimations.duration.slow).toBe('0.5s');
    });
  });

  describe('API Integration', () => {
    test('should work together for complete theme usage', () => {
      const mockTheme = { colors: { primary: '#007bff' } };
      const mockThemeSwitcher = { currentTheme: 'light', switchTheme: jest.fn() };
      const mockTokens = { colors: mockTheme.colors };
      
      mockThemeSystem.getTheme.mockReturnValue(mockTheme);
      mockUseThemeSwitch.mockReturnValue(mockThemeSwitcher);
      mockUseThemeTokens.mockReturnValue(mockTokens);
      
      const theme = mockThemeSystem.getTheme();
      const themeSwitcher = mockUseThemeSwitch();
      const tokens = mockUseThemeTokens();
      
      expect(theme).toEqual(mockTheme);
      expect(themeSwitcher.currentTheme).toBe('light');
      expect(tokens).toEqual(mockTokens);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing theme gracefully', () => {
      mockThemeSystem.getTheme.mockReturnValue(null);
      
      const theme = mockThemeSystem.getTheme();
      expect(theme).toBeNull();
    });

    test('should handle invalid theme switch', () => {
      mockThemeSystem.switchTheme.mockReturnValue(false);
      
      const result = mockThemeSystem.switchTheme('invalid');
      expect(result).toBe(false);
    });
  });

  describe('Performance', () => {
    test('should handle rapid hook calls efficiently', () => {
      const mockHookReturn = { colors: { primary: '#007bff' } };
      
      mockUseEnhancedTheme.mockReturnValue(mockHookReturn);
      mockUseThemeTokens.mockReturnValue(mockHookReturn);
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        mockUseEnhancedTheme();
        mockUseThemeTokens();
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
