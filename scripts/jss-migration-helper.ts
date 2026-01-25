/**
 * JSS Migration Helper - Manual Migration Patterns
 * 
 * This file contains common patterns and templates for migrating
 * JSS createUseStyles to styled-components.
 */

import { Theme } from '@/app/theme';

// Common JSS to styled-components conversion patterns
export const JSS_PATTERNS = {
    // Spacing conversions
    SPACING: {
        PATTERN: /theme\.spacing\(([^)]+)\)/g,
        REPLACEMENT: 'props.theme.spacing($1)'
    },

    // Color conversions
    COLORS: {
        PATTERN: /theme\.colors\.(\w+)/g,
        REPLACEMENT: 'props.theme.colors?.$1 || "default"'
    },

    // Typography conversions
    TYPOGRAPHY: {
        PATTERN: /theme\.typography\.(\w+)/g,
        REPLACEMENT: 'props.theme.typography.$1'
    },

    // Radius conversions
    RADIUS: {
        PATTERN: /theme\.radius\.(\w+)/g,
        REPLACEMENT: 'props.theme.radius.$1'
    },

    // Nested selectors
    NESTED: {
        PATTERN: /&\s*\./g,
        REPLACEMENT: '&.'
    }
};

// Template for styled-component
export const STYLED_COMPONENT_TEMPLATE = (componentName: string, styles: string) => `
export const ${componentName} = styled.div<{ theme: Theme }>\`
  ${styles}
\`;
`;

// Convert JSS object to CSS string
export const convertJSSObjectToCSS = (jssObject: any, theme: Theme): string => {
    let css = '';

    const processObject = (obj: any, indent = 0) => {
        const spaces = '  '.repeat(indent);

        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null) {
                // Handle nested styles (media queries, pseudo-selectors)
                if (key.startsWith('@') || key.startsWith('&')) {
                    css += `${spaces}${key} {\n`;
                    processObject(value, indent + 1);
                    css += `${spaces}}\n`;
                }
            } else {
                // Convert CSS properties
                const cssProperty = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                css += `${spaces}${cssProperty}: ${value};\n`;
            }
        }
    };

    processObject(jssObject);
    return css.trim();
};

// Example conversion function for specific patterns
export const convertAuthStyles = (theme: Theme) => {
    return {
        AuthContainer: `
      display: flex;
      flex-flow: row nowrap;
      background: ${theme.colors?.background || '#fafafa'};
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: inherit;
      
      .greeting-text {
        display: flex;
        padding: ${theme.spacing(theme.spacingFactor.md * 2)};
        flex-flow: column nowrap;
        min-width: min-content;
        align-items: flex-start;
        justify-content: flex-start;
        font-size: 3.2rem;
        align-self: center;
        gap: ${theme.spacing(theme.spacingFactor.md * 3)};
        height: 360px;
        text-wrap: nowrap;
      }
      
      @media (max-width: 720px) {
        flex-direction: column;
        justify-content: space-around;
        
        .greeting-text {
          align-items: center;
          height: fit-content;
        }
      }
    `,

        FormContainer: `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: ${theme.spacing(theme.spacingFactor.lg)};
      min-width: 400px;
      gap: ${theme.spacing(theme.spacingFactor.md)};
    `
    };
};
