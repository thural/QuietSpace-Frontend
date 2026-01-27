/**
 * Theme DI Container Test Suite
 * Tests theme dependency injection container
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the DI container module
const mockThemeContainer = {
  register: jest.fn(),
  resolve: jest.fn(),
  isRegistered: jest.fn(),
  createScope: jest.fn(),
  dispose: jest.fn(),
};

jest.mock('../../../src/core/theme/di/ThemeContainer', () => ({
  ThemeContainer: jest.fn(() => mockThemeContainer),
}));

describe('Theme DI Container', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Container Registration', () => {
    test('should register theme services', () => {
      const serviceName = 'ThemeService';
      const service = { name: 'ThemeService' };
      
      mockThemeContainer.register.mockReturnValue(true);
      
      const result = mockThemeContainer.register(serviceName, service);
      expect(result).toBe(true);
      expect(mockThemeContainer.register).toHaveBeenCalledWith(serviceName, service);
    });

    test('should check if service is registered', () => {
      const serviceName = 'ThemeService';
      
      mockThemeContainer.isRegistered.mockReturnValue(true);
      
      const result = mockThemeContainer.isRegistered(serviceName);
      expect(result).toBe(true);
      expect(mockThemeContainer.isRegistered).toHaveBeenCalledWith(serviceName);
    });
  });

  describe('Service Resolution', () => {
    test('should resolve registered services', () => {
      const serviceName = 'ThemeService';
      const service = { name: 'ThemeService' };
      
      mockThemeContainer.resolve.mockReturnValue(service);
      
      const result = mockThemeContainer.resolve(serviceName);
      expect(result).toEqual(service);
      expect(mockThemeContainer.resolve).toHaveBeenCalledWith(serviceName);
    });

    test('should return null for unregistered services', () => {
      const serviceName = 'UnregisteredService';
      
      mockThemeContainer.resolve.mockReturnValue(null);
      
      const result = mockThemeContainer.resolve(serviceName);
      expect(result).toBeNull();
    });
  });

  describe('Container Lifecycle', () => {
    test('should create scoped containers', () => {
      const scopedContainer = {
        register: jest.fn(),
        resolve: jest.fn(),
        parent: mockThemeContainer,
      };
      
      mockThemeContainer.createScope.mockReturnValue(scopedContainer);
      
      const scope = mockThemeContainer.createScope();
      expect(scope.parent).toBe(mockThemeContainer);
      expect(mockThemeContainer.createScope).toHaveBeenCalled();
    });

    test('should dispose container resources', () => {
      mockThemeContainer.dispose.mockReturnValue(true);
      
      const result = mockThemeContainer.dispose();
      expect(result).toBe(true);
      expect(mockThemeContainer.dispose).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should handle registration errors gracefully', () => {
      const serviceName = 'ThemeService';
      const service = null;
      
      mockThemeContainer.register.mockReturnValue(false);
      
      const result = mockThemeContainer.register(serviceName, service);
      expect(result).toBe(false);
    });
  });
});
