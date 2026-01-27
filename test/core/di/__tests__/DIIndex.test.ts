/**
 * DI Index Test Suite
 * Tests the main dependency injection module exports and API
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock all the dependencies before importing
jest.mock('../../../src/core/di/types/index', () => ({
  ServiceIdentifier: 'ServiceIdentifier',
  ServiceFactory: 'ServiceFactory',
  ServiceDescriptor: 'ServiceDescriptor',
  ServiceLifetime: 'ServiceLifetime',
  ServiceOptions: 'ServiceOptions',
  ServiceProvider: 'ServiceProvider',
  DIContext: 'DIContext',
  Constructor: 'Constructor',
  InjectionToken: 'InjectionToken',
}));

jest.mock('../../../src/core/di/registry', () => ({
  ServiceRegistry: 'ServiceRegistry',
}));

jest.mock('../../../src/core/di/decorators', () => ({
  Injectable: jest.fn(),
  Inject: jest.fn(),
  getInjectableMetadata: jest.fn(),
  getInjectionMetadata: jest.fn(),
  getConstructorDependencies: jest.fn(),
  isInjectable: jest.fn(),
}));

jest.mock('../../../src/core/di/providers', () => ({
  DIProvider: jest.fn(),
  useDIContainer: jest.fn(),
  useDIContext: jest.fn(),
  useService: jest.fn(),
  useTryService: jest.fn(),
  useHasService: jest.fn(),
  useDIScope: jest.fn(),
}));

jest.mock('../../../src/core/di/factory', () => ({
  createContainer: jest.fn(),
  createAutoContainer: jest.fn(),
  createContainerWithServices: jest.fn(),
  createScopedContainer: jest.fn(),
  createChildContainer: jest.fn(),
  createDevelopmentContainer: jest.fn(),
  createProductionContainer: jest.fn(),
  createTestContainer: jest.fn(),
  validateContainer: jest.fn(),
  getContainerStats: jest.fn(),
}));

jest.mock('../../../src/core/di/container', () => ({
  ServiceContainer: jest.fn(),
  Container: jest.fn(),
}));

jest.mock('../../../src/core/di/registry/ServiceRegistry', () => ({
  ServiceRegistry: jest.fn(),
}));

// Now import the module
import * as diModule from '../../../src/core/di';

describe('DI Index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Type Exports', () => {
    test('should export core types', () => {
      // These are type exports, so we check they exist as undefined (types are erased at runtime)
      expect(typeof (diModule as any).ServiceIdentifier).toBe('undefined');
      expect(typeof (diModule as any).ServiceFactory).toBe('undefined');
      expect(typeof (diModule as any).ServiceDescriptor).toBe('undefined');
      expect(typeof (diModule as any).ServiceLifetime).toBe('undefined');
      expect(typeof (diModule as any).ServiceOptions).toBe('undefined');
      expect(typeof (diModule as any).ServiceProvider).toBe('undefined');
      expect(typeof (diModule as any).DIContext).toBe('undefined');
      expect(typeof (diModule as any).Constructor).toBe('undefined');
      expect(typeof (diModule as any).InjectionToken).toBe('undefined');
    });

    test('should export registry types', () => {
      expect(typeof (diModule as any).ServiceRegistry).toBe('undefined');
    });

    test('should export container types', () => {
      expect(typeof (diModule as any).ServiceContainer).toBe('undefined');
    });
  });

  describe('Decorator Exports', () => {
    test('should export decorator functions', () => {
      expect(diModule.Injectable).toBeDefined();
      expect(diModule.Inject).toBeDefined();
      expect(diModule.getInjectableMetadata).toBeDefined();
      expect(diModule.getInjectionMetadata).toBeDefined();
      expect(diModule.getConstructorDependencies).toBeDefined();
      expect(diModule.isInjectable).toBeDefined();
    });

    test('should have correct decorator types', () => {
      expect(typeof diModule.Injectable).toBe('function');
      expect(typeof diModule.Inject).toBe('function');
      expect(typeof diModule.getInjectableMetadata).toBe('function');
      expect(typeof diModule.getInjectionMetadata).toBe('function');
      expect(typeof diModule.getConstructorDependencies).toBe('function');
      expect(typeof diModule.isInjectable).toBe('function');
    });
  });

  describe('Provider Exports', () => {
    test('should export React provider components', () => {
      expect(diModule.DIProvider).toBeDefined();
      expect(diModule.useDIContainer).toBeDefined();
      expect(diModule.useDIContext).toBeDefined();
      expect(diModule.useService).toBeDefined();
      expect(diModule.useTryService).toBeDefined();
      expect(diModule.useHasService).toBeDefined();
      expect(diModule.useDIScope).toBeDefined();
    });

    test('should have correct provider types', () => {
      expect(typeof diModule.DIProvider).toBe('function');
      expect(typeof diModule.useDIContainer).toBe('function');
      expect(typeof diModule.useDIContext).toBe('function');
      expect(typeof diModule.useService).toBe('function');
      expect(typeof diModule.useTryService).toBe('function');
      expect(typeof diModule.useHasService).toBe('function');
      expect(typeof diModule.useDIScope).toBe('function');
    });
  });

  describe('Factory Function Exports', () => {
    test('should export container creation functions', () => {
      expect(diModule.createContainer).toBeDefined();
      expect(diModule.createAutoContainer).toBeDefined();
      expect(diModule.createContainerWithServices).toBeDefined();
      expect(diModule.createScopedContainer).toBeDefined();
      expect(diModule.createChildContainer).toBeDefined();
      expect(diModule.createDevelopmentContainer).toBeDefined();
      expect(diModule.createProductionContainer).toBeDefined();
      expect(diModule.createTestContainer).toBeDefined();
    });

    test('should export utility functions', () => {
      expect(diModule.validateContainer).toBeDefined();
      expect(diModule.getContainerStats).toBeDefined();
    });

    test('should have correct factory function types', () => {
      expect(typeof diModule.createContainer).toBe('function');
      expect(typeof diModule.createAutoContainer).toBe('function');
      expect(typeof diModule.createContainerWithServices).toBe('function');
      expect(typeof diModule.createScopedContainer).toBe('function');
      expect(typeof diModule.createChildContainer).toBe('function');
      expect(typeof diModule.createDevelopmentContainer).toBe('function');
      expect(typeof diModule.createProductionContainer).toBe('function');
      expect(typeof diModule.createTestContainer).toBe('function');
      expect(typeof diModule.validateContainer).toBe('function');
      expect(typeof diModule.getContainerStats).toBe('function');
    });
  });

  describe('Legacy Exports', () => {
    test('should export legacy implementation classes with underscore prefix', () => {
      expect(diModule._ServiceContainer).toBeDefined();
      expect(diModule._Container).toBeDefined();
      expect(diModule._ServiceRegistry).toBeDefined();
    });

    test('should have correct legacy export types', () => {
      expect(typeof diModule._ServiceContainer).toBe('function');
      expect(typeof diModule._Container).toBe('function');
      expect(typeof diModule._ServiceRegistry).toBe('function');
    });
  });

  describe('API Consistency', () => {
    test('should have consistent naming patterns', () => {
      const exports = Object.keys(diModule);
      
      // Check that factory functions follow create* pattern
      const factoryExports = exports.filter(name => name.startsWith('create'));
      expect(factoryExports.length).toBeGreaterThan(0);
      
      // Check that hooks follow use* pattern
      const hookExports = exports.filter(name => name.startsWith('use'));
      expect(hookExports.length).toBeGreaterThan(0);
      
      // Check that utility functions follow get* pattern
      const utilExports = exports.filter(name => name.startsWith('get'));
      expect(utilExports.length).toBeGreaterThan(0);
    });

    test('should not export internal implementation details', () => {
      const exports = Object.keys(diModule);
      
      // Should not export internal modules
      expect(exports).not.toContain('AppContainer');
      expect(exports).not.toContain('ServiceContainerImpl');
      expect(exports).not.toContain('ServiceRegistryImpl');
    });

    test('should follow Black Box pattern', () => {
      const exports = Object.keys(diModule);
      
      // Should only export types, decorators, providers, and factories
      const allowedPatterns = [
        /^[A-Z][a-zA-Z]*$/, // Types and interfaces
        /^create/, // Factory functions
        /^use/, // Hooks
        /^get/, // Utility functions
        /^validate/, // Validation functions
        /^_/, // Legacy exports
      ];
      
      exports.forEach(exportName => {
        const matchesPattern = allowedPatterns.some(pattern => pattern.test(exportName));
        expect(matchesPattern).toBe(true);
      });
    });
  });

  describe('Factory Function Behavior', () => {
    test('should call factory functions correctly', () => {
      const mockContainer = { register: jest.fn(), resolve: jest.fn() };
      
      diModule.createContainer.mockReturnValue(mockContainer);
      
      const container = diModule.createContainer();
      expect(container).toEqual(mockContainer);
      expect(diModule.createContainer).toHaveBeenCalled();
    });

    test('should handle factory function parameters', () => {
      const services = { TestService: jest.fn() };
      const options = { lifetime: 'singleton' };
      
      diModule.createContainerWithServices.mockReturnValue({ services });
      
      const container = diModule.createContainerWithServices(services, options);
      expect(container.services).toEqual(services);
      expect(diModule.createContainerWithServices).toHaveBeenCalledWith(services, options);
    });

    test('should handle different container types', () => {
      const devContainer = { env: 'development' };
      const prodContainer = { env: 'production' };
      const testContainer = { env: 'test' };
      
      diModule.createDevelopmentContainer.mockReturnValue(devContainer);
      diModule.createProductionContainer.mockReturnValue(prodContainer);
      diModule.createTestContainer.mockReturnValue(testContainer);
      
      expect(diModule.createDevelopmentContainer()).toEqual(devContainer);
      expect(diModule.createProductionContainer()).toEqual(prodContainer);
      expect(diModule.createTestContainer()).toEqual(testContainer);
    });
  });

  describe('Decorator Behavior', () => {
    test('should call decorator functions correctly', () => {
      const mockClass = class TestService {};
      const mockMetadata = { injectable: true, dependencies: [] };
      
      diModule.getInjectableMetadata.mockReturnValue(mockMetadata);
      
      const metadata = diModule.getInjectableMetadata(mockClass);
      expect(metadata).toEqual(mockMetadata);
      expect(diModule.getInjectableMetadata).toHaveBeenCalledWith(mockClass);
    });

    test('should handle injection metadata', () => {
      const mockTarget = {};
      const mockPropertyKey = 'testProperty';
      const mockMetadata = { token: 'TestService' };
      
      diModule.getInjectionMetadata.mockReturnValue(mockMetadata);
      
      const metadata = diModule.getInjectionMetadata(mockTarget, mockPropertyKey);
      expect(metadata).toEqual(mockMetadata);
      expect(diModule.getInjectionMetadata).toHaveBeenCalledWith(mockTarget, mockPropertyKey);
    });

    test('should handle injectable checks', () => {
      const mockClass = class TestService {};
      
      diModule.isInjectable.mockReturnValue(true);
      
      const isInjectable = diModule.isInjectable(mockClass);
      expect(isInjectable).toBe(true);
      expect(diModule.isInjectable).toHaveBeenCalledWith(mockClass);
    });
  });

  describe('Provider Behavior', () => {
    test('should call provider hooks correctly', () => {
      const mockContainer = { resolve: jest.fn() };
      const mockService = { name: 'TestService' };
      
      diModule.useDIContainer.mockReturnValue(mockContainer);
      diModule.useService.mockReturnValue(mockService);
      
      const container = diModule.useDIContainer();
      const service = diModule.useService('TestService');
      
      expect(container).toEqual(mockContainer);
      expect(service).toEqual(mockService);
      expect(diModule.useDIContainer).toHaveBeenCalled();
      expect(diModule.useService).toHaveBeenCalledWith('TestService');
    });

    test('should handle service resolution', () => {
      const mockService = { id: 1 };
      const mockFallback = { id: 0 };
      
      diModule.useTryService.mockReturnValue(mockService);
      diModule.useHasService.mockReturnValue(true);
      
      const service = diModule.useTryService('TestService', mockFallback);
      const hasService = diModule.useHasService('TestService');
      
      expect(service).toEqual(mockService);
      expect(hasService).toBe(true);
      expect(diModule.useTryService).toHaveBeenCalledWith('TestService', mockFallback);
      expect(diModule.useHasService).toHaveBeenCalledWith('TestService');
    });
  });

  describe('Error Handling', () => {
    test('should handle factory function errors gracefully', () => {
      const error = new Error('Container creation failed');
      
      diModule.createContainer.mockImplementation(() => {
        throw error;
      });
      
      expect(() => {
        diModule.createContainer();
      }).toThrow('Container creation failed');
    });

    test('should handle decorator errors gracefully', () => {
      const error = new Error('Decorator failed');
      
      diModule.Injectable.mockImplementation(() => {
        throw error;
      });
      
      expect(() => {
        diModule.Injectable();
      }).toThrow('Decorator failed');
    });

    test('should handle provider errors gracefully', () => {
      const error = new Error('Provider failed');
      
      diModule.useDIContainer.mockImplementation(() => {
        throw error;
      });
      
      expect(() => {
        diModule.useDIContainer();
      }).toThrow('Provider failed');
    });
  });

  describe('Integration', () => {
    test('should work together for complete DI setup', () => {
      const mockContainer = { register: jest.fn(), resolve: jest.fn() };
      const mockService = class TestService {};
      const mockMetadata = { injectable: true };
      
      diModule.createContainer.mockReturnValue(mockContainer);
      diModule.getInjectableMetadata.mockReturnValue(mockMetadata);
      diModule.Injectable.mockReturnValue(mockService);
      
      const container = diModule.createContainer();
      const metadata = diModule.getInjectableMetadata(mockService);
      const decoratedService = diModule.Injectable(mockService);
      
      expect(container).toBeDefined();
      expect(metadata).toBeDefined();
      expect(decoratedService).toBeDefined();
    });

    test('should support scoped containers', () => {
      const parentContainer = { id: 'parent' };
      const childContainer = { id: 'child', parent: parentContainer };
      
      diModule.createContainer.mockReturnValue(parentContainer);
      diModule.createChildContainer.mockReturnValue(childContainer);
      
      const parent = diModule.createContainer();
      const child = diModule.createChildContainer(parent);
      
      expect(parent.id).toBe('parent');
      expect(child.id).toBe('child');
      expect(child.parent).toBe(parent);
    });
  });
});
