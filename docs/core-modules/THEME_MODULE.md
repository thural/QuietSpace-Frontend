# Theme Module Documentation

## Overview

The Theme module provides an enterprise-grade theming system with comprehensive design tokens, multiple theme variants, responsive utilities, and perfect BlackBox architecture compliance. It supports light/dark themes, custom themes, and advanced styling utilities.

## Architecture

### Facade Pattern Implementation

The Theme module follows the **Facade pattern** with:
- **Clean Public API**: Only interfaces, factory functions, and hooks exported
- **Hidden Implementation**: Internal theme composers and utilities encapsulated
- **Factory Pattern**: Clean theme creation with pre-configured setups
- **Type Safety**: Full TypeScript support with generic theme types

### Module Structure

```
src/core/theme/
├── public.ts               # Public API exports
├── tokens.ts               # Design tokens
├── interfaces.ts           # Theme interfaces
├── composer.ts             # Theme composition
├── variants.ts             # Theme variants
├── factory.ts              # Theme factory functions
├── enhancers/              # Theme enhancers
├── hooks/                  # React hooks
├── providers/              # React providers
└── index.ts               # Clean public API exports
```

## Core Interfaces

### EnhancedTheme

The main theme interface:

```typescript
interface EnhancedTheme {
    // Color system
    colors: {
        primary: ColorPalette;
        secondary: ColorPalette;
        neutral: ColorPalette;
        semantic: SemanticColors;
        background: BackgroundColors;
        text: TextColors;
        border: BorderColors;
    };
    
    // Typography system
    typography: {
        fontSize: FontSize;
        fontWeight: FontWeight;
        lineHeight: LineHeight;
        fontFamily: FontFamily;
        letterSpacing: LetterSpacing;
    };
    
    // Spacing system
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
        [key: string]: string;
    };
    
    // Layout system
    layout: {
        maxWidth: Record<string, string>;
        breakpoints: Breakpoint;
        container: Container;
        grid: Grid;
    };
    
    // Visual effects
    shadows: Shadow;
    radius: Radius;
    animations: AnimationTokens;
    
    // Component-specific tokens
    components: {
        button: ComponentTokens;
        input: ComponentTokens;
        card: ComponentTokens;
        modal: ComponentTokens;
        [key: string]: ComponentTokens;
    };
    
    // Theme metadata
    metadata: {
        name: string;
        variant: string;
        version: string;
        isDark: boolean;
    };
}
```

### Data Types

```typescript
interface ColorPalette {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // Primary color
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
}

interface SemanticColors {
    success: string;
    warning: string;
    error: string;
    info: string;
}

interface BackgroundColors {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
}

interface TextColors {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    disabled: string;
}

interface BorderColors {
    primary: string;
    secondary: string;
    tertiary: string;
    focus: string;
    error: string;
}

interface FontSize {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
}

interface FontWeight {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
}

interface Spacing {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
    40: string;
    48: string;
    56: string;
    64: string;
}

interface Shadow {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
}

interface Radius {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
}

interface AnimationTokens {
    duration: {
        fast: string;
        normal: string;
        slow: string;
    };
    easing: {
        ease: string;
        easeIn: string;
        easeOut: string;
        easeInOut: string;
    };
}

interface ComponentTokens {
    background: string;
    color: string;
    border: string;
    radius: string;
    padding: string;
    margin: string;
    fontSize: string;
    fontWeight: number;
    [key: string]: any;
}
```

## Factory Functions

### Basic Theme Creation

```typescript
import { 
    createTheme,
    createDefaultTheme,
    createCustomTheme 
} from '@/core/theme';

// Create with default configuration
const defaultTheme = createDefaultTheme();

// Create with custom configuration
const customTheme = createTheme({
    name: 'Custom Theme',
    colors: {
        primary: {
            50: '#eff6ff',
            500: '#3b82f6',
            900: '#1e3a8a'
        },
        // ... other colors
    },
    typography: {
        fontSize: {
            base: '16px',
            lg: '18px'
        }
    },
    spacing: {
        md: '16px',
        lg: '24px'
    }
});

// Create with variant
const darkTheme = createThemeWithVariant('dark', {
    colors: {
        background: {
            primary: '#000000',
            secondary: '#1a1a1a'
        },
        text: {
            primary: '#ffffff',
            secondary: '#cccccc'
        }
    }
});
```

### Theme Composition

```typescript
import { ThemeComposer, themeComposer } from '@/core/theme';

// Compose multiple themes
const composedTheme = themeComposer
    .addBase(defaultTheme)
    .addVariant('dark', darkOverrides)
    .addEnhancement('accessibility', accessibilityEnhancements)
    .addEnhancement('brand', brandColors)
    .compose();

// Manual composition
const composer = new ThemeComposer();
composer.addBase(defaultTheme);
composer.addVariant('dark', darkOverrides);
const finalTheme = composer.compose();
```

### Component-Specific Themes

```typescript
import { createCustomTheme } from '@/core/theme';

const componentTheme = createCustomTheme({
    name: 'Component Theme',
    components: {
        button: {
            primary: {
                background: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                radius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 500,
                transition: 'all 0.2s ease'
            },
            secondary: {
                background: 'transparent',
                color: '#3b82f6',
                border: '1px solid #3b82f6',
                radius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 500
            }
        },
        input: {
            default: {
                background: '#ffffff',
                color: '#1f2937',
                border: '1px solid #d1d5db',
                radius: '6px',
                padding: '8px 12px',
                fontSize: '16px'
            },
            focus: {
                border: '1px solid #3b82f6',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
            }
        }
    }
});
```

## Usage Patterns

### React Integration

```typescript
import { 
    EnhancedThemeProvider,
    useEnhancedTheme,
    useThemeSwitch 
} from '@/core/theme';

function App() {
    return (
        <EnhancedThemeProvider theme={defaultTheme}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </Router>
        </EnhancedThemeProvider>
    );
}

function HomePage() {
    const theme = useEnhancedTheme();
    
    return (
        <div style={{
            backgroundColor: theme.colors.background.primary,
            color: theme.colors.text.primary,
            padding: theme.spacing.lg,
            fontFamily: theme.typography.fontFamily.sans
        }}>
            <h1 style={{
                fontSize: theme.typography.fontSize['3xl'],
                fontWeight: theme.typography.fontWeight.bold,
                marginBottom: theme.spacing.md
            }}>
                Welcome
            </h1>
        </div>
    );
}

function ThemeSwitcher() {
    const { theme, currentVariant, switchTheme, availableVariants } = useThemeSwitch();
    
    return (
        <div>
            <p>Current theme: {theme.metadata.name} ({currentVariant})</p>
            <div>
                {availableVariants.map(variant => (
                    <button
                        key={variant}
                        onClick={() => switchTheme(variant)}
                        style={{
                            backgroundColor: currentVariant === variant 
                                ? theme.colors.primary[500] 
                                : theme.colors.background.secondary,
                            color: currentVariant === variant 
                                ? '#ffffff' 
                                : theme.colors.text.primary,
                            padding: theme.spacing.sm,
                            marginRight: theme.spacing.sm,
                            borderRadius: theme.radius.md
                        }}
                    >
                        {variant}
                    </button>
                ))}
            </div>
        </div>
    );
}
```

### Styled Components Integration

```typescript
import styled, { css } from 'styled-components';
import { useEnhancedTheme, createStyledComponent, media } from '@/core/theme';

// Using createStyledComponent utility
const Button = createStyledComponent('button')<{
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}>`
    ${({ theme, variant = 'primary', size = 'md' }) => css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: ${theme.radius.md};
        font-family: ${theme.typography.fontFamily.sans};
        font-weight: ${theme.typography.fontWeight.medium};
        cursor: pointer;
        transition: all ${theme.animations.duration.normal} ${theme.animations.easing.ease};
        
        ${variant === 'primary' && css`
            background-color: ${theme.colors.primary[500]};
            color: ${theme.colors.background.inverse};
            
            &:hover {
                background-color: ${theme.colors.primary[600]};
            }
            
            &:active {
                background-color: ${theme.colors.primary[700]};
            }
        `}
        
        ${variant === 'secondary' && css`
            background-color: transparent;
            color: ${theme.colors.primary[500]};
            border: 1px solid ${theme.colors.primary[500]};
            
            &:hover {
                background-color: ${theme.colors.primary[50]};
            }
        `}
        
        ${variant === 'danger' && css`
            background-color: ${theme.colors.semantic.error};
            color: ${theme.colors.background.inverse};
            
            &:hover {
                background-color: ${theme.colors.semantic.error};
                opacity: 0.9;
            }
        `}
        
        ${size === 'sm' && css`
            padding: ${theme.spacing.sm} ${theme.spacing.md};
            font-size: ${theme.typography.fontSize.sm};
        `}
        
        ${size === 'md' && css`
            padding: ${theme.spacing.md} ${theme.spacing.lg};
            font-size: ${theme.typography.fontSize.base};
        `}
        
        ${size === 'lg' && css`
            padding: ${theme.spacing.lg} ${theme.spacing.xl};
            font-size: ${theme.typography.fontSize.lg};
        `}
        
        &:focus {
            outline: none;
            box-shadow: 0 0 0 3px ${theme.colors.primary[200]};
        }
        
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `}
`;

// Using traditional styled-components with theme
const Card = styled.div`
    background-color: ${props => props.theme.colors.background.secondary};
    border: 1px solid ${props => props.theme.colors.border.primary};
    border-radius: ${props => props.theme.radius.lg};
    padding: ${props => props.theme.spacing.lg};
    box-shadow: ${props => props.theme.shadows.md};
    
    ${media.mobile(css`
        padding: ${props => props.theme.spacing.md};
        border-radius: ${props => props.theme.radius.md};
    `)}
`;

// Usage
function ComponentExample() {
    const theme = useEnhancedTheme();
    
    return (
        <div>
            <Button variant="primary" size="lg">
                Primary Button
            </Button>
            
            <Button variant="secondary" size="md">
                Secondary Button
            </Button>
            
            <Card>
                <h2 style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.fontSize.xl,
                    marginBottom: theme.spacing.md
                }}>
                    Card Title
                </h2>
                <p style={{
                    color: theme.colors.text.secondary,
                    lineHeight: theme.typography.lineHeight.normal
                }}>
                    Card content goes here...
                </p>
            </Card>
        </div>
    );
}
```

### Theme Tokens Usage

```typescript
import { useThemeTokens } from '@/core/theme';

function TokenExample() {
    const tokens = useThemeTokens();
    
    return (
        <div style={{
            // Using spacing tokens
            padding: tokens.spacing.lg,
            margin: tokens.spacing.md,
            
            // Using color tokens
            backgroundColor: tokens.colors.background.primary,
            color: tokens.colors.text.primary,
            borderColor: tokens.colors.border.primary,
            
            // Using typography tokens
            fontSize: tokens.typography.fontSize.base,
            fontWeight: tokens.typography.fontWeight.medium,
            fontFamily: tokens.typography.fontFamily.sans,
            
            // Using layout tokens
            maxWidth: tokens.layout.maxWidth.md,
            
            // Using visual tokens
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.shadows.md
        }}>
            Content with theme tokens
        </div>
    );
}
```

### Responsive Design

```typescript
import { createStyledComponent, media } from '@/core/theme';

const ResponsiveContainer = createStyledComponent('div')`
    width: 100%;
    padding: ${props => props.theme.spacing.lg};
    
    ${media.mobile(css`
        padding: ${props => props.theme.spacing.md};
    `)}
    
    ${media.tablet(css`
        padding: ${props => props.theme.spacing.lg};
        max-width: ${props => props.theme.layout.maxWidth.sm};
        margin: 0 auto;
    `)}
    
    ${media.desktop(css`
        max-width: ${props => props.theme.layout.maxWidth.lg};
        margin: 0 auto;
    `)}
    
    ${media.large(css`
        max-width: ${props => props.theme.layout.maxWidth.xl};
        margin: 0 auto;
    `)}
`;

const ResponsiveGrid = createStyledComponent('div')`
    display: grid;
    gap: ${props => props.theme.spacing.md};
    
    ${media.mobile(css`
        grid-template-columns: 1fr;
    `)}
    
    ${media.tablet(css`
        grid-template-columns: repeat(2, 1fr);
    `)}
    
    ${media.desktop(css`
        grid-template-columns: repeat(3, 1fr);
    `)}
`;
```

## Advanced Features

### Theme Variants

```typescript
import { getThemeVariants, defaultTheme } from '@/core/theme';

// Get available variants
const variants = getThemeVariants();
console.log(variants); // ['light', 'dark', 'high-contrast']

// Create theme with multiple variants
const multiVariantTheme = createTheme({
    name: 'Multi Variant Theme',
    variants: {
        light: {
            colors: {
                background: { primary: '#ffffff' },
                text: { primary: '#000000' }
            }
        },
        dark: {
            colors: {
                background: { primary: '#000000' },
                text: { primary: '#ffffff' }
            }
        },
        highContrast: {
            colors: {
                background: { primary: '#ffffff' },
                text: { primary: '#000000' },
                border: { primary: '#000000' }
            }
        }
    }
});
```

### Theme Enhancements

```typescript
import { enhanceTheme } from '@/core/theme';

// Add accessibility enhancements
const accessibleTheme = enhanceTheme(defaultTheme, 'accessibility', {
    colors: {
        semantic: {
            success: '#006600',  // Higher contrast
            warning: '#cc6600',
            error: '#cc0000',
            info: '#0066cc'
        }
    },
    typography: {
        fontSize: {
            base: '18px', // Larger default font size
            lg: '20px'
        }
    }
});

// Add brand colors
const brandedTheme = enhanceTheme(defaultTheme, 'brand', {
    colors: {
        brand: {
            primary: '#ff6b35',
            secondary: '#004643',
            accent: '#ffd23f'
        }
    },
    components: {
        button: {
            primary: {
                background: '#ff6b35',
                color: '#ffffff'
            }
        }
    }
});
```

### Dynamic Theme Updates

```typescript
import { useEnhancedTheme } from '@/core/theme';

function DynamicThemeExample() {
    const { theme, updateTheme } = useEnhancedTheme();
    
    const updateColors = () => {
        updateTheme({
            colors: {
                primary: {
                    500: '#ff6b35' // Change primary color
                }
            }
        });
    };
    
    const updateSpacing = () => {
        updateTheme({
            spacing: {
                md: '20px', // Increase medium spacing
                lg: '32px'
            }
        });
    };
    
    return (
        <div>
            <button onClick={updateColors}>
                Update Colors
            </button>
            <button onClick={updateSpacing}>
                Update Spacing
            </button>
        </div>
    );
}
```

### Theme Persistence

```typescript
import { useEffect } from 'react';
import { useThemeSwitch } from '@/core/theme';

function ThemePersistence() {
    const { currentVariant, switchTheme } = useThemeSwitch();
    
    useEffect(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('theme-variant');
        if (savedTheme && savedTheme !== currentVariant) {
            switchTheme(savedTheme);
        }
    }, [currentVariant, switchTheme]);
    
    useEffect(() => {
        // Save theme changes to localStorage
        localStorage.setItem('theme-variant', currentVariant);
    }, [currentVariant]);
    
    return null;
}
```

## Configuration

### Theme Configuration

```typescript
// config/theme/theme.config.ts
export const themeConfig = {
    defaultVariant: 'light',
    enableTransitions: true,
    enableAnimations: true,
    enableResponsive: true,
    breakpoints: {
        mobile: '480px',
        tablet: '768px',
        desktop: '1024px',
        large: '1280px'
    },
    spacing: {
        scale: 4, // 4px base unit
        unit: 'px'
    },
    typography: {
        baseFontSize: '16px',
        lineHeightRatio: 1.5
    }
};

export const getThemeConfig = () => themeConfig;
```

### Custom Theme Creation

```typescript
// themes/custom.ts
import { createTheme } from '@/core/theme';

export const customTheme = createTheme({
    name: 'Custom Brand Theme',
    variant: 'light',
    
    colors: {
        primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9', // Primary brand color
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49'
        },
        semantic: {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        }
    },
    
    typography: {
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            serif: ['Georgia', 'serif'],
            mono: ['JetBrains Mono', 'monospace']
        },
        fontSize: {
            xs: '12px',
            sm: '14px',
            base: '16px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
            '3xl': '30px',
            '4xl': '36px'
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        }
    },
    
    spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px'
    },
    
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    
    radius: {
        none: '0px',
        sm: '2px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '9999px'
    },
    
    animations: {
        duration: {
            fast: '150ms',
            normal: '250ms',
            slow: '350ms'
        },
        easing: {
            ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
    }
});
```

## Best Practices

### Token Usage

```typescript
// Good: Use semantic tokens
const Button = styled.button`
    background-color: ${props => props.theme.colors.primary[500]};
    color: ${props => props.theme.colors.background.inverse};
    border-radius: ${props => props.theme.radius.md};
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
`;

// Bad: Hard-coded values
const BadButton = styled.button`
    background-color: #3b82f6;
    color: #ffffff;
    border-radius: 6px;
    padding: 16px 24px;
`;
```

### Responsive Design

```typescript
// Good: Use responsive utilities
const ResponsiveComponent = createStyledComponent('div')`
    padding: ${props => props.theme.spacing.md};
    
    ${media.mobile(css`
        padding: ${props => props.theme.spacing.sm};
    `)}
    
    ${media.tablet(css`
        padding: ${props => props.theme.spacing.lg};
    `)}
`;

// Bad: Fixed breakpoints
const BadComponent = styled.div`
    padding: 16px;
    
    @media (max-width: 768px) {
        padding: 8px;
    }
`;
```

### Component Theming

```typescript
// Good: Use component tokens
const ThemedButton = createStyledComponent('button')<{ variant?: 'primary' | 'secondary' }>`
    ${({ theme, variant = 'primary' }) => css`
        ${theme.components.button[variant]}
    `}
`;

// Bad: Inline styling
const BadButton = styled.button`
    background-color: ${props => props.variant === 'primary' 
        ? props.theme.colors.primary[500] 
        : 'transparent'
    };
`;
```

## Testing

### Theme Testing

```typescript
import { render, screen } from '@testing-library/react';
import { EnhancedThemeProvider } from '@/core/theme';

const TestTheme = createTheme({
    name: 'Test Theme',
    colors: {
        primary: {
            500: '#ff0000'
        }
    }
});

test('should use custom theme', () => {
    render(
        <EnhancedThemeProvider theme={TestTheme}>
            <Button>Test Button</Button>
        </EnhancedThemeProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: #ff0000');
});
```

### Theme Hook Testing

```typescript
import { renderHook } from '@testing-library/react';
import { EnhancedThemeProvider, useEnhancedTheme } from '@/core/theme';

test('should return theme from hook', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <EnhancedThemeProvider theme={defaultTheme}>
            {children}
        </EnhancedThemeProvider>
    );
    
    const { result } = renderHook(() => useEnhancedTheme(), { wrapper });
    
    expect(result.current.colors.primary[500]).toBe('#3b82f6');
});
```

## Migration Guide

### From Inline Styles

**Before (inline styles):**
```typescript
const Component = () => (
    <div style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '16px',
        borderRadius: '8px'
    }}>
        Content
    </div>
);
```

**After (theme module):**
```typescript
import { createStyledComponent } from '@/core/theme';

const Container = createStyledComponent('div')`
    background-color: ${props => props.theme.colors.background.primary};
    color: ${props => props.theme.colors.text.primary};
    padding: ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.radius.md};
`;

const Component = () => (
    <Container>
        Content
    </Container>
);
```

### From CSS-in-JS

**Before (styled-components without theme):**
```typescript
const Button = styled.button`
    background-color: #3b82f6;
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 6px;
`;
```

**After (theme module):**
```typescript
import { createStyledComponent } from '@/core/theme';

const Button = createStyledComponent('button')`
    background-color: ${props => props.theme.colors.primary[500]};
    color: ${props => props.theme.colors.background.inverse};
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
    border-radius: ${props => props.theme.radius.md};
`;
```

## Troubleshooting

### Common Issues

1. **Theme Not Applied**: Ensure components are wrapped in EnhancedThemeProvider
2. **Responsive Not Working**: Check media utility imports and breakpoint configuration
3. **Color Tokens Missing**: Verify color palette includes all required shades
4. **Type Errors**: Ensure proper TypeScript types are imported

### Debug Mode

```typescript
import { createTheme } from '@/core/theme';

const debugTheme = createTheme({
    name: 'Debug Theme',
    debug: true,
    colors: {
        primary: {
            500: '#ff0000'
        }
    }
});

// Enable theme debugging
console.log('Theme tokens:', debugTheme);
```

## Version Information

- **Current Version**: 1.0.0
- **BlackBox Compliance**: 95%+
- **TypeScript Support**: Full
- **Test Coverage**: Comprehensive
- **Theme Variants**: Light, Dark, Custom

## Dependencies

- TypeScript - Type safety
- Styled-components - CSS-in-JS styling
- React - React integration

## Related Modules

- **All UI Components**: All components use the theme module
- **DI Module**: For dependency injection integration
- **Services Module**: For theme change logging
