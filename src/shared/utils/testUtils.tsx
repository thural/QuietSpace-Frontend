import 'reflect-metadata';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { DIProvider } from '../../core/di';
import { Container } from '../../core/di';

// Test utilities for DI-enabled components
export interface TestRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  container?: Container;
  services?: Array<{ service: any; implementation?: any }>;
}

// Custom render function with DI support
export const renderWithDI = (
  ui: ReactElement,
  options: TestRenderOptions = {}
) => {
  const { container, services, ...renderOptions } = options;

  // Create test container
  const testContainer = container || Container.create();

  // Register test services
  if (services) {
    services.forEach(({ service, implementation }) => {
      if (implementation) {
        testContainer.registerSingleton(service, implementation);
      } else {
        testContainer.registerSingleton(service);
      }
    });
  }

  // Wrapper with DI provider
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DIProvider container={testContainer}>
      {children}
    </DIProvider>
  );

  return render(ui, { wrapper, ...renderOptions });
};

// Mock service factory
export const createMockService = <T extends {}>(
  service: new () => T,
  partialMock: Partial<T> = {}
): T => {
  return {
    ...new service(),
    ...partialMock
  } as T;
};

// Test data factories
export const createTestUser = (overrides: Partial<any> = {}) => ({
  id: 'test-user-1',
  username: 'testuser',
  email: 'test@example.com',
  bio: 'Test user bio',
  avatar: 'test-avatar.jpg',
  verified: false,
  followersCount: 100,
  followingCount: 50,
  isPrivate: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  isVerified: false,
  ...overrides
});

export const createTestPost = (overrides: Partial<any> = {}) => ({
  id: 'test-post-1',
  userId: 'test-user-1',
  content: 'Test post content',
  hashtags: ['test', 'post'],
  likesCount: 10,
  commentsCount: 5,
  sharesCount: 2,
  createdAt: new Date(),
  user: createTestUser(),
  ...overrides
});

export const createTestProfileStats = (overrides: Partial<any> = {}) => ({
  followersCount: 100,
  followingCount: 50,
  postsCount: 25,
  engagementRate: 5.5,
  profileStrength: 75,
  ...overrides
});

// Async test utilities
export const waitFor = (condition: () => boolean, timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 100);
      }
    };
    
    check();
  });
};

export const actAsync = async (callback: () => Promise<void> | void): Promise<void> => {
  const { act } = require('@testing-library/react');
  await act(callback);
};

// Test environment setup
export const setupTestEnvironment = () => {
  // Mock console methods in tests
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
};

export const cleanupTestEnvironment = () => {
  // Restore console methods
  jest.restoreAllMocks();
};

// DI container test utilities
export const createTestContainer = (services: Array<{ service: any; implementation?: any }> = []): Container => {
  const container = Container.create();
  
  services.forEach(({ service, implementation }) => {
    if (implementation) {
      container.registerSingleton(service, implementation);
    } else {
      container.registerSingleton(service);
    }
  });
  
  return container;
};

export const expectServiceRegistered = (container: Container, service: any): void => {
  expect(() => container.resolve(service)).not.toThrow();
};

export const expectServiceNotRegistered = (container: Container, service: any): void => {
  expect(() => container.resolve(service)).toThrow();
};

// Integration test utilities
export const renderFeatureWithDI = (
  featureComponent: ReactElement,
  featureServices: Array<{ service: any; implementation?: any }> = []
) => {
  return renderWithDI(featureComponent, {
    services: featureServices
  });
};

// Performance test utilities
export const measureRenderTime = async (
  renderFn: () => void,
  iterations = 10
): Promise<{ averageTime: number; totalTime: number }> => {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    times.push(endTime - startTime);
  }
  
  const totalTime = times.reduce((sum, time) => sum + time, 0);
  const averageTime = totalTime / iterations;
  
  return { averageTime, totalTime };
};

// Accessibility test utilities
export const checkAccessibility = async (container: HTMLElement): Promise<void> => {
  // Basic accessibility checks
  const interactiveElements = container.querySelectorAll('button, input, select, textarea, a');
  
  interactiveElements.forEach((element) => {
    // Check for aria-label or text content
    const hasLabel = element.hasAttribute('aria-label') || 
                   element.hasAttribute('aria-labelledby') ||
                   element.textContent?.trim();
    
    if (!hasLabel) {
      console.warn('Interactive element missing accessibility label:', element);
    }
  });
  
  // Check for proper heading structure
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length === 0) {
    console.warn('No headings found - consider adding for screen readers');
  }
};

// Mock API utilities
export const createMockApiResponse = <T>(data: T, delay = 100): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

export const createMockApiError = (message: string, delay = 100): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};

// Export all utilities
export {
  renderWithDI as default,
  createMockService,
  createTestUser,
  createTestPost,
  createTestProfileStats,
  waitFor,
  actAsync,
  setupTestEnvironment,
  cleanupTestEnvironment,
  createTestContainer,
  expectServiceRegistered,
  expectServiceNotRegistered,
  renderFeatureWithDI,
  measureRenderTime,
  checkAccessibility,
  createMockApiResponse,
  createMockApiError
};
