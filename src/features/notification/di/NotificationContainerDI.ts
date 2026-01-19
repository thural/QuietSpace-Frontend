import 'reflect-metadata';
import { Container } from '../../../core/di';
import { NotificationServiceDI } from '../application/services/NotificationServiceDI';
import { NotificationRepositoryDI } from '../data/repositories/NotificationRepositoryDI';

let notificationContainerInstance: Container | null = null;

export const initializeNotificationContainer = (): Container => {
  const container = Container.create();
  
  // Register notification services
  container.registerSingleton(NotificationRepositoryDI);
  container.registerSingleton(NotificationServiceDI);
  
  notificationContainerInstance = container;
  return container;
};

export const getNotificationContainer = (): Container => {
  if (!notificationContainerInstance) {
    throw new Error('Notification container not initialized. Call initializeNotificationContainer() first.');
  }
  return notificationContainerInstance;
};
