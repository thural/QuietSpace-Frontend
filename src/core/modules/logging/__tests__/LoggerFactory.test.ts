/**
 * Logger Factory Tests
 * 
 * Unit tests for the logger factory and related functionality.
 */

import { LoggerFactory, getLogger, createAppender, createLayout } from '../factories/LoggerFactory';
import { IAppender, ILayout, ILoggerConfig } from '../types';

// Mock implementations for testing
class MockAppender implements IAppender {
  public readonly name: string;
  public readonly layout: ILayout;
  public active: boolean = false;
  private logs: any[] = [];

  constructor(name: string, layout: ILayout) {
    this.name = name;
    this.layout = layout;
  }

  append(entry: any): void {
    this.logs.push(entry);
  }

  async start(): Promise<void> {
    this.active = true;
  }

  async stop(): Promise<void> {
    this.active = false;
  }

  configure(config: any): void {
    // Mock implementation
  }

  isReady(): boolean {
    return this.active;
  }

  getLogs(): any[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

class MockLayout implements ILayout {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  format(entry: any): string {
    return JSON.stringify(entry);
  }

  configure(config: any): void {
    // Mock implementation
  }

  getContentType(): string {
    return 'application/json';
  }
}

describe('LoggerFactory', () => {
  let factory: LoggerFactory;

  beforeEach(() => {
    factory = LoggerFactory.getInstance();
    factory.clearCache();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = LoggerFactory.getInstance();
      const instance2 = LoggerFactory.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('createLogger', () => {
    it('should create logger with default config', () => {
      const logger = factory.createLogger('test-category');
      
      expect(logger).toBeDefined();
      expect(logger.category).toBe('test-category');
    });

    it('should create logger with custom config', () => {
      const config: ILoggerConfig = {
        category: 'custom-category',
        level: 'DEBUG',
        additive: true,
        appenders: ['console'],
        includeCaller: false
      };
      
      const logger = factory.createLogger('custom-category', config);
      
      expect(logger.category).toBe('custom-category');
    });

    it('should cache logger instances', () => {
      const logger1 = factory.createLogger('cached-category');
      const logger2 = factory.createLogger('cached-category');
      
      expect(logger1).toBe(logger2);
    });

    it('should create different loggers for different categories', () => {
      const logger1 = factory.createLogger('category1');
      const logger2 = factory.createLogger('category2');
      
      expect(logger1).not.toBe(logger2);
      expect(logger1.category).toBe('category1');
      expect(logger2.category).toBe('category2');
    });
  });

  describe('createAppender', () => {
    beforeEach(() => {
      // Register mock appender type
      factory.registerAppenderType('mock', (config) => {
        const layout = new MockLayout('mock-layout');
        return new MockAppender(config.name, layout);
      });
    });

    it('should create appender with registered type', () => {
      const config = {
        name: 'test-appender',
        type: 'mock'
      };
      
      const appender = factory.createAppender(config);
      
      expect(appender).toBeInstanceOf(MockAppender);
      expect(appender.name).toBe('test-appender');
    });

    it('should throw error for unregistered type', () => {
      const config = {
        name: 'test-appender',
        type: 'unregistered'
      };
      
      expect(() => factory.createAppender(config)).toThrow('Unknown appender type: unregistered');
    });
  });

  describe('createLayout', () => {
    beforeEach(() => {
      // Register mock layout type
      factory.registerLayoutType('mock', (config) => {
        return new MockLayout(config.name);
      });
    });

    it('should create layout with registered type', () => {
      const config = {
        name: 'test-layout',
        type: 'mock'
      };
      
      const layout = factory.createLayout(config);
      
      expect(layout).toBeInstanceOf(MockLayout);
      expect(layout.name).toBe('test-layout');
    });

    it('should throw error for unregistered type', () => {
      const config = {
        name: 'test-layout',
        type: 'unregistered'
      };
      
      expect(() => factory.createLayout(config)).toThrow('Unknown layout type: unregistered');
    });
  });

  describe('registerAppenderType', () => {
    it('should register custom appender type', () => {
      const createAppender = (config: any) => new MockAppender(config.name, new MockLayout('test'));
      
      factory.registerAppenderType('custom', createAppender);
      
      const config = { name: 'custom-appender', type: 'custom' };
      const appender = factory.createAppender(config);
      
      expect(appender).toBeInstanceOf(MockAppender);
    });
  });

  describe('registerLayoutType', () => {
    it('should register custom layout type', () => {
      const createLayout = (config: any) => new MockLayout(config.name);
      
      factory.registerLayoutType('custom', createLayout);
      
      const config = { name: 'custom-layout', type: 'custom' };
      const layout = factory.createLayout(config);
      
      expect(layout).toBeInstanceOf(MockLayout);
    });
  });

  describe('getAppenderTypes', () => {
    it('should return registered appender types', () => {
      factory.registerAppenderType('type1', () => new MockAppender('test', new MockLayout('test')));
      factory.registerAppenderType('type2', () => new MockAppender('test', new MockLayout('test')));
      
      const types = factory.getAppenderTypes();
      
      expect(types).toContain('type1');
      expect(types).toContain('type2');
    });
  });

  describe('getLayoutTypes', () => {
    it('should return registered layout types', () => {
      factory.registerLayoutType('type1', () => new MockLayout('test'));
      factory.registerLayoutType('type2', () => new MockLayout('test'));
      
      const types = factory.getLayoutTypes();
      
      expect(types).toContain('type1');
      expect(types).toContain('type2');
    });
  });

  describe('clearCache', () => {
    it('should clear logger cache', () => {
      const logger1 = factory.createLogger('test');
      factory.clearCache();
      const logger2 = factory.createLogger('test');
      
      expect(logger1).not.toBe(logger2);
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', () => {
      factory.createLogger('logger1');
      factory.createLogger('logger2');
      
      const stats = factory.getCacheStats();
      
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('logger1');
      expect(stats.keys).toContain('logger2');
    });
  });
});

describe('Convenience Functions', () => {
  beforeEach(() => {
    const factory = LoggerFactory.getInstance();
    factory.clearCache();
  });

  describe('getLogger', () => {
    it('should create logger using factory', () => {
      const logger = getLogger('test-category');
      
      expect(logger).toBeDefined();
      expect(logger.category).toBe('test-category');
    });
  });

  describe('createAppender', () => {
    beforeEach(() => {
      const factory = LoggerFactory.getInstance();
      factory.registerAppenderType('mock', (config) => {
        const layout = new MockLayout('mock-layout');
        return new MockAppender(config.name, layout);
      });
    });

    it('should create appender using factory', () => {
      const config = { name: 'test', type: 'mock' };
      const appender = createAppender(config);
      
      expect(appender).toBeInstanceOf(MockAppender);
    });
  });

  describe('createLayout', () => {
    beforeEach(() => {
      const factory = LoggerFactory.getInstance();
      factory.registerLayoutType('mock', (config) => new MockLayout(config.name));
    });

    it('should create layout using factory', () => {
      const config = { name: 'test', type: 'mock' };
      const layout = createLayout(config);
      
      expect(layout).toBeInstanceOf(MockLayout);
    });
  });
});

describe('Logger Factory Integration', () => {
  let factory: LoggerFactory;
  let mockAppender: MockAppender;
  let mockLayout: MockLayout;

  beforeEach(() => {
    factory = LoggerFactory.getInstance();
    factory.clearCache();
    
    // Register mock types
    factory.registerAppenderType('mock', (config) => {
      mockLayout = new MockLayout('mock-layout');
      mockAppender = new MockAppender(config.name, mockLayout);
      return mockAppender;
    });
    
    factory.registerLayoutType('mock', (config) => {
      return new MockLayout(config.name);
    });
  });

  describe('Logger with Custom Appender', () => {
    it('should use custom appender for logging', () => {
      const logger = factory.createLogger('test-category');
      const appender = factory.createAppender({ name: 'test-appender', type: 'mock' });
      
      logger.addAppender(appender);
      logger.info({}, 'Test message');
      
      const logs = mockAppender.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe('Test message');
    });
  });

  describe('Logger with Custom Layout', () => {
    it('should use custom layout for formatting', () => {
      const layout = factory.createLayout({ name: 'test-layout', type: 'mock' });
      const appender = factory.createAppender({ name: 'test-appender', type: 'mock' });
      
      // Replace the layout
      (appender as any).layout = layout;
      
      const logger = factory.createLogger('test-category');
      logger.addAppender(appender);
      logger.info({}, 'Test message');
      
      const logs = mockAppender.getLogs();
      expect(logs).toHaveLength(1);
      expect(typeof logs[0]).toBe('string'); // Formatted as string
    });
  });

  describe('Logger Configuration', () => {
    it('should respect configuration settings', () => {
      const config: ILoggerConfig = {
        category: 'configured-logger',
        level: 'ERROR',
        additive: false,
        appenders: [],
        includeCaller: true
      };
      
      const logger = factory.createLogger('configured-logger', config);
      
      expect(logger.level).toBe('ERROR');
    });
  });

  describe('Multiple Loggers', () => {
    it('should handle multiple independent loggers', () => {
      const logger1 = factory.createLogger('category1');
      const logger2 = factory.createLogger('category2');
      
      const appender1 = factory.createAppender({ name: 'appender1', type: 'mock' });
      const appender2 = factory.createAppender({ name: 'appender2', type: 'mock' });
      
      logger1.addAppender(appender1);
      logger2.addAppender(appender2);
      
      logger1.info({}, 'Message from logger1');
      logger2.info({}, 'Message from logger2');
      
      const logs1 = (appender1 as MockAppender).getLogs();
      const logs2 = (appender2 as MockAppender).getLogs();
      
      expect(logs1).toHaveLength(1);
      expect(logs2).toHaveLength(1);
      expect(logs1[0].message).toBe('Message from logger1');
      expect(logs2[0].message).toBe('Message from logger2');
    });
  });
});

describe('Error Handling', () => {
  let factory: LoggerFactory;

  beforeEach(() => {
    factory = LoggerFactory.getInstance();
    factory.clearCache();
  });

  describe('Invalid Configurations', () => {
    it('should handle missing configuration gracefully', () => {
      expect(() => {
        factory.createLogger('test', undefined as any);
      }).not.toThrow();
    });

    it('should handle invalid appender config', () => {
      expect(() => {
        factory.createAppender({ name: 'test', type: 'invalid' });
      }).toThrow();
    });

    it('should handle invalid layout config', () => {
      expect(() => {
        factory.createLayout({ name: 'test', type: 'invalid' });
      }).toThrow();
    });
  });

  describe('Factory Registration', () => {
    it('should handle duplicate registration gracefully', () => {
      const createAppender = () => new MockAppender('test', new MockLayout('test'));
      
      expect(() => {
        factory.registerAppenderType('duplicate', createAppender);
        factory.registerAppenderType('duplicate', createAppender);
      }).not.toThrow();
    });
  });
});
