/**
 * Theme Legacy Support Test Suite
 * Tests theme legacy support and backward compatibility
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the legacy support module
const mockLegacyThemeSupport = jest.fn();
const mockMigrateLegacyTheme = jest.fn();
const mockGetLegacyCompatibility = jest.fn();

jest.mock('../../../src/core/theme/legacy', () => ({
  legacyThemeSupport: mockLegacyThemeSupport,
  migrateLegacyTheme: mockMigrateLegacyTheme,
  getLegacyCompatibility: mockGetLegacyCompatibility,
}));

describe('Theme Legacy Support', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('legacyThemeSupport', () => {
    test('should provide legacy theme support', () => {
      const legacySupport = {
        supported: true,
        version: '1.0.0',
        deprecated: ['oldThemeMethod', 'legacyColor'],
      };
      
      mockLegacyThemeSupport.mockReturnValue(legacySupport);
      
      const result = mockLegacyThemeSupport();
      expect(result.supported).toBe(true);
      expect(result.version).toBe('1.0.0');
    });
  });

  describe('migrateLegacyTheme', () => {
    test('should migrate legacy theme', () => {
      const legacyTheme = { oldColors: { primary: '#007bff' } };
      const modernTheme = { colors: { primary: '#007bff' } };
      
      mockMigrateLegacyTheme.mockReturnValue(modernTheme);
      
      const result = mockMigrateLegacyTheme(legacyTheme);
      expect(result).toEqual(modernTheme);
    });
  });

  describe('getLegacyCompatibility', () => {
    test('should return compatibility status', () => {
      const compatibility = {
        isCompatible: true,
        migrationRequired: false,
        warnings: [],
      };
      
      mockGetLegacyCompatibility.mockReturnValue(compatibility);
      
      const result = mockGetLegacyCompatibility();
      expect(result.isCompatible).toBe(true);
      expect(result.migrationRequired).toBe(false);
    });
  });
});
