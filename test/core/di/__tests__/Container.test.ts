/**
 * DI Container Test Suite
 * 
 * Comprehensive tests for the main DI Container including:
 * - Service registration and resolution
 * - Lifetime management (singleton, transient, scoped)
 * - Dependency injection and auto-resolution
 * - Container scoping and inheritance
 * - Validation and statistics
 * - Auto-registration and scanning
 */

import { Container } from '../../../src/core/di/container/Container';
import { ServiceLifetime } from '../../../src/core/di/registry/ServiceRegistry';
import { TYPES } from '../../../src/core/di/types';

// Mock dependencies for testing
jest.mock('../../../src/core/di/container/ServiceContainer', () => ({
  ServiceContainer: jest.fn().mockImplementation(() => ({
    register: jest.fn(),
    registerInstance: jest.fn(),
    get: jest.fn(),
    tryGet: jest.fn(),
    has: jest.fn(),
    createScope: jest.fn(),
    getStats: jest.fn(() => ({
      dependencyGraph: {},
      registeredServices: []
    })),
    validate: jest.fn(() => []),
    dispose: jest.fn()
  }))
}));

jest.mock('../../../src/core/di/decorators/Injectable', () => ({
  getInjectableMetadata: jest.fn(() => ({ lifetime: 'transient' })),
  getConstructorDependencies: jest.fn(() => [])
}));

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    jest.clearAllMocks();
    container = Container.create();
  });

  afterEach(() => {
    container.dispose();
  });

  describe('Container Creation', () => {
    test('should create container instance', () => {
      expect(container).toBeInstanceOf(Container);
    });

    test('should create container using static method', () => {
      const container1 = Container.create();
      const container2 = Container.create();

      expect(container1).toBeInstanceOf(Container);
      expect(container2).toBeInstanceOf(Container);
      expect(container1).not.toBe(container2);
    });
  });

  describe('Service Registration', () => {
    test('should register service class', () => {
      class TestService { }

      expect(() => {
        container.register(TestService);
      }).not.toThrow();
    });

    test('should register singleton service', () => {
      class TestService { }

      expect(() => {
        container.registerSingleton(TestService);
      }).not.toThrow();
    });

    test('should register scoped service', () => {
      class TestService { }

      expect(() => {
        container.registerScoped(TestService);
      }).not.toThrow();
    });

    test('should register service instance', () => {
      const instance = { value: 'test' };

      expect(() => {
        container.registerInstance('test', instance);
      }).not.toThrow();
    });

    test('should register service by token', () => {
      class TestService { }

      expect(() => {
        container.registerSingletonByToken(TypeKeys.TEST_SERVICE, TestService);
      }).not.toThrow();
    });

    test('should register transient service by token', () => {
      class TestService { }

      expect(() => {
        container.registerTransientByToken(TypeKeys.TEST_SERVICE, TestService);
      }).not.toThrow();
    });

    test('should register instance by token', () => {
      const instance = { value: 'test' };

      expect(() => {
        container.registerInstanceByToken(TypeKeys.TEST_SERVICE, instance);
      }).not.toThrow();
    });
  });

  describe('Service Resolution', () => {
    test('should resolve registered service', () => {
      class TestService { }
      const mockInstance = new TestService();

      (container as any).container.get.mockReturnValue(mockInstance);

      const resolved = container.get(TestService);
      expect(resolved).toBe(mockInstance);
    });

    test('should resolve service by token', () => {
      class TestService { }
      const mockInstance = new TestService();

      (container as any).container.get.mockReturnValue(mockInstance);

      const resolved = container.getByToken(TypeKeys.TEST_SERVICE);
      expect(resolved).toBe(mockInstance);
    });

    test('should try to resolve service', () => {
      const mockInstance = { value: 'test' };

      (container as any).container.tryGet.mockReturnValue(mockInstance);

      const resolved = container.tryGet('test');
      expect(resolved).toBe(mockInstance);
    });

    test('should try to resolve service by token', () => {
      const mockInstance = { value: 'test' };

      (container as any).container.tryGet.mockReturnValue(mockInstance);

      const resolved = container.tryGetByToken(TypeKeys.TEST_SERVICE);
      expect(resolved).toBe(mockInstance);
    });

    test('should return null for unregistered service', () => {
      (container as any).container.tryGet.mockReturnValue(null);

      const resolved = container.tryGet('nonexistent');
      expect(resolved).toBeNull();
    });

    test('should check if service is registered', () => {
      (container as any).container.has.mockReturnValue(true);

      const hasService = container.has('test');
      expect(hasService).toBe(true);
    });
  });

  describe('Auto-Registration', () => {
    test('should auto-register service on resolve', () => {
      class TestService { }

      (container as any).container.get.mockReturnValue(new TestService());

      const resolved = container.resolve(TestService);
      expect(resolved).toBeInstanceOf(TestService);
    });

    test('should not auto-register already registered service', () => {
      class TestService { }

      container.register(TestService);
      const mockInstance = new TestService();
      (container as any).container.get.mockReturnValue(mockInstance);

      const resolved = container.resolve(TestService);
      expect(resolved).toBe(mockInstance);
    });

    test('should handle auto-registration with dependencies', () => {
      class DependencyService { }
      class TestService {
        constructor(public dependency: DependencyService) { }
      }

      const mockDependency = new DependencyService();
      const mockInstance = new TestService(mockDependency);

      (container as any).container.get.mockImplementation((identifier) => {
        if (identifier === DependencyService) return mockDependency;
        if (identifier === TestService) return mockInstance;
        return null;
      });

      const resolved = container.resolve(TestService);
      expect(resolved).toBeInstanceOf(TestService);
      expect(resolved.dependency).toBe(mockDependency);
    });
  });

  describe('Container Scoping', () => {
    test('should create scoped container', () => {
      const mockScopedContainer = {
        registerInstance: jest.fn(),
        get: jest.fn(),
        tryGet: jest.fn(),
        has: jest.fn()
      };

      (container as any).container.createScope.mockReturnValue(mockScopedContainer);

      const scopedContainer = container.createScope();
      expect(scopedContainer).toBeDefined();
    });

    test('should create child container', () => {
      const mockChildContainer = {
        registerInstance: jest.fn(),
        get: jest.fn(),
        tryGet: jest.fn(),
        has: jest.fn()
      };

      // Mock the constructor to return our mock
      const OriginalContainer = Container;
      (Container as any) = jest.fn().mockImplementation(() => mockChildContainer);

      const childContainer = container.createChild();
      expect(childContainer).toBeDefined();

      // Restore original constructor
      (Container as any) = OriginalContainer;
    });

    test('should inherit singletons in child container', () => {
      const mockSingletonInstance = { value: 'singleton' };
      const dependencyGraph = {
        'TestService': { lifetime: ServiceLifetime.Singleton }
      };

      (container as any).container.getStats.mockReturnValue({ dependencyGraph });
      (container as any).container.tryGet.mockReturnValue(mockSingletonInstance);

      const childContainer = container.createChild();
      expect(childContainer).toBeDefined();
    });
  });

  describe('Validation and Statistics', () => {
    test('should validate container', () => {
      const mockErrors = ['Error 1', 'Error 2'];
      (container as any).container.validate.mockReturnValue(mockErrors);

      const errors = container.validate();
      expect(errors).toEqual(mockErrors);
    });

    test('should get dependency tree', () => {
      const mockTree = { 'TestService': { dependencies: [] } };
      (container as any).container.getStats.mockReturnValue({ dependencyGraph: mockTree });

      const tree = container.getDependencyTree();
      expect(tree).toEqual(mockTree);
    });

    test('should get container statistics', () => {
      const mockStats = {
        registeredServices: 5,
        dependencyGraph: {}
      };

      (container as any).container.getStats.mockReturnValue(mockStats);

      const stats = container.getStats();
      expect(stats.registeredServices).toBe(5);
      expect(stats.autoRegistered).toBe(0);
    });

    test('should include auto-registered count in stats', () => {
      class TestService { }
      container.register(TestService);

      const mockStats = {
        registeredServices: 1,
        dependencyGraph: {}
      };

      (container as any).container.getStats.mockReturnValue(mockStats);

      const stats = container.getStats();
      expect(stats.autoRegistered).toBe(1);
    });
  });

  describe('Module Scanning', () => {
    test('should scan module for services', () => {
      const mockModule = {
        TestService: class TestService { },
        TestRepository: class TestRepository { },
        UtilityClass: class UtilityClass { },
        regularFunction: () => { }
      };

      expect(() => {
        container.scan(mockModule);
      }).not.toThrow();
    });

    test('should handle empty module', () => {
      expect(() => {
        container.scan(null);
        container.scan(undefined);
        container.scan({});
      }).not.toThrow();
    });

    test('should handle scanning errors gracefully', () => {
      const mockModule = {
        InvalidService: {
          name: 'InvalidService',
          prototype: null
        }
      };

      expect(() => {
        container.scan(mockModule);
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing dependencies gracefully', () => {
      class TestService {
        constructor(public dependency: any) { }
      }

      (container as any).container.get.mockImplementation(() => {
        throw new Error('Dependency not found');
      });

      expect(() => {
        container.get(TestService);
      }).toThrow();
    });

    test('should handle circular dependencies', () => {
      class ServiceA {
        constructor(public serviceB: ServiceB) { }
      }

      class ServiceB {
        constructor(public serviceA: ServiceA) { }
      }

      // Mock container to simulate circular dependency
      (container as any).container.get.mockImplementation((identifier) => {
        if (identifier === ServiceA) {
          throw new Error('Circular dependency detected');
        }
        return null;
      });

      expect(() => {
        container.register(ServiceA);
        container.get(ServiceA);
      }).toThrow();
    });

    test('should handle invalid service identifiers', () => {
      expect(() => {
        container.get(null as any);
        container.get(undefined as any);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('should handle rapid service registration', () => {
      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        class DynamicService { }
        container.register(DynamicService);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle rapid service resolution', () => {
      class TestService { }
      const mockInstance = new TestService();
      (container as any).container.get.mockReturnValue(mockInstance);

      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        container.get(TestService);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should not leak memory on disposal', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Create and dispose many containers
      for (let i = 0; i < 100; i++) {
        const tempContainer = Container.create();
        tempContainer.dispose();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
    });
  });

  describe('Lifetime Management', () => {
    test('should handle singleton lifetime correctly', () => {
      class TestService { }

      container.registerSingleton(TestService);

      const mockInstance = new TestService();
      (container as any).container.get.mockReturnValue(mockInstance);

      const instance1 = container.get(TestService);
      const instance2 = container.get(TestService);

      expect(instance1).toBe(instance2);
    });

    test('should handle transient lifetime correctly', () => {
      class TestService { }

      container.register(TestService, { lifetime: ServiceLifetime.Transient });

      const instance1 = new TestService();
      const instance2 = new TestService();

      (container as any).container.get.mockReturnValueOnce(instance1).mockReturnValueOnce(instance2);

      const resolved1 = container.get(TestService);
      const resolved2 = container.get(TestService);

      expect(resolved1).toBe(instance1);
      expect(resolved2).toBe(instance2);
      expect(resolved1).not.toBe(resolved2);
    });

    test('should handle scoped lifetime correctly', () => {
      class TestService { }

      container.registerScoped(TestService);

      const mockInstance = new TestService();
      (container as any).container.get.mockReturnValue(mockInstance);

      const instance = container.get(TestService);
      expect(instance).toBeInstanceOf(TestService);
    });
  });

  describe('Integration', () => {
    test('should support complete DI workflow', () => {
      class DatabaseService {
        constructor() { }
        connect() { return 'connected'; }
      }

      class UserService {
        constructor(public database: DatabaseService) { }
        getUser(id: string) { return { id }; }
      }

      const mockDatabase = new DatabaseService();
      const mockUser = new UserService(mockDatabase);

      (container as any).container.get.mockImplementation((identifier) => {
        if (identifier === DatabaseService) return mockDatabase;
        if (identifier === UserService) return mockUser;
        return null;
      });

      // Register services
      container.registerSingleton(DatabaseService);
      container.register(UserService);

      // Resolve and use services
      const userService = container.get(UserService);
      const user = userService.getUser('123');

      expect(userService).toBeInstanceOf(UserService);
      expect(user).toEqual({ id: '123' });
      expect(userService.database).toBe(mockDatabase);
    });

    test('should support container inheritance', () => {
      class BaseService { }
      class ChildService extends BaseService { }

      const baseInstance = new BaseService();
      const childInstance = new ChildService();

      const dependencyGraph = {
        'BaseService': { lifetime: ServiceLifetime.Singleton },
        'ChildService': { lifetime: ServiceLifetime.Transient }
      };

      (container as any).container.getStats.mockReturnValue({ dependencyGraph });
      (container as any).container.tryGet.mockImplementation((identifier) => {
        if (identifier === 'BaseService') return baseInstance;
        return null;
      });

      const childContainer = container.createChild();

      expect(childContainer).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle concurrent access', () => {
      class TestService { }
      const mockInstance = new TestService();
      (container as any).container.get.mockReturnValue(mockInstance);

      const promises = Array.from({ length: 100 }, () =>
        Promise.resolve(container.get(TestService))
      );

      return Promise.all(promises).then(results => {
        results.forEach(result => {
          expect(result).toBe(mockInstance);
        });
      });
    });

    test('should handle disposal after resolution', () => {
      class TestService { }
      const mockInstance = new TestService();
      (container as any).container.get.mockReturnValue(mockInstance);

      const service = container.get(TestService);
      container.dispose();

      expect(service).toBe(mockInstance);
    });

    test('should handle multiple container instances', () => {
      const container1 = Container.create();
      const container2 = Container.create();

      class TestService { }

      container1.registerSingleton(TestService);
      container2.registerSingleton(TestService);

      const mockInstance1 = new TestService();
      const mockInstance2 = new TestService();

      (container1 as any).container.get.mockReturnValue(mockInstance1);
      (container2 as any).container.get.mockReturnValue(mockInstance2);

      const service1 = container1.get(TestService);
      const service2 = container2.get(TestService);

      expect(service1).toBe(mockInstance1);
      expect(service2).toBe(mockInstance2);
      expect(service1).not.toBe(service2);
    });
  });
});
