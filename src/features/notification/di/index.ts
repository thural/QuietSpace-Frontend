/**
 * Notification DI Barrel Export.
 * 
 * Exports all dependency injection components.
 */

// DI Container
export { NotificationDIContainer } from './NotificationDIContainer';
export { useNotificationDI } from './useNotificationDI';

// DI-specific container
export { initializeNotificationContainer, getNotificationContainer } from './NotificationContainerDI';
