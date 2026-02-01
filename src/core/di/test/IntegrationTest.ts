import 'reflect-metadata';
import { Injectable, Inject, createContainer } from '../index';

// Example service interfaces
interface ILogger {
  log(message: string): void;
  error(message: string): void;
}

interface ICacheService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  clear(): void;
}

interface IConfigService {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
}

// Service implementations
@Injectable({ lifetime: 'singleton' })
export class LoggerService implements ILogger {
  log(message: string): void {
    console.log(`[Logger] ${message}`);
  }
  error(message: string): void {
    console.error(`[Error] ${message}`);
  }
}

@Injectable({ lifetime: 'singleton' })
export class CacheService implements ICacheService {
  private cache = new Map<string, any>();

  get<T>(key: string): T | null {
    return this.cache.get(key) || null;
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

@Injectable({ lifetime: 'transient' })
export class ConfigService implements IConfigService {
  constructor(@Inject(CacheService) private cache: ICacheService) { }

  get(key: string): string | undefined {
    return this.cache.get<string>(`config:${key}`);
  }

  set(key: string, value: string): void {
    this.cache.set(`config:${key}`, value);
  }
}

// Complex service with multiple dependencies
@Injectable({ lifetime: 'scoped' })
export class AppService {
  constructor(
    @Inject(LoggerService) private logger: ILogger,
    @Inject(CacheService) private cache: ICacheService,
    @Inject(ConfigService) private config: IConfigService
  ) { }

  initialize(): void {
    this.logger.log('App service initialized');
    this.config.set('version', '1.0.0');
    this.cache.set('initialized', true);
  }

  getStatus(): { version: string; initialized: boolean } {
    return {
      version: this.config.get('version') || 'unknown',
      initialized: this.cache.get('initialized') || false
    };
  }
}

// Test function
export function testDIIntegration() {
  console.log('🧪 Testing DI Integration...');

  const container = createContainer();

  // Register services
  container.registerSingleton(LoggerService);
  container.registerSingleton(CacheService);
  container.register(ConfigService);
  container.registerScoped(AppService);

  // Test service resolution
  const logger = container.get(LoggerService);
  const appService = container.get(AppService);

  // Test functionality
  appService.initialize();
  const status = appService.getStatus();
  logger.log(`App status: ${JSON.stringify(status)}`);

  console.log('✅ DI Integration test completed!');
  return { container, logger, appService };
}

// Export for use in other test files - container is created via factory function
export { createContainer };
