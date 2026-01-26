# Interactive Examples & Demos

> 🎯 **Working Examples and Interactive Demos for QuietSpace Frontend**

This document provides interactive examples and working demos that demonstrate key features and patterns in the QuietSpace Frontend application.

---

## 📋 **Table of Contents**

- [Quick Start Examples](#-quick-start-examples)
- [Component Demos](#-component-demos)
- [Feature Demonstrations](#-feature-demonstrations)
- [Pattern Examples](#-pattern-examples)
- [Advanced Demos](#-advanced-demos)

---

## 🚀 **Quick Start Examples**

### **Basic Component Usage**

```typescript
// Example 1: Basic Form Component
import { useState } from 'react';
import { Container, Button, Input, Text, Title } from '@/shared/ui/components';

const BasicForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <Container padding="lg" maxWidth="md">
      <Title level={2}>Contact Form</Title>
      
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(value) => setFormData({...formData, name: value})}
          marginBottom="md"
        />
        
        <Input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(value) => setFormData({...formData, email: value})}
          marginBottom="md"
        />
        
        <Input
          type="text"
          placeholder="Your Message"
          value={formData.message}
          onChange={(value) => setFormData({...formData, message: value})}
          marginBottom="lg"
        />
        
        <Button type="submit" variant="primary">
          Send Message
        </Button>
      </form>
    </Container>
  );
};
```

### **Theme Integration**

```typescript
// Example 2: Theme-Aware Component
import { useEnhancedTheme } from '@/core/theme';
import { Container, Text, Button } from '@/shared/ui/components';

const ThemeDemo = () => {
  const { theme, switchTheme, currentVariant } = useEnhancedTheme();

  return (
    <Container 
      padding="lg"
      style={{
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.border.light}`
      }}
    >
      <Text marginBottom="md">
        Current theme: <strong>{currentVariant}</strong>
      </Text>
      
      <Button 
        variant="outline" 
        onClick={() => switchTheme(currentVariant === 'light' ? 'dark' : 'light')}
        marginBottom="sm"
      >
        Switch to {currentVariant === 'light' ? 'Dark' : 'Light'} Theme
      </Button>
      
      <Text variant="small" color="secondary">
        Theme colors: {JSON.stringify(theme.colors.primary)}
      </Text>
    </Container>
  );
};
```

---

## 🎨 **Component Demos**

### **Interactive Button Demo**

```typescript
// Example 3: Button Variants and States
const ButtonDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleLoadingClick = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <Container padding="lg">
      <Title level={3}>Button Variants</Title>
      
      {/* Primary Buttons */}
      <Container marginBottom="md">
        <Text fontWeight="bold">Primary:</Text>
        <Button variant="primary" marginRight="sm">Primary</Button>
        <Button variant="primary" disabled marginRight="sm">Disabled</Button>
        <Button variant="primary" loading>Loading</Button>
      </Container>
      
      {/* Secondary Buttons */}
      <Container marginBottom="md">
        <Text fontWeight="bold">Secondary:</Text>
        <Button variant="secondary" marginRight="sm">Secondary</Button>
        <Button variant="secondary" outline>Outline</Button>
      </Container>
      
      {/* Interactive Demo */}
      <Container>
        <Text fontWeight="bold">Interactive:</Text>
        <Button 
          variant="primary" 
          onClick={() => setClickCount(count => count + 1)}
          marginRight="sm"
        >
          Clicked {clickCount} times
        </Button>
        <Button 
          variant="secondary" 
          loading={isLoading}
          onClick={handleLoadingClick}
        >
          Simulate Loading
        </Button>
      </Container>
    </Container>
  );
};
```

### **Form Components Demo**

```typescript
// Example 4: Advanced Form with Validation
const FormDemo = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form is valid:', formData);
    }
  };

  return (
    <Container padding="lg" maxWidth="md">
      <Title level={3}>Advanced Form Demo</Title>
      
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(value) => setFormData({...formData, email: value})}
          error={errors.email}
          marginBottom="md"
          required
        />
        
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(value) => setFormData({...formData, password: value})}
          error={errors.password}
          marginBottom="md"
          required
        />
        
        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(value) => setFormData({...formData, confirmPassword: value})}
          error={errors.confirmPassword}
          marginBottom="md"
          required
        />
        
        <Container marginBottom="lg">
          <label>
            <input
              type="checkbox"
              checked={formData.terms}
              onChange={(e) => setFormData({...formData, terms: e.target.checked})}
            />
            I accept the terms and conditions
          </label>
          {errors.terms && <Text color="error">{errors.terms}</Text>}
        </Container>
        
        <Button type="submit" variant="primary">
          Register Account
        </Button>
      </form>
    </Container>
  );
};
```

---

## 🔧 **Feature Demonstrations**

### **Authentication Demo**

```typescript
// Example 5: Authentication Flow Demo
import { useEnterpriseAuth } from '@/features/auth/application/hooks/useEnterpriseAuth';

const AuthDemo = () => {
  const { user, isLoading, error, login, logout, isAuthenticated } = useEnterpriseAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (isAuthenticated && user) {
    return (
      <Container padding="lg" maxWidth="md">
        <Title level={2}>Welcome, {user.name}!</Title>
        
        <Container marginBottom="md">
          <Text>Email: {user.email}</Text>
          <Text>Provider: {user.provider}</Text>
          <Text>Last Login: {new Date(user.lastLogin).toLocaleString()}</Text>
        </Container>
        
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </Container>
    );
  }

  return (
    <Container padding="lg" maxWidth="md">
      <Title level={2}>Login Demo</Title>
      
      {error && (
        <Container marginBottom="md" padding="md" style={{ backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px' }}>
          <Text color="error">Error: {error}</Text>
        </Container>
      )}
      
      <form onSubmit={handleLogin}>
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={credentials.email}
          onChange={(value) => setCredentials({...credentials, email: value})}
          marginBottom="md"
          required
        />
        
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={credentials.password}
          onChange={(value) => setCredentials({...credentials, password: value})}
          marginBottom="lg"
          required
        />
        
        <Button type="submit" variant="primary" loading={isLoading} fullWidth>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Container>
  );
};
```

### **Cache Demo**

```typescript
// Example 6: Cache Operations Demo
import { createCacheProvider, type ICacheProvider } from '@/core/cache';

const CacheDemo = () => {
  const [cache] = useState(() => createCacheProvider());
  const [cacheData, setCacheData] = useState<Record<string, any>>({});
  const [stats, setStats] = useState<any>({});

  const updateStats = () => {
    setStats(cache.getStats());
  };

  const addToCache = () => {
    const key = `demo-${Date.now()}`;
    const value = {
      message: 'Hello from cache!',
      timestamp: new Date().toISOString(),
      random: Math.random()
    };
    
    cache.set(key, value, 60000); // 1 minute TTL
    setCacheData(prev => ({ ...prev, [key]: value }));
    updateStats();
  };

  const clearCache = () => {
    cache.clear();
    setCacheData({});
    updateStats();
  };

  useEffect(() => {
    updateStats();
  }, []);

  return (
    <Container padding="lg">
      <Title level={3}>Cache Operations Demo</Title>
      
      <Container marginBottom="md">
        <Text fontWeight="bold">Cache Statistics:</Text>
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      </Container>
      
      <Container marginBottom="md">
        <Button variant="primary" onClick={addToCache} marginRight="sm">
          Add to Cache
        </Button>
        <Button variant="secondary" onClick={clearCache}>
          Clear Cache
        </Button>
      </Container>
      
      <Container>
        <Text fontWeight="bold">Cached Data:</Text>
        {Object.keys(cacheData).length === 0 ? (
          <Text color="secondary">No data in cache</Text>
        ) : (
          <pre>{JSON.stringify(cacheData, null, 2)}</pre>
        )}
      </Container>
    </Container>
  );
};
```

---

## 🔄 **Pattern Examples**

### **Custom Hook Pattern**

```typescript
// Example 7: Custom Hook for API Data
import { useState, useEffect } from 'react';
import { useCustomQuery } from '@/core/query';

interface UseApiDataOptions<T> {
  url: string;
  initialData?: T;
  refetchInterval?: number;
  enabled?: boolean;
}

function useApiData<T>({ url, initialData, refetchInterval, enabled = true }: UseApiDataOptions<T>) {
  const { data, isLoading, error, refetch } = useCustomQuery(
    ['api-data', url],
    async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    {
      initialData,
      refetchInterval,
      enabled,
      staleTime: 30000,
      cacheTime: 300000
    }
  );

  return {
    data,
    isLoading,
    error,
    refetch,
    isSuccess: !!data && !error,
    isEmpty: !!data && Array.isArray(data) && data.length === 0
  };
}

// Usage
const UserDataComponent = ({ userId }: { userId: string }) => {
  const { data: user, isLoading, error, isSuccess } = useApiData(`/api/users/${userId}`);

  if (isLoading) return <div>Loading user...</div>;
  if (error) return <div>Error loading user: {error.message}</div>;
  if (!isSuccess) return <div>No user data found</div>;

  return (
    <Container>
      <Title level={3}>{user.name}</Title>
      <Text>{user.email}</Text>
    </Container>
  );
};
```

### **Error Boundary Pattern**

```typescript
// Example 8: Error Boundary with Fallback
import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Container padding="lg" center>
          <Title level={3}>Something went wrong</Title>
          <Text color="secondary" marginBottom="md">
            An unexpected error occurred. Please try refreshing the page.
          </Text>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Usage
const AppWithErrorBoundary = () => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      // Send error to tracking service
      errorTracker.captureException(error, { extra: errorInfo });
    }}
  >
    <YourApp />
  </ErrorBoundary>
);
```

---

## 🚀 **Advanced Demos**

### **Real-time Chat Demo**

```typescript
// Example 9: Real-time Chat Interface
import { useState, useEffect, useRef } from 'react';
import { useChatMessages, useChatPresence, useSendMessage } from '@/features/chat';

const ChatDemo = ({ roomId }: { roomId: string }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading } = useChatMessages(roomId);
  const { users, typingUsers } = useChatPresence(roomId);
  const { sendMessage } = useSendMessage(roomId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage({ content: message.trim(), type: 'text' });
      setMessage('');
    }
  };

  return (
    <Container padding="lg" height="500px" display="flex" flexDirection="column">
      <Container borderBottom="1px solid #eee" padding="md" marginBottom="md">
        <Title level={4}>Chat Room: {roomId}</Title>
        <Text variant="small" color="secondary">
          {users.length} users online
          {typingUsers.length > 0 && ` • ${typingUsers.length} typing`}
        </Text>
      </Container>

      <Container flex={1} overflow="auto" marginBottom="md">
        {messages.map((msg) => (
          <Container key={msg.id} marginBottom="sm" padding="sm">
            <Text fontWeight="bold">{msg.userId}</Text>
            <Text>{msg.content}</Text>
            <Text variant="small" color="secondary">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </Text>
          </Container>
        ))}
        <div ref={messagesEndRef} />
      </Container>

      <form onSubmit={handleSendMessage}>
        <Container display="flex" gap="sm">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={setMessage}
            flex={1}
          />
          <Button type="submit" variant="primary" disabled={!message.trim()}>
            Send
          </Button>
        </Container>
      </form>
    </Container>
  );
};
```

### **Analytics Dashboard Demo**

```typescript
// Example 10: Analytics Dashboard with Real-time Data
import { useAnalyticsMetrics, useRealTimeAnalytics } from '@/features/analytics';

const AnalyticsDashboard = () => {
  const { data: metrics, isLoading } = useAnalyticsMetrics({
    dateRange: { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date() }
  });
  
  const { data: realTimeData } = useRealTimeAnalytics();

  if (isLoading) return <Container padding="lg"><Text>Loading analytics...</Text></Container>;

  return (
    <Container padding="lg">
      <Title level={2}>Analytics Dashboard</Title>
      
      {/* Key Metrics */}
      <Container display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="md" marginBottom="lg">
        <Container padding="md" border="1px solid #eee" borderRadius="md">
          <Text variant="large" fontWeight="bold">{metrics?.totalUsers || 0}</Text>
          <Text color="secondary">Total Users</Text>
        </Container>
        
        <Container padding="md" border="1px solid #eee" borderRadius="md">
          <Text variant="large" fontWeight="bold">{metrics?.activeUsers || 0}</Text>
          <Text color="secondary">Active Users</Text>
        </Container>
        
        <Container padding="md" border="1px solid #eee" borderRadius="md">
          <Text variant="large" fontWeight="bold">{metrics?.engagementRate || 0}%</Text>
          <Text color="secondary">Engagement Rate</Text>
        </Container>
        
        <Container padding="md" border="1px solid #eee" borderRadius="md">
          <Text variant="large" fontWeight="bold">{realTimeData?.currentOnline || 0}</Text>
          <Text color="secondary">Online Now</Text>
        </Container>
      </Container>

      {/* Real-time Activity */}
      <Container marginBottom="lg">
        <Title level={3}>Real-time Activity</Title>
        <Container border="1px solid #eee" borderRadius="md" padding="md">
          <Text>Page Views (last hour): {realTimeData?.pageViews?.lastHour || 0}</Text>
          <Text>Active Sessions: {realTimeData?.activeSessions || 0}</Text>
          <Text>Avg Response Time: {realTimeData?.avgResponseTime || 0}ms</Text>
        </Container>
      </Container>

      {/* Performance Chart Placeholder */}
      <Container>
        <Title level={3}>Performance Trends</Title>
        <Container border="1px solid #eee" borderRadius="md" padding="lg" center height="200px">
          <Text color="secondary">Chart component would go here</Text>
        </Container>
      </Container>
    </Container>
  );
};
```

---

## 🎯 **How to Use These Examples**

### **1. Copy and Paste**
- Copy the example code into your project
- Adjust imports and paths as needed
- Run and test the functionality

### **2. Modify and Extend**
- Use examples as starting points
- Customize for your specific needs
- Add your own features and enhancements

### **3. Learn Patterns**
- Study the code structure and patterns
- Apply similar patterns in your own components
- Follow best practices demonstrated

### **4. Test and Validate**
- Test examples in different environments
- Validate accessibility and performance
- Ensure proper error handling

---

## 📚 **Additional Resources**

- [Component Library Reference](../core-modules/THEME_SYSTEM.md)
- [API Documentation](../api/API_DOCUMENTATION.md)
- [Development Guide](../development-guides/DEVELOPMENT_GUIDE.md)
- [Usage Guide](../usage-guides/USAGE_GUIDE.md)

---

**🎯 These interactive examples provide practical, working demonstrations of QuietSpace Frontend features and patterns. Use them as learning resources and starting points for your own implementations.**

---

*Last Updated: January 26, 2026*  
*Examples Version: 1.0.0*  
*Status: ✅ PRODUCTION READY*
