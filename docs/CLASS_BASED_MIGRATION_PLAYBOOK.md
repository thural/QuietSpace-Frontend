# Class-Based Component Migration Playbook

## 🎯 Overview

This playbook provides step-by-step instructions for migrating functional components to class-based components in the QuietSpace Frontend application.

---

## 📋 Migration Checklist

### **Pre-Migration Preparation**
- [ ] Review component complexity and classification
- [ ] Identify dependencies and integrations
- [ ] Create backup of current implementation
- [ ] Set up testing environment
- [ ] Document current behavior and edge cases

### **Migration Steps**
- [ ] Create class component structure
- [ ] Convert state management
- [ ] Migrate lifecycle effects
- [ ] Update event handlers
- [ ] Implement performance optimizations
- [ ] Add error boundaries
- [ ] Update tests
- [ ] Validate functionality

### **Post-Migration Validation**
- [ ] Run all tests
- [ ] Performance benchmarking
- [ ] Manual testing of critical paths
- [ ] Code review and validation
- [ ] Update documentation

---

## 🔄 Migration Templates

### **Template 1: Simple Stateful Component**

#### **Before (Functional)**
```typescript
import React, { useState, useEffect } from 'react';

interface ISimpleComponentProps {
  userId: string;
  onUpdate?: (data: any) => void;
}

const SimpleComponent: React.FC<ISimpleComponentProps> = ({ userId, onUpdate }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const result = await apiService.getData(userId);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (actionData) => {
    setData(prev => ({ ...prev, ...actionData }));
    onUpdate?.(actionData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{data?.title}</h1>
      <button onClick={() => handleAction({ updated: true })}>
        Update
      </button>
    </div>
  );
};

export default SimpleComponent;
```

#### **After (Class-Based)**
```typescript
import React, { Component, ReactNode } from 'react';

interface ISimpleComponentProps {
  userId: string;
  onUpdate?: (data: any) => void;
}

interface ISimpleComponentState {
  data: any;
  isLoading: boolean;
  error: string | null;
}

class SimpleComponent extends Component<ISimpleComponentProps, ISimpleComponentState> {
  constructor(props: ISimpleComponentProps) {
    super(props);
    
    this.state = {
      data: null,
      isLoading: true,
      error: null
    };

    // Bind methods
    this.handleAction = this.handleAction.bind(this);
  }

  componentDidMount(): void {
    this.loadData();
  }

  componentDidUpdate(prevProps: ISimpleComponentProps): void {
    if (prevProps.userId !== this.props.userId) {
      this.loadData();
    }
  }

  private async loadData(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });
      
      const result = await this.apiService.getData(this.props.userId);
      
      this.setState({ 
        data: result, 
        isLoading: false 
      });
    } catch (err) {
      this.setState({ 
        error: err.message, 
        isLoading: false 
      });
    }
  }

  private handleAction(actionData: any): void {
    this.setState(prevState => ({
      data: { ...prevState.data, ...actionData }
    }));
    
    this.props.onUpdate?.(actionData);
  }

  render(): ReactNode {
    const { data, isLoading, error } = this.state;

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <h1>{data?.title}</h1>
        <button onClick={() => this.handleAction({ updated: true })}>
          Update
        </button>
      </div>
    );
  }
}

export default SimpleComponent;
```

---

### **Template 2: Complex Component with Multiple Effects**

#### **Before (Functional)**
```typescript
import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface IComplexComponentProps {
  userId: string;
  websocketUrl: string;
  filters: FilterOptions;
}

const ComplexComponent: React.FC<IComplexComponentProps> = ({ 
  userId, 
  websocketUrl, 
  filters 
}) => {
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState([]);
  const [realtimeData, setRealtimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);

  // Load initial data
  useEffect(() => {
    loadPosts();
    loadConnections();
  }, [userId]);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(websocketUrl);
    
    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealtimeData(data);
    };

    return () => ws.close();
  }, [websocketUrl]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => 
      post.category === filters.category &&
      post.status === filters.status
    );
  }, [posts, filters]);

  // Handle post update
  const handlePostUpdate = useCallback((postId: string, updates: any) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await postService.getUserPosts(userId);
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const data = await connectionService.getUserConnections(userId);
      setConnections(data);
    } catch (error) {
      console.error('Failed to load connections:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Complex Component</h1>
      <ConnectionStatus connected={wsConnected} />
      <PostList posts={filteredPosts} onUpdate={handlePostUpdate} />
      <RealtimeDisplay data={realtimeData} />
    </div>
  );
};

export default ComplexComponent;
```

#### **After (Class-Based)**
```typescript
import React, { Component, ReactNode } from 'react';

interface IComplexComponentProps {
  userId: string;
  websocketUrl: string;
  filters: FilterOptions;
}

interface IComplexComponentState {
  posts: Post[];
  connections: Connection[];
  realtimeData: any;
  isLoading: boolean;
  wsConnected: boolean;
}

class ComplexComponent extends Component<IComplexComponentProps, IComplexComponentState> {
  private websocket: WebSocket | null = null;
  private memoizedFilteredPosts: Post[] | null = null;
  private lastFilters: FilterOptions | null = null;

  constructor(props: IComplexComponentProps) {
    super(props);
    
    this.state = {
      posts: [],
      connections: [],
      realtimeData: null,
      isLoading: true,
      wsConnected: false
    };

    // Bind methods
    this.handlePostUpdate = this.handlePostUpdate.bind(this);
  }

  componentDidMount(): void {
    this.loadInitialData();
    this.connectWebSocket();
  }

  componentDidUpdate(prevProps: IComplexComponentProps): void {
    // Handle user change
    if (prevProps.userId !== this.props.userId) {
      this.loadInitialData();
    }

    // Handle WebSocket URL change
    if (prevProps.websocketUrl !== this.props.websocketUrl) {
      this.connectWebSocket();
    }

    // Clear memoization when filters change
    if (prevProps.filters !== this.props.filters) {
      this.memoizedFilteredPosts = null;
      this.lastFilters = null;
    }
  }

  componentWillUnmount(): void {
    this.cleanupWebSocket();
  }

  private async loadInitialData(): Promise<void> {
    this.setState({ isLoading: true });
    
    try {
      await Promise.all([
        this.loadPosts(),
        this.loadConnections()
      ]);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private async loadPosts(): Promise<void> {
    try {
      const data = await this.postService.getUserPosts(this.props.userId);
      this.setState({ posts: data });
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }

  private async loadConnections(): Promise<void> {
    try {
      const data = await this.connectionService.getUserConnections(this.props.userId);
      this.setState({ connections: data });
    } catch (error) {
      console.error('Failed to load connections:', error);
    }
  }

  private connectWebSocket(): void {
    this.cleanupWebSocket();

    this.websocket = new WebSocket(this.props.websocketUrl);
    
    this.websocket.onopen = () => {
      this.setState({ wsConnected: true });
    };

    this.websocket.onclose = () => {
      this.setState({ wsConnected: false });
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.setState({ realtimeData: data });
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  private cleanupWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  private getFilteredPosts(): Post[] {
    // Memoization pattern
    if (
      this.memoizedFilteredPosts && 
      this.lastFilters && 
      JSON.stringify(this.lastFilters) === JSON.stringify(this.props.filters)
    ) {
      return this.memoizedFilteredPosts;
    }

    const filtered = this.state.posts.filter(post => 
      post.category === this.props.filters.category &&
      post.status === this.props.filters.status
    );

    this.memoizedFilteredPosts = filtered;
    this.lastFilters = { ...this.props.filters };

    return filtered;
  }

  private handlePostUpdate(postId: string, updates: any): void {
    this.setState(prevState => ({
      posts: prevState.posts.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      )
    }));
  }

  render(): ReactNode {
    const { isLoading, wsConnected, realtimeData } = this.state;
    const filteredPosts = this.getFilteredPosts();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h1>Complex Component</h1>
        <ConnectionStatus connected={wsConnected} />
        <PostList posts={filteredPosts} onUpdate={this.handlePostUpdate} />
        <RealtimeDisplay data={realtimeData} />
      </div>
    );
  }
}

export default ComplexComponent;
```

---

### **Template 3: Real-time Component with Error Boundary**

#### **Before (Functional)**
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface IRealtimeComponentProps {
  userId: string;
  websocketUrl: string;
}

const RealtimeComponent: React.FC<IRealtimeComponentProps> = ({ userId, websocketUrl }) => {
  const [messages, setMessages] = useState([]);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [error, setError] = useState(null);

  useEffect(() => {
    connectWebSocket();
  }, [websocketUrl]);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(websocketUrl);
    
    ws.onopen = () => {
      setConnectionState('connected');
      ws.send(JSON.stringify({ type: 'subscribe', userId }));
    };

    ws.onclose = () => {
      setConnectionState('disconnected');
      // Attempt reconnection
      setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (error) => {
      setError(error);
      setConnectionState('error');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    return () => ws.close();
  }, [websocketUrl, userId]);

  const sendMessage = useCallback((content: string) => {
    const ws = new WebSocket(websocketUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'message', content, userId }));
      ws.close();
    };
  }, [websocketUrl, userId]);

  const handleError = useCallback(() => {
    setError(null);
    setConnectionState('disconnected');
    connectWebSocket();
  }, [connectWebSocket]);

  if (error) {
    return (
      <div>
        <h2>Connection Error</h2>
        <p>{error.message}</p>
        <button onClick={handleError}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Real-time Messages</h1>
      <ConnectionStatus state={connectionState} />
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

const WrappedRealtimeComponent = (props: IRealtimeComponentProps) => (
  <ErrorBoundary
    fallback={<div>Something went wrong with the real-time component</div>}
  >
    <RealtimeComponent {...props} />
  </ErrorBoundary>
);

export default WrappedRealtimeComponent;
```

#### **After (Class-Based)**
```typescript
import React, { Component, ReactNode, ErrorInfo } from 'react';

interface IRealtimeComponentProps {
  userId: string;
  websocketUrl: string;
}

interface IRealtimeComponentState {
  messages: Message[];
  connectionState: 'connected' | 'disconnected' | 'error' | 'connecting';
  error: Error | null;
  reconnectAttempts: number;
}

class RealtimeComponent extends Component<IRealtimeComponentProps, IRealtimeComponentState> {
  private websocket: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 5000;

  constructor(props: IRealtimeComponentProps) {
    super(props);
    
    this.state = {
      messages: [],
      connectionState: 'disconnected',
      error: null,
      reconnectAttempts: 0
    };

    // Bind methods
    this.sendMessage = this.sendMessage.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
  }

  componentDidMount(): void {
    this.connectWebSocket();
  }

  componentDidUpdate(prevProps: IRealtimeComponentProps): void {
    if (prevProps.websocketUrl !== this.props.websocketUrl) {
      this.connectWebSocket();
    }
  }

  componentWillUnmount(): void {
    this.cleanup();
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('RealtimeComponent error:', { error, errorInfo });
    this.setState({ error, connectionState: 'error' });
  }

  private connectWebSocket(): void {
    this.cleanup();
    this.setState({ connectionState: 'connecting', error: null });

    try {
      this.websocket = new WebSocket(this.props.websocketUrl);
      this.setupWebSocketHandlers();
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  private setupWebSocketHandlers(): void {
    if (!this.websocket) return;

    this.websocket.onopen = () => {
      this.setState({ 
        connectionState: 'connected',
        reconnectAttempts: 0 
      });

      // Subscribe to user messages
      this.websocket?.send(JSON.stringify({
        type: 'subscribe',
        userId: this.props.userId
      }));
    };

    this.websocket.onclose = () => {
      this.setState({ connectionState: 'disconnected' });
      this.attemptReconnection();
    };

    this.websocket.onerror = (error) => {
      this.handleConnectionError(error);
    };

    this.websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleIncomingMessage(message);
      } catch (parseError) {
        console.error('Failed to parse message:', parseError);
      }
    };
  }

  private handleIncomingMessage(message: Message): void {
    this.setState(prevState => ({
      messages: [...prevState.messages, message]
    }));
  }

  private handleConnectionError(error: any): void {
    console.error('WebSocket connection error:', error);
    this.setState({ 
      error: new Error(error.message || 'Connection failed'),
      connectionState: 'error' 
    });
  }

  private attemptReconnection(): void {
    if (this.state.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setState({ 
        error: new Error('Max reconnection attempts reached'),
        connectionState: 'error' 
      });
      return;
    }

    this.reconnectTimer = window.setTimeout(() => {
      this.setState(prevState => ({
        reconnectAttempts: prevState.reconnectAttempts + 1
      }));
      this.connectWebSocket();
    }, this.reconnectDelay * this.state.reconnectAttempts);
  }

  private sendMessage(content: string): void {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send message: WebSocket not connected');
      return;
    }

    try {
      this.websocket.send(JSON.stringify({
        type: 'message',
        content,
        userId: this.props.userId
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  private handleRetry(): void {
    this.setState({
      error: null,
      reconnectAttempts: 0
    });
    this.connectWebSocket();
  }

  private cleanup(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  render(): ReactNode {
    const { messages, connectionState, error } = this.state;

    if (error) {
      return (
        <div className="error-container">
          <h2>Connection Error</h2>
          <p>{error.message}</p>
          <button onClick={this.handleRetry}>Retry Connection</button>
        </div>
      );
    }

    return (
      <div className="realtime-container">
        <h1>Real-time Messages</h1>
        <ConnectionStatus state={connectionState} />
        <MessageList messages={messages} />
        <MessageInput onSend={this.sendMessage} disabled={connectionState !== 'connected'} />
      </div>
    );
  }
}

export default RealtimeComponent;
```

---

## 🔄 Step-by-Step Migration Process

### **Step 1: Analysis and Planning**

1. **Component Complexity Assessment**
   ```typescript
   // Use this checklist to assess migration complexity:
   const migrationComplexity = {
     stateManagement: component.useState.length, // Number of useState hooks
     sideEffects: component.useEffect.length,    // Number of useEffect hooks
     dependencies: component.imports.length,     // External dependencies
     eventHandlers: component.callbacks.length,   // Number of callbacks
     realTimeFeatures: hasWebSocket || hasSubscriptions,
     errorHandling: hasErrorBoundaries || tryCatch
   };
   ```

2. **Create Migration Plan**
   - List all components to migrate
   - Prioritize by complexity and business impact
   - Estimate migration time
   - Identify dependencies and integration points

### **Step 2: Setup Class Component Structure**

1. **Create Interfaces**
   ```typescript
   // Define props interface
   interface IComponentProps {
     // Copy all prop types from functional component
   }

   // Define state interface
   interface IComponentState {
     // Convert all useState to state properties
     [key: string]: any;
   }
   ```

2. **Create Class Skeleton**
   ```typescript
   class ComponentName extends Component<IComponentProps, IComponentState> {
     constructor(props: IComponentProps) {
       super(props);
       // Initialize state
       // Bind methods
     }

     // Add lifecycle methods
     componentDidMount() {}
     componentDidUpdate() {}
     componentWillUnmount() {}

     render() {
       return <div><!-- Component JSX --></div>;
     }
   }
   ```

### **Step 3: Convert State Management**

1. **Convert useState to Class State**
   ```typescript
   // Before (Functional)
   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   // After (Class)
   interface IComponentState {
     user: any;
     isLoading: boolean;
     error: string | null;
   }

   constructor(props: IComponentProps) {
     super(props);
     this.state = {
       user: null,
       isLoading: true,
       error: null
     };
   }
   ```

2. **Convert State Updates**
   ```typescript
   // Before (Functional)
   setUser(newUser);
   setIsLoading(false);
   setError(null);

   // After (Class)
   this.setState({
     user: newUser,
     isLoading: false,
     error: null
   });

   // For dependent state updates
   this.setState(prevState => ({
     user: newUser,
     isLoading: false,
     error: null,
     metadata: {
       ...prevState.metadata,
       lastUpdated: Date.now()
     }
   }));
   ```

### **Step 4: Convert Lifecycle Effects**

1. **Convert useEffect to Lifecycle Methods**
   ```typescript
   // Before (Functional)
   useEffect(() => {
     loadData();
   }, [userId]); // Dependency array

   // After (Class)
   componentDidMount() {
     this.loadData();
   }

   componentDidUpdate(prevProps: IComponentProps) {
     if (prevProps.userId !== this.props.userId) {
       this.loadData();
     }
   }
   ```

2. **Convert Cleanup Effects**
   ```typescript
   // Before (Functional)
   useEffect(() => {
     const subscription = apiService.subscribe(callback);
     return () => subscription.unsubscribe();
   }, [userId]);

   // After (Class)
   private subscription: Subscription | null = null;

   componentDidMount() {
     this.subscription = this.apiService.subscribe(this.handleCallback);
   }

   componentWillUnmount() {
     if (this.subscription) {
       this.subscription.unsubscribe();
     }
   }
   ```

### **Step 5: Convert Event Handlers and Callbacks**

1. **Convert Callback Functions**
   ```typescript
   // Before (Functional)
   const handleClick = useCallback((data: any) => {
     // Handle click
   }, [dependency]);

   // After (Class)
   private handleClick = (data: any): void => {
     // Handle click
   }

   // Bind in constructor
   constructor(props: IComponentProps) {
     super(props);
     this.handleClick = this.handleClick.bind(this);
   }
   ```

2. **Convert useMemo**
   ```typescript
   // Before (Functional)
   const expensiveValue = useMemo(() => {
     return calculateExpensiveValue(data);
   }, [data]);

   // After (Class)
   private memoizedValue: any = null;
   private lastData: any = null;

   private getExpensiveValue(): any {
     if (this.lastData !== this.props.data) {
       this.memoizedValue = this.calculateExpensiveValue(this.props.data);
       this.lastData = this.props.data;
     }
     return this.memoizedValue;
   }
   ```

### **Step 6: Add Performance Optimizations**

1. **Implement shouldComponentUpdate**
   ```typescript
   shouldComponentUpdate(nextProps: IComponentProps, nextState: IComponentState): boolean {
     // Shallow comparison for performance
     return (
       nextProps.userId !== this.props.userId ||
       nextState.isLoading !== this.state.isLoading ||
       nextState.data !== this.state.data
     );
   }
   ```

2. **Add Memoization**
   ```typescript
   private memoizedCalculations = new Map<string, any>();

   private calculateStats(data: any): any {
     const cacheKey = JSON.stringify(data);
     
     if (this.memoizedCalculations.has(cacheKey)) {
       return this.memoizedCalculations.get(cacheKey);
     }

     const result = this.performExpensiveCalculation(data);
     this.memoizedCalculations.set(cacheKey, result);
     return result;
   }
   ```

### **Step 7: Add Error Handling**

1. **Implement Error Boundaries**
   ```typescript
   componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
     console.error('Component error:', { error, errorInfo });
     
     // Log to monitoring service
     this.errorLogger.log({
       error: error.message,
       stack: error.stack,
       componentStack: errorInfo.componentStack,
       componentName: this.constructor.name
     });

     this.setState({ error: error.message });
   }
   ```

2. **Add Error Recovery**
   ```typescript
   private handleRetry = (): void => {
     this.setState({ error: null });
     this.initializeComponent();
   };
   ```

---

## 🧪 Testing Strategy

### **Unit Testing Migration**

1. **Test Component Structure**
   ```typescript
   describe('MigratedComponent', () => {
     it('should initialize with correct state', () => {
       const wrapper = mount(<MigratedComponent userId="test" />);
       expect(wrapper.state()).toEqual({
         data: null,
         isLoading: true,
         error: null
       });
     });

     it('should call componentDidMount', () => {
       const componentDidMountSpy = jest.spyOn(
         MigratedComponent.prototype,
         'componentDidMount'
       );
       
       mount(<MigratedComponent userId="test" />);
       expect(componentDidMountSpy).toHaveBeenCalled();
     });
   });
   ```

2. **Test State Updates**
   ```typescript
   it('should update state correctly', () => {
     const wrapper = mount(<MigratedComponent userId="test" />);
     
     wrapper.instance().handleDataUpdate({ test: 'data' });
     
     expect(wrapper.state('data')).toEqual({ test: 'data' });
   });
   ```

3. **Test Lifecycle Methods**
   ```typescript
   it('should handle prop changes', () => {
     const wrapper = mount(<MigratedComponent userId="test1" />);
     const loadDataSpy = jest.spyOn(wrapper.instance(), 'loadData');
     
     wrapper.setProps({ userId: 'test2' });
     
     expect(loadDataSpy).toHaveBeenCalled();
   });
   ```

### **Integration Testing**

1. **Test DI Integration**
   ```typescript
   it('should integrate with DI container', () => {
     const container = createTestContainer();
     const wrapper = mount(
       <DIProvider container={container}>
         <MigratedComponent userId="test" />
       </DIProvider>
     );

     expect(wrapper.instance().service).toBeDefined();
   });
   ```

2. **Test WebSocket Integration**
   ```typescript
   it('should handle WebSocket connections', async () => {
     const mockWebSocket = createMockWebSocket();
     const wrapper = mount(<RealtimeComponent userId="test" />);
     
     await mockWebSocket.simulateOpen();
     expect(wrapper.state('connectionState')).toBe('connected');
   });
   ```

---

## 📊 Performance Validation

### **Benchmarking Tests**

1. **Render Performance**
   ```typescript
   describe('Performance Tests', () => {
     it('should not re-render unnecessarily', () => {
       const wrapper = mount(<OptimizedComponent data={testData} />);
       const renderSpy = jest.spyOn(wrapper.instance(), 'render');
       
       wrapper.setProps({ data: testData }); // Same data
       
       expect(renderSpy).not.toHaveBeenCalled();
     });

     it('should handle large datasets efficiently', () => {
       const startTime = performance.now();
       const wrapper = mount(<LargeDataComponent items={largeDataSet} />);
       const endTime = performance.now();
       
       expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
     });
   });
   ```

2. **Memory Usage**
   ```typescript
   it('should not leak memory on unmount', () => {
     const wrapper = mount(<ComponentWithSubscriptions />);
     const initialMemory = performance.memory?.usedJSHeapSize || 0;
     
     wrapper.unmount();
     
     // Force garbage collection if available
     if (global.gc) global.gc();
     
     const finalMemory = performance.memory?.usedJSHeapSize || 0;
     expect(finalMemory - initialMemory).toBeLessThan(1024 * 1024); // 1MB threshold
   });
   ```

---

## ✅ Migration Validation Checklist

### **Functional Validation**
- [ ] All component functionality works as expected
- [ ] State management behaves correctly
- [ ] Lifecycle methods execute properly
- [ ] Event handlers respond correctly
- [ ] Error handling works as expected

### **Performance Validation**
- [ ] Component renders efficiently
- [ ] No unnecessary re-renders
- [ ] Memory usage is acceptable
- [ ] Large datasets handled properly
- [ ] Real-time features perform well

### **Integration Validation**
- [ ] DI container integration works
- [ ] WebSocket connections function properly
- [ ] Theme system integration works
- [ ] Analytics tracking functions
- [ ] Error boundaries catch errors

### **Code Quality Validation**
- [ ] TypeScript compilation succeeds
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] No console errors or warnings

---

## 🚨 Common Migration Issues and Solutions

### **Issue 1: Lost Context in Event Handlers**
```typescript
// Problem
class MyComponent extends Component {
  handleClick() {
    console.log(this.props.userId); // undefined
  }
}

// Solution
class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(this.props.userId); // works correctly
  }
}
```

### **Issue 2: State Update Timing**
```typescript
// Problem
this.setState({ count: this.state.count + 1 });
console.log(this.state.count); // Old value

// Solution
this.setState({ count: this.state.count + 1 }, () => {
  console.log(this.state.count); // New value
});

// Or use prevState
this.setState(prevState => ({ count: prevState.count + 1 }));
```

### **Issue 3: Memory Leaks from Subscriptions**
```typescript
// Problem
componentDidMount() {
  this.subscription = apiService.subscribe(callback);
}

// Solution
componentDidMount() {
  this.subscription = apiService.subscribe(callback);
}

componentWillUnmount() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}
```

### **Issue 4: Infinite Re-renders**
```typescript
// Problem
shouldComponentUpdate() {
  return true; // Always re-renders
}

// Solution
shouldComponentUpdate(nextProps, nextState) {
  return (
    nextProps.userId !== this.props.userId ||
    nextState.data !== this.state.data
  );
}
```

---

## 📚 Additional Resources

### **Migration Tools**
- React Codemod scripts for automatic conversions
- TypeScript compiler for type checking
- ESLint rules for class component patterns

### **Testing Tools**
- Jest for unit testing
- Enzyme for component testing
- React Testing Library for integration testing
- Performance monitoring tools

### **Documentation**
- React official documentation
- TypeScript React handbook
- Enterprise React best practices
- Performance optimization guides

---

*Playbook Version: 1.0*  
*Last Updated: January 29, 2026*  
*Next Review: February 29, 2026*
