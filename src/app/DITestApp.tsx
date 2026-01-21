import React from 'react';
import { DIProvider, useService, useDIContainer, Injectable } from './core/di';
import { Container } from './core/di';

// Simple test service
@Injectable({ lifetime: 'singleton' })
export class AppLoggerService {
  log(message: string): void {
    console.log(`[AppLogger] ${message}`);
  }
}

// Test component
const TestComponent: React.FC = () => {
  const container = useDIContainer();
  const logger = useService(AppLoggerService);
  
  return (
    <div>
      <h2>DI Integration Test</h2>
      <p>Container services: {container.getStats().registeredServices}</p>
      <button onClick={() => logger.log('Test button clicked')}>
        Test DI
      </button>
    </div>
  );
};

// Test wrapper
const AppIntegrationTest: React.FC = () => {
  const container = Container.create();
  container.registerSingleton(AppLoggerService);
  
  return (
    <DIProvider container={container}>
      <TestComponent />
    </DIProvider>
  );
};

export { AppIntegrationTest };
