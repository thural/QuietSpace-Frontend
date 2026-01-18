import 'reflect-metadata';
import { Injectable, Container } from '@core/di';
import { ContentService } from '@features/content/application/services/ContentServiceDI';
import { ContentRepository } from '@features/content/data';

let containerInstance: Container | null = null;

export const initializeContentContainer = (): Container => {
  const container = Container.create();
  
  // Register content services
  container.registerSingleton(ContentRepository);
  container.registerSingleton(ContentService);
  
  containerInstance = container;
  return container;
};

export const getContentContainer = (): Container => {
  if (!containerInstance) {
    throw new Error('Content container not initialized. Call initializeContentContainer() first.');
  }
  return containerInstance;
};
