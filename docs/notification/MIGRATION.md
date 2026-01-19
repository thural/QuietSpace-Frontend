# Notification Feature Migration Guide

## 📋 Migration Overview

This guide helps migrate from legacy notification systems to the new enhanced notification feature.

## 🔄 Migration Paths

### **From Legacy Notifications (plural) → New Notification (singular)**
```typescript
// ❌ Old way (deprecated)
import { NotificationsService } from '@features/notifications/application/services/NotificationsService';
import { NotificationCenter } from '@features/notifications/presentation/components/NotificationCenter';

// ✅ New way (current)
import { NotificationServiceDI } from '@notification/application/services/NotificationServiceDI';
import { NotificationCenter } from '@notification/presentation/components/NotificationCenter';
```

### **From Basic Hooks → Enhanced DI Hooks**
```typescript
// ❌ Basic implementation
import { useBasicNotifications } from './useBasicNotifications';

// ✅ Enhanced implementation
import { useAdvancedNotifications } from '@notification/application/hooks/useAdvancedNotifications';
```

### **From Direct API → Repository Pattern**
```typescript
// ❌ Direct API calls
import { fetchNotifications } from '@api/requests/notificationRequests';

// ✅ Repository pattern
import { useNotificationDI } from '@notification/di/useNotificationDI';
const { repository } = useNotificationDI();
await repository.getNotifications(query, token);
```

## 🎯 Step-by-Step Migration

### **Step 1: Update Imports**
```typescript
// Update all notification imports
// From:
import { Something } from '@features/notifications/...';

// To:
import { Something } from '@notification/...';
```

### **Step 2: Update Hook Usage**
```typescript
// From basic hook:
const { notifications, loading } = useBasicNotifications(userId);

// To enhanced hook:
const { 
  notifications, 
  loading, 
  unreadCount,
  markAsRead,
  optimisticUpdates,
  connectionStatus 
} = useAdvancedNotifications(userId);
```

### **Step 3: Update Component Props**
```typescript
// Old component props:
interface OldNotificationProps {
  notifications: Notification[];
  onAction: (action: string) => void;
}

// New component props:
interface NewNotificationProps {
  userId: string;
  className?: string;
  onNotificationClick?: (notification: NotificationResponse) => void;
  onMarkAsRead?: (notificationId: ResId) => void;
  onDelete?: (notificationId: ResId) => void;
}
```

### **Step 4: Update Service Integration**
```typescript
// From direct service:
import { NotificationService } from './services/NotificationService';
const service = new NotificationService();

// To DI-based service:
import { useNotificationDI } from '@notification/di/useNotificationDI';
const { service } = useNotificationDI();
```

## 🔄 Implementation Variants Migration

### **Simple → Enhanced Hook**
```typescript
// Before:
const SimpleComponent = () => {
  const { notifications, fetchNotifications } = useNotifications(userId);
  
  return (
    <div>
      <button onClick={fetchNotifications}>Refresh</button>
      {notifications.map(/* render */)}
    </div>
  );
};

// After:
const EnhancedComponent = () => {
  const { 
    notifications, 
    fetchNotifications,
    unreadCount,
    markAsRead,
    connectionStatus 
  } = useAdvancedNotifications(userId);
  
  return (
    <div>
      <ConnectionStatus status={connectionStatus} />
      <Badge count={unreadCount} />
      <button onClick={fetchNotifications}>Refresh</button>
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onMarkAsRead={markAsRead}
        />
      ))}
    </div>
  );
};
```

### **Mock → Real Repository**
```typescript
// Before (testing only):
const mockRepo = new MockNotificationRepository();

// After (production ready):
const { repository } = useNotificationDI({
  overrideConfig: {
    useMockRepositories: false // Switch to real API
  }
});
```

### **State Management Migration**
```typescript
// From local state:
const [notifications, setNotifications] = useState([]);

// To React Query:
const { 
  notifications, 
  isLoading, 
  error, 
  refetch 
} = useReactQueryNotifications(userId);

// Benefits:
// - Automatic caching
// - Background refetching  
// - Optimistic updates
// - Error handling
```

## 🛠️ Code Transformation Examples

### **Function Signature Updates**
```typescript
// Old function signature:
const handleNotification = (notificationId: string, type: string) => {
  // Handle notification
};

// New function signature:
const handleNotification = async (notificationId: ResId, type: NotificationType) => {
  await markNotificationAsRead(notificationId);
  // Type-safe handling
};
```

### **Component Structure Updates**
```typescript
// Old component structure:
const OldNotification = ({ notifications, onAction }) => (
  <div>
    {notifications.map(n => (
      <div key={n.id} onClick={() => onAction('click', n)}>
        {n.title}
      </div>
    ))}
  </div>
);

// New component structure:
const NewNotification = ({ userId, onNotificationClick }) => {
  const { notifications, markAsRead } = useAdvancedNotifications(userId);
  
  return (
    <div>
      {notifications?.content.map(n => (
        <NotificationItem 
          key={n.id}
          notification={n}
          onMarkAsRead={markAsRead}
          onClick={() => onNotificationClick(n)}
        />
      ))}
    </div>
  );
};
```

## 🧪 Testing Migration

### **Update Test Imports**
```typescript
// Before:
import { OldNotificationCenter } from '@features/notifications/...';

// After:
import { NotificationCenter } from '@notification/presentation/components/NotificationCenter';
```

### **Update Test Assertions**
```typescript
// Before:
expect(screen.getByText('Old Notification Text')).toBeInTheDocument();

// After:
expect(screen.getByText('New Notification Text')).toBeInTheDocument();
expect(screen.getByTestId('notification-center')).toBeInTheDocument();
```

### **Mock Data Updates**
```typescript
// Update mock data structure:
const createMockNotification = (): NotificationResponse => ({
  id: Date.now().toString(),
  type: 'message' as NotificationType,
  title: 'New Message',
  message: 'You have a new message',
  isSeen: false,
  createdAt: new Date(),
  // New fields:
  priority: 'medium',
  metadata: { source: 'chat' }
});
```

## ⚠️ Common Migration Issues

### **Import Path Errors**
```typescript
// ❌ Problem:
Cannot find module '@features/notifications/...'

// ✅ Solution:
Use '@notification/...' or relative paths
```

### **Type Mismatches**
```typescript
// ❌ Problem:
Property 'unreadCount' does not exist on type 'NotificationState'

// ✅ Solution:
Use enhanced hook with proper typing
const { unreadCount } = useAdvancedNotifications(userId);
```

### **Missing Dependencies**
```typescript
// ❌ Problem:
Cannot find name 'useNotificationDI'

// ✅ Solution:
Import from correct location
import { useNotificationDI } from '@notification/di/useNotificationDI';
```

## 🔄 Backward Compatibility

### **Feature Flags**
```typescript
// Gradual migration with feature flags
const useMigratedNotifications = () => {
  const enableNewNotifications = FEATURE_FLAGS.MIGRATED_NOTIFICATIONS;
  
  if (enableNewNotifications) {
    return useAdvancedNotifications(userId);
  } else {
    return useBasicNotifications(userId);
  }
};
```

### **Adapter Pattern**
```typescript
// Create adapter for gradual migration
class NotificationAdapter {
  constructor(private oldService: OldNotificationService) {}
  
  async getNotifications(): Promise<NotificationPage> {
    const oldData = await this.oldService.getOldNotifications();
    return this.transformData(oldData);
  }
  
  private transformData(oldData): NotificationPage {
    // Transform old format to new format
    return {
      content: oldData.map(this.transformNotification),
      // ... new format properties
    };
  }
}
```

## ✅ Migration Checklist

### **Pre-Migration**
- [ ] Backup current implementation
- [ ] Identify all notification usage points
- [ ] Plan migration strategy
- [ ] Set up feature flags
- [ ] Prepare rollback plan

### **Migration**
- [ ] Update import statements
- [ ] Update hook usage
- [ ] Update component props
- [ ] Update service integration
- [ ] Update type definitions
- [ ] Update tests

### **Post-Migration**
- [ ] Test all functionality
- [ ] Update documentation
- [ ] Remove deprecated code
- [ ] Update team training
- [ ] Monitor for issues

## 🚀 Rollback Plan

### **Quick Rollback**
```typescript
// If issues arise, quickly rollback:
const useNotifications = FEATURE_FLAGS.ENABLE_MIGRATION 
  ? useAdvancedNotifications 
  : useBasicNotifications;
```

### **Database Migration**
```sql
-- If database schema changed, ensure migration scripts are ready
-- Test migrations on staging first
-- Have rollback scripts prepared
```

## 📞 Support Resources

### **Documentation**
- [API Documentation](./API.md)
- [Component Documentation](./COMPONENTS.md)
- [Development Guidelines](../DEVELOPMENT_GUIDELINES.md)

### **Tools**
- Migration scripts in `/scripts/migration/`
- Type checking tools
- Automated testing suites

### **Team Support**
- Migration planning sessions
- Code review procedures
- Pair programming for complex migrations
- Knowledge transfer sessions

---

**Migration should be done incrementally with thorough testing at each step!**
