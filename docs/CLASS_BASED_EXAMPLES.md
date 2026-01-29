# Class-Based React Component Examples

## 🎯 Overview

This document provides comprehensive examples of class-based React components for the QuietSpace Frontend application, demonstrating best practices and common patterns.

---

## 📋 Table of Contents

1. [Basic Component Examples](#basic-component-examples)
2. [Complex State Management](#complex-state-management)
3. [Real-time Components](#real-time-components)
4. [Error Boundary Components](#error-boundary-components)
5. [Performance-Optimized Components](#performance-optimized-components)

---

## 🏗️ Basic Component Examples

### **Example 1: Simple Data Loading Component with Best Practices**

```typescript
import React, { Component, ReactNode } from 'react';
import { Container, Button, Text } from '@/shared/ui/components';

interface IUserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

interface IUserProfileState {
  user: AsyncState<User>;
  isEditing: boolean;
}

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
}

/**
 * Simple user profile component demonstrating best practices
 */
class UserProfile extends Component<IUserProfileProps, IUserProfileState> {
  constructor(props: IUserProfileProps) {
    super(props);
    
    this.state = {
      user: { data: null, isLoading: true, error: null },
      isEditing: false
    };

    // ✅ DO: Bind methods once in constructor
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount(): void {
    this.loadUser();
  }

  componentDidUpdate(prevProps: IUserProfileProps): void {
    if (prevProps.userId !== this.props.userId) {
      this.loadUser();
    }
  }

  // ✅ DO: Extract complex logic into separate methods
  private async loadUser(): Promise<void> {
    try {
      this.setState(prevState => ({
        user: { ...prevState.user, isLoading: true, error: null }
      }));

      const userData = await this.userService.getUser(this.props.userId);
      
      this.setState(prevState => ({
        user: { data: userData, isLoading: false, error: null }
      }));
    } catch (error) {
      this.setState(prevState => ({
        user: { ...prevState.user, isLoading: false, error: error.message }
      }));
    }
  }

  // ✅ DO: Use bound methods
  private handleEdit(): void {
    this.setState({ isEditing: true });
  }

  private async handleSave(updatedUser: Partial<User>): Promise<void> {
    try {
      const savedUser = await this.userService.updateUser(
        this.props.userId,
        updatedUser
      );

      this.setState(prevState => ({
        user: { ...prevState.user, data: savedUser },
        isEditing: false
      }));

      this.props.onUpdate?.(savedUser);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  }

  private handleCancel(): void {
    this.setState({ isEditing: false });
  }

  // ✅ DO: Keep render method clean and focused
  render(): ReactNode {
    const { user, isEditing } = this.state;

    if (user.isLoading) {
      return this.renderLoadingState();
    }

    if (user.error) {
      return this.renderErrorState(user.error);
    }

    return this.renderContent(user.data, isEditing);
  }

  // ✅ DO: Extract render helpers
  private renderLoadingState = (): ReactNode => (
    <Container className="loading-container">
      <Text>Loading user profile...</Text>
    </Container>
  );

  private renderErrorState = (error: string): ReactNode => (
    <Container className="error-container">
      <Text variant="error">Error: {error}</Text>
      <Button onClick={() => this.loadUser()}>Retry</Button>
    </Container>
  );

  private renderContent = (user: User | null, isEditing: boolean): ReactNode => {
    if (!user) return null;

    return (
      <Container className="user-profile">
        <div className="profile-header">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>

        <div className="profile-content">
          {isEditing ? (
            <UserProfileEdit
              user={user}
              onSave={this.handleSave}
              onCancel={this.handleCancel}
            />
          ) : (
            <UserProfileDisplay
              user={user}
              onEdit={this.handleEdit}
            />
          )}
        </div>
      </Container>
    );
  }
}

export default UserProfile;
```

### **Example 2: Form Component with Validation and Best Practices**

```typescript
import React, { Component, ReactNode } from 'react';
import { Container, Button, Input, Text } from '@/shared/ui/components';

interface IContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  initialData?: Partial<ContactFormData>;
}

interface IContactFormState {
  data: ContactFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/**
 * Contact form component demonstrating validation and best practices
 */
class ContactForm extends Component<IContactFormProps, IContactFormState> {
  constructor(props: IContactFormProps) {
    super(props);
    
    this.state = {
      data: {
        name: '',
        email: '',
        subject: '',
        message: '',
        ...props.initialData
      },
      errors: {},
      isSubmitting: false,
      isSubmitted: false
    };

    // ✅ DO: Bind methods once
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  // ✅ DO: Extract validation logic into separate methods
  private validateField = (name: keyof ContactFormData, value: string): string | null => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 100) return 'Name must be less than 100 characters';
        return null;

      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return null;

      default:
        return null;
    }
  };

  // ✅ DO: Extract state update logic
  private handleInputChange = (field: keyof ContactFormData, value: string): void => {
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        [field]: value
      },
      errors: {
        ...prevState.errors,
        [field]: this.validateField(field, value)
      }
    }));
  };

  render(): ReactNode {
    if (this.state.isSubmitted) {
      return this.renderSuccessMessage();
    }

    return this.renderForm();
  }

  // ✅ DO: Extract render helpers
  private renderSuccessMessage = (): ReactNode => (
    <Container className="success-message">
      <Text variant="success">Thank you for your message! We'll get back to you soon.</Text>
      <Button onClick={this.handleReset}>Send Another Message</Button>
    </Container>
  );

  private renderForm = (): ReactNode => {
    const { data, errors, isSubmitting } = this.state;

    return (
      <Container className="contact-form-container">
        <h2>Contact Us</h2>
        <form onSubmit={this.handleSubmit} className="contact-form">
          <div className="form-field">
            <label htmlFor="name">Name *</label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => this.handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email *</label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => this.handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={this.handleReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </Container>
    );
  }
}

export default ContactForm;
```

### **Example 3: PureComponent with Performance Optimization**

```typescript
import React, { PureComponent, ReactNode } from 'react';
import { Container, Button, Text } from '@/shared/ui/components';

interface IUserListItemProps {
  user: User;
  onSelect: (userId: string) => void;
  isSelected: boolean;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

/**
 * User list item component demonstrating PureComponent optimization
 */
class UserListItem extends PureComponent<IUserListItemProps> {
  // ✅ DO: Use PureComponent for performance
  // No shouldComponentUpdate needed - PureComponent handles shallow comparison

  // ✅ DO: Extract click handler to avoid anonymous functions
  private handleClick = (): void => {
    this.props.onSelect(this.props.user.id);
  };

  // ✅ DO: Extract status class calculation
  private getStatusClass = (): string => {
    return `status status--${this.props.user.status}`;
  };

  render(): ReactNode {
    const { user, isSelected } = this.props;

    return (
      <li 
        className={`user-list-item ${isSelected ? 'selected' : ''}`}
        onClick={this.handleClick}
      >
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">{user.name.charAt(0)}</div>
          )}
        </div>
        
        <div className="user-info">
          <h4 className="user-name">{user.name}</h4>
          <p className="user-email">{user.email}</p>
          <span className={this.getStatusClass()}>
            {user.status}
          </span>
        </div>
      </li>
    );
  }
}

interface IUserListProps {
  users: User[];
  selectedUserId?: string;
  onSelectUser: (userId: string) => void;
}

/**
 * User list component demonstrating composition and immutable updates
 */
class UserList extends Component<IUserListProps> {
  // ✅ DO: Extract selection logic
  private handleUserSelect = (userId: string): void => {
    this.props.onSelectUser(userId);
  };

  render(): ReactNode {
    const { users, selectedUserId } = this.props;
    
    return (
      <Container className="user-list">
        <h3>Users ({users.length})</h3>
        <ul className="user-list-items">
          {users.map(user => (
            <UserListItem
              key={user.id}
              user={user}
              isSelected={user.id === selectedUserId}
              onSelect={this.handleUserSelect}
            />
          ))}
        </ul>
      </Container>
    );
  }
}

export { UserList };
export default UserList;
```

---

## 🔄 Complex State Management

### **Example 3: Multi-Tab Dashboard Component**

```typescript
import React, { Component, ReactNode } from 'react';
import { Container, Button, Text } from '@/shared/ui/components';

interface IDashboardProps {
  userId: string;
  refreshInterval?: number;
}

interface IDashboardState {
  // Data state
  data: {
    overview: AsyncState<DashboardOverview>;
    analytics: AsyncState<AnalyticsData>;
    reports: AsyncState<ReportData[]>;
  };
  
  // UI state
  ui: {
    activeTab: 'overview' | 'analytics' | 'reports';
    dateRange: DateRange;
    filters: FilterOptions;
  };
  
  // Performance state
  performance: {
    lastRefresh: number;
    autoRefreshEnabled: boolean;
    refreshCount: number;
  };
}

/**
 * Complex dashboard component demonstrating advanced state management
 */
class Dashboard extends Component<IDashboardProps, IDashboardState> {
  private refreshTimer: number | null = null;
  private dataCache = new Map<string, any>();

  constructor(props: IDashboardProps) {
    super(props);
    
    this.state = {
      data: {
        overview: { data: null, isLoading: true, error: null },
        analytics: { data: null, isLoading: true, error: null },
        reports: { data: null, isLoading: true, error: null }
      },
      ui: {
        activeTab: 'overview',
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        filters: {}
      },
      performance: {
        lastRefresh: Date.now(),
        autoRefreshEnabled: true,
        refreshCount: 0
      }
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount(): void {
    this.loadAllData();
    this.setupAutoRefresh();
  }

  componentDidUpdate(prevProps: IDashboardProps, prevState: IDashboardState): void {
    if (prevProps.userId !== this.props.userId) {
      this.loadAllData();
    }

    if (prevState.ui.activeTab !== this.state.ui.activeTab) {
      this.loadTabData(this.state.ui.activeTab);
    }
  }

  componentWillUnmount(): void {
    this.cleanupAutoRefresh();
  }

  private async loadAllData(): Promise<void> {
    const promises = [
      this.loadOverviewData(),
      this.loadAnalyticsData(),
      this.loadReportsData()
    ];

    await Promise.allSettled(promises);
    this.updateLastRefresh();
  }

  private async loadOverviewData(): Promise<void> {
    try {
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          overview: { ...prevState.data.overview, isLoading: true, error: null }
        }
      }));

      const overviewData = await this.dashboardService.getOverview({
        userId: this.props.userId,
        dateRange: this.state.ui.dateRange
      });
      
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          overview: { data: overviewData, isLoading: false, error: null }
        }
      }));
    } catch (error) {
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          overview: { ...prevState.data.overview, isLoading: false, error: error.message }
        }
      }));
    }
  }

  private setupAutoRefresh(): void {
    if (this.props.refreshInterval && this.state.performance.autoRefreshEnabled) {
      this.refreshTimer = window.setInterval(() => {
        this.refreshData();
      }, this.props.refreshInterval);
    }
  }

  private cleanupAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private updateLastRefresh(): void {
    this.setState(prevState => ({
      performance: {
        ...prevState.performance,
        lastRefresh: Date.now(),
        refreshCount: prevState.performance.refreshCount + 1
      }
    }));
  }

  private handleTabChange(tab: IDashboardState['ui']['activeTab']): void {
    this.setState(prevState => ({
      ui: { ...prevState.ui, activeTab: tab }
    }));
  }

  private async refreshData(): Promise<void> {
    await this.loadTabData(this.state.ui.activeTab);
    this.updateLastRefresh();
  }

  private renderTabContent(): ReactNode {
    const { activeTab } = this.state.ui;
    const { data } = this.state;

    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={data.overview} />;
      case 'analytics':
        return <AnalyticsTab data={data.analytics} />;
      case 'reports':
        return <ReportsTab data={data.reports} />;
      default:
        return null;
    }
  }

  render(): ReactNode {
    return (
      <Container className="dashboard">
        <div className="dashboard-layout">
          <nav className="dashboard-nav">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'reports', label: 'Reports' }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={this.state.ui.activeTab === tab.id ? 'primary' : 'ghost'}
                onClick={() => this.handleTabChange(tab.id as any)}
              >
                {tab.label}
              </Button>
            ))}
          </nav>

          <main className="dashboard-content">
            {this.renderTabContent()}
          </main>

          <footer className="dashboard-footer">
            <Text variant="caption">
              Last refresh: {new Date(this.state.performance.lastRefresh).toLocaleTimeString()}
            </Text>
            <Button onClick={this.refreshData} variant="secondary" size="sm">
              Refresh
            </Button>
          </footer>
        </div>
      </Container>
    );
  }
}

export default Dashboard;
```

---

## 🔄 Real-time Components

### **Example 4: WebSocket Chat Component**

```typescript
import React, { Component, ReactNode } from 'react';
import { Container, Button, Input, Text } from '@/shared/ui/components';

interface IChatComponentProps {
  userId: string;
  websocketUrl: string;
  chatId: string;
}

interface IChatComponentState {
  connection: {
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    reconnectAttempts: number;
  };
  
  messages: AsyncState<Message[]>;
  ui: {
    messageText: string;
    isTyping: boolean;
    typingUsers: string[];
  };
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'system';
}

/**
 * Real-time chat component demonstrating WebSocket integration
 */
class ChatComponent extends Component<IChatComponentProps, IChatComponentState> {
  private websocket: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private typingTimer: number | null = null;

  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private typingTimeout = 3000;

  constructor(props: IChatComponentProps) {
    super(props);
    
    this.state = {
      connection: {
        isConnected: false,
        isConnecting: false,
        error: null,
        reconnectAttempts: 0
      },
      messages: { data: [], isLoading: true, error: null },
      ui: {
        messageText: '',
        isTyping: false,
        typingUsers: []
      }
    };

    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount(): void {
    this.connectWebSocket();
  }

  componentWillUnmount(): void {
    this.cleanup();
  }

  private connectWebSocket(): void {
    this.cleanup();
    this.setState({ 
      connection: { 
        ...this.state.connection, 
        isConnecting: true, 
        error: null 
      }
    });

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
        connection: {
          ...this.state.connection,
          isConnected: true,
          isConnecting: false,
          reconnectAttempts: 0
        }
      });

      this.sendWebSocketMessage({
        type: 'join_chat',
        data: { userId: this.props.userId, chatId: this.props.chatId }
      });

      this.loadInitialData();
    };

    this.websocket.onclose = () => {
      this.setState({
        connection: {
          ...this.state.connection,
          isConnected: false,
          isConnecting: false
        }
      });

      this.attemptReconnection();
    };

    this.websocket.onerror = (error) => {
      this.handleConnectionError(error);
    };

    this.websocket.onmessage = (event) => {
      this.handleWebSocketMessage(event);
    };
  }

  private handleWebSocketMessage = (event: MessageEvent): void => {
    try {
      const message = JSON.parse(event.data);
      this.processWebSocketMessage(message);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  private processWebSocketMessage = (message: any): void => {
    switch (message.type) {
      case 'chat_history':
        this.setState({
          messages: {
            data: message.data.messages,
            isLoading: false,
            error: null
          }
        });
        break;

      case 'new_message':
        this.addMessage(message.data);
        break;

      case 'user_typing':
        this.handleUserTyping(message.data);
        break;

      case 'error':
        this.setState({
          connection: {
            ...this.state.connection,
            error: message.data.message
          }
        });
        break;
    }
  };

  private sendWebSocketMessage = (message: any): void => {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
    }
  };

  private addMessage = (message: Message): void => {
    this.setState(prevState => ({
      messages: {
        ...prevState.messages,
        data: [...(prevState.messages.data || []), message]
      }
    }));
  };

  private handleUserTyping = (data: { userId: string; userName: string; isTyping: boolean }): void => {
    this.setState(prevState => {
      const typingUsers = prevState.ui.typingUsers.filter(id => id !== data.userId);
      
      if (data.isTyping && data.userId !== this.props.userId) {
        typingUsers.push(data.userId);
      }

      return {
        ui: {
          ...prevState.ui,
          typingUsers
        }
      };
    });
  };

  private handleConnectionError = (error: any): void => {
    this.setState({
      connection: {
        ...this.state.connection,
        isConnecting: false,
        error: error.message || 'Connection failed'
      }
    });
  };

  private attemptReconnection = (): void => {
    if (this.state.connection.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setState({
        connection: {
          ...this.state.connection,
          error: 'Max reconnection attempts reached'
        }
      });
      return;
    }

    this.reconnectTimer = window.setTimeout(() => {
      this.setState(prevState => ({
        connection: {
          ...prevState.connection,
          reconnectAttempts: prevState.connection.reconnectAttempts + 1
        }
      }));
      this.connectWebSocket();
    }, this.reconnectDelay * this.state.connection.reconnectAttempts);
  }

  private async loadInitialData(): Promise<void> {
    this.sendWebSocketMessage({
      type: 'get_chat_history',
      data: { chatId: this.props.chatId, limit: 50 }
    });
  }

  private handleInputChange = (value: string): void => {
    this.setState(prevState => ({
      ui: {
        ...prevState.ui,
        messageText: value
      }
    }));

    if (!this.state.ui.isTyping && value.length > 0) {
      this.sendWebSocketMessage({
        type: 'typing',
        data: { userId: this.props.userId, isTyping: true }
      });

      this.setState(prevState => ({
        ui: {
          ...prevState.ui,
          isTyping: true
        }
      }));

      this.setTypingTimeout();
    }
  };

  private setTypingTimeout = (): void => {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    this.typingTimer = window.setTimeout(() => {
      this.sendWebSocketMessage({
        type: 'typing',
        data: { userId: this.props.userId, isTyping: false }
      });

      this.setState(prevState => ({
        ui: {
          ...prevState.ui,
          isTyping: false
        }
      }));
    }, this.typingTimeout);
  };

  private handleSendMessage = (): void => {
    const { messageText } = this.state.ui;

    if (!messageText.trim() || !this.state.connection.isConnected) {
      return;
    }

    const message: Partial<Message> = {
      userId: this.props.userId,
      content: messageText.trim(),
      timestamp: Date.now(),
      type: 'text'
    };

    this.sendWebSocketMessage({
      type: 'send_message',
      data: message
    });

    this.setState(prevState => ({
      ui: {
        ...prevState.ui,
        messageText: '',
        isTyping: false
      }
    }));
  };

  private cleanup(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  private renderConnectionStatus(): ReactNode {
    const { connection } = this.state;

    if (connection.isConnecting) {
      return <Text variant="caption">Connecting...</Text>;
    }

    if (connection.error) {
      return (
        <div>
          <Text variant="error">Connection Error: {connection.error}</Text>
          <Button onClick={() => this.connectWebSocket()} size="sm">
            Reconnect
          </Button>
        </div>
      );
    }

    return (
      <Text variant="caption" style={{ color: connection.isConnected ? 'green' : 'red' }}>
        {connection.isConnected ? 'Connected' : 'Disconnected'}
      </Text>
    );
  }

  private renderTypingIndicator(): ReactNode {
    const { typingUsers } = this.state.ui;

    if (typingUsers.length === 0) {
      return null;
    }

    return (
      <Text variant="caption" className="typing-indicator">
        {typingUsers.length === 1 
          ? `${typingUsers[0]} is typing...`
          : `${typingUsers.length} people are typing...`
        }
      </Text>
    );
  }

  render(): ReactNode {
    const { messages, ui, connection } = this.state;

    return (
      <Container className="chat-component">
        <header className="chat-header">
          <h3>Chat Room</h3>
          {this.renderConnectionStatus()}
        </header>

        <div className="chat-messages">
          {messages.isLoading ? (
            <Text>Loading messages...</Text>
          ) : messages.error ? (
            <Text variant="error">Error: {messages.error}</Text>
          ) : (
            messages.data?.map(message => (
              <div key={message.id} className={`message ${message.type}`}>
                <strong>{message.userName}:</strong> {message.content}
                <Text variant="caption">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Text>
              </div>
            ))
          )}
        </div>

        {this.renderTypingIndicator()}

        <div className="chat-input">
          <Input
            value={ui.messageText}
            onChange={(e) => this.handleInputChange(e.target.value)}
            placeholder="Type a message..."
            disabled={!connection.isConnected}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
              }
            }}
          />
          
          <Button
            onClick={this.handleSendMessage}
            disabled={!ui.messageText.trim() || !connection.isConnected}
          >
            Send
          </Button>
        </div>
      </Container>
    );
  }
}

export default ChatComponent;
```

---

## 🛡️ Error Boundary Components

### **Example 5: Comprehensive Error Boundary**

```typescript
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Container, Button, Text } from '@/shared/ui/components';

interface IErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<{ error: Error | null; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  showRetry?: boolean;
  componentName?: string;
}

interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  errorHistory: Array<{
    error: Error;
    errorInfo: ErrorInfo;
    timestamp: number;
  }>;
}

/**
 * Comprehensive error boundary component
 */
class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorHistory: []
    };
  }

  static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorEntry = {
      error,
      errorInfo,
      timestamp: Date.now()
    };

    this.setState(prevState => ({
      errorInfo,
      errorHistory: [...prevState.errorHistory.slice(-4), errorEntry]
    }));

    // Log to error service
    this.props.onError?.(error, errorInfo);

    // Console logging in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component:', this.props.componentName);
      console.groupEnd();
    }
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

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorHistory: []
    });
  };

  private renderDefaultFallback(): ReactNode {
    const { error, errorInfo, retryCount } = this.state;
    const { maxRetries, showRetry, componentName } = this.props;

    return (
      <Container className="error-boundary-fallback">
        <div className="error-content">
          <h2>🚨 Something went wrong</h2>
          
          {componentName && (
            <Text variant="caption">Component: {componentName}</Text>
          )}
          
          {error && (
            <div className="error-details">
              <Text variant="error">{error.message}</Text>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="error-debug">
                  <summary>Error Details</summary>
                  <pre>{error.stack}</pre>
                  {errorInfo && (
                    <pre>Component Stack: {errorInfo.componentStack}</pre>
                  )}
                </details>
              )}
            </div>
          )}

          <div className="error-actions">
            {showRetry && retryCount < (maxRetries || 3) && (
              <Button onClick={this.handleRetry}>
                Try Again ({(maxRetries || 3) - retryCount} attempts left)
              </Button>
            )}
            
            <Button onClick={this.handleReset} variant="secondary">
              Reset Component
            </Button>
          </div>

          {retryCount >= (maxRetries || 3) && (
            <Text variant="caption" className="max-retries-message">
              Maximum retry attempts reached. Please refresh the page.
            </Text>
          )}
        </div>
      </Container>
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return (
          <FallbackComponent 
            error={this.state.error} 
            retry={this.handleRetry}
          />
        );
      }

      return this.renderDefaultFallback();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## ⚡ Performance-Optimized Components

### **Example 6: Virtualized List Component**

```typescript
import React, { Component, ReactNode } from 'react';
import { Container } from '@/shared/ui/components';

interface IVirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
}

interface IVirtualizedListState {
  scrollTop: number;
  containerWidth: number;
}

/**
 * Virtualized list component for performance optimization
 */
class VirtualizedList<T> extends Component<IVirtualizedListProps<T>, IVirtualizedListState> {
  private containerRef = React.createRef<HTMLDivElement>();

  constructor(props: IVirtualizedListProps<T>) {
    super(props);
    
    this.state = {
      scrollTop: 0,
      containerWidth: 0
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount(): void {
    this.updateContainerWidth();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.handleResize);
  }

  shouldComponentUpdate(nextProps: IVirtualizedListProps<T>, nextState: IVirtualizedListState): boolean {
    // Only re-render if props or scroll position changed
    return (
      nextProps.items !== this.props.items ||
      nextProps.itemHeight !== this.props.itemHeight ||
      nextProps.containerHeight !== this.props.containerHeight ||
      nextState.scrollTop !== this.state.scrollTop ||
      nextState.containerWidth !== this.state.containerWidth
    );
  }

  private handleScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    const scrollTop = event.currentTarget.scrollTop;
    this.setState({ scrollTop });
    this.props.onScroll?.(scrollTop);
  };

  private handleResize = (): void => {
    this.updateContainerWidth();
  };

  private updateContainerWidth = (): void => {
    if (this.containerRef.current) {
      this.setState({
        containerWidth: this.containerRef.current.clientWidth
      });
    }
  };

  private getVisibleRange = (): { start: number; end: number } => {
    const { scrollTop } = this.state;
    const { itemHeight, containerHeight, overscan = 5 } = this.props;

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      this.props.items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { start, end };
  };

  render(): ReactNode {
    const { items, itemHeight, containerHeight, renderItem } = this.props;
    const { scrollTop } = this.state;
    const { start, end } = this.getVisibleRange();

    const visibleItems = items.slice(start, end);

    return (
      <Container className="virtualized-list">
        <div
          ref={this.containerRef}
          style={{
            height: containerHeight,
            overflow: 'auto'
          }}
          onScroll={this.handleScroll}
        >
          <div
            style={{
              height: items.length * itemHeight,
              position: 'relative'
            }}
          >
            {visibleItems.map((item, index) => {
              const actualIndex = start + index;
              const top = actualIndex * itemHeight;

              return (
                <div
                  key={actualIndex}
                  style={{
                    position: 'absolute',
                    top,
                    left: 0,
                    right: 0,
                    height: itemHeight
                  }}
                >
                  {renderItem(item, actualIndex)}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    );
  }
}

export default VirtualizedList;
```

---

## 🚀 Large-Scale, Multi-Platform Enterprise Examples

### **Example 6: Enterprise Data Management Component**

This example demonstrates a complex data management component optimized for large-scale applications with multi-platform support (React Web + React Native).

```typescript
import React, { PureComponent, ReactNode } from 'react';
import debounce from 'lodash/debounce';
import { Container, Button, Input, LoadingSpinner } from '@/shared/ui/components';

// Enhanced interfaces for enterprise use
interface IEnterpriseDataGridProps<T> {
  data: T[];
  columns: IColumnConfig<T>[];
  onRowSelect?: (rows: T[]) => void;
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: IFilterConfig) => void;
  enableVirtualization?: boolean;
  pageSize?: number;
  className?: string;
  platform?: 'web' | 'native';
}

interface IEnterpriseDataGridState<T> {
  // Data state
  filteredData: T[];
  sortedData: T[];
  selectedRows: Set<string | number>;
  
  // UI state
  loading: boolean;
  error: string | null;
  currentPage: number;
  sortColumn?: keyof T;
  sortDirection: 'asc' | 'desc';
  filters: IFilterConfig;
  
  // Performance state
  renderMetrics: {
    renderTime: number;
    itemCount: number;
    lastUpdate: number;
  };
  
  // Virtualization state
  visibleRange: {
    start: number;
    end: number;
  };
}

interface IColumnConfig<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, row: T) => ReactNode;
}

interface IFilterConfig {
  [key: string]: {
    value: string;
    operator: 'contains' | 'equals' | 'startsWith';
  };
}

/**
 * Enterprise Data Grid Component
 * 
 * Features:
 * - Virtual scrolling for large datasets
 * - Multi-column sorting and filtering
 * - Row selection with bulk operations
 * - Performance monitoring
 * - Cross-platform compatibility
 * - Debounced search input
 * - Memory-efficient rendering
 */
class EnterpriseDataGrid<T extends { id: string | number }> extends 
  PureComponent<IEnterpriseDataGridProps<T>, IEnterpriseDataGridState<T>> {
  
  // Private properties for encapsulation
  #containerRef = React.createRef<HTMLDivElement>();
  #scrollListener: ((event: Event) => void) | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #performanceTimer: number | null = null;
  
  // Default props for consistency
  static defaultProps: Partial<IEnterpriseDataGridProps<any>> = {
    enableVirtualization: true,
    pageSize: 50,
    platform: 'web'
  };

  constructor(props: IEnterpriseDataGridProps<T>) {
    super(props);
    
    this.state = {
      filteredData: props.data,
      sortedData: props.data,
      selectedRows: new Set(),
      loading: false,
      error: null,
      currentPage: 1,
      sortDirection: 'asc',
      filters: {},
      renderMetrics: {
        renderTime: 0,
        itemCount: props.data.length,
        lastUpdate: Date.now()
      },
      visibleRange: { start: 0, end: props.pageSize || 50 }
    };

    // Debounced search for performance
    this.debouncedFilter = debounce(this.performFiltering.bind(this), 300);
    
    // Bind methods for performance
    this.handleSort = this.handleSort.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  // Performance monitoring
  componentDidMount(): void {
    this.startPerformanceMonitoring();
    this.setupEventListeners();
    
    // Initial data processing
    this.processData();
  }

  componentDidUpdate(prevProps: IEnterpriseDataGridProps<T>): void {
    if (prevProps.data !== this.props.data) {
      this.processData();
    }
    
    this.updateRenderMetrics();
  }

  componentWillUnmount(): void {
    this.cleanup();
  }

  // Private methods for internal logic
  private startPerformanceMonitoring(): void {
    this.#performanceTimer = window.requestAnimationFrame(() => {
      const startTime = performance.now();
      
      // Force re-render to measure
      this.forceUpdate(() => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        this.setState(prevState => ({
          renderMetrics: {
            ...prevState.renderMetrics,
            renderTime,
            lastUpdate: Date.now()
          }
        }));
      });
    });
  }

  private setupEventListeners(): void {
    if (this.props.enableVirtualization && this.#containerRef.current) {
      // Virtual scrolling
      this.#scrollListener = this.handleScroll.bind(this);
      this.#containerRef.current.addEventListener('scroll', this.#scrollListener);
      
      // Resize observer for responsive behavior
      this.#resizeObserver = new ResizeObserver(this.handleResize.bind(this));
      this.#resizeObserver.observe(this.#containerRef.current);
    }
  }

  private cleanup(): void {
    if (this.#performanceTimer) {
      window.cancelAnimationFrame(this.#performanceTimer);
    }
    
    if (this.#scrollListener && this.#containerRef.current) {
      this.#containerRef.current.removeEventListener('scroll', this.#scrollListener);
    }
    
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
    }
    
    // Cancel debounced calls
    this.debouncedFilter.cancel();
  }

  private processData(): void {
    const { data } = this.props;
    const { filters, sortColumn, sortDirection } = this.state;
    
    let processedData = [...data];
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      processedData = this.applyFilters(processedData, filters);
    }
    
    // Apply sorting
    if (sortColumn) {
      processedData = this.applySorting(processedData, sortColumn, sortDirection);
    }
    
    this.setState({
      filteredData: processedData,
      sortedData: processedData
    });
  }

  private applyFilters(data: T[], filters: IFilterConfig): T[] {
    return data.filter(row => {
      return Object.entries(filters).every(([key, filter]) => {
        const value = row[key];
        if (value == null) return false;
        
        const stringValue = String(value).toLowerCase();
        const filterValue = filter.value.toLowerCase();
        
        switch (filter.operator) {
          case 'contains':
            return stringValue.includes(filterValue);
          case 'equals':
            return stringValue === filterValue;
          case 'startsWith':
            return stringValue.startsWith(filterValue);
          default:
            return true;
        }
      });
    });
  }

  private applySorting(data: T[], column: keyof T, direction: 'asc' | 'desc'): T[] {
    return [...data].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      const comparison = String(aVal).localeCompare(String(bVal));
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  private updateRenderMetrics(): void {
    this.setState(prevState => ({
      renderMetrics: {
        ...prevState.renderMetrics,
        itemCount: this.props.data.length
      }
    }));
  }

  // Event handlers
  private handleSort(column: keyof T): void {
    const { sortColumn, sortDirection } = this.state;
    
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    
    this.setState({ sortColumn: column, sortDirection: newDirection }, () => {
      this.processData();
      this.props.onSort?.(column, newDirection);
    });
  }

  private handleRowSelect(rowId: string | number, selected: boolean): void {
    this.setState(prevState => {
      const newSelectedRows = new Set(prevState.selectedRows);
      
      if (selected) {
        newSelectedRows.add(rowId);
      } else {
        newSelectedRows.delete(rowId);
      }
      
      return { selectedRows: newSelectedRows };
    }, () => {
      const selectedData = this.props.data.filter(row => 
        this.state.selectedRows.has(row.id)
      );
      this.props.onRowSelect?.(selectedData);
    });
  }

  private handleScroll = (event: Event): void => {
    if (!this.props.enableVirtualization) return;
    
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const itemHeight = 50; // Fixed row height
    const containerHeight = target.clientHeight;
    const pageSize = this.props.pageSize || 50;
    
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + Math.ceil(containerHeight / itemHeight) + pageSize, this.state.sortedData.length);
    
    this.setState({ visibleRange: { start, end } });
  };

  private handleResize = (entries: ResizeObserverEntry[]): void => {
    // Handle container resize for responsive behavior
    if (this.props.enableVirtualization) {
      this.handleScroll({ target: this.#containerRef.current } as Event);
    }
  };

  private handleFilterChange = (column: keyof T, value: string, operator: 'contains' | 'equals' | 'startsWith'): void => {
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        [String(column)]: { value, operator }
      }
    }), () => {
      this.debouncedFilter();
    });
  };

  private performFiltering(): void {
    this.processData();
    this.props.onFilter?.(this.state.filters);
  };

  // Main render method
  render(): ReactNode {
    const { loading, error } = this.state;
    const { className, platform } = this.props;
    
    if (loading) return <div>Loading data...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
      <Container 
        className={`enterprise-datagrid ${className || ''}`}
        platform={platform}
      >
        <div className="datagrid-filters">
          {/* Filter inputs */}
        </div>
        <div className="datagrid-header">
          {/* Header cells */}
        </div>
        <div 
          ref={this.#containerRef}
          className="datagrid-container"
          style={{ height: '400px', overflow: 'auto' }}
        >
          <div className="datagrid-body">
            {/* Data rows */}
          </div>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="performance-metrics">
            <span>Render Time: {this.state.renderMetrics.renderTime.toFixed(2)}ms</span>
            <span>Items: {this.state.renderMetrics.itemCount}</span>
            <span>Selected: {this.state.selectedRows.size}</span>
          </div>
        )}
      </Container>
    );
  }
}

export default EnterpriseDataGrid;
```

### **Example 7: Advanced Error Boundary with Recovery**

This example demonstrates an enterprise-grade error boundary with automatic recovery, logging, and user-friendly error handling.

```typescript
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Container, Button, Text } from '@/shared/ui/components';

interface IAdvancedErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, context: string) => void;
  maxRetries?: number;
  retryDelay?: number;
  enableErrorReporting?: boolean;
  context?: string;
}

interface IAdvancedErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
  errorId: string;
}

/**
 * Advanced Error Boundary Component
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Error reporting and logging
 * - Context-aware error handling
 * - User-friendly error messages
 * - Performance monitoring
 * - Recovery strategies
 */
class AdvancedErrorBoundary extends Component<IAdvancedErrorBoundaryProps, IAdvancedErrorBoundaryState> {
  private retryTimeouts: Map<string, NodeJS.Timeout> = new Map();
  
  static defaultProps: Partial<IAdvancedErrorBoundaryProps> = {
    maxRetries: 3,
    retryDelay: 1000,
    enableErrorReporting: true,
    context: 'application'
  };

  constructor(props: IAdvancedErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
      errorId: this.generateErrorId()
    };
  }

  static getDerivedStateFromError(error: Error): Partial<IAdvancedErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: AdvancedErrorBoundary.prototype.generateErrorId()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Enhanced error reporting
    this.reportError(error, errorInfo);
    
    // Notify parent component
    this.props.onError?.(error, errorInfo, this.props.context || 'application');
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    if (!this.props.enableErrorReporting) return;
    
    const errorReport = {
      id: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: this.props.context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    };
    
    // Send to error reporting service
    console.error('Error reported:', errorReport);
    
    // In production, send to external service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorReport });
    }
  }

  private handleRetry = (): void => {
    const { maxRetries, retryDelay } = this.props;
    const { retryCount } = this.state;
    
    if (retryCount >= maxRetries!) {
      console.warn('Max retries reached');
      return;
    }
    
    this.setState({ isRetrying: true });
    
    // Exponential backoff
    const delay = retryDelay! * Math.pow(2, retryCount);
    
    const timeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
        isRetrying: false,
        errorId: this.generateErrorId()
      });
      
      this.retryTimeouts.delete(this.state.errorId);
    }, delay);
    
    this.retryTimeouts.set(this.state.errorId, timeoutId);
  };

  private handleReset = (): void => {
    // Clear all pending retries
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
      errorId: this.generateErrorId()
    });
  };

  componentWillUnmount(): void {
    // Cleanup pending retries
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private getErrorMessage(): string {
    const { error } = this.state;
    const { context } = this.props;
    
    if (!error) return 'An unknown error occurred';
    
    // Context-aware error messages
    const contextMessages = {
      'authentication': 'There was a problem signing you in. Please try again.',
      'data-loading': 'Unable to load data. Please check your connection and try again.',
      'form': 'There was a problem submitting your form. Please check your input and try again.',
      'navigation': 'Navigation error. Please refresh the page.',
      'application': 'Something went wrong. We\'re working to fix it.'
    };
    
    return contextMessages[context as keyof typeof contextMessages] || contextMessages.application;
  }

  private canRetry(): boolean {
    const { maxRetries } = this.props;
    const { retryCount } = this.state;
    
    return retryCount < maxRetries!;
  }

  private renderDefaultFallback(): ReactNode {
    const { isRetrying, retryCount, error } = this.state;
    const { maxRetries } = this.props;
    
    return (
      <Container className="error-boundary-fallback">
        <div className="error-icon">⚠️</div>
        
        <Text variant="h3" className="error-title">
          Oops! Something went wrong
        </Text>
        
        <Text className="error-message">
          {this.getErrorMessage()}
        </Text>
        
        {error && process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary>Error Details (Development Only)</summary>
            <pre>{error.stack}</pre>
          </details>
        )}
        
        <div className="error-actions">
          {this.canRetry() && (
            <Button
              onClick={this.handleRetry}
              disabled={isRetrying}
              variant="primary"
            >
              {isRetrying ? 'Retrying...' : `Retry (${retryCount}/${maxRetries})`}
            </Button>
          )}
          
          <Button
            onClick={this.handleReset}
            variant="outline"
          >
            Start Over
          </Button>
        </div>
        
        {retryCount >= maxRetries! && (
          <Text className="error-help">
            If the problem persists, please contact support or refresh the page.
          </Text>
        )}
      </Container>
    );
  }

  render(): ReactNode {
    const { hasError, isRetrying } = this.state;
    const { children, fallback } = this.props;
    
    if (hasError) {
      if (isRetrying) {
        return (
          <Container className="error-boundary-retrying">
            <div className="retry-spinner" />
            <Text>Attempting to recover...</Text>
          </Container>
        );
      }
      
      return fallback || this.renderDefaultFallback();
    }
    
    return children;
  }
}

export default AdvancedErrorBoundary;
```

---

## 📋 Summary of Enterprise Patterns

### **Key Benefits Demonstrated:**

1. **Performance Optimization**
   - PureComponent for shallow comparison
   - Virtual scrolling for large datasets
   - Debounced inputs and operations
   - Memory-efficient rendering patterns

2. **Cross-Platform Compatibility**
   - Platform-specific component rendering
   - Unified API across Web and Native
   - Theme integration across platforms
   - Responsive design patterns

3. **Enterprise Error Handling**
   - Advanced error boundaries
   - Automatic recovery mechanisms
   - Context-aware error messages
   - Comprehensive error reporting

4. **Scalability Features**
   - Component composition patterns
   - Service layer integration
   - Performance monitoring
   - Memory management

5. **Developer Experience**
   - TypeScript interfaces
   - Comprehensive documentation
   - Clear separation of concerns
   - Reusable patterns

These examples demonstrate how class-based components can handle complex enterprise scenarios while maintaining clean, maintainable, and performant code structures.

---

*Examples Version: 1.0*  
*Last Updated: January 29, 2026*  
*Next Review: February 29, 2026*
