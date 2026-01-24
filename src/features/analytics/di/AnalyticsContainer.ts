import 'reflect-metadata';
import { Container } from '@core/di';
import { AnalyticsService } from '@analytics/application/services/AnalyticsServiceDI';
import { AnalyticsRepository } from '@analytics/data';

let analyticsContainerInstance: Container | null = null;

export const initializeAnalyticsContainer = (): Container => {
  const container = Container.create();
  
  // Register analytics services
  container.registerSingleton(AnalyticsRepository);
  container.registerSingleton(AnalyticsService);
  
  analyticsContainerInstance = container;
  return container;
};

export const getAnalyticsContainer = (): Container => {
  if (!analyticsContainerInstance) {
    throw new Error('Analytics container not initialized. Call initializeAnalyticsContainer() first.');
  }
  return analyticsContainerInstance;
};
