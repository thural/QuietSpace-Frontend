/**
 * Notification Application Barrel Export.
 * 
 * Exports all application layer components.
 */

// Application services
export { NotificationService, type INotificationService } from './services/NotificationService';
export { RealtimeNotificationService, realtimeNotificationService, type IRealtimeNotificationService, type RealtimeNotificationEvent, type ConnectionStatus } from './services/RealtimeNotificationService';
export { OptimisticUpdateManager, optimisticUpdateManager, type OptimisticOperation, type OptimisticUpdateContext } from './services/OptimisticUpdateManager';
export { StateSynchronizationManager, stateSynchronizationManager, type SyncConflict, type SyncConflictType, type SyncStrategy } from './services/StateSynchronizationManager';

// DI-specific services
export { NotificationServiceDI, useNotificationsDI } from './services/NotificationServiceDI';

// Application hooks
export { useReactQueryNotifications, type ReactQueryNotificationState, type ReactQueryNotificationActions } from './hooks/useReactQueryNotifications';
export { useNotifications, type NotificationState, type NotificationActions } from './hooks/useNotifications';
export { useAdvancedNotifications, type AdvancedNotificationState, type AdvancedNotificationActions } from './hooks/useAdvancedNotifications';

// Application stores
export { useNotificationUIStore, createNotificationUIStore, type NotificationUIState, type NotificationUIActions, type NotificationUIStore } from './stores/notificationUIStore';

// Advanced state management hooks
export { useRealtimeNotifications } from './services/RealtimeNotificationService';
export { useOptimisticUpdates } from './services/OptimisticUpdateManager';
export { useStateSynchronization } from './services/StateSynchronizationManager';

// Socket hooks
export { default as useNotificationSocket } from './hooks/useNotificationSocket';
