/**
 * DI Factory Tests
 * 
 * Tests for the DI factory functions and Black Box pattern compliance
 */

import { createContainer, createAutoContainer } from '../../../../src/core/di/factory';
import type { Container } from '../../../../src/core/di/factory';

describe('DI Factory', () => {
    describe('Container Creation', () => {
        it('should create a container using factory function', () => {
            const container = createContainer();
            
            expect(container).toBeDefined();
            expect(typeof container.register).toBe('function');
            expect(typeof container.get).toBe('function');
            expect(typeof container.has).toBe('function');
            expect(typeof container.resolve).toBe('function');
        });

        it('should create an auto container using factory function', () => {
            const container = createAutoContainer();
            
            expect(container).toBeDefined();
            expect(typeof container.register).toBe('function');
            expect(typeof container.get).toBe('function');
        });

        it('should create different container instances', () => {
            const container1 = createContainer();
            const container2 = createContainer();
            
            expect(container1).not.toBe(container2);
        });
    });

    describe('Service Registration', () => {
        let container: Container;

        beforeEach(() => {
            container = createContainer();
        });

        it('should register and resolve services by class', () => {
            class TestService {
                getValue() { return 'test-value'; }
            }

            container.register(TestService);
            const service = container.get(TestService);
            
            expect(service).toBeInstanceOf(TestService);
            expect(service.getValue()).toBe('test-value');
        });

        it('should register singleton services', () => {
            class TestService {
                private id = Math.random();
                getId() { return this.id; }
            }

            container.registerSingleton(TestService);
            const service1 = container.get(TestService);
            const service2 = container.get(TestService);
            
            expect(service1).toBe(service2);
            expect(service1.getId()).toBe(service2.getId());
        });

        it('should resolve dependencies automatically', () => {
            class DependencyService {
                getValue() { return 'dependency'; }
            }

            class MainService {
                constructor(private dependency: DependencyService) {}
                
                getValue() {
                    return this.dependency.getValue();
                }
            }

            container.register(DependencyService);
            container.register(MainService);
            
            const service = container.get(MainService);
            expect(service.getValue()).toBe('dependency');
        });

        it('should throw error for unregistered services', () => {
            class UnregisteredService {}
            
            expect(() => container.get(UnregisteredService)).toThrow();
        });
    });

    describe('Black Box Pattern Compliance', () => {
        it('should hide implementation details behind factory functions', () => {
            // This test ensures we're using factory functions, not direct class instantiation
            expect(() => {
                const container = createContainer();
                expect(container).toBeDefined();
            }).not.toThrow();
        });

        it('should provide type-safe interfaces', () => {
            interface ITestService {
                getValue(): string;
            }

            class TestService implements ITestService {
                getValue() { return 'typed-value'; }
            }

            const container = createContainer();
            container.register(TestService);
            const service = container.get(TestService);
            
            // TypeScript should enforce type safety
            expect(service.getValue()).toBe('typed-value');
        });
    });

    describe('Error Handling', () => {
        let container: Container;

        beforeEach(() => {
            container = createContainer();
        });

        it('should handle duplicate registration gracefully', () => {
            class TestService {}
            
            container.register(TestService);
            expect(() => container.register(TestService)).not.toThrow();
        });

        it('should handle invalid service types', () => {
            expect(() => {
                container.register(null as any);
            }).toThrow();
        });
    });

    describe('Performance', () => {
        it('should resolve services efficiently', () => {
            class TestService {}
            const container = createContainer();
            container.register(TestService);
            
            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                container.get(TestService);
            }
            const end = performance.now();
            
            // Should resolve 1000 services in under 100ms
            expect(end - start).toBeLessThan(100);
        });

        it('should create containers efficiently', () => {
            const start = performance.now();
            for (let i = 0; i < 100; i++) {
                createContainer();
            }
            const end = performance.now();
            
            // Should create 100 containers in under 50ms
            expect(end - start).toBeLessThan(50);
        });
    });
});
