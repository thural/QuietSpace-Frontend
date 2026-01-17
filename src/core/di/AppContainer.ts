import 'reflect-metadata';
import { Container } from '../di';
import { ThemeService } from '../../core/services/ThemeService';
import { LoggerService } from './test/SimpleTest';

/**
 * Application DI Container Setup.
 * 
 * Configures and initializes the dependency injection container
 * with all application services.
 */

export function createAppContainer(): Container {
  console.log('🏗️ Setting up application DI container...');
  
  const container = Container.create();
  
  // Register core services
  container.registerSingleton(LoggerService);
  container.registerSingleton(ThemeService);
  
  console.log('✅ Core services registered');
  console.log(`📊 Container stats: ${JSON.stringify(container.getStats())}`);
  
  return container;
}

/**
 * Initialize application with DI
 */
export function initializeApp(): Container {
  const container = createAppContainer();
  
  // Initialize services
  const themeService = container.get(ThemeService);
  themeService.setTheme('light');
  
  console.log('🚀 Application initialized with DI');
  
  return container;
}
