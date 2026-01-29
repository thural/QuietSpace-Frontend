# Class-Based React Components Best Practices

## 🎯 Overview

This document outlines best practices for developing class-based React components in the QuietSpace Frontend application, focusing on enterprise-grade patterns, performance optimization, and maintainability.

---

## 📋 Table of Contents

1. [Component Structure Standards](#component-structure-standards)
2. [State Management Best Practices](#state-management-best-practices)
3. [Lifecycle Method Guidelines](#lifecycle-method-guidelines)
4. [Performance Optimization Patterns](#performance-optimization-patterns)
5. [Error Handling Strategies](#error-handling-strategies)
6. [TypeScript Integration](#typescript-integration)
7. [Testing Best Practices](#testing-best-practices)
8. [Code Organization](#code-organization)
9. [Security Considerations](#security-considerations)

---

## 🏗️ Component Structure Standards

### **1. Separate Logic from Rendering**

Keep the `render()` method focused solely on returning JSX to improve readability. Extract complex logic, calculations, or conditional rendering into separate methods.

```typescript
class UserProfile extends Component<IUserProfileProps, IUserProfileState> {
  // ✅ DO: Extract logic into separate methods
  private getFullName = (): string => {
    const { firstName, lastName } = this.props;
    return `${firstName} ${lastName}`;
  };

  private getUserStatus = (): string => {
    const { user } = this.state;
    if (!user) return 'Loading...';
    return user.isActive ? 'Active' : 'Inactive';
  };

  render(): ReactNode {
    // ✅ DO: Keep render method clean and focused
    return (
      <div className="user-profile">
        <h1>{this.getFullName()}</h1>
        <p>Status: {this.getUserStatus()}</p>
      </div>
    );
  }
}
```

### **2. Bind Methods in the Constructor**

Avoid inline binding in event handlers, which creates new functions on each render and can hurt performance. Bind once in the constructor for efficiency.

```typescript
class ButtonComponent extends Component<IButtonProps, IButtonState> {
  constructor(props: IButtonProps) {
    super(props);
    
    // ✅ DO: Bind methods once in constructor
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }

  // ✅ DO: Use bound methods
  private handleClick(event: React.MouseEvent): void {
    this.props.onClick?.(event);
  }

  render(): ReactNode {
    // ✅ DO: Use pre-bound methods
    return (
      <button
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
      >
        {this.props.children}
      </button>
    );
  }

  // ❌ DON'T: Inline binding creates new functions on each render
  // <button onClick={this.handleClick.bind(this)}>Click Me</button>
  // <button onClick={() => this.handleClick()}>Click Me</button>
}
```

### **3. Destructure Props and State**

Reduce repetition of `this.props` or `this.state`, making code shorter and easier to scan. Do this at the top of methods where needed.

```typescript
class GreetingComponent extends Component<IGreetingProps, IGreetingState> {
  render(): ReactNode {
    // ✅ DO: Destructure at the top of methods
    const { name, title, isLoggedIn } = this.props;
    const { currentTime, theme } = this.state;

    return (
      <div className={`greeting ${theme}`}>
        <h1>
          {isLoggedIn ? `Welcome, ${title} ${name}!` : 'Welcome, Guest!'}
        </h1>
        <p>Current time: {currentTime}</p>
      </div>
    );
  }

  // ❌ DON'T: Repeated this.props/this.state access
  // render(): ReactNode {
  //   return (
  //     <div>
  //       <h1>{this.props.isLoggedIn ? this.props.name : 'Guest'}</h1>
  //       <p>{this.state.currentTime}</p>
  //     </div>
  //   );
  // }
}
```

### **4. Group Related Lifecycle Methods**

Organize lifecycle methods (mounting, updating, unmounting) together and keep them concise. Avoid cluttering them with unrelated side effects.

```typescript
class DataFetcherComponent extends Component<IDataFetcherProps, IDataFetcherState> {
  // ✅ DO: Group lifecycle methods together
  
  // Mounting lifecycle
  componentDidMount(): void {
    this.fetchData();
    this.setupSubscriptions();
    this.startPerformanceMonitoring();
  }

  // Updating lifecycle
  componentDidUpdate(prevProps: IDataFetcherProps): void {
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
  }

  // Unmounting lifecycle
  componentWillUnmount(): void {
    this.cleanupSubscriptions();
    this.stopPerformanceMonitoring();
  }

  // ✅ DO: Extract complex logic into separate methods
  private fetchData = async (): Promise<void> => {
    try {
      this.setState({ isLoading: true, error: null });
      const data = await this.dataService.fetch(this.props.id);
      this.setState({ data, isLoading: false });
    } catch (error) {
      this.setState({ error: error.message, isLoading: false });
    }
  };

  render(): ReactNode {
    // Render logic
  }
}
```

### **5. Break Down into Smaller Components**

Large class components become hard to maintain. Compose them from smaller, reusable ones to promote modularity and testability.

```typescript
// ✅ DO: Create small, focused components
class DashboardHeader extends Component<IDashboardHeaderProps> {
  render(): ReactNode {
    const { title, user, onLogout } = this.props;
    return (
      <header className="dashboard-header">
        <h1>{title}</h1>
        <UserProfile user={user} onLogout={onLogout} />
      </header>
    );
  }
}

// ✅ DO: Compose larger components from smaller ones
class Dashboard extends Component<IDashboardProps, IDashboardState> {
  render(): ReactNode {
    return (
      <div className="dashboard">
        <DashboardHeader 
          title="Analytics Dashboard" 
          user={this.state.user}
          onLogout={this.handleLogout}
        />
        <DashboardContent data={this.state.data} />
        <DashboardFooter />
      </div>
    );
  }
}
```

### **6. Use Default Props and PropTypes**

Provides self-documentation, prevents runtime errors, and makes components more predictable.

```typescript
import PropTypes from 'prop-types';

interface IMessageProps {
  text: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  timestamp?: number;
  onDismiss?: () => void;
}

class Message extends Component<IMessageProps> {
  static propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
    timestamp: PropTypes.number,
    onDismiss: PropTypes.func
  };

  static defaultProps: Partial<IMessageProps> = {
    type: 'info',
    timestamp: Date.now()
  };

  render(): ReactNode {
    const { text, type, timestamp, onDismiss } = this.props;
    return (
      <div className={`message message--${type}`}>
        <p>{text}</p>
        {onDismiss && (
          <button onClick={onDismiss}>×</button>
        )}
      </div>
    );
  }
}
```

### **7. Handle State Updates Immutably**

Avoid mutating state directly, as it can lead to bugs. Use `setState` with spread operators for clarity and reliability.

```typescript
class TodoListComponent extends Component<ITodoListProps, ITodoListState> {
  // ✅ DO: Use immutable updates with spread operator
  private addTodo = (newTodo: Todo): void => {
    this.setState(prevState => ({
      todos: [...prevState.todos, newTodo]
    }));
  };

  private updateTodo = (id: string, updates: Partial<Todo>): void => {
    this.setState(prevState => ({
      todos: prevState.todos.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    }));
  };

  // ❌ DON'T: Mutate state directly
  // private addTodoBad = (newTodo: Todo): void => {
  //   this.state.todos.push(newTodo); // WRONG!
  //   this.setState({ todos: this.state.todos });
  // }
}
```

### **8. Implement Error Boundaries**

Catch and handle errors gracefully in subtrees without crashing the app.

```typescript
class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', { error, errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### **9. Follow Consistent Naming and Formatting**

Use camelCase for methods and variables, PascalCase for components. Add comments for non-obvious logic.

```typescript
class TimerComponent extends Component<ITimerProps, ITimerState> {
  private intervalId: number | null = null;

  /**
   * Initializes timer on mount
   * Sets up interval to tick every second
   */
  componentDidMount(): void {
    if (this.props.autoStart) {
      this.handleStart();
    }
  }

  /**
   * Updates timer state every second
   */
  private tick = (): void => {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1
    }));
  };

  private handleStart = (): void => {
    if (!this.state.isRunning) {
      this.intervalId = window.setInterval(this.tick, 1000);
      this.setState({ isRunning: true });
    }
  };

  render(): ReactNode {
    const { seconds, isRunning } = this.props;
    return (
      <div className="timer">
        <div className="timer-display">{seconds}s</div>
        <button onClick={this.handleStart} disabled={isRunning}>
          Start
        </button>
      </div>
    );
  }
}
```

### **10. Avoid Inline Styles and Logic**

Keep JSX clean by moving styles to CSS files and complex conditionals to methods.

```typescript
class AlertComponent extends Component<IAlertProps> {
  // ✅ DO: Extract conditional logic into methods
  private getAlertClass = (): string => {
    const { type, variant } = this.props;
    const classes = ['alert', `alert--${type || 'info'}`];
    
    if (variant) {
      classes.push(`alert--${variant}`);
    }
    
    return classes.join(' ');
  };

  render(): ReactNode {
    const { message, onDismiss } = this.props;
    
    return (
      // ✅ DO: Use CSS classes instead of inline styles
      <div className={this.getAlertClass()}>
        <p>{message}</p>
        {onDismiss && (
          <button onClick={onDismiss} className="alert-dismiss">
            ×
          </button>
        )}
      </div>
    );
  }

  // ❌ DON'T: Inline styles and complex logic in JSX
  // render(): ReactNode {
  //   return (
  //     <div style={{ backgroundColor: this.props.type === 'error' ? '#f44336' : '#2196f3' }}>
  //       {this.props.message}
  //     </div>
  //   );
  // }
}
```

### **11. Use React.PureComponent by Default**

In large apps, unnecessary re-renders are a major performance bottleneck. PureComponent does a shallow comparison of props and state.

```typescript
// ✅ DO: Use PureComponent for performance optimization
class UserListItem extends PureComponent<IUserListItemProps> {
  render(): ReactNode {
    const { user, onSelect, isSelected } = this.props;
    
    return (
      <li 
        className={`user-list-item ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(user.id)}
      >
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </li>
    );
  }
}

// ✅ DO: Combine with immutable updates for effectiveness
class UserList extends Component<IUserListProps> {
  render(): ReactNode {
    const { users, selectedUserId, onSelectUser } = this.props;
    
    return (
      <ul className="user-list">
        {users.map(user => (
          <UserListItem
            key={user.id}
            user={user}
            isSelected={user.id === selectedUserId}
            onSelect={onSelectUser}
          />
        ))}
      </ul>
    );
  }
}
```

### **12. Organize by "The Class Anatomy"**

Follow a strict vertical order for class members to improve readability and maintainability.

```typescript
class WellOrganizedComponent extends PureComponent<IWellOrganizedProps, IWellOrganizedState> {
  // ✅ 1. Static properties
  static propTypes = {
    data: PropTypes.object.isRequired,
    onUpdate: PropTypes.func
  };

  // ✅ 2. Private properties
  private dataService: DataService;
  private containerRef = React.createRef<HTMLDivElement>();
  private resizeObserver: ResizeObserver | null = null;

  // ✅ 3. Constructor
  constructor(props: IWellOrganizedProps) {
    super(props);
    this.state = {
      data: null,
      isLoading: false,
      error: null
    };

    this.dataService = props.container.getByToken(TYPES.DATA_SERVICE);
    this.handleResize = this.handleResize.bind(this);
  }

  // ✅ 4. Lifecycle methods (grouped by phase)
  componentDidMount(): void {
    this.loadData();
    this.setupResizeObserver();
  }

  componentDidUpdate(prevProps: IWellOrganizedProps): void {
    if (prevProps.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }
  }

  componentWillUnmount(): void {
    this.cleanupResizeObserver();
  }

  // ✅ 5. Event handlers
  private handleResize = (entries: ResizeObserverEntry[]): void => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    this.setState({ dimensions: { width, height } });
  };

  // ✅ 6. Private methods
  private async loadData(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });
      const data = await this.dataService.fetch(this.props.id);
      this.setState({ data, isLoading: false });
    } catch (error) {
      this.setState({ error: error.message, isLoading: false });
    }
  };

  // ✅ 7. Render helpers
  private renderLoadingState = (): ReactNode => (
    <div className="loading-state">
      <Spinner />
      <p>Loading data...</p>
    </div>
  );

  // ✅ 8. Main render method
  render(): ReactNode {
    const { isLoading, error } = this.state;
    
    return (
      <div ref={this.containerRef} className="well-organized-component">
        {isLoading && this.renderLoadingState()}
        {error && this.renderErrorState(error)}
        {!isLoading && !error && this.renderContent()}
      </div>
    );
  }
}
```

### **13. Avoid Anonymous Functions in Render**

Inline arrow functions create new function references on every render, breaking PureComponent optimizations.

```typescript
// ✅ DO: Use class properties (preferred)
class OptimizedComponent extends Component<IOptimizedProps> {
  // Preferred: Class property syntax (no bind needed)
  private handleClick = (): void => {
    this.props.onClick?.();
  };

  private handleItemClick = (itemId: string): void => {
    this.props.onItemClick?.(itemId);
  };

  render(): ReactNode {
    const { items } = this.props;
    
    return (
      <div>
        <button onClick={this.handleClick}>Click Me</button>
        
        <ul>
          {items.map(item => (
            <li 
              key={item.id}
              onClick={() => this.handleItemClick(item.id)} // Still OK for simple cases
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

// ❌ DON'T: Anonymous functions in render (performance issues)
class ProblematicComponent extends Component<IProblematicProps> {
  render(): ReactNode {
    return (
      <div>
        {/* Creates new function on every render */}
        <button onClick={() => this.props.onClick()}>Click Me</button>
        
        {/* Causes unnecessary re-renders */}
        {this.props.items.map(item => (
          <Item 
            key={item.id}
            item={item}
            onUpdate={(newItem) => this.props.onUpdate(item.id, newItem)}
          />
        ))}
      </div>
    );
  }
}
```

### **14. Leverage Private Class Fields for Internal Logic**

Use private class fields (`#methodName`) to clearly signal internal-only logic, improving encapsulation.

```typescript
class EncapsulatedComponent extends Component<IEncapsulatedProps> {
  // ✅ DO: Use private fields for internal methods
  #validateInput(input: string): boolean {
    return input.length > 0 && input.length <= 100;
  }

  #sanitizeData(data: any): any {
    return JSON.parse(JSON.stringify(data));
  }

  #internalCache = new Map<string, any>();
  #retryCount = 0;

  // ✅ DO: Public methods use private helpers
  public async handleSubmit(formData: FormData): Promise<void> {
    if (!this.#validateInput(formData.text)) {
      throw new Error('Invalid input');
    }

    const sanitizedData = this.#sanitizeData(formData);
    await this.props.onSubmit(sanitizedData);
  }

  render(): ReactNode {
    return <div>Component content</div>;
  }
}

// TypeScript alternative: private keyword
class TypeScriptEncapsulatedComponent extends Component<ITSEncapsulatedProps> {
  private validateInput(input: string): boolean {
    return input.length > 0 && input.length <= 100;
  }

  private internalCache = new Map<string, any>();

  public async handleSubmit(formData: FormData): Promise<void> {
    if (!this.validateInput(formData.text)) {
      throw new Error('Invalid input');
    }

    const sanitizedData = this.sanitizeData(formData);
    await this.props.onSubmit(sanitizedData);
  }
}
```

### **15. Strict TypeScript Interfaces**

Use TypeScript interfaces for compile-time safety and better developer experience.

```typescript
// ✅ DO: Define strict interfaces for props and state
interface IUserProfileProps {
  userId: string;
  currentUser?: User;
  onUpdate?: (user: User) => void;
  className?: string;
  showActions?: boolean;
}

interface IUserProfileState {
  user: AsyncState<User>;
  isEditing: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated?: number;
}

// ✅ DO: Use generics for reusable components
class GenericList<T> extends PureComponent<IGenericListProps<T>> {
  render(): ReactNode {
    const { items, renderItem, onSelect } = this.props;
    
    return (
      <ul className="generic-list">
        {items.map((item, index) => (
          <li key={index} onClick={() => onSelect?.(item)}>
            {renderItem(item, index)}
          </li>
        ))}
      </ul>
    );
  }
}

interface IGenericListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onSelect?: (item: T) => void;
  className?: string;
}
```

### **16. Performance Tip: Debounced State Updates**

In React especially, rapid state updates (e.g., typing in a search input) can cause excessive renders. Debouncing state updates reduces renders.

```typescript
import debounce from 'lodash/debounce';

class SearchInput extends Component<ISearchInputProps, ISearchInputState> {
  constructor(props: ISearchInputProps) {
    super(props);
    
    this.state = {
      query: '',
      suggestions: [],
      isSearching: false
    };

    // Debounce the search function
    this.debouncedSearch = debounce(this.performSearch.bind(this), 300);
  }

  private debouncedSearch: (query: string) => void;

  componentDidMount(): void {
    // Initial search if needed
    if (this.props.initialQuery) {
      this.setState({ query: this.props.initialQuery });
      this.debouncedSearch(this.props.initialQuery);
    }
  }

  componentWillUnmount(): void {
    // Cancel any pending debounced calls
    this.debouncedSearch.cancel();
  }

  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const query = event.target.value;
    
    // Update UI immediately for responsive typing
    this.setState({ query });
    
    // Debounce the actual search
    this.debouncedSearch(query);
  };

  private async performSearch(query: string): Promise<void> {
    if (!query.trim()) {
      this.setState({ suggestions: [], isSearching: false });
      return;
    }

    try {
      this.setState({ isSearching: true });
      const suggestions = await this.searchService.getSuggestions(query);
      this.setState({ suggestions, isSearching: false });
    } catch (error) {
      this.setState({ 
        suggestions: [], 
        isSearching: false,
        error: error.message 
      });
    }
  };

  render(): ReactNode {
    const { query, suggestions, isSearching } = this.state;
    
    return (
      <div className="search-input">
        <input
          type="text"
          value={query}
          onChange={this.handleInputChange}
          placeholder="Search..."
          className="search-input-field"
        />
        
        {isSearching && (
          <div className="search-loading">
            <Spinner size="sm" />
          </div>
        )}
        
        {suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                onClick={() => this.handleSuggestionSelect(suggestion)}
                className="search-suggestion-item"
              >
                {suggestion.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  private handleSuggestionSelect = (suggestion: SearchSuggestion): void => {
    this.setState({ 
      query: suggestion.text,
      suggestions: [] 
    });
    
    this.props.onSelect?.(suggestion);
  };
}

interface ISearchInputProps {
  initialQuery?: string;
  onSelect?: (suggestion: SearchSuggestion) => void;
  className?: string;
}

interface ISearchInputState {
  query: string;
  suggestions: SearchSuggestion[];
  isSearching: boolean;
  error?: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'user' | 'content' | 'tag';
}
```

---

## 📋 Updated Best Practices Summary

### **Core Principles**
1. **Separate Logic from Rendering** - Keep render() clean
2. **Bind Methods in Constructor** - Avoid inline binding
3. **Destructure Props and State** - Reduce repetition
4. **Group Related Lifecycle Methods** - Organize by phase
5. **Break Down into Smaller Components** - Promote modularity
6. **Use Default Props and PropTypes** - Self-documentation
7. **Handle State Updates Immutably** - Prevent bugs
8. **Implement Error Boundaries** - Graceful error handling
9. **Follow Consistent Naming and Formatting** - Maintain readability
10. **Avoid Inline Styles and Logic** - Separate concerns

### **Performance Optimization**
11. **Use React.PureComponent by Default** - Prevent unnecessary re-renders
12. **Organize by "The Class Anatomy"** - Consistent structure
13. **Avoid Anonymous Functions in Render** - Performance critical
14. **Leverage Private Class Fields** - Encapsulation
15. **Strict TypeScript Interfaces** - Compile-time safety
16. **Debounced State Updates** - Optimize rapid updates

These best practices ensure maintainable, performant, and scalable class-based React components for enterprise applications.

```typescript
/**
 * Component File Structure Template
 * 
 * 1. Imports (React, third-party, internal)
 * 2. Interface definitions (Props, State, Types)
 * 3. Component class definition
 * 4. Constructor and method bindings
 * 5. Lifecycle methods
 * 6. Private methods (grouped by functionality)
 * 7. Event handlers
 * 8. Render method and render helpers
 * 9. Export statement
 */

// 1. Imports
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Container, Button } from '@/shared/ui/components';
import { IAuthService } from '@/core/auth/interfaces';

// 2. Interface definitions
interface IComponentProps {
  userId: string;
  onAction?: (data: any) => void;
  enableAnalytics?: boolean;
}

interface IComponentState {
  user: AsyncState<User>;
  posts: AsyncState<Post[]>;
  ui: UIState;
  performance: PerformanceMetrics;
}

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// 3. Component class definition
class ComponentName extends Component<IComponentProps, IComponentState> {
  // 4. Class properties
  private authService: IAuthService;
  private subscriptions: Array<() => void> = [];
  private performanceTimer?: number;

  // 5. Constructor
  constructor(props: IComponentProps) {
    super(props);
    
    this.state = {
      user: { data: null, isLoading: true, error: null },
      posts: { data: [], isLoading: true, error: null },
      ui: { selectedTab: 'posts', showDetails: false },
      performance: { loadTime: Date.now(), renderCount: 0 }
    };

    // Dependency injection
    this.authService = this.props.container.getByToken(TYPES.AUTH_SERVICE);
    
    // Method bindings
    this.handleAction = this.handleAction.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  // 6. Lifecycle methods
  componentDidMount(): void {
    this.initializeComponent();
  }

  componentWillUnmount(): void {
    this.cleanup();
  }

  // 7. Private methods
  private initializeComponent(): void {
    this.loadUserData();
    this.setupSubscriptions();
  }

  private async loadUserData(): Promise<void> {
    try {
      this.setState(prevState => ({
        user: { ...prevState.user, isLoading: true, error: null }
      }));

      const userData = await this.authService.getUser(this.props.userId);
      
      this.setState(prevState => ({
        user: { data: userData, isLoading: false, error: null }
      }));
    } catch (error) {
      this.setState(prevState => ({
        user: { ...prevState.user, isLoading: false, error: error.message }
      }));
    }
  }

  private setupSubscriptions(): void {
    const unsubscribeUser = this.authService.subscribeToUserUpdates(
      this.props.userId,
      this.handleUserUpdate
    );
    
    this.subscriptions.push(unsubscribeUser);
  }

  private cleanup(): void {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions = [];
  }

  // 8. Event handlers
  private handleAction(data: any): void {
    this.props.onAction?.(data);
  }

  private handleTabChange(tab: string): void {
    this.setState(prevState => ({
      ui: { ...prevState.ui, selectedTab: tab }
    }));
  }

  private handleUserUpdate = (user: User): void => {
    this.setState(prevState => ({
      user: { ...prevState.user, data: user }
    }));
  };

  // 9. Render helpers
  private renderLoadingState(): ReactNode {
    return (
      <Container className="loading-container">
        <div>Loading user data...</div>
      </Container>
    );
  }

  private renderContent(): ReactNode {
    const { user, posts, ui } = this.state;

    return (
      <Container className="content-container">
        <h1>{user.data?.name}</h1>
        <div className="tabs">
          {['posts', 'profile', 'settings'].map(tab => (
            <Button
              key={tab}
              variant={ui.selectedTab === tab ? 'primary' : 'secondary'}
              onClick={() => this.handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </Container>
    );
  }

  // 10. Main render method
  render(): ReactNode {
    const { user, posts } = this.state;

    if (user.isLoading || posts.isLoading) {
      return this.renderLoadingState();
    }

    return this.renderContent();
  }
}

// 11. Export statement
export default ComponentName;
```

### **2. Naming Conventions**

```typescript
// Component class: PascalCase
class UserProfileContainer extends Component<IUserProfileProps, IUserProfileState> {}

// Interface names: PascalCase with 'I' prefix
interface IUserProfileProps {}
interface IUserProfileState {}
interface IAsyncState<T> {}

// Private methods: camelCase with descriptive names
private loadUserData(): void {}
private handleUserUpdate = (user: User): void => {}
private shouldRender(nextProps: IUserProfileProps, nextState: IUserProfileState): boolean {}

// Private properties: camelCase
private authService: IAuthService;
private subscriptions: Array<() => void>;
private performanceTimer?: number;

// Event handlers: camelCase starting with 'handle'
private handleButtonClick = (): void => {}
private handleInputChange = (value: string): void => {}
private handleSubmit = (event: FormEvent): void => {}

// Render helpers: camelCase starting with 'render'
private renderLoadingState(): ReactNode {}
private renderErrorState(error: string): ReactNode {}
private renderContent(): ReactNode {}
```

---

## 🔄 State Management Best Practices

### **1. State Organization**

```typescript
// Organize state into logical groups
interface IWellOrganizedState {
  // Data state - async data from APIs
  data: {
    user: AsyncState<User>;
    posts: AsyncState<Post[]>;
    comments: AsyncState<Comment[]>;
  };
  
  // UI state - component UI state
  ui: {
    selectedTab: string;
    isModalOpen: boolean;
    filterText: string;
    sortBy: SortOption;
  };
  
  // Connection state - WebSocket/API connections
  connection: {
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    reconnectAttempts: number;
  };
  
  // Performance state - metrics and monitoring
  performance: {
    loadTime: number;
    renderCount: number;
    lastUpdate: number;
    memoryUsage?: number;
  };
}

// Generic async state type for consistency
interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated?: number;
}
```

### **2. State Update Patterns**

```typescript
class StateManagementExample extends Component<IProps, IState> {
  // Pattern 1: Simple state update
  private updateLoadingState = (isLoading: boolean): void => {
    this.setState({ isLoading });
  };

  // Pattern 2: Nested state update with spread operator
  private updateUserData = (userData: Partial<User>): void => {
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        user: {
          ...prevState.data.user,
          data: prevState.data.user.data ? {
            ...prevState.data.user.data,
            ...userData
          } : null
        }
      }
    }));
  };

  // Pattern 3: Async state update with error handling
  private async loadPosts = async (): Promise<void> => {
    try {
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          posts: {
            ...prevState.data.posts,
            isLoading: true,
            error: null
          }
        }
      }));

      const posts = await this.postService.getUserPosts(this.props.userId);
      
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          posts: {
            data: posts,
            isLoading: false,
            error: null,
            lastUpdated: Date.now()
          }
        }
      }));
    } catch (error) {
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          posts: {
            ...prevState.data.posts,
            isLoading: false,
            error: error.message
          }
        }
      }));
    }
  };

  // Pattern 4: Batch state updates
  private updateMultipleStates = (updates: {
    user?: User;
    posts?: Post[];
    selectedTab?: string;
  }): void => {
    this.setState(prevState => {
      const newState: Partial<IState> = {};

      if (updates.user) {
        newState.data = {
          ...prevState.data,
          user: {
            ...prevState.data.user,
            data: updates.user
          }
        };
      }

      if (updates.posts) {
        newState.data = {
          ...newState.data || prevState.data,
          posts: {
            ...prevState.data.posts,
            data: updates.posts
          }
        };
      }

      if (updates.selectedTab) {
        newState.ui = {
          ...prevState.ui,
          selectedTab: updates.selectedTab
        };
      }

      return newState as IState;
    });
  };
}
```

---

## 🔄 Lifecycle Method Guidelines

### **1. Lifecycle Method Order and Purpose**

```typescript
class LifecycleExample extends Component<IProps, IState> {
  // 1. Constructor - Component initialization
  constructor(props: IProps) {
    super(props);
    
    // Initialize state
    this.state = this.createInitialState();
    
    // Inject dependencies
    this.authService = this.props.container.getByToken(TYPES.AUTH_SERVICE);
    
    // Bind event handlers
    this.handleClick = this.handleClick.bind(this);
    
    // Initialize class properties
    this.subscriptions = [];
    this.timers = [];
  }

  // 2. componentDidMount - Initial data loading and setup
  componentDidMount(): void {
    // Start data loading
    this.loadInitialData();
    
    // Setup subscriptions
    this.setupSubscriptions();
    
    // Setup timers
    this.setupTimers();
    
    // Connect to external services
    this.connectWebSocket();
  }

  // 3. shouldComponentUpdate - Performance optimization
  shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
    // Shallow comparison for performance
    const propsChanged = 
      nextProps.userId !== this.props.userId ||
      nextProps.config !== this.props.config;

    const stateChanged = 
      nextState.data.user !== this.state.data.user ||
      nextState.ui.selectedTab !== this.state.ui.selectedTab;

    return propsChanged || stateChanged;
  }

  // 4. componentDidUpdate - Handle prop/state changes
  componentDidUpdate(prevProps: IProps, prevState: IState): void {
    // Handle user change
    if (prevProps.userId !== this.props.userId) {
      this.handleUserChange();
    }

    // Update performance metrics
    this.updatePerformanceMetrics();
  }

  // 5. componentWillUnmount - Cleanup
  componentWillUnmount(): void {
    // Cleanup subscriptions
    this.cleanupSubscriptions();
    
    // Cleanup timers
    this.cleanupTimers();
    
    // Disconnect from services
    this.disconnectWebSocket();
  }

  // 6. componentDidCatch - Error handling
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error
    this.logError(error, errorInfo);
    
    // Update state for error display
    this.setState({
      error: {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      }
    });
    
    // Send to monitoring service
    this.errorReportingService.report({
      error,
      errorInfo,
      componentName: this.constructor.name,
      props: this.props
    });
  }
}
```

### **2. Best Practices for Each Lifecycle Method**

#### **Constructor Best Practices**
```typescript
class ConstructorBestPractices extends Component<IProps, IState> {
  private authService: IAuthService;
  private subscriptions: Array<() => void> = [];

  constructor(props: IProps) {
    super(props); // Always call super() first

    // ✅ DO: Initialize state
    this.state = {
      data: null,
      isLoading: false,
      error: null
    };

    // ✅ DO: Inject dependencies
    this.authService = this.props.container.getByToken(TYPES.AUTH_SERVICE);

    // ✅ DO: Bind event handlers
    this.handleClick = this.handleClick.bind(this);

    // ❌ DON'T: Call setState
    // this.setState({ data: 'initial' }); // WRONG

    // ❌ DON'T: Make API calls
    // this.loadData(); // WRONG - use componentDidMount
  }
}
```

---

## ⚡ Performance Optimization Patterns

### **1. Render Optimization**

```typescript
class RenderOptimization extends Component<IProps, IState> {
  // Pattern 1: shouldComponentUpdate for fine-grained control
  shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
    // Shallow comparison for primitive values
    if (nextProps.userId !== this.props.userId) return true;
    if (nextProps.config !== this.props.config) return true;

    // State comparison
    if (nextState.data !== this.state.data) return true;
    if (nextState.ui.selectedTab !== this.state.ui.selectedTab) return true;

    return false;
  }

  // Pattern 2: Memoization for expensive calculations
  private memoizedCalculations = new Map<string, any>();

  private calculateExpensiveMetrics = (data: any[]): Metrics => {
    const cacheKey = JSON.stringify(data);
    
    if (this.memoizedCalculations.has(cacheKey)) {
      return this.memoizedCalculations.get(cacheKey);
    }

    const metrics = {
      total: data.length,
      average: data.reduce((sum, item) => sum + item.value, 0) / data.length,
      max: Math.max(...data.map(item => item.value)),
      min: Math.min(...data.map(item => item.value))
    };

    this.memoizedCalculations.set(cacheKey, metrics);
    return metrics;
  };

  // Pattern 3: Instance reuse for expensive objects
  private expensiveProcessor: ExpensiveProcessor | null = null;

  private getProcessor = (): ExpensiveProcessor => {
    if (!this.expensiveProcessor) {
      this.expensiveProcessor = new ExpensiveProcessor({
        algorithm: 'advanced',
        cacheSize: 1000
      });
    }
    return this.expensiveProcessor;
  };
}
```

### **2. Memory Management**

```typescript
class MemoryManagement extends Component<IProps, IState> {
  // Pattern 1: Proper cleanup of subscriptions
  private subscriptions: Array<() => void> = [];

  componentDidMount(): void {
    const userSubscription = this.userService.subscribe(
      this.props.userId,
      this.handleUserUpdate
    );
    
    this.subscriptions.push(userSubscription);
  }

  componentWillUnmount(): void {
    this.subscriptions.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.warn('Failed to unsubscribe:', error);
      }
    });
    this.subscriptions = [];
  }

  // Pattern 2: AbortController for cancellable operations
  private abortController: AbortController | null = null;

  private async loadData = async (): Promise<void> => {
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    try {
      this.setState({ isLoading: true });

      const response = await fetch(`/api/data/${this.props.userId}`, {
        signal: this.abortController.signal
      });

      const data = await response.json();
      
      if (!this.abortController.signal.aborted) {
        this.setState({ data, isLoading: false });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.setState({ error: error.message, isLoading: false });
      }
    }
  };

  componentWillUnmount(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}
```

---

## 🛡️ Error Handling Strategies

### **1. Comprehensive Error Boundaries**

```typescript
interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ComprehensiveErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log to monitoring service
    this.props.errorLogger?.log({
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: Date.now(),
      componentName: this.props.componentName
    });
  }

  private handleRetry = (): void => {
    const maxRetries = this.props.maxRetries || 3;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container className="error-boundary-fallback">
          <h2>Something went wrong</h2>
          <p>We're sorry, but this feature encountered an error.</p>
          
          {this.props.showRetry && (
            <button onClick={this.handleRetry}>
              Try Again ({(this.props.maxRetries || 3) - this.state.retryCount} attempts left)
            </button>
          )}
          
          {this.props.fallbackComponent && (
            <this.props.fallbackComponent error={this.state.error} />
          )}
        </Container>
      );
    }

    return this.props.children;
  }
}
```

### **2. Async Error Handling**

```typescript
class AsyncErrorHandling extends Component<IProps, IState> {
  private async loadUserData(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });
      
      const userData = await this.authService.getUser(this.props.userId);
      
      this.setState({ 
        user: userData, 
        isLoading: false 
      });
    } catch (error) {
      // Handle different error types
      if (error instanceof NetworkError) {
        this.setState({ 
          error: 'Network connection failed. Please check your internet connection.',
          isLoading: false 
        });
      } else if (error instanceof AuthenticationError) {
        this.setState({ 
          error: 'Authentication failed. Please log in again.',
          isLoading: false 
        });
      } else {
        this.setState({ 
          error: 'An unexpected error occurred. Please try again.',
          isLoading: false 
        });
      }

      // Log error for debugging
      console.error('Failed to load user data:', error);
      
      // Send to monitoring service
      this.errorReportingService.report({
        error,
        context: 'loadUserData',
        userId: this.props.userId
      });
    }
  }

  private handleRetry = (): void => {
    this.loadUserData();
  };
}
```

---

## 🔧 TypeScript Integration

### **1. Strong Typing Patterns**

```typescript
// Generic component with strict typing
interface IGenericComponentProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onSelect?: (item: T) => void;
  loading?: boolean;
  error?: string | null;
}

interface IGenericComponentState {
  selectedIndex: number | null;
  filterText: string;
}

class GenericComponent<T> extends Component<IGenericComponentProps<T>, IGenericComponentState> {
  constructor(props: IGenericComponentProps<T>) {
    super(props);
    
    this.state = {
      selectedIndex: null,
      filterText: ''
    };
  }

  private handleSelect = (item: T, index: number): void => {
    this.setState({ selectedIndex: index });
    this.props.onSelect?.(item);
  };

  render(): ReactNode {
    const { data, renderItem, loading, error } = this.props;
    const { selectedIndex, filterText } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const filteredData = data.filter(item => 
      JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
    );

    return (
      <div>
        <input
          type="text"
          value={filterText}
          onChange={(e) => this.setState({ filterText: e.target.value })}
          placeholder="Filter items..."
        />
        
        {filteredData.map((item, index) => (
          <div
            key={index}
            onClick={() => this.handleSelect(item, index)}
            style={{
              backgroundColor: selectedIndex === index ? 'lightblue' : 'transparent'
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }
}

// Usage example
interface IUser {
  id: string;
  name: string;
  email: string;
}

const UserList: React.FC<{ users: IUser[] }> = ({ users }) => (
  <GenericComponent<IUser>
    data={users}
    renderItem={(user) => (
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    )}
    onSelect={(user) => console.log('Selected user:', user)}
  />
);
```

### **2. Type Guards and Validation**

```typescript
class TypeValidationComponent extends Component<IProps, IState> {
  // Type guard functions
  private isUser = (obj: any): obj is User => {
    return obj && 
           typeof obj.id === 'string' && 
           typeof obj.name === 'string' && 
           typeof obj.email === 'string';
  };

  private isPost = (obj: any): obj is Post => {
    return obj && 
           typeof obj.id === 'string' && 
           typeof obj.title === 'string' && 
           typeof obj.content === 'string';
  };

  private validateApiResponse = (response: any): response is ApiResponse => {
    return response && 
           typeof response.success === 'boolean' && 
           (response.data === undefined || this.isUserData(response.data));
  };

  private isUserData = (data: any): data is User | User[] => {
    if (Array.isArray(data)) {
      return data.every(item => this.isUser(item));
    }
    return this.isUser(data);
  };

  private async loadData(): Promise<void> {
    try {
      const response = await this.apiService.getData(this.props.userId);
      
      // Type validation
      if (!this.validateApiResponse(response)) {
        throw new Error('Invalid API response format');
      }

      if (!response.success) {
        throw new Error(response.error || 'API request failed');
      }

      // Type-safe state update
      if (this.isUserData(response.data)) {
        this.setState({ 
          data: response.data,
          validationError: null 
        });
      } else {
        this.setState({ 
          validationError: 'Received data does not match expected format' 
        });
      }
    } catch (error) {
      this.setState({ 
        error: error.message,
        validationError: null 
      });
    }
  }
}
```

---

## 🧪 Testing Best Practices

### **1. Unit Testing Structure**

```typescript
describe('ComponentName', () => {
  let wrapper: any;
  let mockProps: IComponentProps;
  let mockServices: any;

  beforeEach(() => {
    // Setup mock services
    mockServices = {
      authService: {
        getUser: jest.fn(),
        subscribeToUserUpdates: jest.fn()
      },
      errorReportingService: {
        report: jest.fn()
      }
    };

    // Setup mock props
    mockProps = {
      userId: 'test-user-123',
      container: {
        getByToken: jest.fn((token) => mockServices[token])
      }
    };

    wrapper = mount(<ComponentName {...mockProps} />);
  });

  afterEach(() => {
    wrapper.unmount();
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should initialize with correct default state', () => {
      const state = wrapper.state();
      
      expect(state.user.isLoading).toBe(true);
      expect(state.user.data).toBeNull();
      expect(state.user.error).toBeNull();
    });

    it('should inject services correctly', () => {
      const instance = wrapper.instance();
      
      expect(instance.authService).toBeDefined();
      expect(mockProps.container.getByToken).toHaveBeenCalledWith(TYPES.AUTH_SERVICE);
    });

    it('should bind event handlers correctly', () => {
      const instance = wrapper.instance();
      
      expect(typeof instance.handleAction).toBe('function');
      expect(typeof instance.handleTabChange).toBe('function');
    });
  });

  describe('Lifecycle Methods', () => {
    it('should call componentDidMount', () => {
      const componentDidMountSpy = jest.spyOn(
        ComponentName.prototype,
        'componentDidMount'
      );
      
      wrapper = mount(<ComponentName {...mockProps} />);
      
      expect(componentDidMountSpy).toHaveBeenCalled();
    });

    it('should load user data on mount', async () => {
      const mockUserData = { id: 'test-user', name: 'Test User' };
      mockServices.authService.getUser.mockResolvedValue(mockUserData);

      wrapper = mount(<ComponentName {...mockProps} />);
      await flushPromises();
      wrapper.update();

      expect(wrapper.state('user').data).toEqual(mockUserData);
      expect(wrapper.state('user').isLoading).toBe(false);
    });

    it('should cleanup on unmount', () => {
      const componentWillUnmountSpy = jest.spyOn(
        ComponentName.prototype,
        'componentWillUnmount'
      );
      
      wrapper.unmount();
      
      expect(componentWillUnmountSpy).toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    it('should update state correctly when user data loads', async () => {
      const mockUserData = { id: 'test-user', name: 'Test User' };
      mockServices.authService.getUser.mockResolvedValue(mockUserData);

      wrapper.instance().loadUserData();
      await flushPromises();
      wrapper.update();

      expect(wrapper.state('user')).toEqual({
        data: mockUserData,
        isLoading: false,
        error: null
      });
    });

    it('should handle loading state correctly', () => {
      wrapper.instance().updateLoadingState(true);
      
      expect(wrapper.state('isLoading')).toBe(true);
    });
  });

  describe('Event Handlers', () => {
    it('should call onAction prop when handleAction is called', () => {
      const mockOnAction = jest.fn();
      wrapper.setProps({ onAction: mockOnAction });

      const testData = { test: 'data' };
      wrapper.instance().handleAction(testData);

      expect(mockOnAction).toHaveBeenCalledWith(testData);
    });

    it('should update selected tab when handleTabChange is called', () => {
      wrapper.instance().handleTabChange('profile');

      expect(wrapper.state('ui').selectedTab).toBe('profile');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors correctly', async () => {
      const mockError = new Error('API Error');
      mockServices.authService.getUser.mockRejectedValue(mockError);

      wrapper.instance().loadUserData();
      await flushPromises();
      wrapper.update();

      expect(wrapper.state('user').error).toBe('API Error');
      expect(wrapper.state('user').isLoading).toBe(false);
    });

    it('should call error reporting service on error', async () => {
      const mockError = new Error('Test Error');
      mockServices.authService.getUser.mockRejectedValue(mockError);

      wrapper.instance().loadUserData();
      await flushPromises();

      expect(mockServices.errorReportingService.report).toHaveBeenCalledWith({
        error: mockError,
        context: 'loadUserData',
        userId: mockProps.userId
      });
    });
  });

  describe('Performance Optimization', () => {
    it('should not re-render when props have not changed', () => {
      const renderSpy = jest.spyOn(ComponentName.prototype, 'render');
      
      wrapper.setProps({ ...mockProps });
      
      expect(renderSpy).not.toHaveBeenCalled();
    });

    it('should re-render when userId prop changes', () => {
      const renderSpy = jest.spyOn(ComponentName.prototype, 'render');
      
      wrapper.setProps({ ...mockProps, userId: 'different-user' });
      
      expect(renderSpy).toHaveBeenCalled();
    });
  });
});
```

### **2. Integration Testing**

```typescript
describe('ComponentName Integration', () => {
  let container: Container;
  let wrapper: any;

  beforeEach(() => {
    // Setup DI container
    container = createTestContainer();
    
    wrapper = mount(
      <DIProvider container={container}>
        <ComponentName userId="test-user" />
      </DIProvider>
    );
  });

  it('should integrate with DI container correctly', () => {
    const instance = wrapper.find(ComponentName).instance();
    
    expect(instance.authService).toBeDefined();
    expect(instance.authService).toBeInstanceOf(MockAuthService);
  });

  it('should handle real WebSocket connections', async () => {
    const mockWebSocket = createMockWebSocket();
    
    wrapper = mount(
      <WebSocketProvider websocket={mockWebSocket}>
        <RealtimeComponent userId="test-user" />
      </WebSocketProvider>
    );

    await mockWebSocket.simulateOpen();
    expect(wrapper.find(RealtimeComponent).state('connectionState')).toBe('connected');
  });
});
```

---

## 📁 Code Organization

### **1. Directory Structure**

```
src/features/feature-name/
├── components/
│   ├── ComponentName.tsx              # Main component
│   ├── ComponentName.styles.ts        # Component-specific styles
│   ├── ComponentName.test.tsx         # Component tests
│   └── __tests__/
│       ├── ComponentName.unit.test.tsx
│       └── ComponentName.integration.test.tsx
├── hooks/
│   └── useFeatureSpecific.ts          # Feature-specific hooks
├── services/
│   └── FeatureService.ts               # Feature services
├── types/
│   └── index.ts                        # Feature types
├── utils/
│   └── featureUtils.ts                 # Feature utilities
└── index.ts                           # Feature exports
```

### **2. Import Organization**

```typescript
// 1. React imports
import React, { Component, ReactNode } from 'react';

// 2. Third-party library imports
import { debounce, throttle } from 'lodash';
import { RouteComponentProps } from 'react-router-dom';

// 3. Internal shared imports
import { Container, Button } from '@/shared/ui/components';
import { IAuthService } from '@/core/auth/interfaces';
import { createLogger } from '@/core/services';

// 4. Feature-specific imports
import { FeatureService } from '../services/FeatureService';
import { IFeatureData } from '../types';
import { featureUtils } from '../utils/featureUtils';

// 5. Relative imports
import { SubComponent } from './SubComponent';
import { styles } from './ComponentName.styles';
```

---

## 🔒 Security Considerations

### **1. Input Validation**

```typescript
class SecureComponent extends Component<ISecureProps, ISecureState> {
  private validateInput = (input: string): boolean => {
    // Validate input length
    if (input.length > 1000) {
      return false;
    }

    // Validate for XSS patterns
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];

    return !xssPatterns.some(pattern => pattern.test(input));
  };

  private sanitizeInput = (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  private handleInputChange = (value: string): void => {
    if (!this.validateInput(value)) {
      this.setState({ 
        error: 'Invalid input detected',
        inputError: true 
      });
      return;
    }

    const sanitizedValue = this.sanitizeInput(value);
    
    this.setState({ 
      inputValue: sanitizedValue,
      inputError: false,
      error: null 
    });
  };
}
```

### **2. Data Protection**

```typescript
class DataProtectionComponent extends Component<IDataProtectionProps, IDataProtectionState> {
  private sensitiveDataKeys = ['password', 'token', 'secret', 'key'];

  private sanitizeStateForLogging = (state: any): any => {
    const sanitized = { ...state };
    
    Object.keys(sanitized).forEach(key => {
      if (this.sensitiveDataKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  };

  private logStateChange = (prevState: any, newState: any): void => {
    const sanitizedPrevState = this.sanitizeStateForLogging(prevState);
    const sanitizedNewState = this.sanitizeStateForLogging(newState);

    this.logger.info('State changed', {
      from: sanitizedPrevState,
      to: sanitizedNewState,
      timestamp: Date.now()
    });
  };

  componentDidUpdate(prevProps: IDataProtectionProps, prevState: IDataProtectionState): void {
    this.logStateChange(prevState, this.state);
  }
}
```

---

## ✅ Best Practices Checklist

### **Component Structure**
- [ ] Follow consistent file organization pattern
- [ ] Use proper naming conventions
- [ ] Define explicit interfaces for props and state
- [ ] Bind methods in constructor
- [ ] Group related methods together

### **State Management**
- [ ] Organize state into logical groups
- [ ] Use immutable update patterns
- [ ] Handle async operations properly
- [ ] Validate state consistency
- [ ] Implement proper error handling

### **Lifecycle Management**
- [ ] Use appropriate lifecycle methods
- [ ] Implement proper cleanup
- [ ] Handle prop changes correctly
- [ ] Optimize re-renders
- [ ] Add error boundaries

### **Performance**
- [ ] Implement shouldComponentUpdate when needed
- [ ] Use memoization for expensive calculations
- [ ] Manage memory properly
- [ ] Optimize render performance
- [ ] Monitor component metrics

### **TypeScript**
- [ ] Use strong typing throughout
- [ ] Implement type guards
- [ ] Validate external data
- [ ] Use generics appropriately
- [ ] Handle type errors gracefully

### **Testing**
- [ ] Write comprehensive unit tests
- [ ] Test lifecycle methods
- [ ] Test error scenarios
- [ ] Include integration tests
- [ ] Test performance critical paths

### **Security**
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Protect sensitive information
- [ ] Implement proper error handling
- [ ] Follow secure coding practices

---

*Document Version: 1.0*  
*Last Updated: January 29, 2026*  
*Next Review: February 29, 2026*
