/**
 * Unit Tests for UI Library Utility Functions
 * 
 * Comprehensive test coverage for all new and enhanced utility functions
 * to ensure proper theme token integration and fallback behavior.
 */

import { describe, test, expect, vi } from 'vitest';

// Mock theme for testing
const mockTheme = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    '3xl': '64px',
    '4xl': '96px',
    '5xl': '128px',
    '6xl': '256px'
  },
  colors: {
    brand: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    semantic: {
      error: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b'
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      inverse: '#ffffff'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6'
    },
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      dark: '#9ca3af'
    }
  },
  typography: {
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px'
    }
  },
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
    round: '50%'
  },
  border: {
    none: '0',
    hairline: '1px',
    xs: '1px',
    sm: '2px',
    md: '3px',
    lg: '4px',
    xl: '6px',
    '2xl': '8px'
  },
  size: {
    skeleton: {
      minWidth: '172px',
      height: '256px'
    },
    avatar: {
      xs: '24px',
      sm: '32px',
      md: '40px',
      lg: '56px'
    }
  },
  animation: {
    duration: {
      fast: '0.15s',
      normal: '0.2s',
      slow: '0.3s'
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  }
};

// Import utility functions
import {
  getSpacing,
  getColor,
  getRadius,
  getShadow,
  getBorderWidth,
  getMicroSpacing,
  getComponentSize,
  getSkeletonStyles
} from '../../src/shared/ui/components/utils';

describe('Utility Functions - getSpacing', () => {
  test('should return theme spacing token for valid keys', () => {
    expect(getSpacing(mockTheme, 'sm')).toBe('8px');
    expect(getSpacing(mockTheme, 'md')).toBe('16px');
    expect(getSpacing(mockTheme, 'xl')).toBe('32px');
  });

  test('should return original string for non-token strings', () => {
    expect(getSpacing(mockTheme, 'auto')).toBe('auto');
    expect(getSpacing(mockTheme, 'inherit')).toBe('inherit');
  });

  test('should convert numbers to pixel values', () => {
    expect(getSpacing(mockTheme, 10)).toBe('10px');
    expect(getSpacing(mockTheme, 0)).toBe('0px');
  });

  test('should handle undefined and null values', () => {
    expect(getSpacing(mockTheme, undefined)).toBe('0');
    expect(getSpacing(mockTheme, null)).toBe('0');
  });
});

describe('Utility Functions - getColor', () => {
  test('should return brand colors for valid paths', () => {
    expect(getColor(mockTheme, 'brand.500')).toBe('#3b82f6');
    expect(getColor(mockTheme, 'brand.600')).toBe('#2563eb');
  });

  test('should return semantic colors for valid paths', () => {
    expect(getColor(mockTheme, 'semantic.error')).toBe('#ef4444');
    expect(getColor(mockTheme, 'semantic.success')).toBe('#10b981');
  });

  test('should return text colors for valid paths', () => {
    expect(getColor(mockTheme, 'text.primary')).toBe('#111827');
    expect(getColor(mockTheme, 'text.inverse')).toBe('#ffffff');
  });

  test('should return original path for invalid paths', () => {
    expect(getColor(mockTheme, 'invalid.path')).toBe('invalid.path');
    expect(getColor(mockTheme, 'brand.999')).toBe('brand.999');
  });

  test('should return inherit for undefined colorPath', () => {
    expect(getColor(mockTheme, undefined)).toBe('inherit');
  });
});

describe('Utility Functions - getRadius', () => {
  test('should return theme radius token for valid keys', () => {
    expect(getRadius(mockTheme, 'sm')).toBe('4px');
    expect(getRadius(mockTheme, 'md')).toBe('8px');
    expect(getRadius(mockTheme, 'lg')).toBe('12px');
  });

  test('should return 50% for round radius', () => {
    expect(getRadius(mockTheme, 'round')).toBe('50%');
  });

  test('should return default md for undefined size', () => {
    expect(getRadius(mockTheme, undefined)).toBe('8px');
  });

  test('should return original string for non-token values', () => {
    expect(getRadius(mockTheme, '25%')).toBe('25%');
    expect(getRadius(mockTheme, '10px')).toBe('10px');
  });
});

describe('Utility Functions - getBorderWidth', () => {
  test('should return theme border token for valid keys', () => {
    expect(getBorderWidth(mockTheme, 'sm')).toBe('2px');
    expect(getBorderWidth(mockTheme, 'md')).toBe('3px');
    expect(getBorderWidth(mockTheme, 'lg')).toBe('4px');
  });

  test('should return default md for undefined width', () => {
    expect(getBorderWidth(mockTheme, undefined)).toBe('3px');
  });

  test('should return original string for non-token values', () => {
    expect(getBorderWidth(mockTheme, '5px')).toBe('5px');
    expect(getBorderWidth(mockTheme, '1px')).toBe('1px');
  });
});

describe('Utility Functions - getMicroSpacing', () => {
  test('should return theme spacing token for valid keys', () => {
    expect(getMicroSpacing(mockTheme, 'xs')).toBe('4px');
    expect(getMicroSpacing(mockTheme, 'sm')).toBe('8px');
  });

  test('should convert small numbers to rem', () => {
    expect(getMicroSpacing(mockTheme, 4)).toBe('0.25rem');
    expect(getMicroSpacing(mockTheme, 6)).toBe('0.375rem');
  });

  test('should convert larger numbers to pixels', () => {
    expect(getMicroSpacing(mockTheme, 10)).toBe('10px');
    expect(getMicroSpacing(mockTheme, 16)).toBe('16px');
  });

  test('should handle undefined and null values', () => {
    expect(getMicroSpacing(mockTheme, undefined)).toBe('0');
    expect(getMicroSpacing(mockTheme, null)).toBe('0');
  });
});

describe('Utility Functions - getComponentSize', () => {
  test('should return skeleton component sizes', () => {
    expect(getComponentSize(mockTheme, 'skeleton', 'minWidth')).toBe('172px');
    expect(getComponentSize(mockTheme, 'skeleton', 'height')).toBe('256px');
  });

  test('should return avatar component sizes', () => {
    expect(getComponentSize(mockTheme, 'avatar', 'xs')).toBe('24px');
    expect(getComponentSize(mockTheme, 'avatar', 'md')).toBe('40px');
    expect(getComponentSize(mockTheme, 'avatar', 'lg')).toBe('56px');
  });

  test('should return default sizes for component without size param', () => {
    expect(getComponentSize(mockTheme, 'avatar')).toBe('40px');
    expect(getComponentSize(mockTheme, 'skeleton')).toBe('256px');
  });

  test('should return md for invalid component', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(getComponentSize(mockTheme, 'invalid')).toBe('md');
    expect(consoleSpy).toHaveBeenCalledWith('Component size not found: invalid');
    consoleSpy.mockRestore();
  });

  test('should return original size for invalid size key', () => {
    expect(getComponentSize(mockTheme, 'avatar', 'invalid')).toBe('invalid');
  });
});

describe('Utility Functions - getSkeletonStyles', () => {
  test('should return default skeleton styles', () => {
    const styles = getSkeletonStyles(mockTheme, 'default');
    expect(styles).toContain('background: linear-gradient');
    expect(styles).toContain('min-width: 172px');
    expect(styles).toContain('height: 256px');
    expect(styles).toContain('border-radius: 8px');
  });

  test('should return circle skeleton styles', () => {
    const styles = getSkeletonStyles(mockTheme, 'circle');
    expect(styles).toContain('background: linear-gradient');
    expect(styles).toContain('border-radius: 50%');
    expect(styles).toContain('width: 40px');
    expect(styles).toContain('height: 40px');
  });

  test('should return text skeleton styles', () => {
    const styles = getSkeletonStyles(mockTheme, 'text');
    expect(styles).toContain('background: linear-gradient');
    expect(styles).toContain('height: 1rem');
    expect(styles).toContain('border-radius: 4px');
    expect(styles).toContain('margin-bottom: 4px');
  });

  test('should return default styles for invalid variant', () => {
    const styles = getSkeletonStyles(mockTheme, 'invalid' as any);
    expect(styles).toContain('background: linear-gradient');
    expect(styles).toContain('min-width: 172px');
  });
});

describe('Utility Functions - Error Handling', () => {
  test('should handle incomplete theme objects gracefully', () => {
    const incompleteTheme = {
      spacing: { md: '16px' }
      // Missing other properties
    };

    expect(getSpacing(incompleteTheme, 'md')).toBe('16px');
    expect(getSpacing(incompleteTheme, 'sm')).toBe('sm'); // Fallback to original
  });

  test('should handle null theme gracefully', () => {
    expect(() => getSpacing(null, 'md')).not.toThrow();
    expect(() => getColor(null, 'brand.500')).not.toThrow();
  });
});

describe('Utility Functions - Integration', () => {
  test('should work together for complex styling scenarios', () => {
    const spacing = getSpacing(mockTheme, 'md');
    const color = getColor(mockTheme, 'brand.500');
    const radius = getRadius(mockTheme, 'lg');
    const borderWidth = getBorderWidth(mockTheme, 'sm');

    expect(spacing).toBe('16px');
    expect(color).toBe('#3b82f6');
    expect(radius).toBe('12px');
    expect(borderWidth).toBe('2px');
  });

  test('should support nested component sizing', () => {
    const avatarSize = getComponentSize(mockTheme, 'avatar', 'lg');
    const spacing = getSpacing(mockTheme, 'sm');
    
    expect(avatarSize).toBe('56px');
    expect(spacing).toBe('8px');
  });
});
