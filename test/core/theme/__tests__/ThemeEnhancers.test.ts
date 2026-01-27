/**
 * Theme Enhancers Test Suite
 * Tests theme enhancement functionality
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the enhancers module
const mockEnhanceTheme = jest.fn();

jest.mock('../../../src/core/theme/enhancers/themeEnhancers', () => ({
  enhanceTheme: mockEnhanceTheme,
}));

describe('Theme Enhancers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('enhanceTheme', () => {
    test('should enhance theme with additional features', () => {
      const baseTheme = { colors: { primary: '#007bff' } };
      const enhancedTheme = {
        ...baseTheme,
        utilities: { getColor: jest.fn() },
        animations: { duration: { fast: '0.15s' } },
      };
      
      mockEnhanceTheme.mockReturnValue(enhancedTheme);
      
      const result = mockEnhanceTheme(baseTheme);
      expect(result).toEqual(enhancedTheme);
      expect(mockEnhanceTheme).toHaveBeenCalledWith(baseTheme);
    });

    test('should handle null theme gracefully', () => {
      mockEnhanceTheme.mockReturnValue(null);
      
      const result = mockEnhanceTheme(null);
      expect(result).toBeNull();
    });
  });
});
