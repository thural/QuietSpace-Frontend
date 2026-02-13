/**
 * useLogger Hook
 * 
 * React hook for accessing the centralized logging system.
 * Provides category-based loggers with React-specific context.
 */

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { ILogger, ILoggingContext } from '../../../core/modules/logging/types';

/**
 * Hook options
 */
export interface UseLoggerOptions {
  /** Logger category */
  category: string;
  /** Default context to include with all log entries */
  defaultContext?: ILoggingContext;
  /** Enable performance monitoring */
  enablePerformanceMonitoring?: boolean;
  /** Auto-generate component context */
  autoComponentContext?: boolean;
}

/**
 * Hook result with logger and utilities
 */
export interface UseLoggerResult {
  /** Logger instance */
  logger: ILogger;
  /** Log methods with automatic context */
  trace: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  audit: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  metrics: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  security: (message: string, ...args: any[]) => void;
  fatal: (message: string, ...args: any[]) => void;
  /** Log with custom context */
  logWithContext: (level: string, context: ILoggingContext, message: string, ...args: any[]) => void;
  /** Performance monitoring wrapper */
  withPerformanceMonitoring: <T>(operation: () => T, operationName: string) => T;
  /** Async performance monitoring wrapper */
  withPerformanceMonitoringAsync: <T>(operation: () => Promise<T>, operationName: string) => Promise<T>;
}

/**
 * Hook for accessing logger with React-specific features
 */
export function useLogger(options: UseLoggerOptions): UseLoggerResult {
  const { category, defaultContext, enablePerformanceMonitoring, autoComponentContext } = options;
  
  // Get logger instance (memoized)
  const logger = useMemo(() => {
    // This would be imported from the logging module
    // For now, create a mock logger
    return createMockLogger(category);
  }, [category]);

  // Merge context
  const mergedContext = useMemo(() => {
    const context: ILoggingContext = { ...defaultContext };
    
    if (autoComponentContext) {
      context.component = category;
      // Add React-specific context
      if (typeof window !== 'undefined') {
        context.route = window.location.pathname;
      }
    }
    
    return context;
  }, [category, defaultContext, autoComponentContext]);

  // Performance monitoring ref
  const performanceRef = useRef(enablePerformanceMonitoring ?? false);

  // Create log methods with automatic context
  const createLogMethod = useCallback((level: string) => {
    return (message: string, ...args: any[]) => {
      logger.log(level, mergedContext, message, ...args);
    };
  }, [logger, mergedContext]);

  // Log methods
  const trace = useCallback(createLogMethod('TRACE'), [createLogMethod]);
  const debug = useCallback(createLogMethod('DEBUG'), [createLogMethod]);
  const info = useCallback(createLogMethod('INFO'), [createLogMethod]);
  const audit = useCallback(createLogMethod('AUDIT'), [createLogMethod]);
  const warn = useCallback(createLogMethod('WARN'), [createLogMethod]);
  const metrics = useCallback(createLogMethod('METRICS'), [createLogMethod]);
  const error = useCallback(createLogMethod('ERROR'), [createLogMethod]);
  const security = useCallback(createLogMethod('SECURITY'), [createLogMethod]);
  const fatal = useCallback(createLogMethod('FATAL'), [createLogMethod]);

  // Log with custom context
  const logWithContext = useCallback((level: string, context: ILoggingContext, message: string, ...args: any[]) => {
    const finalContext = { ...mergedContext, ...context };
    logger.log(level, finalContext, message, ...args);
  }, [logger, mergedContext]);

  // Performance monitoring wrapper
  const withPerformanceMonitoring = useCallback(<T>(operation: () => T, operationName: string): T => {
    if (performanceRef.current && 'withPerformanceMonitoring' in logger) {
      return (logger as any).withPerformanceMonitoring(operation, operationName);
    }
    return operation();
  }, [logger]);

  // Async performance monitoring wrapper
  const withPerformanceMonitoringAsync = useCallback(async <T>(operation: () => Promise<T>, operationName: string): Promise<T> => {
    if (performanceRef.current && 'withPerformanceMonitoringAsync' in logger) {
      return (logger as any).withPerformanceMonitoringAsync(operation, operationName);
    }
    return operation();
  }, [logger]);

  // Update performance monitoring setting
  useEffect(() => {
    performanceRef.current = enablePerformanceMonitoring ?? false;
  }, [enablePerformanceMonitoring]);

  return {
    logger,
    trace,
    debug,
    info,
    audit,
    warn,
    metrics,
    error,
    security,
    fatal,
    logWithContext,
    withPerformanceMonitoring,
    withPerformanceMonitoringAsync
  };
}

/**
 * Hook for component-specific logging
 */
export function useComponentLogger(componentName: string, additionalContext?: ILoggingContext): UseLoggerResult {
  return useLogger({
    category: `app.components.${componentName}`,
    defaultContext: additionalContext,
    autoComponentContext: true,
    enablePerformanceMonitoring: true
  });
}

/**
 * Hook for service-specific logging
 */
export function useServiceLogger(serviceName: string, additionalContext?: ILoggingContext): UseLoggerResult {
  return useLogger({
    category: `app.services.${serviceName}`,
    defaultContext: additionalContext,
    autoComponentContext: false,
    enablePerformanceMonitoring: true
  });
}

/**
 * Hook for API-specific logging
 */
export function useApiLogger(apiEndpoint: string, additionalContext?: ILoggingContext): UseLoggerResult {
  return useLogger({
    category: `app.api.${apiEndpoint}`,
    defaultContext: { ...additionalContext, endpoint: apiEndpoint },
    autoComponentContext: false,
    enablePerformanceMonitoring: true
  });
}

/**
 * Hook for user action logging
 */
export function useUserActionLogger(userId?: string, sessionId?: string): UseLoggerResult {
  return useLogger({
    category: 'app.user.actions',
    defaultContext: { userId, sessionId },
    autoComponentContext: true,
    enablePerformanceMonitoring: false
  });
}

/**
 * Mock logger implementation (replace with actual logger from logging module)
 */
function createMockLogger(category: string): ILogger {
  return {
    category,
    level: 'INFO',
    isEnabled: (level: string) => true,
    trace: (context?: ILoggingContext, message?: string, ...args: any[]) => console.trace(`[${category}] TRACE:`, message, ...args, context),
    debug: (context?: ILoggingContext, message?: string, ...args: any[]) => console.debug(`[${category}] DEBUG:`, message, ...args, context),
    info: (context?: ILoggingContext, message?: string, ...args: any[]) => console.info(`[${category}] INFO:`, message, ...args, context),
    audit: (context?: ILoggingContext, message?: string, ...args: any[]) => console.info(`[${category}] AUDIT:`, message, ...args, context),
    warn: (context?: ILoggingContext, message?: string, ...args: any[]) => console.warn(`[${category}] WARN:`, message, ...args, context),
    metrics: (context?: ILoggingContext, message?: string, ...args: any[]) => console.info(`[${category}] METRICS:`, message, ...args, context),
    error: (context?: ILoggingContext, message?: string, ...args: any[]) => console.error(`[${category}] ERROR:`, message, ...args, context),
    security: (context?: ILoggingContext, message?: string, ...args: any[]) => console.error(`[${category}] SECURITY:`, message, ...args, context),
    fatal: (context?: ILoggingContext, message?: string, ...args: any[]) => console.error(`[${category}] FATAL:`, message, ...args, context),
    log: (level: string, context?: ILoggingContext, message?: string, ...args: any[]) => console.log(`[${category}] ${level}:`, message, ...args, context),
    setLevel: (level: string) => { /* Mock implementation */ },
    addAppender: (appender: any) => { /* Mock implementation */ },
    removeAppender: (appender: any) => { /* Mock implementation */ },
    getAppenders: () => []
  };
}
