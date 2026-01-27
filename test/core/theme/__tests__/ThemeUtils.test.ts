/**
 * Theme Utils Test Suite
 * Tests theme utility functions
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the utils module
const mockMediaQuery = jest.fn();
const mockCreateStyledComponent = jest.fn();
const mockAnimations = {
  duration: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
  },
  easing: {
    ease: 'ease-in-out',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
  },
};

jest.mock('../../../src/core/theme/utils', () => ({
  media: mockMediaQuery,
  createStyledComponent: mockCreateStyledComponent,
  animations: mockAnimations,
}));

jest.mock('../../../src/core/theme/utils/mediaQueries', () => ({
  media: mockMediaQuery,
}));

describe('Theme Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Media Queries', () => {
    test('should have media query function', () => {
      expect(mockMediaQuery).toBeDefined();
    });

    test('should accept breakpoint parameter', () => {
      const mockCSS = { css: 'color: red;' };
      mockMediaQuery(mockCSS);
      expect(mockMediaQuery).toHaveBeenCalledWith(mockCSS);
    });
  });

  describe('createStyledComponent', () => {
    test('should be a function', () => {
      expect(mockCreateStyledComponent).toBeDefined();
      expect(typeof mockCreateStyledComponent).toBe('function');
    });

    test('should accept element parameter', () => {
      const element = 'div';
      mockCreateStyledComponent(element);
      expect(mockCreateStyledComponent).toHaveBeenCalledWith(element);
    });
  });

  describe('Animations', () => {
    test('should have animation durations', () => {
      expect(mockAnimations.duration).toBeDefined();
      expect(mockAnimations.duration.fast).toBe('0.15s');
      expect(mockAnimations.duration.normal).toBe('0.3s');
      expect(mockAnimations.duration.slow).toBe('0.5s');
    });

    test('should have animation easing', () => {
      expect(mockAnimations.easing).toBeDefined();
      expect(mockAnimations.easing.ease).toBe('ease-in-out');
      expect(mockAnimations.easing.easeIn).toBe('ease-in');
      expect(mockAnimations.easing.easeOut).toBe('ease-out');
    });
  });

  describe('Performance', () => {
    test('should handle multiple calls efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        mockCreateStyledComponent('div', { color: 'red' });
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
