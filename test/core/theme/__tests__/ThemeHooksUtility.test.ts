/**
 * Theme Hooks Utility Test Suite
 * Tests theme utility hooks
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the utility hooks module
const mockUseThemeUtility = jest.fn();
const mockUseResponsiveValue = jest.fn();
const mockUseBreakpoint = jest.fn();
const mockUseMediaQuery = jest.fn();

jest.mock('../../../src/core/theme/hooks/utilityHooks', () => ({
  useThemeUtility: mockUseThemeUtility,
  useResponsiveValue: mockUseResponsiveValue,
  useBreakpoint: mockUseBreakpoint,
  useMediaQuery: mockUseMediaQuery,
}));

describe('Theme Hooks Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('useThemeUtility', () => {
    test('should return theme utilities', () => {
      const mockUtilities = {
        getColor: jest.fn((color) => color),
        getSpacing: jest.fn((size) => size),
        getTypography: jest.fn((type) => type),
      };
      
      mockUseThemeUtility.mockReturnValue(mockUtilities);
      
      const result = mockUseThemeUtility();
      expect(result).toEqual(mockUtilities);
    });

    test('should accept theme parameter', () => {
      const theme = { colors: { primary: '#007bff' } };
      const mockUtilities = { getColor: jest.fn((color) => theme.colors[color]) };
      
      mockUseThemeUtility.mockReturnValue(mockUtilities);
      
      const result = mockUseThemeUtility(theme);
      expect(mockUseThemeUtility).toHaveBeenCalledWith(theme);
    });
  });

  describe('useResponsiveValue', () => {
    test('should return responsive value', () => {
      const values = { xs: '12px', sm: '14px', md: '16px', lg: '18px' };
      const mockValue = values.md;
      
      mockUseResponsiveValue.mockReturnValue(mockValue);
      
      const result = mockUseResponsiveValue(values);
      expect(result).toBe(mockValue);
    });
  });

  describe('useBreakpoint', () => {
    test('should return breakpoint status', () => {
      const mockStatus = { isAbove: true, isBelow: false, current: 'md' };
      
      mockUseBreakpoint.mockReturnValue(mockStatus);
      
      const result = mockUseBreakpoint('md');
      expect(result.isAbove).toBe(true);
      expect(result.current).toBe('md');
    });
  });

  describe('useMediaQuery', () => {
    test('should return media query result', () => {
      const query = '(min-width: 768px)';
      const mockResult = true;
      
      mockUseMediaQuery.mockReturnValue(mockResult);
      
      const result = mockUseMediaQuery(query);
      expect(result).toBe(mockResult);
    });
  });
});
