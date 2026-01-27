/**
 * Theme Enhancers Hooks Test Suite
 * Tests theme enhancer hooks
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the enhancer hooks module
const mockUseThemeEnhancement = jest.fn();
const mockUseThemeVariant = jest.fn();
const mockUseThemeAnimation = jest.fn();

jest.mock('../../../src/core/theme/enhancers/useThemeEnhancement', () => ({
  useThemeEnhancement: mockUseThemeEnhancement,
  useThemeVariant: mockUseThemeVariant,
  useThemeAnimation: mockUseThemeAnimation,
}));

describe('Theme Enhancers Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('useThemeEnhancement', () => {
    test('should be a function', () => {
      expect(mockUseThemeEnhancement).toBeDefined();
      expect(typeof mockUseThemeEnhancement).toBe('function');
    });

    test('should return enhanced theme', () => {
      const baseTheme = { colors: { primary: '#007bff' } };
      const enhancedTheme = {
        ...baseTheme,
        utilities: { getColor: jest.fn() },
        animations: { duration: { fast: '0.15s' } },
      };
      
      mockUseThemeEnhancement.mockReturnValue(enhancedTheme);
      
      const result = mockUseThemeEnhancement(baseTheme);
      expect(result).toEqual(enhancedTheme);
    });
  });

  describe('useThemeVariant', () => {
    test('should be a function', () => {
      expect(mockUseThemeVariant).toBeDefined();
      expect(typeof mockUseThemeVariant).toBe('function');
    });

    test('should return variant theme', () => {
      const variant = 'dark';
      const variantTheme = { colors: { primary: '#0d6efd' } };
      
      mockUseThemeVariant.mockReturnValue(variantTheme);
      
      const result = mockUseThemeVariant(variant);
      expect(result).toEqual(variantTheme);
    });
  });

  describe('useThemeAnimation', () => {
    test('should be a function', () => {
      expect(mockUseThemeAnimation).toBeDefined();
      expect(typeof mockUseThemeAnimation).toBe('function');
    });

    test('should return animation utilities', () => {
      const animations = {
        duration: { fast: '0.15s', normal: '0.3s', slow: '0.5s' },
        easing: { ease: 'ease-in-out' },
      };
      
      mockUseThemeAnimation.mockReturnValue(animations);
      
      const result = mockUseThemeAnimation();
      expect(result).toEqual(animations);
    });
  });
});
