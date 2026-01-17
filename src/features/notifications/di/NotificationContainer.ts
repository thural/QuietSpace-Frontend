import 'reflect-metadata';
import { Container } from '../../../core/di';
import { NotificationService } from '../application/services/NotificationServiceDI';
import { NotificationRepository } from '../data/NotificationRepository';

let notificationContainerInstance: Container | null = null;

export const initializeNotificationContainer = (): Container => {
  const container = Container.create();
  
  // Register notification services
  container.registerSingleton(NotificationRepository);
  container.registerSingleton(NotificationService);
  
  notificationContainerInstance = container;
  return container;
};

export const getNotificationContainer = (): Container => {
  if (!notificationContainerInstance) {
    throw new Error('Notification container not initialized. Call initializeNotificationContainer() first.');
  }
  return notificationContainerInstance;
};
