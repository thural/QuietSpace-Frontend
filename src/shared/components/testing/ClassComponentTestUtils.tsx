import { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { BaseClassComponent, IBaseComponentProps } from '../base/BaseClassComponent';

/**
 * Custom render function for class components
 * Provides additional utilities for testing class-based components
 */
export function renderClassComponent<P extends IBaseComponentProps>(
  component: ReactElement<P>,
  options?: RenderOptions
): RenderResult {
  return render(component, {
    ...options,
    wrapper: options?.wrapper
  });
}

/**
 * Helper to test component state
 */
export function getComponentState<C extends BaseClassComponent<any, any>>(
  renderResult: RenderResult
): C['state'] {
  const componentInstance = renderResult.container.querySelector('[data-component]') as any;
  return componentInstance?._reactInternals?.child?.stateNode?.state;
}

/**
 * Helper to test component props
 */
export function getComponentProps<C extends BaseClassComponent<any, any>>(
  renderResult: RenderResult
): C['props'] {
  const componentInstance = renderResult.container.querySelector('[data-component]') as any;
  return componentInstance?._reactInternals?.child?.stateNode?.props;
}

/**
 * Helper to trigger component methods
 */
export function callComponentMethod<C extends BaseClassComponent<any, any>>(
  renderResult: RenderResult,
  methodName: keyof C,
  ...args: any[]
): any {
  const componentInstance = renderResult.container.querySelector('[data-component]') as any;
  const component = componentInstance?._reactInternals?.child?.stateNode;
  
  if (component && typeof component[methodName] === 'function') {
    return component[methodName](...args);
  }
  
  throw new Error(`Method ${String(methodName)} not found on component`);
}

/**
 * Helper to wait for component state changes
 */
export async function waitForStateChange<C extends BaseClassComponent<any, any>>(
  renderResult: RenderResult,
  predicate: (state: C['state']) => boolean,
  timeout = 5000
): Promise<C['state']> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkState = () => {
      const state = getComponentState<C>(renderResult);
      
      if (predicate(state)) {
        resolve(state);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error(`State condition not met within ${timeout}ms`));
        return;
      }
      
      setTimeout(checkState, 50);
    };
    
    checkState();
  });
}

/**
 * Helper to simulate component lifecycle events
 */
export function simulateComponentMount(renderResult: RenderResult): void {
  const componentInstance = renderResult.container.querySelector('[data-component]') as any;
  const component = componentInstance?._reactInternals?.child?.stateNode;
  
  if (component && typeof component.componentDidMount === 'function') {
    component.componentDidMount();
  }
}

/**
 * Helper to simulate component unmount
 */
export function simulateComponentUnmount(renderResult: RenderResult): void {
  const componentInstance = renderResult.container.querySelector('[data-component]') as any;
  const component = componentInstance?._reactInternals?.child?.stateNode;
  
  if (component && typeof component.componentWillUnmount === 'function') {
    component.componentWillUnmount();
  }
}

/**
 * Helper to simulate component update
 */
export function simulateComponentUpdate<P extends IBaseComponentProps>(
  renderResult: RenderResult,
  newProps: Partial<P>
): void {
  const componentInstance = renderResult.container.querySelector('[data-component]') as any;
  const component = componentInstance?._reactInternals?.child?.stateNode;
  
  if (component && typeof component.componentDidUpdate === 'function') {
    const prevProps = component.props;
    component.props = { ...prevProps, ...newProps };
    component.componentDidUpdate(prevProps, component.state);
  }
}

/**
 * Mock query system for testing
 */
export function createMockQuerySystem() {
  const cache = new Map();
  const subscriptions = new Map();
  
  return {
    queryClient: {
      getQueryData: (key: string) => cache.get(key)?.data || null,
      setQueryData: (key: string, data: any) => {
        cache.set(key, { data, timestamp: Date.now() });
      },
      invalidateQuery: (key: string) => {
        cache.delete(key);
        const subs = subscriptions.get(key);
        if (subs) {
          subs.forEach((cb: any) => cb('invalidated'));
        }
      }
    },
    queryCache: {
      get: (key: string) => cache.get(key) || null,
      set: (key: string, data: any, options?: any) => {
        cache.set(key, {
          ...data,
          timestamp: Date.now(),
          ...options
        });
      },
      invalidate: (key: string) => {
        cache.delete(key);
        const subs = subscriptions.get(key);
        if (subs) {
          subs.forEach((cb: any) => cb('invalidated'));
        }
      },
      subscribe: (key: string, callback: any) => {
        if (!subscriptions.has(key)) {
          subscriptions.set(key, new Set());
        }
        subscriptions.get(key).add(callback);
        
        return () => {
          const subs = subscriptions.get(key);
          if (subs) {
            subs.delete(callback);
            if (subs.size === 0) {
              subscriptions.delete(key);
            }
          }
        };
      }
    },
    performanceMonitor: {
      startQuery: (key: string) => `tracking-${key}-${Date.now()}`,
      endQuery: (trackingId: string, success: boolean, error?: Error, source?: string) => {
        // Mock implementation
      }
    }
  };
}

/**
 * Setup mock query system for testing
 */
export function setupMockQuerySystem() {
  const mockSystem = createMockQuerySystem();
  
  // Set up global mocks
  (globalThis as any).queryClient = mockSystem.queryClient;
  (globalThis as any).queryCache = mockSystem.queryCache;
  (globalThis as any).performanceMonitor = mockSystem.performanceMonitor;
  
  return mockSystem;
}

/**
 * Cleanup mock query system after testing
 */
export function cleanupMockQuerySystem() {
  delete (globalThis as any).queryClient;
  delete (globalThis as any).queryCache;
  delete (globalThis as any).performanceMonitor;
}

export default {
  renderClassComponent,
  getComponentState,
  getComponentProps,
  callComponentMethod,
  waitForStateChange,
  simulateComponentMount,
  simulateComponentUnmount,
  simulateComponentUpdate,
  createMockQuerySystem,
  setupMockQuerySystem,
  cleanupMockQuerySystem
};
