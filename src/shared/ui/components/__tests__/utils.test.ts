/**
 * Theme Utilities Unit Tests
 * 
 * Comprehensive test suite for theme utility functions
 * ensuring proper fallback behavior and theme token access.
 */

import { EnhancedTheme } from '@/core/modules/theming';
import {
    getSpacing,
    getColor,
    getRadius,
    getBorderWidth,
    getShadow,
    getTransition,
    getTypography,
    getBreakpoint,
    getComponentSize
} from '../utils';

// Mock theme for testing
const mockTheme: EnhancedTheme = {
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
        '6xl': '192px'
    },
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40',
        brand: {
            500: '#007bff',
            200: '#b3d7ff'
        },
        text: {
            primary: '#212529',
            secondary: '#6c757d'
        },
        background: {
            primary: '#ffffff',
            secondary: '#f8f9fa'
        },
        border: {
            light: '#dee2e6',
            medium: '#ced4da',
            dark: '#adb5bd'
        },
        semantic: {
            error: '#dc3545',
            overlay: 'rgba(0, 0, 0, 0.5)'
        }
    },
    radius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '50px',
        round: '50px'
    },
    border: {
        none: '0',
        hairline: '1px',
        xs: '1px',
        sm: '2px',
        md: '2px',
        lg: '2px',
        xl: '3px',
        '2xl': '4px'
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
    },
    animation: {
        duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms'
        },
        easing: {
            ease: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
    },
    breakpoints: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
    },
    typography: {
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            md: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem'
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        },
        lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75
        }
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
            lg: '48px'
        },
        messageCard: {
            maxWidth: '200px'
        },
        modal: {
            small: { maxWidth: '400px', width: '90%' },
            medium: { maxWidth: '600px', width: '90%' },
            large: { maxWidth: '800px', width: '90%' },
            fullscreen: { maxWidth: '100%', width: '100%', height: '100%' }
        }
    },
    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070
    }
};

describe('Theme Utilities', () => {
    describe('getSpacing', () => {
        it('should return correct spacing value from theme', () => {
            expect(getSpacing(mockTheme, 'md')).toBe('16px');
            expect(getSpacing(mockTheme, 'lg')).toBe('24px');
        });

        it('should return fallback when theme is undefined', () => {
            expect(getSpacing(undefined, 'md')).toBe('16px');
        });

        it('should return fallback when spacing key is missing', () => {
            expect(getSpacing(mockTheme, 'invalid' as any)).toBe('16px');
        });
    });

    describe('getColor', () => {
        it('should return correct color value from theme', () => {
            expect(getColor(mockTheme, 'primary')).toBe('#007bff');
            expect(getColor(mockTheme, 'brand.500')).toBe('#007bff');
        });

        it('should return fallback when theme is undefined', () => {
            expect(getColor(undefined, 'primary')).toBe('#000000');
        });

        it('should return fallback when color key is missing', () => {
            expect(getColor(mockTheme, 'invalid' as any)).toBe('#000000');
        });
    });

    describe('getRadius', () => {
        it('should return correct radius value from theme', () => {
            expect(getRadius(mockTheme, 'md')).toBe('0.375rem');
            expect(getRadius(mockTheme, 'full')).toBe('50px');
        });

        it('should return fallback when theme is undefined', () => {
            expect(getRadius(undefined, 'md')).toBe('0.375rem');
        });

        it('should return fallback when radius key is missing', () => {
            expect(getRadius(mockTheme, 'invalid' as any)).toBe('0.375rem');
        });
    });

    describe('getBorderWidth', () => {
        it('should return correct border width value from theme', () => {
            expect(getBorderWidth(mockTheme, 'sm')).toBe('2px');
            expect(getBorderWidth(mockTheme, 'xl')).toBe('3px');
        });

        it('should return fallback when theme is undefined', () => {
            expect(getBorderWidth(undefined, 'md')).toBe('2px');
        });

        it('should return fallback when border key is missing', () => {
            expect(getBorderWidth(mockTheme, 'invalid' as any)).toBe('2px');
        });
    });

    describe('getShadow', () => {
        it('should return correct shadow value from theme', () => {
            expect(getShadow(mockTheme, 'md')).toBe('0 4px 6px -1px rgba(0, 0, 0, 0.07)');
            expect(getShadow(mockTheme, 'xl')).toBe('0 20px 25px -5px rgba(0, 0, 0, 0.1)');
        });

        it('should return fallback when theme is undefined', () => {
            expect(getShadow(undefined, 'md')).toBe('0 4px 6px -1px rgba(0, 0, 0, 0.07)');
        });

        it('should return fallback when shadow key is missing', () => {
            expect(getShadow(mockTheme, 'invalid' as any)).toBe('0 4px 6px -1px rgba(0, 0, 0, 0.07)');
        });
    });

    describe('getTransition', () => {
        it('should return correct transition value from theme', () => {
            expect(getTransition(mockTheme, 'all', 'normal', 'ease')).toBe('all 300ms cubic-bezier(0.4, 0, 0.2, 1)');
        });

        it('should return fallback when theme is undefined', () => {
            expect(getTransition(undefined, 'all', 'normal', 'ease')).toBe('all 300ms ease');
        });

        it('should return fallback when transition key is missing', () => {
            expect(getTransition(mockTheme, 'all', 'invalid' as any, 'ease')).toBe('all 300ms ease');
        });
    });

    describe('getTypography', () => {
        it('should return correct typography value from theme', () => {
            expect(getTypography(mockTheme, 'fontSize.md')).toBe('1rem');
            expect(getTypography(mockTheme, 'fontWeight.bold')).toBe(700);
            expect(getTypography(mockTheme, 'lineHeight.tight')).toBe(1.25);
        });

        it('should return fallback when theme is undefined', () => {
            expect(getTypography(undefined, 'fontSize.md')).toBe('1rem');
        });

        it('should return fallback when typography key is missing', () => {
            expect(getTypography(mockTheme, 'invalid' as any)).toBe('1rem');
        });
    });

    describe('getBreakpoint', () => {
        it('should return correct breakpoint value from theme', () => {
            expect(getBreakpoint(mockTheme, 'sm')).toBe('640px');
            expect(getBreakpoint(mockTheme, 'lg')).toBe('1024px');
        });

        it('should return fallback when theme is undefined', () => {
            expect(getBreakpoint(undefined, 'md')).toBe('768px');
        });

        it('should return fallback when breakpoint key is missing', () => {
            expect(getBreakpoint(mockTheme, 'invalid' as any)).toBe('768px');
        });
    });

    describe('getComponentSize', () => {
        it('should return correct component size from theme', () => {
            expect(getComponentSize(mockTheme, 'avatar', 'md')).toBe('40px');
            expect(getComponentSize(mockTheme, 'avatar', 'lg')).toBe('48px');
        });

        it('should return modal size object', () => {
            const modalSize = getComponentSize(mockTheme, 'modal', 'small');
            expect(modalSize).toEqual({ maxWidth: '400px', width: '90%' });
        });

        it('should return fallback when theme is undefined', () => {
            expect(getComponentSize(undefined, 'avatar', 'md')).toEqual({});
        });

        it('should return fallback when component is missing', () => {
            expect(getComponentSize(mockTheme, 'invalid' as any, 'md')).toEqual({});
        });
    });
});
