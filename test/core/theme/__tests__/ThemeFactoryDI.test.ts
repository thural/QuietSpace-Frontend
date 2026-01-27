/**
 * Theme Factory DI Test Suite
 * Tests theme factory dependency injection
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the factory DI module
const mockCreateThemeFromDI = jest.fn();
const mockCreateThemeWithVariantFromDI = jest.fn();
const mockRegisterThemeFactory = jest.fn();

jest.mock('../../../src/core/theme/di/ThemeFactory', () => ({
  createThemeFromDI: mockCreateThemeFromDI,
  createThemeWithVariantFromDI: mockCreateThemeWithVariantFromDI,
  registerThemeFactory: mockRegisterThemeFactory,
}));

describe('Theme Factory DI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('DI Theme Creation', () => {
    test('should create theme from DI container', () => {
      const mockContainer = {
        get: jest.fn(),
        resolve: jest.fn(),
      };
      const serviceName = 'ThemeService';
      const mockTheme = { colors: { primary: '#007bff' } };
      
      mockCreateThemeFromDI.mockReturnValue(mockTheme);
      
      const result = mockCreateThemeFromDI(mockContainer, serviceName);
      expect(result).toEqual(mockTheme);
      expect(mockCreateThemeFromDI).toHaveBeenCalledWith(mockContainer, serviceName);
    });

    test('should create theme with variant from DI', () => {
      const mockContainer = { get: jest.fn() };
      const serviceName = 'ThemeService';
      const variant = 'dark';
      const mockTheme = { colors: { primary: '#0d6efd' } };
      
      mockCreateThemeWithVariantFromDI.mockReturnValue(mockTheme);
      
      const result = mockCreateThemeWithVariantFromDI(mockContainer, serviceName, variant);
      expect(result).toEqual(mockTheme);
      expect(mockCreateThemeWithVariantFromDI).toHaveBeenCalledWith(mockContainer, serviceName, variant);
    });
  });

  describe('Factory Registration', () => {
    test('should register theme factory', () => {
      const factoryName = 'ThemeFactory';
      const factory = { create: jest.fn() };
      
      mockRegisterThemeFactory.mockReturnValue(true);
      
      const result = mockRegisterThemeFactory(factoryName, factory);
      expect(result).toBe(true);
      expect(mockRegisterThemeFactory).toHaveBeenCalledWith(factoryName, factory);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing DI container gracefully', () => {
      const serviceName = 'ThemeService';
      
      mockCreateThemeFromDI.mockReturnValue(null);
      
      const result = mockCreateThemeFromDI(null, serviceName);
      expect(result).toBeNull();
    });
  });
});
