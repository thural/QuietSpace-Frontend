# Usage Guide

## 🎯 Overview

This comprehensive usage guide provides practical examples and patterns for using QuietSpace Frontend components, services, and features effectively in real-world applications with strict layer separation compliance.

## 🚀 Quick Start

### Basic Component Usage

```typescript
// Import components from central index
import { Container, Button, Input, Text, Title } from '@/shared/ui/components';

// Use in your components
import React, { Component, ReactNode } from 'react';
import { Container, Button, Input, Text, Title } from '@/shared/ui/components';

interface IMyComponentProps {}

class MyComponent extends Component<IMyComponentProps> {
  render(): ReactNode {
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
  }
}
```

### Theme Integration

```typescript
import { useEnhancedTheme } from '@/core/theme';
import React, { Component, ReactNode } from 'react';

interface IThemedComponentProps {}

class ThemedComponent extends Component<IThemedComponentProps> {
  private themeService = useEnhancedTheme();

  render(): ReactNode {
    const { theme, switchTheme } = this.themeService;
    
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
import React, { Component, ReactNode } from 'react';
import { Container, Button, Input, Text, Title } from '@/shared/ui/components';

interface ILoginFormState {
  credentials: {
    email: string;
    password: string;
  };
  isLoading: boolean;
  error: string | null;
}

interface ILoginFormProps {}

class LoginForm extends Component<ILoginFormProps, ILoginFormState> {
  private authService = useEnterpriseAuth();

  constructor(props: ILoginFormProps) {
    super(props);
    this.state = {
      credentials: {
        email: '',
        password: ''
      },
      isLoading: false,
      error: null
    };
  }

  private handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    this.safeSetState({ isLoading: true, error: null });
    
    try {
      await this.authService.login(this.state.credentials);
      // Redirect to dashboard
    } catch (error) {
      this.safeSetState({ error: error.message });
    }
  };

  private safeSetState = (partialState: Partial<ILoginFormState>): void => {
    if (this._isMounted) {
      this.setState(partialState as ILoginFormState);
    }
  };

  componentDidMount(): void {
    this._isMounted = true;
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  private _isMounted = false;

  render(): ReactNode {
    const { credentials, isLoading, error } = this.state;
    
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          type="email"
          value={credentials.email}
          onChange={(e) => this.safeSetState({ 
            credentials: { ...credentials, email: e.target.value }
          })}
          placeholder="Email address"
          required
        />
        <Input
          type="password"
          value={credentials.password}
          onChange={(e) => this.safeSetState({ 
            credentials: { ...credentials, password: e.target.value }
          })}
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
        {error && <Text color="error">{error}</Text>}
      </form>
    );
  }
}
```

#### Multi-Factor Authentication

```typescript
import { useEnterpriseAuth } from '@/features/auth/application/hooks/useEnterpriseAuth';
import React, { Component, ReactNode } from 'react';
import { Button, Text } from '@/shared/ui/components';

interface IMFASetupState {
  qrCode: string;
  backupCodes: string[];
  isLoading: boolean;
  error: string | null;
}

interface IMFASetupProps {}

class MFASetup extends Component<IMFASetupProps, IMFASetupState> {
  private authService = useEnterpriseAuth();

  constructor(props: IMFASetupProps) {
    super(props);
    this.state = {
      qrCode: '',
      backupCodes: [],
      isLoading: false,
      error: null
    };
  }

  private handleEnableMFA = async (): Promise<void> => {
    this.safeSetState({ isLoading: true, error: null });
    
    try {
      const setup = await this.authService.generateTOTPSecret();
      this.safeSetState({ 
        qrCode: setup.qrCode,
        backupCodes: setup.backupCodes
      });
      await this.authService.enableMFA('totp');
    } catch (error) {
      this.safeSetState({ error: error.message });
    } finally {
      this.safeSetState({ isLoading: false });
    }
  };

  private safeSetState = (partialState: Partial<IMFASetupState>): void => {
    if (this._isMounted) {
      this.setState(partialState as IMFASetupState);
    }
  };

  componentDidMount(): void {
    this._isMounted = true;
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  private _isMounted = false;

  render(): ReactNode {
    const { qrCode, backupCodes, isLoading, error } = this.state;
    
    return (
      <div>
        <h2>Set Up Multi-Factor Authentication</h2>
        <Button 
          onClick={this.handleEnableMFA}
          loading={isLoading}
        >
          Enable TOTP
        </Button>
        {error && <Text color="error">{error}</Text>}
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
  }
}
```

### Chat Feature

#### Real-time Chat Interface

```typescript
import { useUnifiedChat } from '@/features/chat/application/hooks/useUnifiedChat';
import React, { Component, ReactNode } from 'react';
import { Button, Input } from '@/shared/ui/components';

interface IChatRoomProps {
  roomId: string;
}

interface IChatRoomState {
  message: string;
  isLoading: boolean;
  error: string | null;
}

class ChatRoom extends Component<IChatRoomProps, IChatRoomState> {
  private chatService = useUnifiedChat(this.props.roomId);

  constructor(props: IChatRoomProps) {
    super(props);
    this.state = {
      message: '',
      isLoading: false,
      error: null
    };
  }

  private handleSendMessage = async (): Promise<void> => {
    if (this.state.message.trim()) {
      this.safeSetState({ isLoading: true });
      try {
        await this.chatService.sendMessage(this.state.message);
        this.safeSetState({ message: '' });
      } catch (error) {
        this.safeSetState({ error: error.message });
      } finally {
        this.safeSetState({ isLoading: false });
      }
    }
  };

  private handleTyping = async (isTyping: boolean): Promise<void> => {
    try {
      await this.chatService.sendTypingIndicator(isTyping);
    } catch (error) {
      console.error('Typing indicator failed:', error);
    }
  };

  private handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.safeSetState({ message: e.target.value });
    this.handleTyping(true);
  };

  private handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.handleSendMessage();
    }
  };

  private safeSetState = (partialState: Partial<IChatRoomState>): void => {
    if (this._isMounted) {
      this.setState(partialState as IChatRoomState);
    }
  };

  componentDidMount(): void {
    this._isMounted = true;
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  private _isMounted = false;

  render(): ReactNode {
    const { message, isLoading, error } = this.state;
    const { messages } = this.chatService;
    
    return (
      <div className="chat-room">
        <div className="messages">
          {messages.map(msg => (
            <MessageComponent key={msg.id} message={msg} />
          ))}
        </div>
        
        <div className="input-area">
          <Input
            type="text"
            value={message}
            onChange={this.handleMessageChange}
            onKeyPress={this.handleKeyPress}
            placeholder="Type a message..."
          />
          <Button 
            onClick={this.handleSendMessage}
            disabled={isLoading}
            loading={isLoading}
          >
            Send
          </Button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    );
  }
}
```

### Analytics Feature

#### Dashboard with Real-time Data

```typescript
import { useEnterpriseAnalytics } from '@/features/analytics/application/hooks/useEnterpriseAnalytics';
import React, { Component, ReactNode } from 'react';
import { Container, Title, Button } from '@/shared/ui/components';

interface IAnalyticsDashboardState {
  selectedDashboard: string | null;
  isLoading: boolean;
  error: string | null;
}

interface IAnalyticsDashboardProps {}

class AnalyticsDashboard extends Component<IAnalyticsDashboardProps, IAnalyticsDashboardState> {
  private analyticsService = useEnterpriseAnalytics();

  constructor(props: IAnalyticsDashboardProps) {
    super(props);
    this.state = {
      selectedDashboard: null,
      isLoading: false,
      error: null
    };
  }

  private handleGenerateReport = async (reportConfig: ReportConfig): Promise<void> => {
    this.safeSetState({ isLoading: true, error: null });
    try {
      const report = await this.analyticsService.generateReport(reportConfig);
      console.log('Report generated:', report.id);
    } catch (error) {
      this.safeSetState({ error: error.message });
    } finally {
      this.safeSetState({ isLoading: false });
    }
  };

  private handleDashboardChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    this.safeSetState({ selectedDashboard: e.target.value });
  };

  private safeSetState = (partialState: Partial<IAnalyticsDashboardState>): void => {
    if (this._isMounted) {
      this.setState(partialState as IAnalyticsDashboardState);
    }
  };

  componentDidMount(): void {
    this._isMounted = true;
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  private _isMounted = false;

  render(): ReactNode {
    const { selectedDashboard, isLoading, error } = this.state;
    const { dashboards, runPrediction, exportData } = this.analyticsService;
    
    return (
      <Container>
        <Title level={1}>Analytics Dashboard</Title>
        
        <select
          value={selectedDashboard || ''}
          onChange={this.handleDashboardChange}
        >
          <option value="">Select Dashboard</option>
          {dashboards.map(dashboard => (
            <option key={dashboard.id} value={dashboard.id}>
              {dashboard.name}
            </option>
          ))}
        </select>
        
        {error && <div className="error">{error}</div>}
        
        {selectedDashboard && (
          <DashboardView 
            dashboard={dashboards.find(d => d.id === selectedDashboard)!}
            onGenerateReport={this.handleGenerateReport}
            onRunPrediction={runPrediction}
            onExportData={exportData}
          />
        )}
      </Container>
    );
  }
}
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
import React, { Component, ReactNode } from 'react';

interface ICustomComponentProps {}

class CustomComponent extends Component<ICustomComponentProps> {
  private themeService = useEnhancedTheme();

  render(): ReactNode {
    const { theme } = this.themeService;
    
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
  }
}
```

### Responsive Design

```typescript
import { media } from '@/core/theme';
import { useEnhancedTheme } from '@/core/theme';
import React, { Component, ReactNode } from 'react';

interface IResponsiveComponentProps {}

class ResponsiveComponent extends Component<IResponsiveComponentProps> {
  private themeService = useEnhancedTheme();

  render(): ReactNode {
    const { theme } = this.themeService;
    
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
  }
}
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
import React, { Component, ReactNode } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

interface IAppState {}

class App extends Component<IAppState> {
  render(): ReactNode {
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      </div>
    );
  }
}
```

### Memoization

```typescript
import React, { Component, ReactNode } from 'react';

interface IExpensiveListProps {
  items: Item[];
}

class ExpensiveList extends Component<IExpensiveListProps> {
  shouldComponentUpdate(nextProps: IExpensiveListProps): boolean {
    return nextProps.items !== this.props.items;
  }

  render(): ReactNode {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    );
  }
}
```

## 📱 Accessibility Guidelines

### Semantic HTML

```typescript
// Use semantic HTML elements
import React, { Component, ReactNode } from 'react';

interface IHeaderProps {
  children?: ReactNode;
}

class Header extends Component<IHeaderProps> {
  render(): ReactNode {
    return <header>{this.props.children}</header>;
  }
}

interface IMainProps {
  children?: ReactNode;
}

class Main extends Component<IMainProps> {
  render(): ReactNode {
    return <main>{this.props.children}</main>;
  }
}

interface IFooterProps {
  children?: ReactNode;
}

class Footer extends Component<IFooterProps> {
  render(): ReactNode {
    return <footer>{this.props.children}</footer>;
  }
}
```

### ARIA Attributes

```typescript
import React, { Component, ReactNode } from 'react';

interface IFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  id: string;
  helperText?: string;
}

class FormField extends Component<IFormFieldProps> {
  render(): ReactNode {
    const { label, error, required, id, helperText } = this.props;
    
    return (
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
  }
}
```

## 🔧 Debugging Tools

### React DevTools Profiler

```typescript
import { Profiler } from 'react';
import React, { Component, ReactNode } from 'react';

interface IProfileComponentProps {}

class ProfileComponent extends Component<IProfileComponentProps> {
  private handleProfilerRender = (id: string, phase: string, actualDuration: number): void => {
    if (actualDuration > 16) {
      console.warn(`Slow render: ${actualDuration}ms for ${id}`);
    }
  };

  render(): ReactNode {
    return (
      <Profiler
        id="ProfileComponent"
        onRender={this.handleProfilerRender}
      >
        <div>Profiled Component Content</div>
      </Profiler>
    );
  }
}
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
