/**
 * Notification Application Barrel Export.
 * 
 * Exports all application layer components with enterprise-grade architecture.
 */

// Enterprise Services
export { NotificationFeatureService, PushNotificationService } from './services/index';

// Application services (Legacy)
export { NotificationService, type INotificationService } from './services/NotificationService';
export { RealtimeNotificationService, realtimeNotificationService, type IRealtimeNotificationService, type RealtimeNotificationEvent, type ConnectionStatus } from './services/RealtimeNotificationService';
export { OptimisticUpdateManager, optimisticUpdateManager, type OptimisticOperation, type OptimisticUpdateContext } from './services/OptimisticUpdateManager';
export { StateSynchronizationManager, stateSynchronizationManager, type SyncConflict, type SyncConflictType, type SyncStrategy } from './services/StateSynchronizationManager';

// DI-specific services
export { NotificationServiceDI, useNotificationsDI } from './services/NotificationServiceDI';

// Enterprise Hooks
export { useNotificationServices } from './hooks/useNotificationServices';
export { usePushNotifications } from './hooks/usePushNotifications';
export { useNotificationSettings } from './hooks/useNotificationSettings';

// Application hooks (Enhanced)
export { useNotifications, type NotificationState, type NotificationActions } from './hooks/useNotifications';
export { useAdvancedNotifications, type AdvancedNotificationState, type AdvancedNotificationActions } from './hooks/useAdvancedNotifications';
// useReactQueryNotifications removed - migrated to enterprise hooks

// Application stores
export { useNotificationUIStore, createNotificationUIStore, type NotificationUIState, type NotificationUIActions, type NotificationUIStore } from './stores/notificationUIStore';

// Advanced state management hooks
export { useRealtimeNotifications } from './services/RealtimeNotificationService';
export { useOptimisticUpdates } from './services/OptimisticUpdateManager';
export { useStateSynchronization } from './services/StateSynchronizationManager';

// Legacy data hooks (for backward compatibility)
export { useNotificationData } from '../data/useNotificationData';
export { useUserData } from '../data/useUserData';

// WebSocket hooks (Enterprise)
export { useNotificationWebSocket } from '@/core/websocket/hooks';
