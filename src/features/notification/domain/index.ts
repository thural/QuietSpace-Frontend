/**
 * Notification Domain Barrel Export.
 * 
 * Exports all domain entities and interfaces.
 */

// Repository interfaces
export type { INotificationRepository, NotificationQuery, NotificationFilters } from './entities/INotificationRepository';

// Domain entities
export type {
    NotificationQuery as DomainNotificationQuery,
    NotificationFilters as DomainNotificationFilters,
    NotificationResult,
    NotificationMessage,
    NotificationSettings,
    NotificationStatus,
    NotificationParticipant,
    NotificationTypingIndicator,
    NotificationEvent,
    NotificationPriority,
    NotificationChannel
} from './entities/NotificationEntities';

// DI-specific entities
export type { NotificationEntity, NotificationPreferences, NotificationStats } from './entities/NotificationEntity';
