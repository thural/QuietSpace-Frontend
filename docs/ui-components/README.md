# UI Components Documentation

## 🎯 Overview

This directory contains comprehensive documentation for the QuietSpace Frontend UI component library, covering architecture patterns, design principles, and implementation guidelines for all 23 enterprise-grade components.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Component Categories](#component-categories)
3. [Architecture Overview](#architecture-overview)
4. [Design System](#design-system)
5. [Usage Examples](#usage-examples)
6. [Migration Guide](#migration-guide)
7. [Testing Guidelines](#testing-guidelines)
8. [Contributing](#contributing)

---

## 🚀 Quick Start

### **Installation**
```bash
npm install @quiet-space/ui-components
```

### **Basic Usage**
```typescript
import { Button, TextInput, Card } from '@quiet-space/ui-components';

function App() {
  return (
    <div>
      <Button variant="primary" onClick={() => console.log('clicked')}>
        Click me
      </Button>
      
      <TextInput placeholder="Enter your text" />
      
      <Card>
        <h3>Card Title</h3>
        <p>Card content goes here</p>
      </Card>
    </div>
  );
}
```

### **Theme Integration**
```typescript
import { ThemeProvider } from '@quiet-space/ui-components';

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Button variant="primary">Themed Button</Button>
    </ThemeProvider>
  );
}
```

---

## 📂 Component Categories

### **Typography Components** (2)
- **Text**: Versatile text rendering with theme integration
- **Title**: Heading components with responsive design

### **Utility Components** (15)
- **ClickableComponent**: Enterprise clickable container
- **FormStyled**: Form container with focus states
- **ListMenu**: Dropdown menu with responsive design
- **CloseButtonStyled**: Close button with variants
- **CountdownTimer**: Real-time countdown timer
- **Conditional**: Conditional rendering component
- **FollowToggle**: Follow/unfollow toggle
- **PrivateBlock**: Private content blocker
- **Typography**: Typography wrapper component
- **ComponentList**: List rendering component
- **Clickable**: Clickable wrapper component

### **Layout Components** (6)
- **BoxStyled**: Box container with hover states
- **BaseCard**: Card container with responsive design
- **DefaultContainer**: Default container with sizing
- **AnchorStyled**: Anchor/link component

### **Features**
- **Enterprise Architecture**: Decoupled structure with interfaces, styles, and logic separation
- **Theme Integration**: Full compatibility with existing theme system
- **TypeScript Safety**: Comprehensive type checking and IntelliSense
- **Responsive Design**: Mobile-first approach with consistent breakpoints
- **Accessibility**: WCAG 2.1 AA compliance with ARIA support
- **Performance**: Optimized rendering with Emotion CSS

---

## 🏗️ Architecture Overview

### **Decoupled Structure**
All components follow the established enterprise pattern:

```
ComponentName/
├── index.ts              # Clean barrel exports
├── interfaces/
│   ├── IComponentName.ts     # TypeScript interfaces
│   └── index.ts              # Interface barrel exports
├── styles/
│   ├── ComponentName.styles.ts  # Emotion CSS styles
│   └── index.ts              # Style barrel exports
└── ComponentName.tsx       # Pure component logic
```

### **Key Benefits**
- **Maintainability**: Clear separation of concerns
- **Testability**: Isolated components are easy to test
- **Reusability**: Consistent patterns across all components
- **Scalability**: Easy to extend and modify
- **Developer Experience**: Clean imports and comprehensive documentation

### **Enterprise Features**
- **Component Variants**: Multiple styling options (primary, secondary, danger)
- **Responsive Design**: Mobile-first breakpoints
- **Theme Integration**: Centralized design system compatibility
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
- **Performance**: Optimized rendering with Emotion CSS

---

## 🎨 Design System

### **Theme Integration**
Components seamlessly integrate with the existing theme system:

```typescript
import { getSpacing, getColor, getTypography } from '@quiet-space/ui-components/utils';

// Theme-aware styling
const themedStyles = (theme?: any) => css`
  padding: ${getSpacing(theme, 'md')};
  background: ${getColor(theme, 'background.primary')};
  color: ${getColor(theme, 'text.primary')};
`;
```

### **Design Tokens**
Consistent design tokens across all components:
- **Spacing**: xs (4px), sm (8px), md (16px), lg (24px), xl (32px)
- **Colors**: Primary, secondary, brand, semantic colors
- **Typography**: Consistent font sizes and weights
- **Border Radius**: Small, medium, large radius values
- **Shadows**: Light, medium, heavy shadow variations

### **Responsive Breakpoints**
Standardized breakpoint system:
- **xs**: 480px
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

---

## 📖 Usage Examples

### **Basic Component Usage**
```typescript
import { 
  Button, 
  TextInput, 
  Card, 
  Modal,
  ListMenu 
} from '@quiet-space/ui-components';

// Button with variants
<Button 
  variant="primary" 
  size="lg" 
  disabled={false}
  onClick={handleClick}
>
  Primary Button
</Button>

// Form with validation
<FormStyled>
  <TextInput 
    label="Email"
    type="email"
    required={true}
    error={hasError}
  />
  
  <Button 
    variant="primary" 
    type="submit"
  >
    Submit
  </Button>
</FormStyled>

// Responsive card layout
<BaseCard>
  <h3>Card Title</h3>
  <p>Card content with responsive design</p>
  <Button variant="secondary">Action</Button>
</BaseCard>
```

### **Advanced Component Composition**
```typescript
// Complex component with multiple features
<PrivateBlock>
  <h3>Private Content</h3>
  <p>This content requires authentication to view.</p>
  <Button variant="primary">Sign In</Button>
</PrivateBlock>

// List menu with items
<ListMenu 
  menuIcon={<MenuIcon />}
  styleProps={{ width: '200px' }}
>
  <MenuItem onClick={handleAction1}>Action 1</MenuItem>
  <MenuItem onClick={handleAction2}>Action 2</MenuItem>
  <MenuItem onClick={handleAction3}>Action 3</MenuItem>
</ListMenu>
```

---

## 📚 Migration Guide

### **From Legacy to Modern**
Step-by-step migration process for existing components:

1. **Assessment**: Evaluate current component structure
2. **Interface Extraction**: Create TypeScript interfaces
3. **Style Migration**: Convert to Emotion CSS
4. **Component Refactoring**: Implement class-based patterns
5. **Testing**: Update test suites
6. **Documentation**: Update component documentation

### **Migration Checklist**
```markdown
## Migration Checklist

### ✅ Phase 1: Assessment
- [ ] Current component functionality documented
- [ ] Dependencies identified
- [ ] Migration complexity assessed
- [ ] Breaking changes noted

### ✅ Phase 2: Interface Design
- [ ] Props interface created
- [ ] State interface designed
- [ ] Base interfaces extended
- [ ] JSDoc documentation added

### ✅ Phase 3: Style Migration
- [ ] CSS converted to Emotion
- [ ] Theme utilities integrated
- [ ] Responsive design implemented
- [ ] Component variants added

### ✅ Phase 4: Component Implementation
- [ ] Class component created
- [ ] Lifecycle methods implemented
- [ ] Event handlers added
- [ ] Error boundaries included

### ✅ Phase 5: Testing & Documentation
- [ ] Unit tests written
- [ ] Integration tests created
- [ ] Accessibility tests added
- [ ] Documentation updated
```

---

## 🧪 Testing Guidelines

### **Testing Strategy**
Comprehensive testing approach for all components:

```typescript
// Unit testing with Jest and Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('ComponentName', () => {
  // Rendering tests
  it('should render correctly', () => {
    const { container } = render(<ComponentName {...props} />);
    expect(container).toBeInTheDocument();
  });

  // Props testing
  it('should handle props correctly', () => {
    const props = { variant: 'primary', size: 'lg' };
    const { container } = render(<ComponentName {...props} />);
    
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'primary');
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');
  });

  // Event testing
  it('should handle events correctly', () => {
    const mockHandler = jest.fn();
    const { container } = render(<ComponentName onClick={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  // Accessibility testing
  it('should be accessible', async () => {
    const { container } = render(<ComponentName />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### **Test Utilities**
Helper functions for testing class components:

```typescript
// Test utilities for class components
import { render } from '@testing-library/react';

export const getComponentProps = (componentName: string) => {
  const component = render(<ComponentName />);
  return component.container.querySelector('[data-component]')?.dataset;
};

export const getComponentState = (componentName: string) => {
  const component = render(<ComponentName />);
  return component.container.querySelector('[data-component]')?._reactInternals?.stateNode?.state;
};
```

---

## 🤝 Contributing

### **Development Setup**
```bash
# Clone the repository
git clone https://github.com/your-org/quiet-space-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### **Component Development Workflow**
1. **Create Component**: Follow the established patterns
2. **Add Tests**: Write comprehensive unit tests
3. **Update Documentation**: Include JSDoc and examples
4. **Code Review**: Ensure compliance with standards
5. **Submit PR**: Follow contribution guidelines

### **Code Quality Standards**
- TypeScript strict mode
- ESLint compliance
- Prettier formatting
- 100% test coverage
- Accessibility compliance

---

*This documentation provides a comprehensive guide for the QuietSpace Frontend UI component library, enabling developers to quickly understand, use, and extend the enterprise-grade component system.*
