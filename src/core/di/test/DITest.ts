/**
 * DI System Integration Test.
 * 
 * Example services and usage to test the DI system.
 */

import 'reflect-metadata';
import { Injectable, Inject } from '../index';
import { Container } from '../container/Container';

// Example service interfaces
interface ILogger {
  log(message: string): void;
}

interface IDataService {
  getData(): Promise<string[]>;
}

// Example service implementations
@Injectable({ lifetime: 'singleton' })
class LoggerService implements ILogger {
  log(message: string): void {
    console.log(`[Logger] ${message}`);
  }
}

@Injectable({ lifetime: 'transient' })
class DataService implements IDataService {
  constructor(@Inject(LoggerService) private logger: ILogger) { }

  async getData(): Promise<string[]> {
    this.logger.log('Fetching data...');
    return ['item1', 'item2', 'item3'];
  }
}

// Example service with multiple dependencies
@Injectable({ lifetime: 'scoped' })
class BusinessService {
  constructor(
    @Inject(LoggerService) private logger: ILogger,
    @Inject(DataService) private dataService: IDataService
  ) { }

  async processData(): Promise<string[]> {
    this.logger.log('Processing business logic...');
    const data = await this.dataService.getData();
    return data.map(item => item.toUpperCase());
  }
}

// Test function
export function testDI() {
  console.log('🧪 Testing DI System...');

  // Create container
  const container = Container.create();

  // Register services
  container.registerSingleton(LoggerService);
  container.register(DataService);
  container.registerScoped(BusinessService);

  // Test service resolution
  const logger = container.get(LoggerService);
  logger.log('DI System initialized');

  const dataService = container.get(DataService);
  const businessService = container.get(BusinessService);

  // Test dependency injection
  businessService.processData().then(result => {
    logger.log(`Business result: ${result.join(', ')}`);
    console.log('✅ DI System test completed successfully!');
  }).catch(error => {
    console.error('❌ DI System test failed:', error);
  });

  // Test container validation
  const errors = container.validate();
  if (errors.length > 0) {
    console.error('❌ Validation errors:', errors);
  } else {
    console.log('✅ Container validation passed');
  }

  // Get container stats
  const stats = container.getStats();
  console.log('📊 Container stats:', stats);

  return { container, logger, businessService };
}
