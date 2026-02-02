/**
 * Theme System Constants
 *
 * Centralized constants for the theme system including color values,
 * typography scales, spacing systems, breakpoints, and animation timings.
 */

// Color palette constants
export const COLOR_PALETTE = {
    // Primary brand colors
    PRIMARY: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
    },

    // Secondary brand colors
    SECONDARY: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a'
    },

    // Success colors
    SUCCESS: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
    },

    // Warning colors
    WARNING: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f'
    },

    // Error colors
    ERROR: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d'
    },

    // Info colors
    INFO: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a'
    }
} as const;

// Semantic color constants
export const SEMANTIC_COLORS = {
    // Background colors
    BACKGROUND: {
        PRIMARY: '#ffffff',
        SECONDARY: '#f8fafc',
        TERTIARY: '#f1f5f9',
        INVERSE: '#1e293b',
        OVERLAY: 'rgba(0, 0, 0, 0.5)',
        MUTED: '#f8fafc',
        ACCENT: '#f0f9ff'
    },

    // Text colors
    TEXT: {
        PRIMARY: '#1e293b',
        SECONDARY: '#475569',
        TERTIARY: '#64748b',
        INVERSE: '#ffffff',
        MUTED: '#94a3b8',
        ACCENT: '#0ea5e9',
        DISABLED: '#cbd5e1',
        LINK: '#0ea5e9',
        SUCCESS: '#16a34a',
        WARNING: '#d97706',
        ERROR: '#dc2626'
    },

    // Border colors
    BORDER: {
        PRIMARY: '#e2e8f0',
        SECONDARY: '#cbd5e1',
        TERTIARY: '#94a3b8',
        INVERSE: '#475569',
        MUTED: '#f1f5f9',
        ACCENT: '#0ea5e9',
        FOCUS: '#3b82f6',
        ERROR: '#ef4444',
        SUCCESS: '#22c55e',
        WARNING: '#f59e0b'
    }
} as const;

// Typography constants
export const TYPOGRAPHY = {
    // Font families
    FONT_FAMILY: {
        SANS: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        SERIF: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        MONO: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', 'SF Mono', 'Consolas', 'monospace'],
        DISPLAY: ['Inter Display', 'Inter', 'system-ui', 'sans-serif']
    },

    // Font sizes (in rem)
    FONT_SIZE: {
        XS: '0.75rem',    // 12px
        SM: '0.875rem',   // 14px
        BASE: '1rem',     // 16px
        LG: '1.125rem',   // 18px
        XL: '1.25rem',    // 20px
        '2XL': '1.5rem',  // 24px
        '3XL': '1.875rem', // 30px
        '4XL': '2.25rem', // 36px
        '5XL': '3rem',    // 48px
        '6XL': '3.75rem', // 60px
        '7XL': '4.5rem',  // 72px
        '8XL': '6rem',    // 96px
        '9XL': '8rem'    // 128px
    },

    // Font weights
    FONT_WEIGHT: {
        THIN: 100,
        EXTRA_LIGHT: 200,
        LIGHT: 300,
        NORMAL: 400,
        MEDIUM: 500,
        SEMIBOLD: 600,
        BOLD: 700,
        EXTRA_BOLD: 800,
        BLACK: 900
    },

    // Line heights
    LINE_HEIGHT: {
        NONE: 1,
        TIGHT: 1.25,
        SNUG: 1.375,
        NORMAL: 1.5,
        RELAXED: 1.625,
        LOOSE: 2
    },

    // Letter spacing
    LETTER_SPACING: {
        TIGHTEST: '-0.05em',
        TIGHTER: '-0.025em',
        NORMAL: '0em',
        WIDE: '0.025em',
        WIDER: '0.05em',
        WIDEST: '0.1em'
    }
} as const;

// Spacing constants
export const SPACING = {
    // Spacing scale (in rem)
    SCALE: {
        0: '0',
        PX: '1px',
        0.5: '0.125rem',  // 2px
        1: '0.25rem',     // 4px
        1.5: '0.375rem',  // 6px
        2: '0.5rem',      // 8px
        2.5: '0.625rem',  // 10px
        3: '0.75rem',     // 12px
        3.5: '0.875rem',  // 14px
        4: '1rem',        // 16px
        5: '1.25rem',     // 20px
        6: '1.5rem',      // 24px
        7: '1.75rem',     // 28px
        8: '2rem',        // 32px
        9: '2.25rem',     // 36px
        10: '2.5rem',     // 40px
        11: '2.75rem',    // 44px
        12: '3rem',       // 48px
        14: '3.5rem',     // 56px
        16: '4rem',       // 64px
        20: '5rem',       // 80px
        24: '6rem',       // 96px
        28: '7rem',       // 112px
        32: '8rem',       // 128px
        36: '9rem',       // 144px
        40: '10rem',      // 160px
        44: '11rem',      // 176px
        48: '12rem',      // 192px
        52: '13rem',      // 208px
        56: '14rem',      // 224px
        60: '15rem',      // 240px
        64: '16rem',      // 256px
        72: '18rem',      // 288px
        80: '20rem',      // 320px
        96: '24rem'      // 384px
    },

    // Common spacing values
    COMMON: {
        XS: '0.5rem',     // 8px
        SM: '1rem',        // 16px
        MD: '1.5rem',      // 24px
        LG: '2rem',        // 32px
        XL: '3rem',        // 48px
        '2XL': '4rem',     // 64px
        '3XL': '6rem'     // 96px
    }
} as const;

// Breakpoint constants
export const BREAKPOINTS = {
    // Breakpoint values (in px)
    VALUES: {
        XS: 0,
        SM: 576,
        MD: 768,
        LG: 992,
        XL: 1200,
        '2XL': 1400
    },

    // Media query strings
    MEDIA_QUERIES: {
        XS: '(max-width: 575px)',
        SM: '(min-width: 576px)',
        MD: '(min-width: 768px)',
        LG: '(min-width: 992px)',
        XL: '(min-width: 1200px)',
        '2XL': '(min-width: 1400px)'
    },

    // Container max widths
    CONTAINER_MAX_WIDTHS: {
        SM: '540px',
        MD: '720px',
        LG: '960px',
        XL: '1140px',
        '2XL': '1320px'
    }
} as const;

// Border radius constants
export const BORDER_RADIUS = {
    SCALE: {
        NONE: '0',
        SM: '0.125rem',   // 2px
        DEFAULT: '0.25rem', // 4px
        MD: '0.375rem',   // 6px
        LG: '0.5rem',     // 8px
        XL: '0.75rem',    // 12px
        '2XL': '1rem',    // 16px
        '3XL': '1.5rem',  // 24px
        FULL: '9999px'
    },

    // Common radius values
    COMMON: {
        NONE: '0',
        SM: '0.25rem',     // 4px
        MD: '0.5rem',      // 8px
        LG: '0.75rem',     // 12px
        XL: '1rem',        // 16px
        FULL: '9999px'
    }
} as const;

// Shadow constants
export const SHADOWS = {
    // Shadow definitions
    SCALE: {
        NONE: 'none',
        SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
    },

    // Colored shadows
    COLORED: {
        PRIMARY: '0 4px 14px 0 rgba(14, 165, 233, 0.39)',
        SUCCESS: '0 4px 14px 0 rgba(34, 197, 94, 0.39)',
        WARNING: '0 4px 14px 0 rgba(245, 158, 11, 0.39)',
        ERROR: '0 4px 14px 0 rgba(239, 68, 68, 0.39)'
    }
} as const;

// Animation constants
export const ANIMATION = {
    // Durations (in ms)
    DURATION: {
        FAST: 150,
        NORMAL: 300,
        SLOW: 500,
        EXTRA_SLOW: 1000
    },

    // Easing functions
    EASING: {
        LINEAR: 'linear',
        EASE: 'ease',
        EASE_IN: 'ease-in',
        EASE_OUT: 'ease-out',
        EASE_IN_OUT: 'ease-in-out',

        // Custom easing curves
        EASE_OUT_CUBIC: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        EASE_IN_OUT_CUBIC: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        EASE_OUT_QUART: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        EASE_IN_OUT_QUART: 'cubic-bezier(0.77, 0, 0.175, 1)'
    },

    // Common animations
    KEYFRAMES: {
        FADE_IN: {
            from: { opacity: 0 },
            to: { opacity: 1 }
        },
        FADE_OUT: {
            from: { opacity: 1 },
            to: { opacity: 0 }
        },
        SLIDE_UP: {
            from: { transform: 'translateY(100%)' },
            to: { transform: 'translateY(0)' }
        },
        SLIDE_DOWN: {
            from: { transform: 'translateY(-100%)' },
            to: { transform: 'translateY(0)' }
        },
        SLIDE_LEFT: {
            from: { transform: 'translateX(100%)' },
            to: { transform: 'translateX(0)' }
        },
        SLIDE_RIGHT: {
            from: { transform: 'translateX(-100%)' },
            to: { transform: 'translateX(0)' }
        },
        SCALE_IN: {
            from: { transform: 'scale(0.9)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 }
        },
        SCALE_OUT: {
            from: { transform: 'scale(1)', opacity: 1 },
            to: { transform: 'scale(0.9)', opacity: 0 }
        },
        PULSE: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 }
        },
        SPIN: {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' }
        },
        BOUNCE: {
            '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0, 0, 0)' },
            '40%, 43%': { transform: 'translate3d(0, -30px, 0)' },
            '70%': { transform: 'translate3d(0, -15px, 0)' },
            '90%': { transform: 'translate3d(0, -4px, 0)' }
        }
    }
} as const;

// Z-index constants
export const Z_INDEX = {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
    LOADING: 9999
} as const;

// Layout constants
export const LAYOUT = {
    // Container padding
    CONTAINER_PADDING: {
        SM: '1rem',
        MD: '1.5rem',
        LG: '2rem',
        XL: '3rem'
    },

    // Grid system
    GRID: {
        COLUMNS: 12,
        GUTTER_WIDTH: '1.5rem',
        GUTTER_WIDTH_COMPACT: '1rem',
        GUTTER_WIDTH_WIDE: '2rem'
    },

    // Header/footer heights
    COMPONENT_HEIGHTS: {
        HEADER_SM: '3rem',
        HEADER_MD: '4rem',
        HEADER_LG: '5rem',
        SIDEBAR: '16rem',
        SIDEBAR_COMPACT: '4rem',
        FOOTER: '4rem',
        TAB_BAR: '3rem'
    }
} as const;

// Theme variant constants
export const THEME_VARIANTS = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
    CUSTOM: 'custom'
} as const;

// CSS variable prefixes
export const CSS_VARIABLE_PREFIXES = {
    COLOR: '--color',
    SPACING: '--spacing',
    TYPOGRAPHY: '--typography',
    BORDER_RADIUS: '--radius',
    SHADOW: '--shadow',
    ANIMATION: '--animation',
    BREAKPOINT: '--breakpoint'
} as const;

// Core constants for backward compatibility
export const CORE_CONSTANTS = {
    DEFAULT_THEME_NAME: 'default',
    THEME_VARIANTS,
    CSS_VARIABLE_PREFIXES
} as const;

// Core validation rules
export const CORE_VALIDATION_RULES = {
    THEME_NAME_MIN_LENGTH: 1,
    THEME_NAME_MAX_LENGTH: 100,
    COLOR_HEX_REGEX: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    FONT_SIZE_MIN: 8,
    FONT_SIZE_MAX: 200
} as const;

// Core error codes
export const CORE_ERROR_CODES = {
    THEME_ERROR: 'THEME_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    CONFIG_ERROR: 'CONFIG_ERROR'
} as const;

// Core error messages
export const CORE_ERROR_MESSAGES = {
    THEME_ERROR: 'Theme system error occurred',
    VALIDATION_ERROR: 'Theme validation failed',
    CONFIG_ERROR: 'Theme configuration error',
    INVALID_THEME_NAME: 'Theme name must be between 1 and 100 characters',
    CONFIG_REQUIRED: 'Configuration must be an object',
    COLORS_REQUIRED: 'Theme colors must be an object',
    TYPOGRAPHY_REQUIRED: 'Theme typography must be an object',
    SPACING_REQUIRED: 'Theme spacing must be an object',
    SHADOWS_REQUIRED: 'Theme shadows must be an object'
} as const;
