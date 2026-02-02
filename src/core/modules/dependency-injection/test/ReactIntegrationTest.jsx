import React, { useEffect, useState } from 'react';
import { DIProvider, useService, useDIContainer } from '../providers/ReactProvider.js';
import { createContainer, LoggerService, AppService } from './IntegrationTest.js';

/**
 * Test component using DI
 * 
 * @returns {React.ReactElement} Test component
 * @description Component that demonstrates DI usage in React
 */
const TestComponent = () => {
  const container = useDIContainer();
  const appService = useService(AppService);
  const [status, setStatus] = useState(null);

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

/**
 * Test wrapper component
 * 
 * @returns {React.ReactElement} Test wrapper component
 * @description Wrapper component that sets up DI container for testing
 */
const DIIntegrationTest = () => {
  const container = createContainer();

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
export default DIIntegrationTest;
