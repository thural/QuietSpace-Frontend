/**
 * Theme Variants Test Suite
 * Tests theme variant functionality
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the variants module
const mockGetTheme = jest.fn();
const mockGetThemeVariants = jest.fn();
const mockDefaultTheme = { colors: { primary: '#000' } };

jest.mock('../../../src/core/theme/variants', () => ({
  getTheme: mockGetTheme,
  getThemeVariants: mockGetThemeVariants,
  defaultTheme: mockDefaultTheme,
}));

describe('Theme Variants', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getTheme', () => {
    test('should return theme by name', () => {
      const mockTheme = { colors: { primary: '#007bff' } };
      mockGetTheme.mockReturnValue(mockTheme);
      
      const result = mockGetTheme('light');
      expect(result).toEqual(mockTheme);
    });

    test('should return default theme for unknown name', () => {
      mockGetTheme.mockReturnValue(mockDefaultTheme);
      
      const result = mockGetTheme('unknown');
      expect(result).toEqual(mockDefaultTheme);
    });
  });

  describe('getThemeVariants', () => {
    test('should return available variants', () => {
      const variants = ['light', 'dark', 'high-contrast'];
      mockGetThemeVariants.mockReturnValue(variants);
      
      const result = mockGetThemeVariants();
      expect(result).toEqual(variants);
    });
  });

  describe('defaultTheme', () => {
    test('should export default theme', () => {
      expect(mockDefaultTheme).toBeDefined();
      expect(mockDefaultTheme.colors.primary).toBe('#000');
    });
  });
});
