# 📚 Component Library Reference

## 🎨 Available Styled Components

### **App-Level Components**

#### **AppContainer**
```typescript
import { AppContainer } from '../app/appStyles';

// Usage
<AppContainer>
  <YourApp />
</AppContainer>
```
- **Purpose**: Root application container
- **Features**: Theme switching, smooth transitions
- **Location**: `src/app/appStyles.ts`

---

### **Shared Components**

#### **BaseCard**
```typescript
import { BaseCard } from '../shared/styles/baseCardStyles';

// Usage
<BaseCard>
  <CardContent />
</BaseCard>
```
- **Purpose**: Reusable card container
- **Features**: Hover effects, shadows, theme integration
- **Location**: `src/shared/styles/baseCardStyles.ts`

#### **CustomButton**
```typescript
import { CustomButton } from '../shared/styles/customButtonStyles';

// Usage
<CustomButton onClick={handleClick}>
  Click Me
</CustomButton>
```
- **Purpose**: Interactive button component
- **Features**: Hover states, focus indicators, transitions
- **Location**: `src/shared/styles/customButtonStyles.ts`

#### **Input & TextArea**
```typescript
import { Input, TextArea } from '../shared/styles/inputStyles';

// Usage
<Input placeholder="Enter text" />
<TextArea placeholder="Enter message" />
```
- **Purpose**: Form input components
- **Features**: Validation states, accessibility, focus management
- **Location**: `src/shared/styles/inputStyles.ts`

#### **Form Components**
```typescript
import { FormContainer, FormGroup, FormLabel, FormError, FormSuccess } from '../shared/styles/formStyles';

// Usage
<FormContainer>
  <FormGroup>
    <FormLabel>Email</FormLabel>
    <Input type="email" />
    <FormError>Invalid email</FormError>
    <FormSuccess>Email sent!</FormSuccess>
  </FormGroup>
</FormContainer>
```
- **Purpose**: Form layout and validation styling
- **Features**: Error/success states, accessibility
- **Location**: `src/shared/styles/formStyles.ts`

---

### **Page-Level Components**

#### **ChatPageContainer**
```typescript
import { ChatPageContainer, ChatContacts, ChatMessages } from '../pages/chat/styles/chatPageStyles';

// Usage
<ChatPageContainer>
  <ChatContacts>
    <ContactList />
  </ChatContacts>
  <ChatMessages>
    <MessageList />
  </ChatMessages>
</ChatPageContainer>
```
- **Purpose**: Chat page layout
- **Features**: Responsive design, interactive buttons
- **Location**: `src/pages/chat/styles/chatPageStyles.ts`

#### **FeedPageContainer**
```typescript
import { FeedPageContainer } from '../pages/feed/styles/postPageStyles';

// Usage
<FeedPageContainer>
  <PostList />
</FeedPageContainer>
```
- **Purpose**: Feed page layout
- **Features**: Post button styling, responsive design
- **Location**: `src/pages/feed/styles/postPageStyles.ts`

---

### **Feature Components**

#### **NotificationCard**
```typescript
import { NotificationCard } from '../features/notification/presentation/styles/notificationCardStyles';

// Usage
<NotificationCard>
  <NotificationContent />
</NotificationCard>
```
- **Purpose**: Notification display component
- **Features**: Hover effects, badge styling, transitions
- **Location**: `src/features/notification/presentation/styles/notificationCardStyles.ts`

#### **Navbar**
```typescript
import { Navbar } from '../features/navbar/presentation/styles/NavbarStyles';

// Usage
<Navbar>
  <NavigationItems />
</Navbar>
```
- **Purpose**: Navigation bar component
- **Features**: Interactive items, responsive design, backdrop blur
- **Location**: `src/features/navbar/presentation/styles/NavbarStyles.ts`

---

## 🎯 Usage Patterns

### **1. Import Pattern**
```typescript
import { ComponentName } from '../path/to/component.styles';
```

### **2. Basic Usage**
```typescript
<ComponentName>
  <ChildComponents />
</ComponentName>
```

### **3. With Props**
```typescript
<ComponentName className="custom-class" onClick={handler}>
  <ChildComponents />
</ComponentName>
```

### **4. Nested Components**
```typescript
<ParentComponent>
  <ChildComponent>
    <GrandChildComponent />
  </ChildComponent>
</ParentComponent>
```

---

## 🔧 Customization

### **Extending Components**
```typescript
import styled from 'styled-components';
import { BaseComponent } from '../path/to/component.styles';

export const CustomComponent = styled(BaseComponent)`
  /* Additional styles */
  margin-top: ${props => props.theme.spacing.md};
  
  /* Override styles */
  background-color: ${props => props.theme.colors.background.secondary};
`;
```

### **Component Variants**
```typescript
import styled from 'styled-components';
import { BaseComponent } from '../path/to/component.styles';

export const VariantComponent = styled(BaseComponent)<{ variant?: 'primary' | 'secondary' }>`
  ${props => props.variant === 'primary' && `
    background-color: ${props.theme.colors.brand[500]};
    color: ${props.theme.colors.text.inverse};
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: transparent;
    color: ${props.theme.colors.brand[500]};
    border: 1px solid ${props.theme.colors.brand[500]};
  `}
`;
```

---

## 📱 Responsive Components

### **Responsive Pattern**
```typescript
import styled from 'styled-components';
import { EnhancedTheme } from '../../../core/theme';

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

### **Breakpoint Reference**
- **Desktop**: > 768px
- **Tablet**: ≤ 768px
- **Mobile**: ≤ 480px

---

## 🎨 Theme Integration

All components automatically integrate with the EnhancedTheme system:

```typescript
// Available in all components
${props => props.theme.colors.primary}
${props => props.theme.spacing.md}
${props => props.theme.typography.fontSize.base}
${props => props.theme.radius.lg}
${props => props.theme.animation.duration.normal}
```

---

## 🔍 Finding Components

### **By Category**
- **App-Level**: `src/app/appStyles.ts`
- **Shared**: `src/shared/styles/`
- **Page-Level**: `src/pages/[page]/styles/`
- **Feature-Level**: `src/features/[feature]/styles/`

### **By Name**
```bash
# Find all styled components
find src -name "*.ts" -exec grep -l "styled\." {} \;

# Find specific component
find src -name "*.ts" -exec grep -l "ComponentName" {} \;
```

---

## 🚀 Best Practices

1. **Always use theme tokens**
2. **Add interactive states**
3. **Include transitions**
4. **Make responsive**
5. **Test accessibility**
6. **Document custom components**
7. **Follow naming conventions**

---

## 📞 Support

- **Documentation**: `STYLING_DOCUMENTATION.md`
- **Quick Start**: `QUICK_START.md`
- **Theme System**: `src/core/theme/`
- **Examples**: Check existing components for reference

Happy component building! 🎨
