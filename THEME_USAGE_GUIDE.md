# Theme Usage Guide

## Overview

This guide provides comprehensive instructions for using theme tokens and utility functions in the UI library to ensure consistent styling across all components.

## 🎯 Core Principles

1. **No Hard-coded Values**: Never use hard-coded colors, spacing, typography, or other styling values
2. **Use Utility Functions**: Always access theme tokens through the provided utility functions
3. **Provide Fallbacks**: All utility functions include sensible fallbacks for missing theme values
4. **Consistent Patterns**: Follow established patterns for theme token usage

## 🛠️ Utility Functions

### Spacing Utilities

```typescript
import { getSpacing } from '@/shared/ui/components/utils';

// ✅ Correct - Uses theme tokens
const styles = {
  padding: getSpacing(theme, 'md'),
  margin: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'lg')}`
};

// ❌ Incorrect - Hard-coded values
const styles = {
  padding: '16px',
  margin: '8px 24px'
};
```

### Color Utilities

```typescript
import { getColor } from '@/shared/ui/components/utils';

// ✅ Correct - Uses theme tokens
const styles = {
  backgroundColor: getColor(theme, 'primary'),
  color: getColor(theme, 'text.primary'),
  borderColor: getColor(theme, 'border.medium')
};

// ❌ Incorrect - Hard-coded values
const styles = {
  backgroundColor: '#007bff',
  color: '#212529',
  borderColor: '#ced4da'
};
```

### Typography Utilities

```typescript
import { getTypography } from '@/shared/ui/components/utils';

// ✅ Correct - Uses theme tokens
const styles = {
  fontSize: getTypography(theme, 'fontSize.md'),
  fontWeight: getTypography(theme, 'fontWeight.bold'),
  lineHeight: getTypography(theme, 'lineHeight.normal')
};

// ❌ Incorrect - Hard-coded values
const styles = {
  fontSize: '1rem',
  fontWeight: 700,
  lineHeight: 1.5
};
```

### Border Radius Utilities

```typescript
import { getRadius } from '@/shared/ui/components/utils';

// ✅ Correct - Uses theme tokens
const styles = {
  borderRadius: getRadius(theme, 'md'),
  borderTopLeftRadius: getRadius(theme, 'full')
};

// ❌ Incorrect - Hard-coded values
const styles = {
  borderRadius: '0.375rem',
  borderTopLeftRadius: '50px'
};
```

### Border Width Utilities

```typescript
import { getBorderWidth } from '@/shared/ui/components/utils';

// ✅ Correct - Uses theme tokens
const styles = {
  borderWidth: getBorderWidth(theme, 'sm'),
  border: `${getBorderWidth(theme, 'md')} solid ${getColor(theme, 'border.light')}`
};

// ❌ Incorrect - Hard-coded values
const styles = {
  borderWidth: '2px',
  border: '2px solid #dee2e6'
};
```

### Shadow Utilities

```typescript
import { getShadow } from '@/shared/ui/components/utils';

// ✅ Correct - Uses theme tokens
const styles = {
  boxShadow: getShadow(theme, 'md'),
  boxShadow: `${getShadow(theme, 'sm')} 0 0 0 2px ${getColor(theme, 'brand.500')}`
};

// ❌ Incorrect - Hard-coded values
const styles = {
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05) 0 0 0 2px #007bff'
};
```

### Transition Utilities

```typescript
import { getTransition } from '@/shared/ui/components/utils';

// ✅ Correct - Uses theme tokens
const styles = {
  transition: getTransition(theme, 'all', 'normal', 'ease'),
  transition: `opacity ${getTransition(theme, 'duration.fast', 'ease')}`
};

// ❌ Incorrect - Hard-coded values
const styles = {
  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  transition: 'opacity 150ms ease'
};
```

### Breakpoint Utilities

```typescript
import { getBreakpoint } from '@/shared/ui/components/utils';

// ✅ Correct - Uses theme tokens
const styles = {
  '@media (max-width: 768px)': {
    flexDirection: 'column'
  }
};

const responsiveStyles = {
  '@media (max-width: ${getBreakpoint(theme, 'sm')})': {
    flexDirection: 'column'
  }
};

// ❌ Incorrect - Hard-coded values
const styles = {
  '@media (max-width: 768px)': {
    flexDirection: 'column'
  }
};
```

### Component Size Utilities

```typescript
import { getComponentSize } from '@/shared/ui/components/utils';

// ✅ Correct - Uses theme tokens
const avatarSize = getComponentSize(theme, 'avatar', 'md');
const modalSize = getComponentSize(theme, 'modal', 'large');

// ❌ Incorrect - Hard-coded values
const avatarSize = '40px';
const modalSize = { maxWidth: '800px', width: '90%' };
```

## 🎨 Styled Components Integration

### Using with Styled Components

```typescript
import styled from 'styled-components';
import { getSpacing, getColor, getRadius } from '../utils';

const StyledComponent = styled.div<{ theme: EnhancedTheme }>`
  padding: ${props => getSpacing(props.theme, 'md')};
  background-color: ${props => getColor(props.theme, 'background.primary')};
  border-radius: ${props => getRadius(props.theme, 'lg')};
  
  &:hover {
    background-color: ${props => getColor(props.theme, 'background.secondary')};
  }
  
  @media (max-width: ${props => getBreakpoint(props.theme, 'sm')}) {
    padding: ${props => getSpacing(props.theme, 'sm')};
  }
`;
```

### Using with React Components

```typescript
import React from 'react';
import { getSpacing, getColor } from '../utils';

interface ComponentProps {
  theme: EnhancedTheme;
}

class Component extends React.Component<ComponentProps> {
  private getStyles = () => {
    const { theme } = this.props;
    
    return {
      container: {
        padding: getSpacing(theme, 'md'),
        backgroundColor: getColor(theme, 'primary'),
        borderRadius: getRadius(theme, 'md')
      }
    };
  };

  render() {
    const styles = this.getStyles();
    return (
      <div style={styles.container}>
        {this.props.children}
      </div>
    );
  }
}
```

## 📋 Theme Token Reference

### Available Spacing Tokens

- `xs`: 4px
- `sm`: 8px  
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px
- `3xl`: 64px
- `4xl`: 96px
- `5xl`: 128px
- `6xl`: 192px

### Available Color Tokens

#### Primary Colors
- `primary`: Main brand color
- `secondary`: Secondary brand color
- `success`: Success state color
- `danger`: Error/danger state color
- `warning`: Warning state color
- `info`: Information state color

#### Semantic Colors
- `text.primary`: Primary text color
- `text.secondary`: Secondary text color
- `background.primary`: Primary background
- `background.secondary`: Secondary background
- `border.light`: Light border color
- `border.medium`: Medium border color
- `border.dark`: Dark border color
- `semantic.error`: Error state color
- `semantic.overlay`: Overlay/background color

#### Brand Colors
- `brand.500`: Primary brand color
- `brand.200`: Light brand variant

### Available Radius Tokens

- `none`: No border radius
- `sm`: Small border radius (0.125rem)
- `md`: Medium border radius (0.375rem)
- `lg`: Large border radius (0.5rem)
- `xl`: Extra large border radius (0.75rem)
- `full`: Full circle (50px)
- `round`: Round (50px)

### Available Breakpoint Tokens

- `xs`: 480px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Available Component Sizes

#### Avatar Sizes
- `xs`: 24px
- `sm`: 32px
- `md`: 40px
- `lg`: 48px

#### Modal Sizes
- `small`: { maxWidth: '400px', width: '90%' }
- `medium`: { maxWidth: '600px', width: '90%' }
- `large`: { maxWidth: '800px', width: '90%' }
- `fullscreen`: { maxWidth: '100%', width: '100%', height: '100%' }

#### Message Card Sizes
- `maxWidth`: 200px

## ⚠️ Migration Guide

### Converting Hard-coded Values

1. **Identify Hard-coded Values**: Use the validation script to find hard-coded values
2. **Map to Theme Tokens**: Find corresponding theme tokens
3. **Replace with Utilities**: Use appropriate utility functions
4. **Test Thoroughly**: Ensure visual consistency
5. **Update Documentation**: Document any new tokens used

### Common Patterns

| Hard-coded Value | Theme Token | Utility Function |
|----------------|-------------|------------------|
| `#007bff` | `colors.primary` | `getColor(theme, 'primary')` |
| `16px` | `spacing.md` | `getSpacing(theme, 'md')` |
| `0.375rem` | `radius.md` | `getRadius(theme, 'md')` |
| `768px` | `breakpoints.sm` | `getBreakpoint(theme, 'sm')` |
| `1rem` | `typography.fontSize.md` | `getTypography(theme, 'fontSize.md')` |
| `2px` | `border.md` | `getBorderWidth(theme, 'md')` |

## 🧪 Testing

### Running Validation

```bash
# Validate theme compliance
node scripts/validate-theme-usage.cjs

# Run tests
npm test -- theme-compliance
```

### ESLint Rules

The following ESLint rules are configured to prevent hard-coded values:

- `no-hard-coded-pixels`: Prevents hard-coded pixel values
- `no-hard-coded-colors`: Prevents hard-coded hex colors
- `no-hard-coded-rgba`: Prevents hard-coded rgba values
- `no-hard-coded-rem`: Prevents hard-coded rem values
- `require-spacing-utility`: Requires getSpacing for margin/padding
- `require-border-utility`: Requires getBorderWidth for borders
- `no-hard-coded-transitions`: Prevents hard-coded transitions

## 📚 Best Practices

1. **Always Use Utilities**: Never access theme properties directly
2. **Provide Fallbacks**: Utilities handle missing theme values gracefully
3. **Consistent Naming**: Use standard token names across components
4. **Responsive Design**: Use breakpoint utilities for media queries
5. **Semantic Colors**: Use semantic color tokens for states (error, success, etc.)
6. **Component Sizes**: Use component-specific size tokens when available
7. **Documentation**: Document any new theme tokens or utilities
8. **Testing**: Test components with different theme configurations

## 🔧 Troubleshooting

### Common Issues

**Issue**: Theme values not applying
**Solution**: Ensure theme prop is passed to component and utility functions

**Issue**: TypeScript errors with theme utilities
**Solution**: Check that theme object matches EnhancedTheme interface

**Issue**: Fallback values not working
**Solution**: Verify utility function has proper fallback logic

**Issue**: Responsive styles not working
**Solution**: Use getBreakpoint utility instead of hard-coded values

## 📞 Support

For questions or issues with theme compliance:
1. Check this documentation
2. Run validation script
3. Review existing components for patterns
4. Consult the theme token reference
5. Contact the design system team

---

*This guide ensures consistent, maintainable, and scalable theming across the UI library.*
