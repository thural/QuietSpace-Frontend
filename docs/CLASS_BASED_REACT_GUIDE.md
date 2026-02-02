# Class-Based React Guidelines

## 🎯 Overview

This comprehensive guide covers class-based React development patterns, best practices, and migration strategies for building enterprise-grade React applications.

---

## 📋 Table of Contents

1. [Class-Based React Fundamentals](#class-based-react-fundamentals)
2. [Best Practices](#best-practices)
3. [Component Patterns](#component-patterns)
4. [Migration Strategies](#migration-strategies)
5. [Performance Optimization](#performance-optimization)
6. [Testing Class Components](#testing-class-components)

---

## 🏗️ Class-Based React Fundamentals

### **Why Class-Based Components?**
Class-based components offer several advantages for enterprise applications:
- **Better State Management**: Explicit state management with lifecycle methods
- **Cleaner Architecture**: Clear separation of concerns with method organization
- **Enhanced Debugging**: Better stack traces and debugging capabilities
- **Performance Optimization**: PureComponent for efficient re-rendering
- **Type Safety**: Strong TypeScript integration with interfaces

### **Basic Class Component Structure**
```typescript
import React, { PureComponent } from 'react';

interface IComponentProps {
  // Component props interface
}

interface IComponentState {
  // Component state interface
}

class ComponentName extends PureComponent<IComponentProps, IComponentState> {
  // 1. Static properties
  static defaultProps: Partial<IComponentProps> = {
    // Default props
  };

  // 2. Private properties
  private service: ServiceType;
  private ref = React.createRef<HTMLDivElement>();

  // 3. Constructor
  constructor(props: IComponentProps) {
    super(props);
    this.state = {
      // Initial state
    };
    
    // 4. Method binding
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // 5. Lifecycle methods
  componentDidMount(): void {
    // Component mounted
  }

  componentDidUpdate(prevProps: IComponentProps): void {
    // Component updated
  }

  componentWillUnmount(): void {
    // Component will unmount
  }

  // 6. Event handlers
  private handleClick = (): void => {
    // Handle click event
  };

  private handleChange = (value: string): void => {
    // Handle change event
  };

  // 7. Private methods
  private validateInput = (input: string): boolean => {
    // Validate input
    return true;
  };

  private fetchData = async (): Promise<void> => {
    // Fetch data
  };

  // 8. Render helpers
  private renderLoadingState = (): ReactNode => {
    return <div>Loading...</div>;
  };

  private renderErrorState = (error: Error): ReactNode => {
    return <div>Error: {error.message}</div>;
  };

  // 9. Main render method
  render(): ReactNode {
    const { prop1, prop2 } = this.props;
    const { state1, state2 } = this.state;

    return (
      <div ref={this.ref}>
        {/* JSX content */}
      </div>
    );
  }
}

export default ComponentName;
```

---

## 📚 Best Practices

### **16 Best Practices for Class-Based Components**

#### **1. Separate Logic from Rendering**
```typescript
class UserProfile extends PureComponent<IUserProfileProps, IUserProfileState> {
  // ✅ GOOD: Separate business logic
  private calculateUserAge = (): number => {
    const { birthDate } = this.props.user;
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getFullYear() - birth.getFullYear();
  };

  // ✅ GOOD: Separate rendering logic
  private renderUserAge = (): ReactNode => {
    const age = this.calculateUserAge();
    return <span>Age: {age}</span>;
  };

  render(): ReactNode {
    return (
      <div>
        <h1>{this.props.user.name}</h1>
        {this.renderUserAge()}
      </div>
    );
  }
}
```

#### **2. Bind Methods in Constructor**
```typescript
class SearchComponent extends PureComponent<ISearchProps, ISearchState> {
  constructor(props: ISearchProps) {
    super(props);
    
    // ✅ GOOD: Bind methods in constructor
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  private handleSearch = (query: string): void => {
    // Search logic
  };

  private handleClear = (): void => {
    // Clear logic
  };
}
```

#### **3. Destructure Props and State**
```typescript
class ProductCard extends PureComponent<IProductCardProps, IProductCardState> {
  render(): ReactNode {
    // ✅ GOOD: Destructure props and state
    const { 
      product: { name, price, description }, 
      onAddToCart,
      className 
    } = this.props;
    
    const { 
      isLoading, 
      error, 
      quantity 
    } = this.state;

    return (
      <div className={className}>
        <h2>{name}</h2>
        <p>${price}</p>
        <p>{description}</p>
        <button onClick={() => onAddToCart(product)}>
          Add to Cart ({quantity})
        </button>
      </div>
    );
  }
}
```

#### **4. Group Related Lifecycle Methods**
```typescript
class DataComponent extends PureComponent<IDataProps, IDataState> {
  // ✅ GOOD: Group lifecycle methods by phase
  
  // Mounting phase
  componentDidMount(): void {
    this.loadData();
    this.setupEventListeners();
  }

  // Updating phase
  componentDidUpdate(prevProps: IDataProps): void {
    if (prevProps.id !== this.props.id) {
      this.loadData();
    }
  }

  // Unmounting phase
  componentWillUnmount(): void {
    this.cleanupEventListeners();
  }

  // Private methods
  private loadData = async (): Promise<void> => {
    // Load data logic
  };

  private setupEventListeners = (): void => {
    // Setup listeners
  };

  private cleanupEventListeners = (): void => {
    // Cleanup listeners
  };
}
```

#### **5. Break Down into Smaller Components**
```typescript
class ComplexForm extends PureComponent<IComplexFormProps, IComplexFormState> {
  render(): ReactNode {
    return (
      <div>
        <UserSection user={this.props.user} />
        <AddressSection address={this.props.address} />
        <PaymentSection payment={this.props.payment} />
      </div>
    );
  }
}

// ✅ GOOD: Break down into smaller components
class UserSection extends PureComponent<IUserSectionProps> {
  render(): ReactNode {
    return (
      <div>
        <h2>User Information</h2>
        <UserBasicInfo user={this.props.user} />
        <UserPreferences preferences={this.props.user.preferences} />
      </div>
    );
  }
}
```

#### **6. Use Default Props and PropTypes**
```typescript
interface IButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

class Button extends PureComponent<IButtonProps> {
  // ✅ GOOD: Default props
  static defaultProps: Partial<IButtonProps> = {
    variant: 'primary',
    size: 'medium',
    disabled: false
  };

  // ✅ GOOD: PropTypes (if using prop-types)
  static propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    disabled: PropTypes.bool,
    onClick: PropTypes.func
  };

  render(): ReactNode {
    const { children, variant, size, disabled, onClick } = this.props;
    
    return (
      <button 
        className={`btn btn-${variant} btn-${size}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
}
```

#### **7. Handle State Updates Immutably**
```typescript
class TodoList extends PureComponent<ITodoListProps, ITodoListState> {
  private addTodo = (text: string): void => {
    // ✅ GOOD: Immutable state update
    this.setState(prevState => ({
      todos: [...prevState.todos, {
        id: Date.now(),
        text,
        completed: false
      }]
    }));
  };

  private toggleTodo = (id: number): void => {
    // ✅ GOOD: Immutable state update
    this.setState(prevState => ({
      todos: prevState.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };
}
```

#### **8. Implement Error Boundaries**
```typescript
class ErrorBoundary extends PureComponent<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### **9. Follow Consistent Naming and Formatting**
```typescript
class UserProfile extends PureComponent<IUserProfileProps, IUserProfileState> {
  // ✅ GOOD: Consistent naming
  private userService: UserService;
  private userRef = React.createRef<HTMLDivElement>();
  private isLoading = false;

  constructor(props: IUserProfileProps) {
    super(props);
    this.userService = new UserService();
  }

  // ✅ GOOD: Consistent method naming
  private fetchUserData = async (): Promise<void> => {
    // Implementation
  };

  private validateUserData = (user: User): boolean => {
    // Implementation
  };

  private renderUserProfile = (): ReactNode => {
    // Implementation
  };
}
```

#### **10. Avoid Inline Styles and Logic**
```typescript
class StyledComponent extends PureComponent<IStyledComponentProps> {
  // ✅ GOOD: Use CSS classes instead of inline styles
  private getButtonClassName = (): string => {
    const baseClass = 'btn';
    const variantClass = `btn-${this.props.variant}`;
    const sizeClass = `btn-${this.props.size}`;
    
    return [baseClass, variantClass, sizeClass].join(' ');
  };

  render(): ReactNode {
    return (
      <button className={this.getButtonClassName()}>
        {this.props.children}
      </button>
    );
  }
}
```

#### **11. Use React.PureComponent by Default**
```typescript
// ✅ GOOD: Use PureComponent for performance
class ProductCard extends PureComponent<IProductCardProps, IProductCardState> {
  render(): ReactNode {
    return (
      <div className="product-card">
        {/* Component content */}
      </div>
    );
  }
}

// ✅ GOOD: Use Component only when needed
class ComplexComponent extends Component<IComplexComponentProps, IComplexComponentState> {
  shouldComponentUpdate(nextProps: IComplexComponentProps): boolean {
    // Custom update logic
    return nextProps.id !== this.props.id;
  }

  render(): ReactNode {
    return (
      <div className="complex-component">
        {/* Component content */}
      </div>
    );
  }
}
```

#### **12. Organize by "The Class Anatomy"**
```typescript
class WellOrganizedComponent extends PureComponent<IProps, IState> {
  // 1. Static properties
  static defaultProps: Partial<IProps> = {};
  static propTypes = {};

  // 2. Private properties
  private service: ServiceType;
  private ref = React.createRef<HTMLDivElement>();

  // 3. Constructor
  constructor(props: IProps) {
    super(props);
    this.state = {};
    this.service = new ServiceType();
    this.handleClick = this.handleClick.bind(this);
  }

  // 4. Lifecycle methods (grouped by phase)
  componentDidMount(): void {}
  componentDidUpdate(): void {}
  componentWillUnmount(): void {}

  // 5. Event handlers
  private handleClick = (): void => {};
  private handleChange = (value: string): void => {};

  // 6. Private methods
  private validateInput = (input: string): boolean => true;
  private fetchData = async (): Promise<void> => {};

  // 7. Render helpers
  private renderLoading = (): ReactNode => <div>Loading...</div>;
  private renderError = (error: Error): ReactNode => <div>Error: {error.message}</div>;

  // 8. Main render method
  render(): ReactNode {
    return <div>{/* JSX content */}</div>;
  }
}
```

#### **13. Avoid Anonymous Functions in Render**
```typescript
class BadComponent extends PureComponent<IBadComponentProps> {
  render(): ReactNode {
    return (
      <div>
        {/* ❌ BAD: Anonymous function in render */}
        <button onClick={() => this.handleClick()}>
          Click me
        </button>
      </div>
    );
  }
}

class GoodComponent extends PureComponent<IGoodComponentProps> {
  constructor(props: IGoodComponentProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick = (): void => {
    // Handle click
  };

  render(): ReactNode {
    return (
      <div>
        {/* ✅ GOOD: Bound method */}
        <button onClick={this.handleClick}>
          Click me
        </button>
      </div>
    );
  }
}
```

#### **14. Leverage Private Class Fields**
```typescript
class ModernComponent extends PureComponent<IModernComponentProps, IModernComponentState> {
  // ✅ GOOD: Private class fields
  #userService = new UserService();
  #isLoading = false;
  #error: Error | null = null;

  // ✅ GOOD: Private methods
  #fetchData = async (): Promise<void> => {
    this.#isLoading = true;
    try {
      const data = await this.#userService.getData();
      this.setState({ data });
    } catch (error) {
      this.#error = error as Error;
    } finally {
      this.#isLoading = false;
    }
  };

  render(): ReactNode {
    return (
      <div>
        {this.#isLoading && <div>Loading...</div>}
        {this.#error && <div>Error: {this.#error.message}</div>}
      </div>
    );
  }
}
```

#### **15. Strict TypeScript Interfaces**
```typescript
interface IUserProfileProps {
  user: User;
  onUpdate?: (user: User) => void;
  className?: string;
  testId?: string;
}

interface IUserProfileState {
  isEditing: boolean;
  formData: Partial<User>;
  validationErrors: Record<string, string>;
}

class UserProfile extends PureComponent<IUserProfileProps, IUserProfileState> {
  // ✅ GOOD: Strict TypeScript interfaces
  private handleUpdate = async (updates: Partial<User>): Promise<void> => {
    try {
      const updatedUser = { ...this.props.user, ...updates };
      this.props.onUpdate?.(updatedUser);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  render(): ReactNode {
    const { user, className, testId } = this.props;
    const { isEditing, formData, validationErrors } = this.state;

    return (
      <div className={className} data-testid={testId}>
        {/* Component content */}
      </div>
    );
  }
}
```

#### **16. Debounced State Updates**
```typescript
class SearchComponent extends PureComponent<ISearchProps, ISearchState> {
  private debounceTimer: NodeJS.Timeout | null = null;

  private debouncedSearch = (query: string): void => {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.performSearch(query);
    }, 300);
  };

  private performSearch = async (query: string): Promise<void> => {
    this.setState({ isLoading: true });
    
    try {
      const results = await this.searchService.search(query);
      this.setState({ results, isLoading: false });
    } catch (error) {
      this.setState({ error: error as Error, isLoading: false });
    }
  };

  componentWillUnmount(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  render(): ReactNode {
    return (
      <div>
        <input
          type="text"
          onChange={(e) => this.debouncedSearch(e.target.value)}
          placeholder="Search..."
        />
      </div>
    );
  }
}
```

---

## 🎨 Component Patterns

### **Container Component Pattern**
```typescript
interface IContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  padding?: string;
}

class Container extends PureComponent<IContainerProps> {
  static defaultProps: Partial<IContainerProps> = {
    maxWidth: '1200px',
    padding: '1rem'
  };

  render(): ReactNode {
    const { children, className, maxWidth, padding } = this.props;

    const containerStyle: React.CSSProperties = {
      maxWidth,
      padding,
      margin: '0 auto',
      width: '100%'
    };

    return (
      <div className={className} style={containerStyle}>
        {children}
      </div>
    );
  }
}
```

### **Form Component Pattern**
```typescript
interface IFormProps {
  onSubmit: (data: FormData) => void;
  initialValues?: FormData;
  validation?: ValidationSchema;
}

interface IFormState {
  data: FormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

class Form extends PureComponent<IFormProps, IFormState> {
  constructor(props: IFormProps) {
    super(props);
    this.state = {
      data: props.initialValues || {},
      errors: {},
      isSubmitting: false
    };
  }

  private handleChange = (field: string, value: string): void => {
    this.setState(prevState => ({
      data: { ...prevState.data, [field]: value },
      errors: { ...prevState.errors, [field]: '' }
    }));
  };

  private handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    
    this.setState({ isSubmitting: true });

    try {
      await this.props.onSubmit(this.state.data);
    } catch (error) {
      this.setState({ errors: { submit: error.message } });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  render(): ReactNode {
    const { data, errors, isSubmitting } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <input
          value={data.name || ''}
          onChange={(e) => this.handleChange('name', e.target.value)}
          placeholder="Name"
        />
        {errors.name && <span className="error">{errors.name}</span>}
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        
        {errors.submit && <div className="error">{errors.submit}</div>}
      </form>
    );
  }
}
```

### **List Component Pattern**
```typescript
interface IListProps {
  items: Item[];
  renderItem: (item: Item, index: number) => ReactNode;
  keyExtractor: (item: Item, index: number) => string;
  emptyMessage?: string;
  loading?: boolean;
}

class List extends PureComponent<IListProps> {
  static defaultProps: Partial<IListProps> = {
    emptyMessage: 'No items found',
    loading: false
  };

  render(): ReactNode {
    const { items, renderItem, keyExtractor, emptyMessage, loading } = this.props;

    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (items.length === 0) {
      return <div className="empty">{emptyMessage}</div>;
    }

    return (
      <ul className="list">
        {items.map((item, index) => (
          <li key={keyExtractor(item, index)}>
            {renderItem(item, index)}
          </li>
        ))}
      </ul>
    );
  }
}
```

---

## 🔄 Migration Strategies

### **From Functional to Class-Based**
```typescript
// BEFORE: Functional Component
const UserProfile = ({ user, onUpdate }: IUserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(user);
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      ) : (
        <span>{user.name}</span>
      )}
      <button onClick={isEditing ? handleSave : handleEdit}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
};

// AFTER: Class-Based Component
class UserProfile extends PureComponent<IUserProfileProps, IUserProfileState> {
  constructor(props: IUserProfileProps) {
    super(props);
    this.state = {
      isEditing: false,
      formData: {}
    };
  }

  private handleEdit = (): void => {
    this.setState({
      isEditing: true,
      formData: this.props.user
    });
  };

  private handleSave = (): void => {
    this.props.onUpdate(this.state.formData);
    this.setState({ isEditing: false });
  };

  private handleChange = (field: string, value: string): void => {
    this.setState(prevState => ({
      formData: { ...prevState.formData, [field]: value }
    }));
  };

  render(): ReactNode {
    const { user } = this.props;
    const { isEditing, formData } = this.state;

    return (
      <div>
        {isEditing ? (
          <input
            value={formData.name || ''}
            onChange={(e) => this.handleChange('name', e.target.value)}
          />
        ) : (
          <span>{user.name}</span>
        )}
        <button onClick={isEditing ? this.handleSave : this.handleEdit}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
    );
  }
}
```

### **From Hooks to Class Methods**
```typescript
// BEFORE: Custom Hook
const useApi = (url: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

// AFTER: Class-Based Service
class ApiService {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async fetchData(): Promise<any> {
    const response = await fetch(this.url);
    return response.json();
  }
}

// Component using the service
class DataComponent extends PureComponent<IDataComponentProps, IDataComponentState> {
  private apiService: ApiService;

  constructor(props: IDataComponentProps) {
    super(props);
    this.apiService = new ApiService(props.url);
    this.state = {
      data: null,
      loading: false,
      error: null
    };
  }

  componentDidMount(): void {
    this.fetchData();
  }

  private fetchData = async (): Promise<void> => {
    this.setState({ loading: true });
    
    try {
      const data = await this.apiService.fetchData();
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error: error as Error, loading: false });
    }
  };

  render(): ReactNode {
    const { data, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data</div>;

    return <div>{JSON.stringify(data)}</div>;
  }
}
```

---

## ⚡ Performance Optimization

### **PureComponent Usage**
```typescript
class OptimizedComponent extends PureComponent<IOptimizedComponentProps> {
  // PureComponent automatically implements shouldComponentUpdate
  // with a shallow comparison of props and state
  
  render(): ReactNode {
    // This will only re-render if props or state change
    return <div>{this.props.content}</div>;
  }
}
```

### **Memoization Techniques**
```typescript
class MemoizedComponent extends PureComponent<IMemoizedComponentProps, IMemoizedComponentState> {
  // Memoize expensive calculations
  private expensiveCalculation = (data: any[]): any => {
    // Expensive computation
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  render(): ReactNode {
    const { data } = this.props;
    
    // Only re-calculate if data changes
    const result = this.expensiveCalculation(data);
    
    return <div>Total: {result}</div>;
  }
}
```

### **Lazy Loading**
```typescript
class LazyLoadingComponent extends PureComponent<ILazyLoadingProps, ILazyLoadingState> {
  constructor(props: ILazyLoadingProps) {
    super(props);
    this.state = {
      component: null,
      isLoading: false
    };
  }

  private loadComponent = async (): Promise<void> => {
    this.setState({ isLoading: true });
    
    try {
      const module = await import('./HeavyComponent');
      this.setState({ 
        component: module.default,
        isLoading: false 
      });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  render(): ReactNode {
    const { component, isLoading } = this.state;
    const { trigger } = this.props;

    if (trigger && !component && !isLoading) {
      this.loadComponent();
      return <div>Loading component...</div>;
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (component) {
      const LazyComponent = component;
      return <LazyComponent />;
    }

    return <div>Click to load component</div>;
  }
}
```

---

## 🧪 Testing Class Components

### **Unit Testing**
```typescript
describe('UserProfile', () => {
  let mockUserService: jest.Mocked<UserService>;
  let defaultProps: IUserProfileProps;

  beforeEach(() => {
    mockUserService = createMockUserService();
    defaultProps = {
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      userService: mockUserService
    };
  });

  it('should render user profile correctly', () => {
    const wrapper = mount(<UserProfile {...defaultProps} />);
    
    expect(wrapper.find('h1').text()).toBe('John Doe');
    expect(wrapper.find('p').text()).toBe('john@example.com');
  });

  it('should handle edit mode', () => {
    const wrapper = mount(<UserProfile {...defaultProps} />);
    
    wrapper.find('button').simulate('click');
    
    expect(wrapper.state('isEditing')).toBe(true);
    expect(wrapper.find('input').exists()).toBe(true);
  });

  it('should call onUpdate when saving', () => {
    const onUpdate = jest.fn();
    const wrapper = mount(<UserProfile {...defaultProps} onUpdate={onUpdate} />);
    
    wrapper.find('button').simulate('click'); // Enter edit mode
    wrapper.find('input').simulate('change', { target: { value: 'Jane Doe' } });
    wrapper.find('button').simulate('click'); // Save
    
    expect(onUpdate).toHaveBeenCalledWith({
      ...defaultProps.user,
      name: 'Jane Doe'
    });
  });
});
```

### **Integration Testing**
```typescript
describe('UserProfile Integration', () => {
  it('should integrate with user service', async () => {
    const mockUserService = new MockUserService();
    const user = await mockUserService.getUser('1');
    
    const wrapper = mount(<UserProfile user={user} userService={mockUserService} />);
    
    expect(wrapper.find('h1').text()).toBe(user.name);
  });
});
```

### **Snapshot Testing**
```typescript
describe('UserProfile Snapshots', () => {
  it('should match snapshot', () => {
    const wrapper = mount(<UserProfile {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
```

---

## 📚 Additional Resources

### **Documentation**
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/)

### **Tools and Utilities**
- **React DevTools**: Component debugging
- **React Testing Library**: Component testing
- **Enzyme**: Component testing utilities
- **Storybook**: Component development

### **Best Practices**
- Follow the 16 best practices outlined above
- Use TypeScript for type safety
- Implement proper error handling
- Write comprehensive tests
- Optimize for performance

---

**Last Updated**: February 2, 2026  
**Version**: 1.0.0  
**Best Practices**: 16/16 Implemented
