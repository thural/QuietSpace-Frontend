# Usage Guide

## 🎯 Overview

This comprehensive usage guide provides practical examples and patterns for using QuietSpace Frontend components, services, and features effectively in real-world applications with strict layer separation compliance.

## 🚀 Quick Start

### Basic Component Usage

```typescript
// Import components from central index
import { Container, Button, Input, Text, Title } from '@/shared/ui/components';

// Use in your components
const MyComponent = () => {
  return (
    <Container padding="lg" center>
      <Title level={1}>Welcome to QuietSpace</Title>
      <Text>
        Experience our modern UI component library with enterprise-grade features.
      </Text>
      <Button variant="primary" onClick={() => console.log('Clicked')}>
        Get Started
      </Button>
    </Container>
  );
};
```

### Theme Integration

```typescript
import { useEnhancedTheme } from '@/core/theme';

const ThemedComponent = () => {
  const { theme, switchTheme } = useEnhancedTheme();
  
  return (
    <div 
      style={{
        backgroundColor: theme.colors.background.primary,
        color: theme.colors.text.primary,
        padding: theme.spacing.lg
      }}
    >
      <h1>Current Theme: {theme.currentVariant}</h1>
      <button onClick={() => switchTheme('dark')}>
        Switch to Dark Theme
      </button>
    </div>
  );
};
```

## 📦 Feature Usage Examples

### Authentication

#### Login Form

```typescript
import { useEnterpriseAuth } from '@/features/auth/application/hooks/useEnterpriseAuth';

const LoginForm = () => {
  const { login, isLoading, error } = useEnterpriseAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(credentials);
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        placeholder="Email address"
        required
      />
      <Input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        placeholder="Password"
        required
      />
      <Button 
        type="submit" 
        variant="primary"
        loading={isLoading}
        fullWidth
      >
        Sign In
      </Button>
      {error && <ErrorMessage error={error} />}
    </form>
  );
};
```

#### Multi-Factor Authentication

```typescript
import { useEnterpriseAuth } from '@/features/auth/application/hooks/useEnterpriseAuth';

const MFASetup = () => {
  const { enableMFA, generateTOTPSecret } = useEnterpriseAuth();
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  
  const handleEnableMFA = async () => {
    try {
      const setup = await generateTOTPSecret();
      setQrCode(setup.qrCode);
      setBackupCodes(setup.backupCodes);
      await enableMFA('totp');
    } catch (error) {
      console.error('MFA setup failed:', error);
    }
  };
  
  return (
    <div>
      <h2>Set Up Multi-Factor Authentication</h2>
      <Button onClick={handleEnableMFA}>
        Enable TOTP
      </Button>
      {qrCode && (
        <div>
          <p>Scan this QR code with your authenticator app:</p>
          <img src={qrCode} alt="TOTP QR Code" />
          <p>Backup codes (save these!):</p>
          <ul>
            {backupCodes.map((code, index) => (
              <li key={index}>{code}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

### Chat Feature

#### Real-time Chat Interface

```typescript
import { useUnifiedChat } from '@/features/chat/application/hooks/useUnifiedChat';

const ChatRoom = ({ roomId }: { roomId: string }) => {
  const {
    messages,
    sendMessage,
    sendTypingIndicator,
    isLoading,
    error
  } = useUnifiedChat(roomId);
  
  const [message, setMessage] = useState('');
  
  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
    }
  };
  
  const handleTyping = async (isTyping: boolean) => {
    await sendTypingIndicator(isTyping);
  };
  
  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map(msg => (
          <MessageComponent key={msg.id} message={msg} />
        ))}
      </div>
      
      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping(true);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};
```

### Analytics Feature

#### Dashboard with Real-time Data

```typescript
import { useEnterpriseAnalytics } from '@/features/analytics/application/hooks/useEnterpriseAnalytics';

const AnalyticsDashboard = () => {
  const {
    dashboards,
    generateReport,
    runPrediction,
    exportData
  } = useEnterpriseAnalytics();
  
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);
  
  const handleGenerateReport = async (reportConfig: ReportConfig) => {
    try {
      const report = await generateReport(reportConfig);
      console.log('Report generated:', report.id);
    } catch (error) {
      console.error('Report generation failed:', error);
    }
  };
  
  return (
    <Container>
      <Title level={1}>Analytics Dashboard</Title>
      
      <select
        value={selectedDashboard || ''}
        onChange={(e) => setSelectedDashboard(e.target.value)}
      >
        <option value="">Select Dashboard</option>
        {dashboards.map(dashboard => (
          <option key={dashboard.id} value={dashboard.id}>
            {dashboard.name}
          </option>
        ))}
      </select>
      
      {selectedDashboard && (
        <DashboardView 
          dashboard={dashboards.find(d => d.id === selectedDashboard)!}
          onGenerateReport={handleGenerateReport}
          onRunPrediction={runPrediction}
          onExportData={exportData}
        />
      )}
    </Container>
  );
};
```

## 🔧 Advanced Usage Patterns

### Custom Hook Creation

```typescript
// Custom hook for API data management
import { useState, useCallback, useEffect } from 'react';
import { useCustomQuery, useCustomMutation } from '@/core/query';

export const useApiResource = <T>(
  resourcePath: string,
  options?: {
    initialData?: T;
    autoRefresh?: boolean;
    refreshInterval?: number;
  }
) => {
  const [data, setData] = useState<T | null>(options?.initialData || null);
  
  const { refetch } = useCustomQuery(
    [resourcePath],
    () => apiService.get<T>(resourcePath),
    {
      enabled: !!resourcePath,
      staleTime: options?.autoRefresh ? 60 * 1000 : 5 * 60 * 1000,
      onSuccess: (data) => setData(data)
    }
  );
  
  // Auto-refresh functionality
  useEffect(() => {
    if (!options?.autoRefresh) return;
    
    const interval = setInterval(() => {
      refetch();
    }, options?.refreshInterval || 30000);
    
    return () => clearInterval(interval);
  }, [refetch, options?.refreshInterval]);
  
  return { data, refetch };
};
```

### Service Integration

```typescript
// Service with dependency injection and cache-only dependency
import { injectable, inject } from 'inversify';
import { TYPES } from '@/core/di/types';

@injectable()
export class MyService {
  constructor(
    // ✅ CORRECT: Cache layer dependency only
    @inject(TYPES.CACHE_SERVICE) private cache: ICacheService
  ) {}
  
  async getData(id: string): Promise<MyData> {
    // Business logic: validation
    if (!id) {
      throw new Error('ID is required');
    }
    
    // Business logic: data access through cache layer only
    return this.cache.getData(id);
  }
}
```

## 🎨 Component Library Reference

### Layout Components

#### Container

```typescript
import { Container } from '@/shared/ui/components';

// Basic usage
<Container padding="md">
  <p>Content here</p>
</Container>

// With centering
<Container center>
  <p>Centered content</p>
</Container>

// With responsive design
<Container 
  padding="sm" 
  md={{ padding: 'lg' }}
  lg={{ padding: 'xl' }}
>
  <p>Responsive content</p>
</Container>
```

#### Button

```typescript
import { Button } from '@/shared/ui/components';

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>

// With sizes
<Button size="xs">Extra Small</Button>
<Button size="lg">Large</Button>

// With states
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
```

#### Input

```typescript
import { Input } from '@/shared/ui/components';

// Basic input
<Input placeholder="Enter text here" />

// With validation
<Input 
  error={hasError}
  helperText="Please enter a valid email"
  label="Email Address"
/>

// With adornments
<Input
  startAdornment={<span>@</span>}
  endAdornment={<span>.com</span>}
  placeholder="Username"
/>
```

## 🔧 Theme Customization

### Using Theme Tokens

```typescript
import { useEnhancedTheme } from '@/core/theme';

const CustomComponent = () => {
  const { theme } = useEnhancedTheme();
  
  return (
    <div
      style={{
        backgroundColor: theme.colors.background.primary,
        color: theme.colors.text.primary,
        padding: theme.spacing.lg,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadows.md
      }}
    >
      <h1 style={{
        color: theme.colors.brand[500],
        fontSize: theme.typography.fontSize['2xl']
      }}>
        Custom Styled Component
      </h1>
    </div>
  );
};
```

### Responsive Design

```typescript
import { media } from '@/core/theme';

const ResponsiveComponent = () => {
  const { theme } = useEnhancedTheme();
  
  return (
    <div
      style={{
        padding: theme.spacing.md,
        [media.mobile]: { padding: theme.spacing.sm },
        [media.desktop]: { padding: theme.spacing.xl }
      }}
    >
      <h1>Responsive Design</h1>
    </div>
  );
};
```

## 🧪 Testing Patterns

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/shared/ui/components';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Testing

```typescript
import { renderHook } from '@testing-library/react';
import { useApiResource } from './useApiResource';

describe('useApiResource', () => {
  it('loads data on mount', async () => {
    const { result } = renderHook(() => useApiResource('users/1'));
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

## 🚀 Performance Optimization

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

const App = () => (
  <div>
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  </div>
);
```

### Memoization

```typescript
import React, { memo } from 'react';

const ExpensiveList = memo(({ items }: { items: Item[] }) => {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});
```

## 📱 Accessibility Guidelines

### Semantic HTML

```typescript
// Use semantic HTML elements
const Header = () => <header>Header content</header>;
const Main = () => <main>Main content</main>;
const Footer = () => <footer>Footer content</footer>;
```

### ARIA Attributes

```typescript
const FormField = ({ label, error, required }: FormFieldProps) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      aria-describedby={helperText}
      aria-invalid={!!error}
      aria-required={required}
    />
    {error && (
      <span id={`${id}-error`} role="alert">
        {error}
      </span>
    )}
  </div>
);
```

## 🔧 Debugging Tools

### React DevTools Profiler

```typescript
import { Profiler } from 'react';

const ProfileComponent = () => (
  <Profiler
    id="ProfileComponent"
    onRender={(id, phase, actualDuration) => {
      if (actualDuration > 16) {
        console.warn(`Slow render: ${actualDuration}ms for ${id}`);
      }
    }}
  >
    <ProfileComponent />
  </Profiler>
);
```

### Custom Query Debugging

```typescript
import { useCustomQuery } from '@/core/query';

const { data, isLoading, error } = useCustomQuery(
  ['users', userId],
  () => userService.getUser(userId),
  {
    debug: true,
    onSuccess: (data) => console.log('Query success:', data),
    onError: (error) => console.error('Query failed:', error)
  }
);
```

## 📚 Resources

### Documentation Links
- [Architecture Overview](../architecture/ARCHITECTURE_OVERVIEW.md)
- [Enterprise Patterns](../architecture/ENTERPRISE_PATTERNS.md)
- [Complete Architecture Guide](../architecture/COMPLETE_ARCHITECTURE_GUIDE.md)
- [Architectural Decision Records](../architecture/ADRs.md)
- [Feature Documentation](../features/)
- [Core Modules](../core-modules/)
- [Development Guide](../development-guides/DEVELOPMENT_GUIDE.md)

### Component Reference
- [Theme System](../core-modules/THEME_SYSTEM.md)
- [Custom Query System](../core-modules/CUSTOM_QUERY_SYSTEM.md)
- [Authentication System](../core-modules/AUTHENTICATION_SYSTEM.md)

---

**Status: ✅ READY FOR DEPLOYMENT**

This usage guide provides comprehensive examples and patterns for effective use of QuietSpace Frontend components and features.
