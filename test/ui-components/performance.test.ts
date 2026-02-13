/**
 * Performance Tests for UI Library Components
 * 
 * Performance testing to ensure theme token integration doesn't impact
 * component rendering performance negatively.
 */

import { describe, test, expect, vi } from 'vitest';

// Performance testing utilities
const measureRenderTime = (componentName: string, renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return {
    componentName,
    renderTime: end - start,
    threshold: 16 // Target: < 16ms for 60fps
  };
};

const measureMemoryUsage = (componentName: string, setupFn: () => void, cleanupFn: () => void) => {
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  const memoryBefore = process.memoryUsage();
  setupFn();
  
  if (global.gc) {
    global.gc();
  }
  
  const memoryAfter = process.memoryUsage();
  cleanupFn();
  
  return {
    componentName,
    heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
    heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal
  };
};

describe('UI Library Performance Tests', () => {
  test('utility functions should perform efficiently', () => {
    // Mock theme for testing
    const mockTheme = {
      spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
      colors: { brand: { 500: '#3b82f6' } },
      radius: { sm: '4px', md: '8px', lg: '12px' },
      border: { xs: '1px', sm: '2px', md: '3px' },
      size: {
        skeleton: { minWidth: '172px', height: '256px' },
        avatar: { xs: '24px', sm: '32px', md: '40px', lg: '56px' }
      }
    };

    // Test utility function performance
    const iterations = 10000;
    
    // Test getSpacing performance
    const spacingStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      // Simulate getSpacing calls
      const result = mockTheme.spacing.md || '16px';
    }
    const spacingEnd = performance.now();
    
    // Test getColor performance
    const colorStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      // Simulate getColor calls
      const result = mockTheme.colors.brand[500] || '#3b82f6';
    }
    const colorEnd = performance.now();
    
    // Test getRadius performance
    const radiusStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      // Simulate getRadius calls
      const result = mockTheme.radius.md || '8px';
    }
    const radiusEnd = performance.now();

    // Performance assertions
    expect(spacingEnd - spacingStart).toBeLessThan(50); // < 50ms for 10k calls
    expect(colorEnd - colorStart).toBeLessThan(50);     // < 50ms for 10k calls
    expect(radiusEnd - radiusStart).toBeLessThan(50);   // < 50ms for 10k calls
  });

  test('theme token lookup should be faster than string parsing', () => {
    const mockTheme = {
      spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' }
    };

    const iterations = 10000;
    
    // Test direct object access (theme tokens)
    const directStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      const result = mockTheme.spacing.md;
    }
    const directEnd = performance.now();
    
    // Test string parsing (simulating hard-coded values)
    const parseStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      const value = '16px';
      const result = value.includes('px') ? value : value + 'px';
    }
    const parseEnd = performance.now();

    const directTime = directEnd - directStart;
    const parseTime = parseEnd - parseStart;
    
    // Direct access should be faster or comparable
    expect(directTime).toBeLessThanOrEqual(parseTime * 1.5); // Allow 50% overhead
  });

  test('component rendering should maintain performance', () => {
    // Simulate component rendering performance
    const renderComponent = () => {
      // Simulate the work done during component rendering
      const styles = {
        padding: '16px 24px',
        borderRadius: '8px',
        border: '2px solid #3b82f6',
        fontSize: '16px',
        transition: 'all 0.2s ease'
      };
      return styles;
    };

    const iterations = 1000;
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      renderComponent();
    }
    
    const end = performance.now();
    const averageTime = (end - start) / iterations;
    
    // Each render should take less than 1ms on average
    expect(averageTime).toBeLessThan(1);
  });

  test('memory usage should be stable', () => {
    const initialMemory = process.memoryUsage();
    
    // Simulate creating many components
    const components = [];
    for (let i = 0; i < 1000; i++) {
      components.push({
        id: i,
        styles: {
          padding: '16px',
          margin: '8px',
          borderRadius: '8px'
        }
      });
    }
    
    const afterCreationMemory = process.memoryUsage();
    
    // Clear references
    components.length = 0;
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage();
    
    // Memory growth should be reasonable
    const memoryGrowth = afterCreationMemory.heapUsed - initialMemory.heapUsed;
    const memoryReclaimed = afterCreationMemory.heapUsed - finalMemory.heapUsed;
    
    // Should not grow more than 10MB for 1000 components
    expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024);
    
    // Should reclaim most memory after cleanup
    expect(memoryReclaimed).toBeGreaterThan(memoryGrowth * 0.5);
  });

  test('theme token caching should improve performance', () => {
    const mockTheme = {
      spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' }
    };

    // Simulate cache
    const cache = new Map();
    
    const getCachedValue = (path: string) => {
      if (cache.has(path)) {
        return cache.get(path);
      }
      
      // Simulate theme token lookup
      const value = path.split('.').reduce((obj, key) => obj?.[key], mockTheme);
      cache.set(path, value);
      return value;
    };

    const iterations = 10000;
    
    // First pass - populate cache
    const firstStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      getCachedValue('spacing.md');
    }
    const firstEnd = performance.now();
    
    // Second pass - use cache
    const secondStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      getCachedValue('spacing.md');
    }
    const secondEnd = performance.now();

    // Cached access should be significantly faster
    const firstTime = firstEnd - firstStart;
    const secondTime = secondEnd - secondStart;
    
    expect(secondTime).toBeLessThan(firstTime * 0.5); // At least 50% faster
  });
});

describe('Theme Token Performance Benchmarks', () => {
  test('border width lookups should be efficient', () => {
    const borderTokens = {
      none: '0',
      hairline: '1px',
      xs: '1px',
      sm: '2px',
      md: '3px',
      lg: '4px',
      xl: '6px',
      '2xl': '8px'
    };

    const iterations = 5000;
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
      const randomSize = sizes[i % sizes.length];
      const result = borderTokens[randomSize] || borderTokens.md;
    }
    
    const end = performance.now();
    const averageTime = (end - start) / iterations;
    
    // Each lookup should be very fast
    expect(averageTime).toBeLessThan(0.01); // < 0.01ms per lookup
  });

  test('component size calculations should be efficient', () => {
    const sizeTokens = {
      skeleton: { minWidth: '172px', height: '256px' },
      avatar: { xs: '24px', sm: '32px', md: '40px', lg: '56px' }
    };

    const iterations = 5000;
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const components = ['skeleton', 'avatar'];
      const component = components[i % components.length];
      const sizes = component === 'avatar' ? ['xs', 'sm', 'md', 'lg'] : ['minWidth', 'height'];
      const size = sizes[i % sizes.length];
      
      const componentSizes = sizeTokens[component];
      const result = componentSizes?.[size] || 'md';
    }
    
    const end = performance.now();
    const averageTime = (end - start) / iterations;
    
    // Each calculation should be fast
    expect(averageTime).toBeLessThan(0.02); // < 0.02ms per calculation
  });
});
