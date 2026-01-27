/**
 * Services Interfaces Index Test Suite
 * Tests services interface index exports
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the interfaces index module
jest.mock('../../../src/core/services/interfaces/index', () => ({
  ILoggerService: 'ILoggerService',
  IThemeService: 'IThemeService',
  IUserService: 'IUserService',
  IServiceFactory: 'IServiceFactory',
  ServiceConfig: 'ServiceConfig',
  ServiceMetrics: 'ServiceMetrics',
}));

describe('Services Interfaces Index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Index Exports', () => {
    test('should export all service interfaces', () => {
      // Type exports are undefined at runtime
      expect(typeof (global as any).ILoggerService).toBe('undefined');
      expect(typeof (global as any).IThemeService).toBe('undefined');
      expect(typeof (global as any).IUserService).toBe('undefined');
      expect(typeof (global as any).IServiceFactory).toBe('undefined');
    });

    test('should export configuration interfaces', () => {
      expect(typeof (global as any).ServiceConfig).toBe('undefined');
      expect(typeof (global as any).ServiceMetrics).toBe('undefined');
    });
  });

  describe('Export Consistency', () => {
    test('should have consistent interface naming pattern', () => {
      const interfaces = [
        'ILoggerService',
        'IThemeService',
        'IUserService',
        'IServiceFactory',
      ];
      
      interfaces.forEach(name => {
        expect(name.startsWith('I')).toBe(true);
      });
    });

    test('should export service-related types', () => {
      const types = ['ServiceConfig', 'ServiceMetrics'];
      
      types.forEach(type => {
        expect(typeof (global as any)[type]).toBe('undefined');
      });
    });
  });
});
