/**
 * Application Typography System.
 * 
 * Defines font sizes, weights, and line heights for consistent typography.
 * Follows design system guidelines for readability and hierarchy.
 */

export const typography = {
  // Font Families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Liberation Mono', 'Courier New', 'monospace'],
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line Heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
    loose: '2',
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },

  // Text Styles
  heading: {
    h1: {
      fontSize: '1.875rem',  // 30px
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '1.5rem',   // 24px
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    h3: {
      fontSize: '1.25rem',  // 20px
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    h4: {
      fontSize: '1.125rem', // 18px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    h5: {
      fontSize: '1rem',      // 16px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    h6: {
      fontSize: '0.875rem',  // 14px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    },
  },

  body: {
    large: {
      fontSize: '1.125rem', // 18px
      fontWeight: '400',
      lineHeight: '1.75',
      letterSpacing: '0',
    },
    base: {
      fontSize: '1rem',      // 16px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    small: {
      fontSize: '0.875rem',  // 14px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    xs: {
      fontSize: '0.75rem',   // 12px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
  },

  caption: {
    fontSize: '0.75rem',   // 12px
    fontWeight: '500',
    lineHeight: '1.5',
    letterSpacing: '0.025em',
  },
} as const;

export type TypographyKeys = keyof typeof typography;
