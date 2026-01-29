/**
 * UI Components Constants
 * 
 * Centralized constants for UI components including sizes, variants,
 * default props, animation settings, and component-specific configurations.
 */

// Component size constants
export const COMPONENT_SIZES = {
    BUTTON: {
        XS: 'xs',
        SM: 'sm',
        MD: 'md',
        LG: 'lg',
        XL: 'xl',
    },
    INPUT: {
        SM: 'sm',
        MD: 'md',
        LG: 'lg',
    },
    AVATAR: {
        XS: 'xs',
        SM: 'sm',
        MD: 'md',
        LG: 'lg',
        XL: 'xl',
        '2XL': '2xl',
    },
    CONTAINER: {
        SM: 'sm',
        MD: 'md',
        LG: 'lg',
        XL: 'xl',
        FULL: 'full',
    },
} as const;

// Component variant constants
export const COMPONENT_VARIANTS = {
    BUTTON: {
        FILLED: 'filled',
        OUTLINE: 'outline',
        LIGHT: 'light',
        GRADIENT: 'gradient',
        SUBTLE: 'subtle',
        TRANSPARENT: 'transparent',
    },
    INPUT: {
        DEFAULT: 'default',
        FILLED: 'filled',
        UNSTYLED: 'unstyled',
    },
    TEXT: {
        PRIMARY: 'primary',
        SECONDARY: 'secondary',
        TERTIARY: 'tertiary',
        MUTE: 'mute',
        SUCCESS: 'success',
        WARNING: 'warning',
        ERROR: 'error',
        LINK: 'link',
    },
    TITLE: {
        PRIMARY: 'primary',
        SECONDARY: 'secondary',
        TERTIARY: 'tertiary',
        MUTE: 'mute',
        SUCCESS: 'success',
        WARNING: 'warning',
        ERROR: 'error',
    },
    BADGE: {
        FILLED: 'filled',
        OUTLINE: 'outline',
        LIGHT: 'light',
        DOT: 'dot',
    },
    LOADING_OVERLAY: {
        OVERLAY: 'overlay',
        OPAQUE: 'opaque',
        TRANSPARENT: 'transparent',
    },
} as const;

// Component color constants
export const COMPONENT_COLORS = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info',
    GRAY: 'gray',
    DARK: 'dark',
    LIGHT: 'light',
    WHITE: 'white',
} as const;

// Component spacing constants
export const COMPONENT_SPACING = {
    // Button spacing
    BUTTON: {
        PADDING_X: {
            XS: '0.5rem',
            SM: '0.75rem',
            MD: '1rem',
            LG: '1.5rem',
            XL: '2rem',
        },
        PADDING_Y: {
            XS: '0.25rem',
            SM: '0.375rem',
            MD: '0.5rem',
            LG: '0.75rem',
            XL: '1rem',
        },
    },

    // Input spacing
    INPUT: {
        PADDING_X: {
            SM: '0.75rem',
            MD: '1rem',
            LG: '1.25rem',
        },
        PADDING_Y: {
            SM: '0.5rem',
            MD: '0.625rem',
            LG: '0.75rem',
        },
    },

    // Container spacing
    CONTAINER: {
        PADDING: {
            SM: '1rem',
            MD: '1.5rem',
            LG: '2rem',
            XL: '3rem',
            FULL: '4rem',
        },
        MARGIN: {
            SM: '1rem',
            MD: '1.5rem',
            LG: '2rem',
            XL: '3rem',
            FULL: '4rem',
        },
    },
} as const;

// Component border radius constants
export const COMPONENT_BORDER_RADIUS = {
    BUTTON: {
        XS: '0.125rem',
        SM: '0.25rem',
        MD: '0.375rem',
        LG: '0.5rem',
        XL: '0.75rem',
        FULL: '9999px',
    },
    INPUT: {
        SM: '0.25rem',
        MD: '0.375rem',
        LG: '0.5rem',
        FULL: '9999px',
    },
    AVATAR: {
        XS: '0.125rem',
        SM: '0.25rem',
        MD: '0.375rem',
        LG: '0.5rem',
        XL: '0.75rem',
        '2XL': '1rem',
        FULL: '50%',
    },
    CONTAINER: {
        SM: '0.25rem',
        MD: '0.5rem',
        LG: '0.75rem',
        XL: '1rem',
        FULL: '9999px',
    },
} as const;

// Component typography constants
export const COMPONENT_TYPOGRAPHY = {
    TEXT: {
        FONT_SIZES: {
            XS: '0.75rem',
            SM: '0.875rem',
            MD: '1rem',
            LG: '1.125rem',
            XL: '1.25rem',
            '2XL': '1.5rem',
            '3XL': '1.875rem',
        },
        FONT_WEIGHTS: {
            LIGHT: 300,
            NORMAL: 400,
            MEDIUM: 500,
            SEMIBOLD: 600,
            BOLD: 700,
        },
        LINE_HEIGHTS: {
            TIGHT: 1.25,
            NORMAL: 1.5,
            RELAXED: 1.75,
        },
    },
    TITLE: {
        FONT_SIZES: {
            H1: '2.25rem',
            H2: '1.875rem',
            H3: '1.5rem',
            H4: '1.25rem',
            H5: '1.125rem',
            H6: '1rem',
        },
        FONT_WEIGHTS: {
            LIGHT: 300,
            NORMAL: 400,
            MEDIUM: 500,
            SEMIBOLD: 600,
            BOLD: 700,
        },
        LINE_HEIGHTS: {
            TIGHT: 1.2,
            NORMAL: 1.4,
            RELAXED: 1.6,
        },
    },
} as const;

// Component animation constants
export const COMPONENT_ANIMATIONS = {
    // Durations (in ms)
    DURATIONS: {
        FAST: 150,
        NORMAL: 250,
        SLOW: 350,
        EXTRA_SLOW: 500,
    },

    // Easing functions
    EASING: {
        EASE: 'ease',
        EASE_IN: 'ease-in',
        EASE_OUT: 'ease-out',
        EASE_IN_OUT: 'ease-in-out',
    },

    // Transitions
    TRANSITIONS: {
        BUTTON: 'all 0.2s ease-in-out',
        INPUT: 'all 0.15s ease-in-out',
        AVATAR: 'all 0.3s ease-in-out',
        LOADING_OVERLAY: 'all 0.25s ease-in-out',
        SKELETON: 'all 1.5s ease-in-out infinite',
    },

    // Keyframes
    KEYFRAMES: {
        FADE_IN: 'fadeIn 0.2s ease-in-out',
        FADE_OUT: 'fadeOut 0.2s ease-in-out',
        SLIDE_UP: 'slideUp 0.3s ease-out',
        SLIDE_DOWN: 'slideDown 0.3s ease-out',
        SCALE_IN: 'scaleIn 0.2s ease-out',
        PULSE: 'pulse 1.5s ease-in-out infinite',
        SPIN: 'spin 1s linear infinite',
        SKELETON_LOADING: 'skeletonLoading 1.5s ease-in-out infinite',
    },
} as const;

// Component z-index constants
export const COMPONENT_Z_INDEX = {
    DROPDOWN: 1000,
    MODAL: 1050,
    TOOLTIP: 1070,
    LOADING_OVERLAY: 1100,
    TOAST: 1200,
    POPOVER: 1300,
} as const;

// Component specific constants
export const BUTTON_CONSTANTS = {
    // Default props
    DEFAULT_PROPS: {
        variant: 'filled',
        size: 'md',
        color: 'primary',
        disabled: false,
        loading: false,
        fullWidth: false,
    },

    // Loading states
    LOADING: {
        SPINNER_SIZE: {
            XS: 12,
            SM: 14,
            MD: 16,
            LG: 18,
            XL: 20,
        },
    },

    // Icon spacing
    ICON_SPACING: {
        LEFT: '0.5rem',
        RIGHT: '0.5rem',
    },
} as const;

export const INPUT_CONSTANTS = {
    // Default props
    DEFAULT_PROPS: {
        variant: 'default',
        size: 'md',
        disabled: false,
        error: false,
        required: false,
        fullWidth: false,
    },

    // Validation states
    VALIDATION_STATES: {
        SUCCESS: 'success',
        WARNING: 'warning',
        ERROR: 'error',
    },

    // Icon sizing
    ICON_SIZE: {
        SM: 16,
        MD: 18,
        LG: 20,
    },
} as const;

export const AVATAR_CONSTANTS = {
    // Default props
    DEFAULT_PROPS: {
        size: 'md',
        variant: 'circle',
        color: 'primary',
    },

    // Size dimensions (in px)
    SIZE_DIMENSIONS: {
        XS: 24,
        SM: 32,
        MD: 40,
        LG: 48,
        XL: 56,
        '2XL': 64,
    },

    // Fallback text
    FALLBACK_TEXT: {
        MAX_LENGTH: 2,
    },
} as const;

export const LOADING_OVERLAY_CONSTANTS = {
    // Default props
    DEFAULT_PROPS: {
        variant: 'overlay',
        visible: false,
        blur: 2,
        opacity: 0.7,
    },

    // Blur values
    BLUR_VALUES: {
        NONE: 0,
        SUBTLE: 1,
        NORMAL: 2,
        STRONG: 4,
    },
} as const;

export const SKELETON_CONSTANTS = {
    // Default props
    DEFAULT_PROPS: {
        visible: true,
        animate: true,
        height: 'auto',
        width: '100%',
    },

    // Animation speeds
    ANIMATION_SPEEDS: {
        SLOW: 2,
        NORMAL: 1.5,
        FAST: 1,
    },
} as const;

export const TABS_CONSTANTS = {
    // Default props
    DEFAULT_PROPS: {
        variant: 'default',
        color: 'primary',
        size: 'md',
        fullWidth: false,
    },

    // Tab positions
    POSITIONS: {
        TOP: 'top',
        BOTTOM: 'bottom',
        LEFT: 'left',
        RIGHT: 'right',
    },
} as const;

export const PROGRESS_CONSTANTS = {
    // Default props
    DEFAULT_PROPS: {
        value: 0,
        size: 'md',
        color: 'primary',
        striped: false,
        animated: false,
    },

    // Size heights (in px)
    SIZE_HEIGHTS: {
        XS: 4,
        SM: 6,
        MD: 8,
        LG: 10,
        XL: 12,
    },
} as const;

// Component accessibility constants
export const ACCESSIBILITY_CONSTANTS = {
    // ARIA roles
    ROLES: {
        BUTTON: 'button',
        INPUT: 'textbox',
        TAB: 'tab',
        TABLIST: 'tablist',
        TABPANEL: 'tabpanel',
        PROGRESSBAR: 'progressbar',
        ALERT: 'alert',
        DIALOG: 'dialog',
    },

    // ARIA attributes
    ATTRIBUTES: {
        DISABLED: 'aria-disabled',
        REQUIRED: 'aria-required',
        INVALID: 'aria-invalid',
        EXPANDED: 'aria-expanded',
        SELECTED: 'aria-selected',
        LABELLEDBY: 'aria-labelledby',
        DESCRIBEDBY: 'aria-describedby',
    },

    // Keyboard navigation
    KEYBOARD: {
        ENTER: 'Enter',
        SPACE: ' ',
        ESCAPE: 'Escape',
        ARROW_UP: 'ArrowUp',
        ARROW_DOWN: 'ArrowDown',
        ARROW_LEFT: 'ArrowLeft',
        ARROW_RIGHT: 'ArrowRight',
        TAB: 'Tab',
        HOME: 'Home',
        END: 'End',
    },
} as const;

// Component testing constants
export const TESTING_CONSTANTS = {
    // Test ID prefixes
    ID_PREFIXES: {
        BUTTON: 'btn',
        INPUT: 'input',
        AVATAR: 'avatar',
        LOADING_OVERLAY: 'loading-overlay',
        SKELETON: 'skeleton',
        TABS: 'tabs',
        PROGRESS: 'progress',
        BADGE: 'badge',
    },

    // Test data attributes
    DATA_ATTRIBUTES: {
        TEST_ID: 'data-testid',
        VARIANT: 'data-variant',
        SIZE: 'data-size',
        COLOR: 'data-color',
        STATE: 'data-state',
    },
} as const;
