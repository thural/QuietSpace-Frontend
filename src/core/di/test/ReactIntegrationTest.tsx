import React, { useEffect, useState } from 'react';
import { DIProvider, useService, useDIContainer } from '../providers';
import { Container, LoggerService, AppService } from './IntegrationTest';

// Test component using DI
const TestComponent: React.FC = () => {
  const container = useDIContainer();
  const appService = useService(AppService);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const currentStatus = appService.getStatus();
    setStatus(currentStatus);
  }, [appService]);

  return (
    <div>
      <h2>DI React Integration Test</h2>
      <p>Container services: {container.getStats().registeredServices}</p>
      <p>App status: {JSON.stringify(status)}</p>
    </div>
  );
};

// Test wrapper component
const DIIntegrationTest: React.FC = () => {
  const container = Container.create();
  
  // Register services
  container.registerSingleton(LoggerService);
  container.registerSingleton(AppService);
  
  return (
    <DIProvider container={container}>
      <TestComponent />
    </DIProvider>
  );
};

export { DIIntegrationTest, TestComponent };
