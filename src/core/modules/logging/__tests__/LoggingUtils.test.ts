/**
 * Logging Utilities Tests
 * 
 * Unit tests for logging utility functions.
 */

import { LoggingUtils, PerformanceUtils, FormatUtils, ValidationUtils } from '../utils';

describe('LoggingUtils', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = LoggingUtils.generateId();
      const id2 = LoggingUtils.generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(10);
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp to ISO string', () => {
      const date = new Date('2023-01-01T00:00:00.000Z');
      const formatted = LoggingUtils.formatTimestamp(date);
      
      expect(formatted).toBe('2023-01-01T00:00:00.000Z');
    });
  });

  describe('formatDuration', () => {
    it('should format milliseconds', () => {
      expect(LoggingUtils.formatDuration(500)).toBe('500.00ms');
      expect(LoggingUtils.formatDuration(1500)).toBe('1.50s');
      expect(LoggingUtils.formatDuration(65000)).toBe('1m 5.00s');
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes', () => {
      expect(LoggingUtils.formatFileSize(1024)).toBe('1.00 KB');
      expect(LoggingUtils.formatFileSize(1048576)).toBe('1.00 MB');
      expect(LoggingUtils.formatFileSize(1073741824)).toBe('1.00 GB');
    });
  });

  describe('sanitizeString', () => {
    it('should sanitize special characters', () => {
      const input = 'Hello\nWorld\rTest\tQuote"';
      const sanitized = LoggingUtils.sanitizeString(input);
      
      expect(sanitized).toBe('Hello\\nWorld\\rTest\\tQuote\\"');
    });
  });

  describe('truncateString', () => {
    it('should truncate long strings', () => {
      const longString = 'This is a very long string that should be truncated';
      const truncated = LoggingUtils.truncateString(longString, 20);
      
      expect(truncated.length).toBeLessThanOrEqual(20);
      expect(truncated).toContain('...');
    });
  });

  describe('deepClone', () => {
    it('should create deep copy of object', () => {
      const original = {
        name: 'test',
        nested: { value: 42 },
        array: [1, 2, 3]
      };
      
      const cloned = LoggingUtils.deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.array).not.toBe(original.array);
    });
  });

  describe('isEmpty', () => {
    it('should check if value is empty', () => {
      expect(LoggingUtils.isEmpty(null)).toBe(true);
      expect(LoggingUtils.isEmpty(undefined)).toBe(true);
      expect(LoggingUtils.isEmpty([])).toBe(true);
      expect(LoggingUtils.isEmpty({})).toBe(true);
      expect(LoggingUtils.isEmpty('')).toBe(false);
      expect(LoggingUtils.isEmpty([1])).toBe(false);
      expect(LoggingUtils.isEmpty({ key: 'value' })).toBe(false);
    });
  });

  describe('merge', () => {
    it('should merge multiple objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const obj3 = { d: 5 };
      
      const merged = LoggingUtils.merge(obj1, obj2, obj3);
      
      expect(merged).toEqual({ a: 1, b: 3, c: 4, d: 5 });
    });
  });

  describe('extractErrorInfo', () => {
    it('should extract error information', () => {
      const error = new Error('Test error');
      const info = LoggingUtils.extractErrorInfo(error);
      
      expect(info.message).toBe('Test error');
      expect(info.name).toBe('Error');
      expect(info.stack).toBeDefined();
    });

    it('should handle errors with codes', () => {
      const error = new Error('Test error') as any;
      error.code = 'ENOENT';
      
      const info = LoggingUtils.extractErrorInfo(error);
      
      expect(info.code).toBe('ENOENT');
    });
  });

  describe('compareLevels', () => {
    it('should compare log levels correctly', () => {
      expect(LoggingUtils.compareLevels('DEBUG', 'INFO')).toBe(-1);
      expect(LoggingUtils.compareLevels('INFO', 'DEBUG')).toBe(1);
      expect(LoggingUtils.compareLevels('INFO', 'INFO')).toBe(0);
    });
  });

  describe('isLevelEnabled', () => {
    it('should check if level is enabled for threshold', () => {
      expect(LoggingUtils.isLevelEnabled('ERROR', 'WARN')).toBe(true);
      expect(LoggingUtils.isLevelEnabled('DEBUG', 'INFO')).toBe(false);
      expect(LoggingUtils.isLevelEnabled('INFO', 'INFO')).toBe(true);
    });
  });
});

describe('PerformanceUtils', () => {
  beforeEach(() => {
    PerformanceUtils.clearMeasurements();
  });

  describe('startMeasurement and endMeasurement', () => {
    it('should measure execution time', async () => {
      const id = PerformanceUtils.startMeasurement('test-operation');
      
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const measurement = PerformanceUtils.endMeasurement(id);
      
      expect(measurement).toBeDefined();
      expect(measurement!.name).toBe('test-operation');
      expect(measurement!.duration).toBeGreaterThan(0);
      expect(measurement!.startTime).toBeLessThan(measurement!.endTime!);
    });

    it('should return null for invalid measurement ID', () => {
      const measurement = PerformanceUtils.endMeasurement('invalid-id');
      expect(measurement).toBeNull();
    });
  });

  describe('measureAsync', () => {
    it('should measure async function execution', async () => {
      const asyncFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'result';
      };
      
      const { result, measurement } = await PerformanceUtils.measureAsync('async-test', asyncFunction);
      
      expect(result).toBe('result');
      expect(measurement.name).toBe('async-test');
      expect(measurement.duration).toBeGreaterThan(0);
    });
  });

  describe('measure', () => {
    it('should measure synchronous function execution', () => {
      const syncFunction = () => {
        const start = Date.now();
        while (Date.now() - start < 5) {
          // Busy wait
        }
        return 'sync-result';
      };
      
      const { result, measurement } = PerformanceUtils.measure('sync-test', syncFunction);
      
      expect(result).toBe('sync-result');
      expect(measurement.name).toBe('sync-test');
      expect(measurement.duration).toBeGreaterThan(0);
    });
  });

  describe('getMetrics', () => {
    it('should calculate performance metrics', async () => {
      // Add some measurements
      const id1 = PerformanceUtils.startMeasurement('test');
      await new Promise(resolve => setTimeout(resolve, 10));
      PerformanceUtils.endMeasurement(id1);
      
      const id2 = PerformanceUtils.startMeasurement('test');
      await new Promise(resolve => setTimeout(resolve, 20));
      PerformanceUtils.endMeasurement(id2);
      
      const metrics = PerformanceUtils.getMetrics('test');
      
      expect(metrics).toBeDefined();
      expect(metrics!.totalMeasurements).toBe(2);
      expect(metrics!.averageDuration).toBeGreaterThan(0);
      expect(metrics!.minDuration).toBeLessThan(metrics!.maxDuration);
    });

    it('should return null for non-existent measurements', () => {
      const metrics = PerformanceUtils.getMetrics('non-existent');
      expect(metrics).toBeNull();
    });
  });

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(PerformanceUtils.formatDuration(500)).toBe('500.00ms');
      expect(PerformanceUtils.formatDuration(1500)).toBe('1.50s');
      expect(PerformanceUtils.formatDuration(65000)).toBe('1m 5.00s');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(PerformanceUtils.formatBytes(1024)).toBe('1.00 KB');
      expect(PerformanceUtils.formatBytes(1048576)).toBe('1.00 MB');
      expect(PerformanceUtils.formatBytes(1073741824)).toBe('1.00 GB');
    });
  });
});

describe('FormatUtils', () => {
  describe('formatMessage', () => {
    it('should format message with {} placeholders', () => {
      const result = FormatUtils.formatMessage('Hello {} and {}', ['world', 'universe']);
      expect(result).toBe('Hello world and universe');
    });

    it('should format message with numbered placeholders', () => {
      const result = FormatUtils.formatMessage('Hello {0} and {1}', ['world', 'universe']);
      expect(result).toBe('Hello world and universe');
    });

    it('should handle missing arguments', () => {
      const result = FormatUtils.formatMessage('Hello {} and {}', ['world']);
      expect(result).toBe('Hello world and {}');
    });

    it('should handle empty message', () => {
      const result = FormatUtils.formatMessage('', ['test']);
      expect(result).toBe('');
    });
  });

  describe('formatValue', () => {
    it('should format different value types', () => {
      expect(FormatUtils.formatValue('string')).toBe('string');
      expect(FormatUtils.formatValue(42)).toBe('42');
      expect(FormatUtils.formatValue(true)).toBe('true');
      expect(FormatUtils.formatValue(null)).toBe('null');
      expect(FormatUtils.formatValue(undefined)).toBe('null');
    });

    it('should format dates', () => {
      const date = new Date('2023-01-01T00:00:00.000Z');
      const result = FormatUtils.formatValue(date);
      expect(result).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should format arrays', () => {
      const result = FormatUtils.formatValue([1, 2, 3]);
      expect(result).toBe('[1, 2, 3]');
    });

    it('should format objects', () => {
      const result = FormatUtils.formatValue({ key: 'value' });
      expect(result).toBe('{"key":"value"}');
    });
  });

  describe('formatDate', () => {
    it('should format date as ISO by default', () => {
      const date = new Date('2023-01-01T00:00:00.000Z');
      const result = FormatUtils.formatDate(date);
      expect(result).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should format date with custom pattern', () => {
      const date = new Date('2023-01-01T12:30:45.000Z');
      const result = FormatUtils.formatDate(date, 'YYYY-MM-DD HH:mm:ss');
      expect(result).toBe('2023-01-01 12:30:45');
    });
  });

  describe('formatNumber', () => {
    it('should format number with default options', () => {
      const result = FormatUtils.formatNumber(1234.567);
      expect(result).toBe('1234.57');
    });

    it('should format number with custom options', () => {
      const result = FormatUtils.formatNumber(1234.567, { maximumFractionDigits: 0 });
      expect(result).toBe('1235');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency', () => {
      const result = FormatUtils.formatCurrency(1234.56, 'USD');
      expect(result).toContain('$');
      expect(result).toContain('1234.56');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage', () => {
      expect(FormatUtils.formatPercentage(0.1234)).toBe('12.34%');
      expect(FormatUtils.formatPercentage(0.5, 1)).toBe('50.0%');
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes', () => {
      expect(FormatUtils.formatFileSize(1024)).toBe('1.00 KB');
      expect(FormatUtils.formatFileSize(1048576)).toBe('1.00 MB');
    });
  });

  describe('formatDuration', () => {
    it('should format durations', () => {
      expect(FormatUtils.formatDuration(500)).toBe('500.00ms');
      expect(FormatUtils.formatDuration(1500)).toBe('1.50s');
      expect(FormatUtils.formatDuration(65000)).toBe('1m 5s');
    });
  });

  describe('formatTemplate', () => {
    it('should format template with variables', () => {
      const template = 'Hello ${name}, you have ${count} messages';
      const variables = { name: 'John', count: 5 };
      
      const result = FormatUtils.formatTemplate(template, variables);
      expect(result).toBe('Hello John, you have 5 messages');
    });
  });

  describe('truncateString', () => {
    it('should truncate long strings', () => {
      const longString = 'This is a very long string that should be truncated';
      const result = FormatUtils.truncateString(longString, 20);
      
      expect(result.length).toBeLessThanOrEqual(20);
      expect(result).toContain('...');
    });

    it('should return short strings unchanged', () => {
      const shortString = 'Short';
      const result = FormatUtils.truncateString(shortString, 20);
      
      expect(result).toBe('Short');
    });
  });
});

describe('ValidationUtils', () => {
  describe('validateLogEntry', () => {
    it('should validate valid log entry', () => {
      const entry = {
        id: 'test-id',
        timestamp: new Date(),
        level: 'INFO',
        category: 'test',
        message: 'Test message'
      };
      
      const result = ValidationUtils.validateLogEntry(entry);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid log entry', () => {
      const entry = {
        // Missing required fields
        timestamp: new Date(),
        level: 'INVALID',
        category: 'test'
      };
      
      const result = ValidationUtils.validateLogEntry(entry);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateContext', () => {
    it('should validate valid context', () => {
      const context = {
        userId: 'user123',
        action: 'login'
      };
      
      const result = ValidationUtils.validateContext(context);
      
      expect(result.valid).toBe(true);
    });

    it('should reject invalid context', () => {
      const context = null;
      
      const result = ValidationUtils.validateContext(context);
      
      expect(result.valid).toBe(false);
    });
  });

  describe('validateString', () => {
    it('should validate valid string', () => {
      const result = ValidationUtils.validateString('valid string', 'test');
      expect(result.valid).toBe(true);
    });

    it('should reject string with forbidden patterns', () => {
      const options = {
        forbiddenPatterns: [/<script/gi]
      };
      
      const result = ValidationUtils.validateString('<script>alert("xss")</script>', 'test', options);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('isValidLogLevel', () => {
    it('should validate log levels', () => {
      expect(ValidationUtils.isValidLogLevel('INFO')).toBe(true);
      expect(ValidationUtils.isValidLogLevel('DEBUG')).toBe(true);
      expect(ValidationUtils.isValidLogLevel('INVALID')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should sanitize string with forbidden patterns', () => {
      const options = {
        forbiddenPatterns: [/<script[^>]*>/gi]
      };
      
      const result = ValidationUtils.sanitizeString('<script>alert("test")</script>', options);
      
      expect(result).toBe('[REDACTED]alert("test")</script>');
    });

    it('should truncate long strings', () => {
      const options = {
        maxStringLength: 10
      };
      
      const result = ValidationUtils.sanitizeString('This is a very long string', options);
      
      expect(result.length).toBeLessThanOrEqual(10);
      expect(result).toContain('...');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize object recursively', () => {
      const obj = {
        safe: 'safe value',
        unsafe: '<script>alert("xss")</script>',
        nested: {
          safe: 'nested safe',
          unsafe: '<script>alert("nested")</script>'
        }
      };
      
      const options = {
        forbiddenPatterns: [/<script[^>]*>/gi]
      };
      
      const result = ValidationUtils.sanitizeObject(obj, options);
      
      expect(result.safe).toBe('safe value');
      expect(result.unsafe).toBe('[REDACTED]alert("xss")</script>');
      expect(result.nested.safe).toBe('nested safe');
      expect(result.nested.unsafe).toBe('[REDACTED]alert("nested")</script>');
    });
  });
});
