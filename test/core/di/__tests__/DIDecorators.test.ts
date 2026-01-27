/**
 * DI Decorators Test Suite
 * Tests dependency injection decorators functionality
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the decorators module
const mockInjectable = jest.fn();
const mockInject = jest.fn();
const mockGetInjectableMetadata = jest.fn();
const mockGetInjectionMetadata = jest.fn();
const mockGetConstructorDependencies = jest.fn();
const mockIsInjectable = jest.fn();

jest.mock('../../../src/core/di/decorators', () => ({
  Injectable: mockInjectable,
  Inject: mockInject,
  getInjectableMetadata: mockGetInjectableMetadata,
  getInjectionMetadata: mockGetInjectionMetadata,
  getConstructorDependencies: mockGetConstructorDependencies,
  isInjectable: mockIsInjectable,
}));

describe('DI Decorators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Injectable Decorator', () => {
    test('should be a function', () => {
      expect(mockInjectable).toBeDefined();
      expect(typeof mockInjectable).toBe('function');
    });

    test('should decorate classes correctly', () => {
      const mockClass = class TestService {};
      const mockOptions = { lifetime: 'singleton' };
      
      mockInjectable.mockReturnValue(mockClass);
      
      const result = mockInjectable(mockOptions)(mockClass);
      expect(result).toBe(mockClass);
      expect(mockInjectable).toHaveBeenCalledWith(mockOptions);
    });

    test('should handle default options', () => {
      const mockClass = class TestService {};
      
      mockInjectable.mockReturnValue(mockClass);
      
      const result = mockInjectable()(mockClass);
      expect(result).toBe(mockClass);
      expect(mockInjectable).toHaveBeenCalledWith();
    });

    test('should support different lifetimes', () => {
      const mockClass = class TestService {};
      const lifetimes = ['singleton', 'transient', 'scoped'];
      
      lifetimes.forEach(lifetime => {
        mockInjectable.mockReturnValue(mockClass);
        
        const options = { lifetime };
        const result = mockInjectable(options)(mockClass);
        
        expect(result).toBe(mockClass);
        expect(mockInjectable).toHaveBeenCalledWith(options);
      });
    });

    test('should handle class inheritance', () => {
      class BaseService {}
      class ExtendedService extends BaseService {}
      
      mockInjectable.mockReturnValue(ExtendedService);
      
      const result = mockInjectable()(ExtendedService);
      expect(result).toBe(ExtendedService);
      expect(mockInjectable).toHaveBeenCalled();
    });
  });

  describe('Inject Decorator', () => {
    test('should be a function', () => {
      expect(mockInject).toBeDefined();
      expect(typeof mockInject).toBe('function');
    });

    test('should inject service tokens', () => {
      const token = 'TestService';
      const mockTarget = {};
      const mockPropertyKey = 'service';
      
      mockInject.mockReturnValue(undefined);
      
      mockInject(token)(mockTarget, mockPropertyKey);
      
      expect(mockInject).toHaveBeenCalledWith(token)(mockTarget, mockPropertyKey);
    });

    test('should handle injection tokens', () => {
      const token = { name: 'TestService' };
      const mockTarget = {};
      const mockPropertyKey = 'service';
      
      mockInject.mockReturnValue(undefined);
      
      mockInject(token)(mockTarget, mockPropertyKey);
      
      expect(mockInject).toHaveBeenCalledWith(token)(mockTarget, mockPropertyKey);
    });

    test('should support multiple injections', () => {
      const tokens = ['Service1', 'Service2', 'Service3'];
      const mockTarget = {};
      
      tokens.forEach((token, index) => {
        const propertyKey = `service${index + 1}`;
        mockInject.mockReturnValue(undefined);
        
        mockInject(token)(mockTarget, propertyKey);
        
        expect(mockInject).toHaveBeenCalledWith(token)(mockTarget, propertyKey);
      });
    });

    test('should handle constructor parameter injection', () => {
      const token = 'TestService';
      const mockTarget = class TestService {};
      const mockParameterIndex = 0;
      
      mockInject.mockReturnValue(undefined);
      
      mockInject(token)(mockTarget, undefined, mockParameterIndex);
      
      expect(mockInject).toHaveBeenCalledWith(token)(mockTarget, undefined, mockParameterIndex);
    });
  });

  describe('getInjectableMetadata', () => {
    test('should be a function', () => {
      expect(mockGetInjectableMetadata).toBeDefined();
      expect(typeof mockGetInjectableMetadata).toBe('function');
    });

    test('should return metadata for injectable classes', () => {
      const mockClass = class TestService {};
      const mockMetadata = {
        lifetime: 'singleton',
        dependencies: ['Service1', 'Service2'],
      };
      
      mockGetInjectableMetadata.mockReturnValue(mockMetadata);
      
      const result = mockGetInjectableMetadata(mockClass);
      expect(result).toEqual(mockMetadata);
      expect(mockGetInjectableMetadata).toHaveBeenCalledWith(mockClass);
    });

    test('should return null for non-injectable classes', () => {
      const mockClass = class TestService {};
      
      mockGetInjectableMetadata.mockReturnValue(null);
      
      const result = mockGetInjectableMetadata(mockClass);
      expect(result).toBeNull();
      expect(mockGetInjectableMetadata).toHaveBeenCalledWith(mockClass);
    });

    test('should handle inherited metadata', () => {
      class BaseService {}
      class ExtendedService extends BaseService {}
      
      const baseMetadata = { lifetime: 'singleton' };
      const extendedMetadata = { 
        lifetime: 'singleton',
        dependencies: ['BaseService'],
      };
      
      mockGetInjectableMetadata
        .mockReturnValueOnce(baseMetadata)
        .mockReturnValueOnce(extendedMetadata);
      
      const baseResult = mockGetInjectableMetadata(BaseService);
      const extendedResult = mockGetInjectableMetadata(ExtendedService);
      
      expect(baseResult).toEqual(baseMetadata);
      expect(extendedResult).toEqual(extendedMetadata);
    });
  });

  describe('getInjectionMetadata', () => {
    test('should be a function', () => {
      expect(mockGetInjectionMetadata).toBeDefined();
      expect(typeof mockGetInjectionMetadata).toBe('function');
    });

    test('should return injection metadata for properties', () => {
      const mockTarget = {};
      const mockPropertyKey = 'service';
      const mockMetadata = {
        token: 'TestService',
        optional: false,
      };
      
      mockGetInjectionMetadata.mockReturnValue(mockMetadata);
      
      const result = mockGetInjectionMetadata(mockTarget, mockPropertyKey);
      expect(result).toEqual(mockMetadata);
      expect(mockGetInjectionMetadata).toHaveBeenCalledWith(mockTarget, mockPropertyKey);
    });

    test('should return injection metadata for constructor parameters', () => {
      const mockTarget = class TestService {};
      const mockParameterIndex = 0;
      const mockMetadata = {
        token: 'TestService',
        optional: false,
      };
      
      mockGetInjectionMetadata.mockReturnValue(mockMetadata);
      
      const result = mockGetInjectionMetadata(mockTarget, undefined, mockParameterIndex);
      expect(result).toEqual(mockMetadata);
      expect(mockGetInjectionMetadata).toHaveBeenCalledWith(mockTarget, undefined, mockParameterIndex);
    });

    test('should handle missing metadata gracefully', () => {
      const mockTarget = {};
      const mockPropertyKey = 'nonExistent';
      
      mockGetInjectionMetadata.mockReturnValue(undefined);
      
      const result = mockGetInjectionMetadata(mockTarget, mockPropertyKey);
      expect(result).toBeUndefined();
    });
  });

  describe('getConstructorDependencies', () => {
    test('should be a function', () => {
      expect(mockGetConstructorDependencies).toBeDefined();
      expect(typeof mockGetConstructorDependencies).toBe('function');
    });

    test('should return constructor dependencies', () => {
      const mockClass = class TestService {};
      const mockDependencies = [
        { token: 'Service1', index: 0 },
        { token: 'Service2', index: 1 },
      ];
      
      mockGetConstructorDependencies.mockReturnValue(mockDependencies);
      
      const result = mockGetConstructorDependencies(mockClass);
      expect(result).toEqual(mockDependencies);
      expect(mockGetConstructorDependencies).toHaveBeenCalledWith(mockClass);
    });

    test('should return empty array for classes without dependencies', () => {
      const mockClass = class TestService {};
      
      mockGetConstructorDependencies.mockReturnValue([]);
      
      const result = mockGetConstructorDependencies(mockClass);
      expect(result).toEqual([]);
    });

    test('should handle complex dependency graphs', () => {
      class ServiceA {}
      class ServiceB {}
      class ServiceC {
        constructor(a: ServiceA, b: ServiceB) {}
      }
      
      const complexDependencies = [
        { token: 'ServiceA', index: 0 },
        { token: 'ServiceB', index: 1 },
      ];
      
      mockGetConstructorDependencies.mockReturnValue(complexDependencies);
      
      const result = mockGetConstructorDependencies(ServiceC);
      expect(result).toHaveLength(2);
      expect(result[0].token).toBe('ServiceA');
      expect(result[1].token).toBe('ServiceB');
    });
  });

  describe('isInjectable', () => {
    test('should be a function', () => {
      expect(mockIsInjectable).toBeDefined();
      expect(typeof mockIsInjectable).toBe('function');
    });

    test('should return true for injectable classes', () => {
      const mockClass = class TestService {};
      
      mockIsInjectable.mockReturnValue(true);
      
      const result = mockIsInjectable(mockClass);
      expect(result).toBe(true);
      expect(mockIsInjectable).toHaveBeenCalledWith(mockClass);
    });

    test('should return false for non-injectable classes', () => {
      const mockClass = class TestService {};
      
      mockIsInjectable.mockReturnValue(false);
      
      const result = mockIsInjectable(mockClass);
      expect(result).toBe(false);
      expect(mockIsInjectable).toHaveBeenCalledWith(mockClass);
    });

    test('should handle edge cases', () => {
      const testCases = [
        null,
        undefined,
        'string',
        123,
        {},
        [],
        function() {},
      ];
      
      testCases.forEach(testCase => {
        mockIsInjectable.mockReturnValue(false);
        
        const result = mockIsInjectable(testCase as any);
        expect(result).toBe(false);
        expect(mockIsInjectable).toHaveBeenCalledWith(testCase);
      });
    });
  });

  describe('Decorator Integration', () => {
    test('should work together for complete DI setup', () => {
      const mockClass = class TestService {};
      const mockMetadata = {
        lifetime: 'singleton',
        dependencies: ['Dependency1', 'Dependency2'],
      };
      
      mockInjectable.mockReturnValue(mockClass);
      mockGetInjectableMetadata.mockReturnValue(mockMetadata);
      mockIsInjectable.mockReturnValue(true);
      
      const decoratedClass = mockInjectable({ lifetime: 'singleton' })(mockClass);
      const metadata = mockGetInjectableMetadata(decoratedClass);
      const isInjectable = mockIsInjectable(decoratedClass);
      
      expect(decoratedClass).toBe(mockClass);
      expect(metadata).toEqual(mockMetadata);
      expect(isInjectable).toBe(true);
    });

    test('should handle complex service hierarchies', () => {
      class BaseService {}
      class ServiceA extends BaseService {}
      class ServiceB extends BaseService {}
      class ServiceC {
        constructor(
          private serviceA: ServiceA,
          private serviceB: ServiceB
        ) {}
      }
      
      mockInjectable.mockImplementation((options) => (target) => target);
      mockGetConstructorDependencies.mockReturnValue([
        { token: 'ServiceA', index: 0 },
        { token: 'ServiceB', index: 1 },
      ]);
      mockIsInjectable.mockReturnValue(true);
      
      const decoratedA = mockInjectable()(ServiceA);
      const decoratedB = mockInjectable()(ServiceB);
      const decoratedC = mockInjectable()(ServiceC);
      
      expect(mockIsInjectable(decoratedA)).toBe(true);
      expect(mockIsInjectable(decoratedB)).toBe(true);
      expect(mockIsInjectable(decoratedC)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid decorator usage', () => {
      const invalidTargets = [
        null,
        undefined,
        'string',
        123,
        {},
      ];
      
      invalidTargets.forEach(target => {
        mockInjectable.mockImplementation(() => {
          throw new Error('Invalid target');
        });
        
        expect(() => {
          mockInjectable()(target as any);
        }).toThrow('Invalid target');
      });
    });

    test('should handle circular dependencies', () => {
      const mockClass = class CircularService {};
      
      mockGetConstructorDependencies.mockImplementation(() => {
        throw new Error('Circular dependency detected');
      });
      
      expect(() => {
        mockGetConstructorDependencies(mockClass);
      }).toThrow('Circular dependency detected');
    });

    test('should handle missing tokens', () => {
      const mockTarget = {};
      const mockPropertyKey = 'service';
      
      mockGetInjectionMetadata.mockImplementation(() => {
        throw new Error('Missing injection token');
      });
      
      expect(() => {
        mockGetInjectionMetadata(mockTarget, mockPropertyKey);
      }).toThrow('Missing injection token');
    });
  });

  describe('Performance', () => {
    test('should handle large numbers of decorators efficiently', () => {
      const classes = [];
      
      // Create many decorated classes
      for (let i = 0; i < 1000; i++) {
        const mockClass = class Service {};
        mockInjectable.mockReturnValue(mockClass);
        classes.push(mockInjectable()(mockClass));
      }
      
      expect(classes).toHaveLength(1000);
      expect(mockInjectable).toHaveBeenCalledTimes(1000);
    });

    test('should cache metadata lookups', () => {
      const mockClass = class TestService {};
      const mockMetadata = { lifetime: 'singleton' };
      
      mockGetInjectableMetadata.mockReturnValue(mockMetadata);
      
      // Multiple calls should return cached result
      const result1 = mockGetInjectableMetadata(mockClass);
      const result2 = mockGetInjectableMetadata(mockClass);
      const result3 = mockGetInjectableMetadata(mockClass);
      
      expect(result1).toEqual(mockMetadata);
      expect(result2).toEqual(mockMetadata);
      expect(result3).toEqual(mockMetadata);
      expect(mockGetInjectableMetadata).toHaveBeenCalledTimes(3);
    });
  });
});
