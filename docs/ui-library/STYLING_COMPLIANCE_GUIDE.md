/**
 * Documentation for UI Library Styling Compliance
 * 
 * Usage guidelines and examples for the enhanced UI library
 * with theme token integration and utility functions.
 */

# UI Library Styling Compliance Guide

## Overview

The UI Library has been enhanced with comprehensive theme token integration to eliminate hard-coded styling values and ensure consistent design system usage across all components.

## 🎯 Key Improvements

### Phase 1: Theme System Enhancement
- **BorderTokens**: Standardized border width tokens (none, hairline, xs, sm, md, lg, xl, 2xl)
- **SizeTokens**: Component-specific sizing (skeleton, avatar)
- **Enhanced RadiusTokens**: Added `round` token for circular elements

### Phase 2: Utility Functions Implementation
- **getBorderWidth()**: Replace hard-coded border values
- **getMicroSpacing()**: Precise spacing with rem conversion for small values
- **getComponentSize()**: Component-specific sizing from theme tokens
- **getSkeletonStyles()**: Standardized skeleton component styling

### Phase 3: Component Refactoring
- **Button.tsx**: All hard-coded values replaced with theme tokens
- **Input.tsx**: Complete theme integration with proper spacing and colors
- **PostMessageSkeleton.tsx**: Component sizing and spacing from theme tokens

## 🛠️ Utility Functions

### getSpacing(theme, value)
```typescript
import { getSpacing } from '@/shared/ui/components/utils';

// Use theme tokens
const padding = getSpacing(theme, 'md'); // '16px'
const margin = getSpacing(theme, 'sm'); // '8px'

// Fallback for non-token values
const autoSpacing = getSpacing(theme, 'auto'); // 'auto'

// Number to pixel conversion
const pixelSpacing = getSpacing(theme, 12); // '12px'
```

### getBorderWidth(theme, width)
```typescript
import { getBorderWidth } from '@/shared/ui/components/utils';

// Theme token border widths
const thinBorder = getBorderWidth(theme, 'xs'); // '1px'
const mediumBorder = getBorderWidth(theme, 'md'); // '3px'
const thickBorder = getBorderWidth(theme, 'xl'); // '6px'

// Default fallback
const defaultBorder = getBorderWidth(theme); // '3px'
```

### getRadius(theme, size)
```typescript
import { getRadius } from '@/shared/ui/components/utils';

// Standard radius tokens
const smallRadius = getRadius(theme, 'sm'); // '4px'
const mediumRadius = getRadius(theme, 'md'); // '8px'
const largeRadius = getRadius(theme, 'lg'); // '12px'

// Special round token
const circleRadius = getRadius(theme, 'round'); // '50%'

// Default fallback
const defaultRadius = getRadius(theme); // '8px'
```

### getColor(theme, colorPath)
```typescript
import { getColor } from '@/shared/ui/components/utils';

// Brand colors
const primaryColor = getColor(theme, 'brand.500'); // '#3b82f6'
const secondaryColor = getColor(theme, 'brand.600'); // '#2563eb'

// Semantic colors
const errorColor = getColor(theme, 'semantic.error'); // '#ef4444'
const successColor = getColor(theme, 'semantic.success'); // '#10b981'

// Text colors
const primaryText = getColor(theme, 'text.primary'); // '#111827'
const inverseText = getColor(theme, 'text.inverse'); // '#ffffff'

// Background colors
const primaryBg = getColor(theme, 'background.primary'); // '#ffffff'
const secondaryBg = getColor(theme, 'background.secondary'); // '#f9fafb'
```

### getComponentSize(theme, component, size?)
```typescript
import { getComponentSize } from '@/shared/ui/components/utils';

// Skeleton component sizing
const skeletonWidth = getComponentSize(theme, 'skeleton', 'minWidth'); // '172px'
const skeletonHeight = getComponentSize(theme, 'skeleton', 'height'); // '256px'

// Avatar component sizing
const avatarSmall = getComponentSize(theme, 'avatar', 'xs'); // '24px'
const avatarMedium = getComponentSize(theme, 'avatar', 'md'); // '40px'
const avatarLarge = getComponentSize(theme, 'avatar', 'lg'); // '56px'

// Default sizes (no size parameter)
const defaultAvatar = getComponentSize(theme, 'avatar'); // '40px'
const defaultSkeleton = getComponentSize(theme, 'skeleton'); // '256px'
```

### getMicroSpacing(theme, value)
```typescript
import { getMicroSpacing } from '@/shared/ui/components/utils';

// Small numbers convert to rem for better precision
const tinySpacing = getMicroSpacing(theme, 2); // '0.125rem' (2px)
const smallSpacing = getMicroSpacing(theme, 4); // '0.25rem' (4px)
const mediumSpacing = getMicroSpacing(theme, 6); // '0.375rem' (6px)

// Larger numbers remain in pixels
const largeSpacing = getMicroSpacing(theme, 10); // '10px'
const extraLargeSpacing = getMicroSpacing(theme, 16); // '16px'

// Theme token support
const tokenSpacing = getMicroSpacing(theme, 'xs'); // '4px'
```

### getSkeletonStyles(theme, variant?)
```typescript
import { getSkeletonStyles } from '@/shared/ui/components/utils';

// Default skeleton
const defaultSkeleton = getSkeletonStyles(theme, 'default');
// Output: CSS with gradient animation, 172px minWidth, 256px height

// Circle skeleton (for avatars)
const circleSkeleton = getSkeletonStyles(theme, 'circle');
// Output: CSS with 50% border-radius, 40px width/height

// Text skeleton
const textSkeleton = getSkeletonStyles(theme, 'text');
// Output: CSS with 1rem height, 4px border-radius, bottom margin
```

## 🎨 Component Usage Examples

### Button Component
```typescript
import Button from '@/shared/ui/components/interactive/Button';

// Basic usage with theme integration
<Button theme={theme} variant="primary" size="md">
  Primary Button
</Button>

// Rounded button with theme radius
<Button theme={theme} rounded size="lg">
  Rounded Button
</Button>

// Outlined button with theme border
<Button theme={theme} outlined variant="secondary">
  Outlined Button
</Button>

// All styling uses theme tokens automatically:
// - Padding: theme.spacing.md + theme.spacing.lg
// - Border radius: theme.radius.md (or theme.radius.round for rounded)
// - Border width: theme.border.md (for outlined)
// - Colors: theme.colors.brand.* (for variants)
// - Transitions: theme.animation.duration.fast + theme.animation.easing.ease
```

### Input Component
```typescript
import Input from '@/shared/ui/components/interactive/Input';

// Basic input with theme styling
<Input theme={theme} placeholder="Enter text" />

// Input with label and theme spacing
<Input 
  theme={theme} 
  label="Email Address" 
  id="email"
  helperText="We'll never share your email"
/>

// Error state with theme colors
<Input 
  theme={theme} 
  error 
  helperText="This field is required"
/>

// All styling uses theme tokens:
// - Border: theme.border.sm + theme.colors.border.light
// - Border radius: theme.radius.md
// - Padding: theme.spacing.sm + theme.spacing.md
// - Font size: theme.typography.fontSize.base
// - Colors: theme.colors.brand.500 (focus), theme.colors.semantic.error (error)
// - Spacing: theme.spacing.xs (margins), theme.spacing.sm (adornments)
```

### PostMessageSkeleton Component
```typescript
import PostMessageSkeleton from '@/shared/ui/components/feedback/PostMessageSkeleton';

// Basic skeleton with theme dimensions
<PostMessageSkeleton theme={theme} />

// Custom styling merged with theme tokens
<PostMessageSkeleton 
  theme={theme} 
  style={{ backgroundColor: 'f0f0f0' }}
/>

// All sizing uses theme tokens:
// - Container: theme.size.skeleton.minWidth + theme.size.skeleton.height
// - Avatar: theme.size.avatar.md + theme.radius.round
// - Spacing: theme.spacing.md (avatar margin), theme.spacing.xs (text margins)
// - Radius: theme.radius.sm (text skeleton)
```

## 📋 Theme Token Structure

### Border Tokens
```typescript
border: {
  none: '0',      // No border
  hairline: '1px', // Very thin border
  xs: '1px',      // Extra small border
  sm: '2px',      // Small border
  md: '3px',      // Medium border (default)
  lg: '4px',      // Large border
  xl: '6px',      // Extra large border
  '2xl': '8px'    // Double extra large border
}
```

### Size Tokens
```typescript
size: {
  skeleton: {
    minWidth: '172px', // Default skeleton width
    height: '256px'    // Default skeleton height
  },
  avatar: {
    xs: '24px',  // Extra small avatar
    sm: '32px',  // Small avatar
    md: '40px',  // Medium avatar (default)
    lg: '56px'   // Large avatar
  }
}
```

### Enhanced Radius Tokens
```typescript
radius: {
  none: '0',    // No radius
  sm: '4px',    // Small radius
  md: '8px',    // Medium radius (default)
  lg: '12px',   // Large radius
  xl: '16px',   // Extra large radius
  full: '9999px', // Fully rounded
  round: '50%'    // Circular (NEW)
}
```

## 🚫 Migration from Hard-coded Values

### Before (Hard-coded)
```typescript
// ❌ Hard-coded values
const styles = `
  padding: 16px 24px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
`;

// ❌ Hard-coded inline styles
<div style={{ 
  marginBottom: '24px',
  minWidth: '172px',
  height: '256px',
  borderRadius: '50%'
}}>
```

### After (Theme Tokens)
```typescript
// ✅ Theme tokens and utilities
import { getSpacing, getBorderWidth, getRadius, getColor } from '@/shared/ui/components/utils';

const styles = `
  padding: ${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'brand.500')};
  border-radius: ${getRadius(theme, 'md')};
  font-size: ${theme.typography.fontSize.base};
  transition: all ${theme.animation.duration.fast} ${theme.animation.easing.ease};
`;

// ✅ Theme-based inline styles
<div style={{ 
  marginBottom: getSpacing(theme, 'md'),
  minWidth: getComponentSize(theme, 'skeleton', 'minWidth'),
  height: getComponentSize(theme, 'skeleton', 'height'),
  borderRadius: getRadius(theme, 'round')
}}>
```

## 🔍 ESLint Rules

The project includes automated ESLint rules to prevent hard-coded values:

### no-hard-coded-pixels
- Detects hard-coded pixel values (`16px`, `24px`, etc.)
- Suggests using theme tokens or utility functions

### no-hard-coded-colors
- Detects hex colors (`#3b82f6`), rgb/rgba values
- Suggests using `getColor(theme, "path")` utility

### require-spacing-utility
- Requires `getSpacing()` for margin/padding properties
- Ensures consistent spacing across components

### require-border-utility
- Requires `getBorderWidth()` for border width properties
- Standardizes border styling

### require-radius-utility
- Requires `getRadius()` for border radius properties
- Ensures consistent corner rounding

## 🧪 Testing

### Unit Tests
- Comprehensive coverage for all utility functions
- Theme token integration testing
- Error handling and fallback behavior

### Integration Tests
- Component rendering with theme tokens
- Props and state management
- Accessibility compliance

### Performance Tests
- Utility function performance benchmarks
- Component rendering performance
- Memory usage validation

## 📈 Benefits

### Consistency
- Unified design system across all components
- Standardized spacing, colors, and sizing
- Reduced design inconsistencies

### Maintainability
- Single source of truth for design tokens
- Easy theme updates across entire application
- Centralized styling logic

### Developer Experience
- Clear utility function APIs
- Comprehensive TypeScript support
- Automated validation and error prevention

### Performance
- Efficient theme token lookups
- Optimized utility functions
- Minimal overhead compared to hard-coded values

## 🎯 Best Practices

1. **Always use utility functions** for styling instead of hard-coded values
2. **Prefer theme tokens** over arbitrary values
3. **Use semantic color names** (brand.500, semantic.error) over hex colors
4. **Leverage component-specific sizing** (getComponentSize) when available
5. **Test with different themes** to ensure flexibility
6. **Follow ESLint rules** to catch violations early

## 🔄 Future Enhancements

- Additional component refactoring for remaining UI components
- Advanced theme variants (dark mode, high contrast)
- Component composition patterns
- Design system documentation site
- Storybook integration with theme controls
