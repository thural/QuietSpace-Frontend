# Notification Feature API Documentation

## 📋 Repository Interfaces

### INotificationRepository
```typescript
interface INotificationRepository {
  // Core operations
  getNotifications(query: NotificationQuery, token: JwtToken): Promise<NotificationPage>;
  getNotificationsByType(type: NotificationType, query: NotificationQuery, token: JwtToken): Promise<NotificationPage>;
  getNotificationById(id: ResId, token: JwtToken): Promise<NotificationResponse | null>;
  getPendingNotificationsCount(userId: string, token: JwtToken): Promise<number>;
  
  // Notification actions
  markNotificationAsSeen(notificationId: ResId, token: JwtToken): Promise<NotificationResponse>;
  markMultipleNotificationsAsSeen(notificationIds: ResId[], token: JwtToken): Promise<NotificationResponse[]>;
  deleteNotification(notificationId: ResId, token: JwtToken): Promise<void>;
  
  // Search functionality
  searchNotifications(searchQuery: string, query: NotificationQuery, token: JwtToken): Promise<NotificationPage>;
}
```

### NotificationRepositoryDI (DI Implementation)
```typescript
@Injectable({ lifetime: 'singleton' })
export class NotificationRepositoryDI implements INotificationRepository {
  // In-memory implementation with full API integration
  // Supports optimistic updates and caching
}
```

### MockNotificationRepository (Testing Implementation)
```typescript
export class MockNotificationRepository implements INotificationRepository {
  // Mock data for testing and UI development
  // Simulates API responses with realistic data
}
```

## 📋 Service Interfaces

### NotificationServiceDI
```typescript
export class NotificationServiceDI {
  // Business logic for notification management
  // Integrates with repository for data operations
  // Supports preferences, analytics, and simulation
}
```

## 📋 Hook Interfaces

### useNotifications (Simple Implementation)
```typescript
export interface NotificationState {
  notifications: NotificationPage | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export interface NotificationActions {
  fetchNotifications: (userId: string, query?: Partial<NotificationQuery>) => Promise<void>;
  fetchNotificationsByType: (type: NotificationType, userId: string, query?: Partial<NotificationQuery>) => Promise<void>;
  fetchUnreadCount: (userId: string) => Promise<void>;
  markAsRead: (notificationId: ResId) => Promise<void>;
  markAllAsRead: (notificationIds: ResId[]) => Promise<void>;
  deleteNotification: (notificationId: ResId) => Promise<void>;
  refresh: () => Promise<void>;
}
```

### useAdvancedNotifications (Enhanced Implementation)
```typescript
// Includes:
// - Zustand state management
// - Real-time WebSocket updates  
// - Optimistic updates with rollback
// - State synchronization and conflict resolution
```

### useReactQueryNotifications (React Query Implementation)
```typescript
// Includes:
// - React Query caching and synchronization
// - Server state management
// - Background refetching
// - Optimistic updates
```

## 📋 Component Interfaces

### NotificationCenter
```typescript
export interface NotificationCenterProps {
  userId: string;
  className?: string;
  maxNotifications?: number;
  showBadge?: boolean;
  enableSimulation?: boolean;
  onNotificationClick?: (notification: NotificationResponse) => void;
  onMarkAsRead?: (notificationId: ResId) => void;
  onDelete?: (notificationId: ResId) => void;
}
```

## 📋 Type Definitions

### NotificationEntity
```typescript
export interface NotificationEntity {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}
```

### NotificationQuery
```typescript
export interface NotificationQuery {
  userId?: string;
  type?: NotificationType;
  page?: number;
  size?: number;
  isSeen?: boolean;
  search?: string;
}
```

## 🔄 Usage Examples

### Basic Usage
```typescript
import { useNotifications } from '@notification/application/hooks/useNotifications';

const MyComponent = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications('user-123');
  
  return (
    <div>
      <h1>Notifications ({unreadCount})</h1>
      {notifications?.content.map(notification => (
        <div key={notification.id}>
          {notification.title}
          <button onClick={() => markAsRead(notification.id)}>
            Mark as Read
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Advanced Usage with DI
```typescript
import { useNotificationDI } from '@notification/di/useNotificationDI';

const MyComponent = () => {
  const { repository, service } = useNotificationDI({
    overrideConfig: {
      useMockRepositories: process.env.NODE_ENV === 'test',
      enableLogging: true
    }
  });
  
  // Use repository and service based on configuration
};
```

### React Query Usage
```typescript
import { useReactQueryNotifications } from '@notification/application/hooks/useReactQueryNotifications';

const MyComponent = () => {
  const { notifications, isLoading, error, refetch } = useReactQueryNotifications('user-123');
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {/* Render notifications */}
    </div>
  );
};
```

## 🧪 Testing

### Mock Repository Usage
```typescript
import { MockNotificationRepository } from '@notification/data/repositories/MockNotificationRepository';

// For testing
const mockRepo = new MockNotificationRepository();
const notifications = await mockRepo.getNotifications(query, token);
```

### Integration Testing
```typescript
import { render, screen } from '@testing-library/react';
import { NotificationCenter } from '@notification/presentation/components/NotificationCenter';

describe('NotificationCenter', () => {
  it('should render notifications', () => {
    render(<NotificationCenter userId="test-user" />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });
});
```

## 📚 Related Documentation

- [Development Guidelines](../DEVELOPMENT_GUIDELINES.md)
- [Import Aliases Guide](../IMPORT_ALIAS_GUIDE.md)
- [Architecture Overview](../ARCHITECTURE_OVERVIEW.md)
