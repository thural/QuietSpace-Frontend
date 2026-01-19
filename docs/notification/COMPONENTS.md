# Notification Feature Components Documentation

## 🎨 NotificationCenter Component

### Overview
The main notification component that provides comprehensive notification management with filtering, simulation, and real-time updates.

### Props
```typescript
interface NotificationCenterProps {
  userId: string;                    // Required: User ID for notifications
  className?: string;                  // Optional: CSS class name
  maxNotifications?: number;              // Optional: Maximum notifications to display
  showBadge?: boolean;                   // Optional: Show unread count badge
  enableSimulation?: boolean;              // Optional: Enable notification simulation
  onNotificationClick?: (notification: NotificationResponse) => void;  // Optional: Click handler
  onMarkAsRead?: (notificationId: ResId) => void;           // Optional: Mark as read handler
  onDelete?: (notificationId: ResId) => void;                // Optional: Delete handler
}
```

### Features

#### **🔔 Notification Display**
- **Priority-based styling** - Different colors for urgent, high, medium, low priority
- **Read/unread states** - Visual distinction between read and unread notifications
- **Timestamp formatting** - Human-readable relative time display
- **Action buttons** - Mark as read, delete, mark all as read

#### **🔍 Filtering & Search**
- **Status filter** - All, Unread, Read
- **Type filter** - Message, Follow, Like, Comment, Mention, System
- **Search functionality** - Search by content or ID
- **Real-time filtering** - Instant updates without refresh

#### **⚡ Simulation System**
- **Type-based simulation** - Generate different notification types
- **Batch simulation** - Create multiple notifications at once
- **Realistic data** - Proper timestamps, IDs, and metadata
- **Immediate UI updates** - Instant feedback on simulation

#### **🎨 Professional Styling**
- **Modern design** - Clean, minimalist interface
- **Responsive layout** - Works on desktop and mobile
- **Smooth animations** - Subtle transitions and micro-interactions
- **Accessibility support** - Proper ARIA labels and keyboard navigation

### Usage Examples

#### **Basic Usage**
```typescript
import { NotificationCenter } from '@notification/presentation/components/NotificationCenter';

const App = () => {
  return (
    <NotificationCenter 
      userId="user-123"
      showBadge={true}
      enableSimulation={true}
    />
  );
};
```

#### **Advanced Usage with Event Handlers**
```typescript
const App = () => {
  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Navigate to related content
  };
  
  const handleMarkAsRead = async (notificationId) => {
    await markNotificationAsRead(notificationId);
    // Update UI state
  };
  
  const handleDelete = async (notificationId) => {
    await deleteNotification(notificationId);
    // Show confirmation toast
  };
  
  return (
    <NotificationCenter 
      userId="user-123"
      onNotificationClick={handleNotificationClick}
      onMarkAsRead={handleMarkAsRead}
      onDelete={handleDelete}
    />
  );
};
```

#### **Custom Styling**
```typescript
const App = () => {
  return (
    <NotificationCenter 
      userId="user-123"
      className="custom-notification-center"
      maxNotifications={5}
    />
  );
};

// CSS
.custom-notification-center {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### Implementation Variants

#### **Simple Hook Integration**
```typescript
import { NotificationCenter } from '@notification/presentation/components/NotificationCenter';
import { useNotifications } from '@notification/application/hooks/useNotifications';

const NotificationWrapper = () => {
  const { notifications, markAsRead } = useNotifications('user-123');
  
  return (
    <NotificationCenter 
      userId="user-123"
      notifications={notifications}
      onMarkAsRead={markAsRead}
    />
  );
};
```

#### **Advanced Hook Integration**
```typescript
import { useAdvancedNotifications } from '@notification/application/hooks/useAdvancedNotifications';

const AdvancedNotificationWrapper = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    optimisticUpdates,
    connectionStatus 
  } = useAdvancedNotifications('user-123');
  
  return (
    <div>
      <ConnectionIndicator status={connectionStatus} />
      <NotificationCenter 
        userId="user-123"
        notifications={notifications}
        onMarkAsRead={markAsRead}
      />
      <OptimisticUpdateIndicator updates={optimisticUpdates} />
    </div>
  );
};
```

#### **React Query Integration**
```typescript
import { useReactQueryNotifications } from '@notification/application/hooks/useReactQueryNotifications';

const QueryNotificationWrapper = () => {
  const { 
    notifications, 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useReactQueryNotifications('user-123');
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <RefreshButton onClick={refetch} isLoading={isFetching} />
      <NotificationCenter 
        userId="user-123"
        notifications={notifications}
      />
    </div>
  );
};
```

### Styling System

#### **CSS-in-JS Structure**
```typescript
export const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxWidth: '400px',
    maxHeight: '600px',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  // ... comprehensive styling system
} as const;
```

#### **Priority Colors**
- **Urgent**: `#dc3545` (Red)
- **High**: `#fd7e14` (Orange)  
- **Medium**: `#ffc107` (Yellow)
- **Low**: `#28a745` (Blue)
- **System**: `#6c757d` (Gray)

### Accessibility Features

#### **ARIA Support**
- `aria-label` for notification actions
- `aria-live` region for dynamic updates
- `role="status"` for notification status
- Keyboard navigation support

#### **Screen Reader Support**
- Semantic HTML structure
- Descriptive button labels
- Status announcements for new notifications
- Focus management for modal interactions

### Performance Optimizations

#### **Virtual Scrolling** (Future Enhancement)
- Large notification lists (>100 items)
- Windowed rendering for smooth scrolling
- Dynamic item height calculation

#### **Memoization**
- Component memoization for props
- Expensive calculations cached
- Optimized re-render cycles

#### **Lazy Loading**
- Incremental loading for large datasets
- Progressive enhancement
- Skeleton loading states

### Testing

#### **Unit Tests**
```typescript
describe('NotificationCenter', () => {
  it('should render empty state', () => {
    render(<NotificationCenter userId="test" />);
    expect(screen.getByText('📭 No notifications found')).toBeInTheDocument();
  });
  
  it('should render notifications', async () => {
    const mockNotifications = createMockNotifications();
    render(<NotificationCenter userId="test" notifications={mockNotifications} />);
    expect(screen.getAllByTestId('notification-item')).toHaveLength(mockNotifications.length);
  });
});
```

#### **Integration Tests**
```typescript
describe('NotificationCenter Integration', () => {
  it('should integrate with useNotifications hook', async () => {
    const { result } = renderHook(() => useNotifications('test-user'));
    
    await act(async () => {
      result.current.fetchNotifications();
    });
    
    expect(result.current.notifications).toBeDefined();
  });
});
```

### Migration Guide

#### **From Legacy System**
```typescript
// Old way
import { LegacyNotificationCenter } from 'legacy-notifications';

// New way
import { NotificationCenter } from '@notification/presentation/components/NotificationCenter';

// Migration steps:
// 1. Update import paths
// 2. Update prop interfaces  
// 3. Update event handlers
// 4. Test functionality
```

## 📚 Related Components

- **NotificationItem** - Individual notification display
- **NotificationBadge** - Unread count indicator
- **NotificationFilter** - Filter controls
- **NotificationSimulator** - Simulation controls
- **ConnectionIndicator** - Real-time status

## 🔧 Customization

### Theming
```typescript
// Custom theme support
const customTheme = {
  primary: '#your-brand-color',
  background: '#your-background',
  text: '#your-text-color'
};

<NotificationCenter 
  userId="user-123"
  theme={customTheme}
/>
```

### Extensions
```typescript
// Custom notification types
interface CustomNotification extends NotificationResponse {
  customField: string;
  customAction: () => void;
}

// Custom actions
const customActions = {
  onCustomAction: (notification) => console.log('Custom action:', notification)
};

<NotificationCenter 
  userId="user-123"
  customActions={customActions}
/>
```
