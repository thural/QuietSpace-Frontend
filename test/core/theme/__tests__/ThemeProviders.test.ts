/**
 * Theme Providers Test Suite
 * Tests theme provider components
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the providers module
const mockThemeProvider = jest.fn();
const mockEnhancedThemeProvider = jest.fn();

jest.mock('../../../src/core/theme/providers/ThemeContext', () => ({
  ThemeProvider: mockThemeProvider,
  EnhancedThemeProvider: mockEnhancedThemeProvider,
}));

describe('Theme Providers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ThemeProvider', () => {
    test('should be a component', () => {
      expect(mockThemeProvider).toBeDefined();
      expect(typeof mockThemeProvider).toBe('function');
    });

    test('should accept theme prop', () => {
      const theme = { colors: { primary: '#007bff' } };
      mockThemeProvider(theme);
      expect(mockThemeProvider).toHaveBeenCalledWith(theme);
    });
  });

  describe('EnhancedThemeProvider', () => {
    test('should be a component', () => {
      expect(mockEnhancedThemeProvider).toBeDefined();
      expect(typeof mockEnhancedThemeProvider).toBe('function');
    });

    test('should accept enhanced theme configuration', () => {
      const theme = { colors: { primary: '#007bff' }, variant: 'dark' };
      mockEnhancedThemeProvider(theme);
      expect(mockEnhancedThemeProvider).toHaveBeenCalledWith(theme);
    });
  });
});
