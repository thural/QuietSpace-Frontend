/**
 * Application Typography System.
 * 
 * Defines font sizes, weights, and line heights for consistent typography.
 * Follows design system guidelines for readability and hierarchy.
 */

/**
 * Application typography tokens
 * @type {Readonly<Object.<string, any>>}
 */
export const typography = Object.freeze({
    // Font Families
    fontFamily: Object.freeze({
        sans: Object.freeze([
            'Inter',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'sans-serif'
        ]),
        serif: Object.freeze([
            'Georgia',
            'Times New Roman',
            'Times',
            'serif'
        ]),
        mono: Object.freeze([
            'JetBrains Mono',
            'Fira Code',
            'Consolas',
            'Monaco',
            'Liberation Mono',
            'Courier New',
            'monospace'
        ]),
        display: Object.freeze([
            'Inter Display',
            'Inter',
            'system-ui',
            'sans-serif'
        ]),
    }),

    // Font Sizes
    fontSize: Object.freeze({
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
        '6xl': '3.75rem', // 60px
        '7xl': '4.5rem',  // 72px
        '8xl': '6rem',    // 96px
        '9xl': '8rem',    // 128px
    }),

    // Font Weights
    fontWeight: Object.freeze({
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
    }),

    // Line Heights
    lineHeight: Object.freeze({
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
    }),

    // Letter Spacing
    letterSpacing: Object.freeze({
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    }),

    // Typography Scale for Components
    scale: Object.freeze({
        // Display typography
        display: Object.freeze({
            fontSize: '4.5rem',
            fontWeight: '800',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
        }),

        // Heading typography
        h1: Object.freeze({
            fontSize: '3rem',
            fontWeight: '700',
            lineHeight: '1.2',
            letterSpacing: '-0.025em',
        }),
        h2: Object.freeze({
            fontSize: '2.25rem',
            fontWeight: '600',
            lineHeight: '1.3',
            letterSpacing: '-0.025em',
        }),
        h3: Object.freeze({
            fontSize: '1.875rem',
            fontWeight: '600',
            lineHeight: '1.4',
            letterSpacing: '-0.025em',
        }),
        h4: Object.freeze({
            fontSize: '1.5rem',
            fontWeight: '600',
            lineHeight: '1.4',
            letterSpacing: '0em',
        }),
        h5: Object.freeze({
            fontSize: '1.25rem',
            fontWeight: '600',
            lineHeight: '1.5',
            letterSpacing: '0em',
        }),
        h6: Object.freeze({
            fontSize: '1.125rem',
            fontWeight: '600',
            lineHeight: '1.5',
            letterSpacing: '0em',
        }),

        // Body typography
        body1: Object.freeze({
            fontSize: '1rem',
            fontWeight: '400',
            lineHeight: '1.6',
            letterSpacing: '0em',
        }),
        body2: Object.freeze({
            fontSize: '0.875rem',
            fontWeight: '400',
            lineHeight: '1.6',
            letterSpacing: '0em',
        }),
        body3: Object.freeze({
            fontSize: '0.75rem',
            fontWeight: '400',
            lineHeight: '1.5',
            letterSpacing: '0em',
        }),

        // UI typography
        caption: Object.freeze({
            fontSize: '0.75rem',
            fontWeight: '500',
            lineHeight: '1.4',
            letterSpacing: '0.025em',
        }),
        overline: Object.freeze({
            fontSize: '0.75rem',
            fontWeight: '600',
            lineHeight: '1.4',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
        }),
        label: Object.freeze({
            fontSize: '0.875rem',
            fontWeight: '500',
            lineHeight: '1.4',
            letterSpacing: '0em',
        }),

        // Special typography
        code: Object.freeze({
            fontSize: '0.875rem',
            fontWeight: '400',
            lineHeight: '1.5',
            fontFamily: 'JetBrains Mono, monospace',
        }),
        blockquote: Object.freeze({
            fontSize: '1.125rem',
            fontWeight: '400',
            lineHeight: '1.7',
            fontStyle: 'italic',
        }),
    }),
});

export default typography;
