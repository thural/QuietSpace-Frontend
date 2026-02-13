/**
 * Logging Context Types
 * 
 * Defines context information for log entries including user session,
 * request tracking, and component information.
 */

import { ILoggingContext } from './LoggingInterfaces';

/**
 * Default logging context implementation
 */
export class LoggingContext implements ILoggingContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  component?: string;
  action?: string;
  route?: string;
  userAgent?: string;
  environment?: string;
  additionalData?: Record<string, any>;

  constructor(data?: Partial<ILoggingContext>) {
    Object.assign(this, data);
  }

  /**
   * Merge with another context
   */
  merge(other: ILoggingContext): LoggingContext {
    return new LoggingContext({
      ...this,
      ...other,
      additionalData: {
        ...this.additionalData,
        ...other.additionalData
      }
    });
  }

  /**
   * Clone context
   */
  clone(): LoggingContext {
    return new LoggingContext({
      userId: this.userId,
      sessionId: this.sessionId,
      requestId: this.requestId,
      component: this.component,
      action: this.action,
      route: this.route,
      userAgent: this.userAgent,
      environment: this.environment,
      additionalData: this.additionalData ? { ...this.additionalData } : undefined
    });
  }

  /**
   * Convert to plain object
   */
  toJSON(): ILoggingContext {
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      requestId: this.requestId,
      component: this.component,
      action: this.action,
      route: this.route,
      userAgent: this.userAgent,
      environment: this.environment,
      additionalData: this.additionalData
    };
  }

  /**
   * Create context from current environment
   */
  static createFromEnvironment(): LoggingContext {
    const context = new LoggingContext();
    
    // Environment detection
    if (typeof window !== 'undefined') {
      context.environment = process.env.NODE_ENV || 'development';
      context.userAgent = navigator.userAgent;
      context.route = window.location.pathname;
    }
    
    return context;
  }

  /**
   * Create context for component
   */
  static forComponent(componentName: string, action?: string): LoggingContext {
    const context = LoggingContext.createFromEnvironment();
    context.component = componentName;
    if (action) {
      context.action = action;
    }
    return context;
  }

  /**
   * Create context for user session
   */
  static forUserSession(userId: string, sessionId: string): LoggingContext {
    const context = LoggingContext.createFromEnvironment();
    context.userId = userId;
    context.sessionId = sessionId;
    return context;
  }

  /**
   * Create context for API request
   */
  static forRequest(requestId: string, userId?: string): LoggingContext {
    const context = LoggingContext.createFromEnvironment();
    context.requestId = requestId;
    if (userId) {
      context.userId = userId;
    }
    return context;
  }
}

/**
 * Context builder for fluent API
 */
export class LoggingContextBuilder {
  private context: LoggingContext;

  constructor() {
    this.context = new LoggingContext();
  }

  /**
   * Set user ID
   */
  withUserId(userId: string): LoggingContextBuilder {
    this.context.userId = userId;
    return this;
  }

  /**
   * Set session ID
   */
  withSessionId(sessionId: string): LoggingContextBuilder {
    this.context.sessionId = sessionId;
    return this;
  }

  /**
   * Set request ID
   */
  withRequestId(requestId: string): LoggingContextBuilder {
    this.context.requestId = requestId;
    return this;
  }

  /**
   * Set component
   */
  withComponent(component: string): LoggingContextBuilder {
    this.context.component = component;
    return this;
  }

  /**
   * Set action
   */
  withAction(action: string): LoggingContextBuilder {
    this.context.action = action;
    return this;
  }

  /**
   * Set route
   */
  withRoute(route: string): LoggingContextBuilder {
    this.context.route = route;
    return this;
  }

  /**
   * Set user agent
   */
  withUserAgent(userAgent: string): LoggingContextBuilder {
    this.context.userAgent = userAgent;
    return this;
  }

  /**
   * Set environment
   */
  withEnvironment(environment: string): LoggingContextBuilder {
    this.context.environment = environment;
    return this;
  }

  /**
   * Add additional data
   */
  withAdditionalData(key: string, value: any): LoggingContextBuilder {
    if (!this.context.additionalData) {
      this.context.additionalData = {};
    }
    this.context.additionalData[key] = value;
    return this;
  }

  /**
   * Add multiple additional data
   */
  withAdditionalDataMap(data: Record<string, any>): LoggingContextBuilder {
    if (!this.context.additionalData) {
      this.context.additionalData = {};
    }
    Object.assign(this.context.additionalData, data);
    return this;
  }

  /**
   * Build context
   */
  build(): LoggingContext {
    return this.context.clone();
  }
}

/**
 * Context utilities
 */
export class ContextUtils {
  /**
   * Merge multiple contexts
   */
  static merge(...contexts: ILoggingContext[]): LoggingContext {
    return contexts.reduce((merged, context) => merged.merge(context), new LoggingContext());
  }

  /**
   * Extract relevant context for log level
   */
  static extractForLevel(level: string, context: ILoggingContext): ILoggingContext {
    // For security level, include less sensitive information
    if (level === 'SECURITY' || level === 'ERROR') {
      const { userId, sessionId, requestId, component, action } = context;
      return { userId, sessionId, requestId, component, action };
    }
    
    return context;
  }

  /**
   * Sanitize context for security
   */
  static sanitize(context: ILoggingContext): ILoggingContext {
    const sanitized: ILoggingContext = {};
    
    // Always include non-sensitive fields
    if (context.component) sanitized.component = context.component;
    if (context.action) sanitized.action = context.action;
    if (context.route) sanitized.route = context.route;
    if (context.environment) sanitized.environment = context.environment;
    
    // Include user/session info only if not sensitive
    if (context.userId) sanitized.userId = this.maskUserId(context.userId);
    if (context.sessionId) sanitized.sessionId = this.maskSessionId(context.sessionId);
    if (context.requestId) sanitized.requestId = context.requestId;
    
    // Include additional data but sanitize it
    if (context.additionalData) {
      sanitized.additionalData = this.sanitizeAdditionalData(context.additionalData);
    }
    
    return sanitized;
  }

  /**
   * Mask user ID for privacy
   */
  private static maskUserId(userId: string): string {
    if (userId.length <= 4) return '****';
    return userId.substring(0, 2) + '****' + userId.substring(userId.length - 2);
  }

  /**
   * Mask session ID
   */
  private static maskSessionId(sessionId: string): string {
    if (sessionId.length <= 8) return '********';
    return sessionId.substring(0, 4) + '****' + sessionId.substring(sessionId.length - 4);
  }

  /**
   * Sanitize additional data
   */
  private static sanitizeAdditionalData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Skip sensitive fields
      if (this.isSensitiveField(key)) {
        sanitized[key] = '***';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * Check if field is sensitive
   */
  private static isSensitiveField(fieldName: string): boolean {
    const sensitivePatterns = [
      /password/i,
      /token/i,
      /secret/i,
      /key/i,
      /auth/i,
      /credential/i,
      /ssn/i,
      /credit/i,
      /card/i,
      /bank/i,
      /account/i
    ];
    
    return sensitivePatterns.some(pattern => pattern.test(fieldName));
  }

  /**
   * Sanitize object recursively
   */
  private static sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    } else if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (this.isSensitiveField(key)) {
          sanitized[key] = '***';
        } else {
          sanitized[key] = this.sanitizeObject(value);
        }
      }
      return sanitized;
    }
    return obj;
  }
}
