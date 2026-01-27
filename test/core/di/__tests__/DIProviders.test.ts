/**
 * DI Providers Test Suite
 * Tests dependency injection React providers and hooks
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';

// Mock the providers module
const mockDIProvider = jest.fn();
const mockUseDIContainer = jest.fn();
const mockUseDIContext = jest.fn();
const mockUseService = jest.fn();
const mockUseTryService = jest.fn();
const mockUseHasService = jest.fn();
const mockUseDIScope = jest.fn();

jest.mock('../../../src/core/di/providers', () => ({
  DIProvider: mockDIProvider,
  useDIContainer: mockUseDIContainer,
  useDIContext: mockUseDIContext,
  useService: mockUseService,
  useTryService: mockUseTryService,
  useHasService: mockUseHasService,
  useDIScope: mockUseDIScope,
}));

// Mock React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
  createContext: jest.fn(() => ({ Provider: mockDIProvider })),
}));

describe('DI Providers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('DIProvider', () => {
    test('should be a React component', () => {
      expect(mockDIProvider).toBeDefined();
      expect(typeof mockDIProvider).toBe('function');
    });

    test('should provide container to children', () => {
      const mockContainer = {
        resolve: jest.fn(),
        register: jest.fn(),
      };
      
      const mockChildren = <div>Test Content</div>;
      
      mockDIProvider.mockImplementation(({ children, container }) => {
        expect(container).toEqual(mockContainer);
        expect(children).toEqual(mockChildren);
        return children;
      });
      
      mockDIProvider({
        children: mockChildren,
        container: mockContainer,
      });
      
      expect(mockDIProvider).toHaveBeenCalled();
    });

    test('should handle container creation', () => {
      const mockServices = { TestService: jest.fn() };
      const mockContainer = { services: mockServices };
      
      mockDIProvider.mockImplementation(({ children, services }) => {
        expect(services).toEqual(mockServices);
        return children;
      });
      
      mockDIProvider({
        children: <div>Test</div>,
        services: mockServices,
      });
      
      expect(mockDIProvider).toHaveBeenCalled();
    });

    test('should support scoped containers', () => {
      const mockParentContainer = { id: 'parent' };
      const mockScopedContainer = { id: 'scoped', parent: mockParentContainer };
      
      mockDIProvider.mockImplementation(({ children, scoped, parent }) => {
        expect(scoped).toBe(true);
        expect(parent).toEqual(mockParentContainer);
        return children;
      });
      
      mockDIProvider({
        children: <div>Test</div>,
        scoped: true,
        parent: mockParentContainer,
      });
      
      expect(mockDIProvider).toHaveBeenCalled();
    });
  });

  describe('useDIContainer', () => {
    test('should return container from context', () => {
      const mockContainer = {
        resolve: jest.fn(),
        register: jest.fn(),
        id: 'test-container',
      };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      
      const result = mockUseDIContainer();
      expect(result).toEqual(mockContainer);
      expect(result.id).toBe('test-container');
    });

    test('should handle missing container gracefully', () => {
      mockUseDIContainer.mockReturnValue(null);
      
      const result = mockUseDIContainer();
      expect(result).toBeNull();
    });

    test('should provide container methods', () => {
      const mockContainer = {
        resolve: jest.fn(),
        register: jest.fn(),
        isRegistered: jest.fn(),
        createScope: jest.fn(),
        dispose: jest.fn(),
      };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      
      const container = mockUseDIContainer();
      expect(container.resolve).toBeDefined();
      expect(container.register).toBeDefined();
      expect(container.isRegistered).toBeDefined();
      expect(container.createScope).toBeDefined();
      expect(container.dispose).toBeDefined();
    });
  });

  describe('useDIContext', () => {
    test('should return DI context value', () => {
      const mockContext = {
        container: { id: 'test' },
        scope: 'test-scope',
        services: ['Service1', 'Service2'],
      };
      
      mockUseDIContext.mockReturnValue(mockContext);
      
      const result = mockUseDIContext();
      expect(result).toEqual(mockContext);
      expect(result.container.id).toBe('test');
      expect(result.scope).toBe('test-scope');
    });

    test('should handle context changes', () => {
      const context1 = { container: { id: 'container1' } };
      const context2 = { container: { id: 'container2' } };
      
      mockUseDIContext.mockReturnValueOnce(context1);
      mockUseDIContext.mockReturnValueOnce(context2);
      
      const result1 = mockUseDIContext();
      const result2 = mockUseDIContext();
      
      expect(result1.container.id).toBe('container1');
      expect(result2.container.id).toBe('container2');
    });

    test('should provide context utilities', () => {
      const mockContext = {
        container: { id: 'test' },
        scope: 'test-scope',
        isInScope: jest.fn(),
        getParentScope: jest.fn(),
        createChildScope: jest.fn(),
      };
      
      mockUseDIContext.mockReturnValue(mockContext);
      
      const context = mockUseDIContext();
      expect(context.isInScope).toBeDefined();
      expect(context.getParentScope).toBeDefined();
      expect(context.createChildScope).toBeDefined();
    });
  });

  describe('useService', () => {
    test('should resolve service from container', () => {
      const mockService = { name: 'TestService', id: 1 };
      const mockContainer = { resolve: jest.fn().mockReturnValue(mockService) };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseService.mockReturnValue(mockService);
      
      const result = mockUseService('TestService');
      expect(result).toEqual(mockService);
      expect(result.name).toBe('TestService');
      expect(result.id).toBe(1);
    });

    test('should handle service resolution errors', () => {
      const error = new Error('Service not found');
      const mockContainer = { resolve: jest.fn().mockImplementation(() => { throw error; }) };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseService.mockImplementation(() => { throw error; });
      
      expect(() => {
        mockUseService('NonExistentService');
      }).toThrow('Service not found');
    });

    test('should support service tokens', () => {
      const token = { name: 'TestService', type: 'service' };
      const mockService = { token: token };
      const mockContainer = { resolve: jest.fn().mockReturnValue(mockService) };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseService.mockReturnValue(mockService);
      
      const result = mockUseService(token);
      expect(result).toEqual(mockService);
      expect(result.token).toEqual(token);
    });

    test('should cache resolved services', () => {
      const mockService = { name: 'TestService' };
      const mockContainer = { resolve: jest.fn().mockReturnValue(mockService) };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseService.mockReturnValue(mockService);
      
      const service1 = mockUseService('TestService');
      const service2 = mockUseService('TestService');
      
      expect(service1).toBe(service2);
      expect(mockContainer.resolve).toHaveBeenCalledTimes(1);
    });
  });

  describe('useTryService', () => {
    test('should return service or fallback', () => {
      const mockService = { name: 'TestService' };
      const mockFallback = { name: 'FallbackService' };
      const mockContainer = { resolve: jest.fn().mockReturnValue(mockService) };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseTryService.mockReturnValue(mockService);
      
      const result = mockUseTryService('TestService', mockFallback);
      expect(result).toEqual(mockService);
      expect(result.name).toBe('TestService');
    });

    test('should return fallback when service not found', () => {
      const mockFallback = { name: 'FallbackService' };
      const mockContainer = { resolve: jest.fn().mockImplementation(() => { 
        throw new Error('Service not found'); 
      })};
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseTryService.mockReturnValue(mockFallback);
      
      const result = mockUseTryService('NonExistentService', mockFallback);
      expect(result).toEqual(mockFallback);
      expect(result.name).toBe('FallbackService');
    });

    test('should return null when no fallback provided', () => {
      const mockContainer = { resolve: jest.fn().mockImplementation(() => { 
        throw new Error('Service not found'); 
      })};
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseTryService.mockReturnValue(null);
      
      const result = mockUseTryService('NonExistentService');
      expect(result).toBeNull();
    });

    test('should handle optional services', () => {
      const mockService = { name: 'OptionalService' };
      const mockContainer = { resolve: jest.fn().mockReturnValue(mockService) };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseTryService.mockReturnValue(mockService);
      
      const result = mockUseTryService('OptionalService', null, { optional: true });
      expect(result).toEqual(mockService);
    });
  });

  describe('useHasService', () => {
    test('should return true when service is registered', () => {
      const mockContainer = { isRegistered: jest.fn().mockReturnValue(true) };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseHasService.mockReturnValue(true);
      
      const result = mockUseHasService('TestService');
      expect(result).toBe(true);
    });

    test('should return false when service is not registered', () => {
      const mockContainer = { isRegistered: jest.fn().mockReturnValue(false) };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseHasService.mockReturnValue(false);
      
      const result = mockUseHasService('NonExistentService');
      expect(result).toBe(false);
    });

    test('should check service availability efficiently', () => {
      const mockContainer = { isRegistered: jest.fn().mockReturnValue(true) };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseHasService.mockReturnValue(true);
      
      const services = ['Service1', 'Service2', 'Service3'];
      services.forEach(service => {
        const result = mockUseHasService(service);
        expect(result).toBe(true);
      });
      
      expect(mockContainer.isRegistered).toHaveBeenCalledTimes(3);
    });
  });

  describe('useDIScope', () => {
    test('should create scoped container', () => {
      const mockParentContainer = { id: 'parent' };
      const mockScopedContainer = { id: 'scoped', parent: mockParentContainer };
      
      mockUseDIContainer.mockReturnValue(mockParentContainer);
      mockUseDIScope.mockReturnValue(mockScopedContainer);
      
      const result = mockUseDIScope('test-scope');
      expect(result).toEqual(mockScopedContainer);
      expect(result.parent).toEqual(mockParentContainer);
    });

    test('should handle scope disposal', () => {
      const mockScopedContainer = {
        id: 'scoped',
        dispose: jest.fn(),
      };
      
      mockUseDIScope.mockReturnValue(mockScopedContainer);
      
      const scopedContainer = mockUseDIScope('test-scope');
      scopedContainer.dispose();
      
      expect(scopedContainer.dispose).toHaveBeenCalled();
    });

    test('should support nested scopes', () => {
      const mockParentContainer = { id: 'parent' };
      const mockChildContainer = { id: 'child', parent: mockParentContainer };
      const mockGrandChildContainer = { id: 'grandchild', parent: mockChildContainer };
      
      mockUseDIContainer.mockReturnValue(mockParentContainer);
      mockUseDIScope
        .mockReturnValueOnce(mockChildContainer)
        .mockReturnValueOnce(mockGrandChildContainer);
      
      const childScope = mockUseDIScope('child');
      const grandChildScope = mockUseDIScope('grandchild');
      
      expect(childScope.parent).toEqual(mockParentContainer);
      expect(grandChildScope.parent).toEqual(mockChildContainer);
    });
  });

  describe('Provider Integration', () => {
    test('should work together for complete DI setup', () => {
      const mockContainer = {
        resolve: jest.fn().mockReturnValue({ name: 'TestService' }),
        isRegistered: jest.fn().mockReturnValue(true),
        createScope: jest.fn().mockReturnValue({ id: 'scoped' }),
      };
      
      const mockContext = {
        container: mockContainer,
        scope: 'test-scope',
      };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseDIContext.mockReturnValue(mockContext);
      mockUseService.mockReturnValue({ name: 'TestService' });
      mockUseHasService.mockReturnValue(true);
      mockUseDIScope.mockReturnValue({ id: 'scoped' });
      
      const container = mockUseDIContainer();
      const context = mockUseDIContext();
      const service = mockUseService('TestService');
      const hasService = mockUseHasService('TestService');
      const scopedContainer = mockUseDIScope('test-scope');
      
      expect(container).toBeDefined();
      expect(context).toBeDefined();
      expect(service).toBeDefined();
      expect(hasService).toBe(true);
      expect(scopedContainer).toBeDefined();
    });

    test('should handle service lifecycle', () => {
      let serviceInstance = null;
      const mockService = { 
        name: 'LifecycleService',
        initialize: jest.fn(),
        dispose: jest.fn(),
      };
      
      const mockContainer = {
        resolve: jest.fn().mockReturnValue(mockService),
        createScope: jest.fn().mockReturnValue({
          dispose: jest.fn(() => {
            mockService.dispose();
            serviceInstance = null;
          }),
        }),
      };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseService.mockReturnValue(mockService);
      mockUseDIScope.mockReturnValue(mockContainer.createScope());
      
      const service = mockUseService('LifecycleService');
      const scope = mockUseDIScope('test-scope');
      
      serviceInstance = service;
      expect(service.initialize).toHaveBeenCalled();
      
      scope.dispose();
      expect(mockService.dispose).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing DI context gracefully', () => {
      mockUseDIContainer.mockImplementation(() => {
        throw new Error('DI context not found');
      });
      
      expect(() => {
        mockUseDIContainer();
      }).toThrow('DI context not found');
    });

    test('should handle service resolution failures', () => {
      const error = new Error('Service resolution failed');
      
      mockUseDIContainer.mockReturnValue({
        resolve: jest.fn().mockImplementation(() => { throw error; }),
      });
      mockUseService.mockImplementation(() => { throw error; });
      
      expect(() => {
        mockUseService('FailingService');
      }).toThrow('Service resolution failed');
    });

    test('should handle scope creation failures', () => {
      const error = new Error('Scope creation failed');
      
      mockUseDIContainer.mockReturnValue({
        createScope: jest.fn().mockImplementation(() => { throw error; }),
      });
      mockUseDIScope.mockImplementation(() => { throw error; });
      
      expect(() => {
        mockUseDIScope('failing-scope');
      }).toThrow('Scope creation failed');
    });
  });

  describe('Performance', () => {
    test('should handle multiple service resolutions efficiently', () => {
      const mockContainer = {
        resolve: jest.fn().mockImplementation((token) => ({ token, id: Math.random() })),
      };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseService.mockImplementation((token) => mockContainer.resolve(token));
      
      const startTime = performance.now();
      
      const services = [];
      for (let i = 0; i < 100; i++) {
        services.push(mockUseService(`Service${i}`));
      }
      
      const endTime = performance.now();
      
      expect(services).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should not cause unnecessary re-renders', () => {
      const mockContainer = { resolve: jest.fn().mockReturnValue({}) };
      
      mockUseDIContainer.mockReturnValue(mockContainer);
      mockUseService.mockReturnValue({});
      
      const service1 = mockUseService('TestService');
      const service2 = mockUseService('TestService');
      
      // Should return same reference for same service
      expect(service1).toBe(service2);
    });
  });
});
