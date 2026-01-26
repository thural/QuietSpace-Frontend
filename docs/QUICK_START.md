# 🚀 Quick Start Guide - Modern Styling System

## ⚡ Quick Start

### **1. Import and Use**

```typescript
import styled from 'styled-components';
import { EnhancedTheme } from '../../../core/theme';

export const MyComponent = styled.div<{ theme: EnhancedTheme }>`
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.radius.lg};
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.secondary};
    transform: translateY(-2px);
  }
`;
```

### **2. Common Patterns**

#### **Button Component**
```typescript
export const Button = styled.button<{ theme: EnhancedTheme; variant?: 'primary' | 'secondary' }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.radius.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  ${props => props.variant === 'primary' && `
    background-color: ${props.theme.colors.brand[500]};
    color: ${props.theme.colors.text.inverse};
    border: 1px solid ${props.theme.colors.brand[500]};
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: transparent;
    color: ${props.theme.colors.brand[500]};
    border: 1px solid ${props.theme.colors.brand[500]};
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.brand[200]};
  }
`;
```

#### **Card Component**
```typescript
export const Card = styled.div<{ theme: EnhancedTheme }>`
  background-color: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.radius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
  }
`;
```

#### **Input Component**
```typescript
export const Input = styled.input<{ theme: EnhancedTheme }>`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.radius.sm};
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.brand[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.brand[200]};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.background.tertiary};
    color: ${props => props.theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;
```

### **3. Theme Tokens Reference**

#### **Colors**
```typescript
${props => props.theme.colors.primary}           // Primary brand color
${props => props.theme.colors.background.primary}  // Main background
${props => props.theme.colors.text.primary}        // Main text color
${props => props.theme.colors.brand[500]}         // Brand color
${props => props.theme.colors.border.medium}       // Border color
```

#### **Spacing**
```typescript
${props => props.theme.spacing.xs}   // 4px
${props => props.theme.spacing.sm}   // 8px
${props => props.theme.spacing.md}   // 16px
${props => props.theme.spacing.lg}   // 24px
${props => props.theme.spacing.xl}   // 32px
```

#### **Typography**
```typescript
${props => props.theme.typography.fontSize.sm}   // 14px
${props => props.theme.typography.fontSize.base} // 16px
${props => props.theme.typography.fontSize.lg}   // 18px
${props => props.theme.typography.fontWeight.medium} // 500
```

#### **Border Radius**
```typescript
${props => props.theme.radius.sm}   // 4px
${props => props.theme.radius.md}   // 8px
${props => props.theme.radius.lg}   // 12px
${props => props.theme.radius.full} // 9999px
```

### **4. Responsive Design**

```typescript
export const ResponsiveComponent = styled.div<{ theme: EnhancedTheme }>`
  padding: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm};
  }
`;
```

### **5. Best Practices**

✅ **Always use theme tokens**  
✅ **Add hover states**  
✅ **Include focus indicators**  
✅ **Add transitions**  
✅ **Make responsive**  
✅ **Test accessibility**

❌ **Don't use hardcoded values**  
❌ **Don't forget interactive states**  
❌ **Don't ignore accessibility**  
❌ **Don't skip responsive design**

---

## 🎯 Need More Help?

- **Full Documentation**: See `STYLING_DOCUMENTATION.md`
- **Component Examples**: Check `src/shared/styles/` for reference
- **Theme System**: See `src/core/theme/` for theme structure
- **Feature Components**: Check `src/features/*/styles/` for examples

Happy styling! 🎨
