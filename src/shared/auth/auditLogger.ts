import { useAuthStore } from '@/core/store/zustand';

// Audit log event types
export enum AuditEventType {
  // Authentication events
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  TOKEN_REFRESH_FAILED = 'TOKEN_REFRESH_FAILED',
  
  // Authorization events
  ACCESS_GRANTED = 'ACCESS_GRANTED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PERMISSION_CHECK = 'PERMISSION_CHECK',
  
  // Session events
  SESSION_TIMEOUT = 'SESSION_TIMEOUT',
  SESSION_EXTENDED = 'SESSION_EXTENDED',
  MULTIPLE_TAB_LOGIN = 'MULTIPLE_TAB_LOGIN',
  
  // Security events
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  
  // Data events
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  DATA_EXPORT = 'DATA_EXPORT',
  
  // System events
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  CONFIGURATION_CHANGE = 'CONFIGURATION_CHANGE'
}

// Audit log severity levels
export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Audit log entry interface
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  userId?: string;
  username?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  details?: any;
  success?: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

// Audit log options
export interface AuditLogOptions {
  /** Enable/disable audit logging (default: true) */
  enabled?: boolean;
  /** Maximum number of logs to keep in memory (default: 1000) */
  maxLogs?: number;
  /** Enable console logging (default: true) */
  consoleLog?: boolean;
  /** Enable localStorage logging (default: false) */
  localStorageLog?: boolean;
  /** Remote logging endpoint (optional) */
  remoteEndpoint?: string;
}

/**
 * Security audit logging system
 * 
 * Tracks authentication and authorization events for security monitoring.
 * Provides multiple logging destinations and configurable options.
 */
export class AuditLogger {
  private options: Required<AuditLogOptions>;
  private logs: AuditLogEntry[] = [];
  private sessionId: string;

  constructor(options: AuditLogOptions = {}) {
    this.options = {
      enabled: options.enabled !== false,
      maxLogs: options.maxLogs || 1000,
      consoleLog: options.consoleLog !== false,
      localStorageLog: options.localStorageLog || false,
      remoteEndpoint: options.remoteEndpoint
    };
    
    this.sessionId = this.generateSessionId();
    this.loadStoredLogs();
  }

  /** Generate unique session ID */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /** Get current user info */
  private getUserInfo() {
    const { user } = useAuthStore.getState();
    return {
      userId: user?.id,
      username: user?.username
    };
  }

  /** Get client information */
  private getClientInfo() {
    return {
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  }

  /** Get client IP address (placeholder - would need backend endpoint) */
  private getClientIP(): string {
    // In production, this would call an endpoint to get the real IP
    return 'client_ip_placeholder';
  }

  /** Create audit log entry */
  private createLogEntry(
    eventType: AuditEventType,
    severity: AuditSeverity,
    details?: any,
    options?: Partial<AuditLogEntry>
  ): AuditLogEntry {
    const userInfo = this.getUserInfo();
    const clientInfo = this.getClientInfo();

    return {
      id: this.generateLogId(),
      timestamp: clientInfo.timestamp,
      eventType,
      severity,
      userId: userInfo.userId,
      username: userInfo.username,
      sessionId: this.sessionId,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      details,
      ...options
    };
  }

  /** Generate unique log ID */
  private generateLogId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /** Add log entry */
  private addLog(entry: AuditLogEntry) {
    if (!this.options.enabled) return;

    // Add to memory logs
    this.logs.push(entry);

    // Maintain max log limit
    if (this.logs.length > this.options.maxLogs) {
      this.logs = this.logs.slice(-this.options.maxLogs);
    }

    // Console logging
    if (this.options.consoleLog) {
      this.consoleLog(entry);
    }

    // LocalStorage logging
    if (this.options.localStorageLog) {
      this.localStorageLog(entry);
    }

    // Remote logging
    if (this.options.remoteEndpoint) {
      this.remoteLog(entry);
    }
  }

  /** Console logging */
  private consoleLog(entry: AuditLogEntry) {
    const logMethod = this.getConsoleMethod(entry.severity);
    logMethod(`[AUDIT] ${entry.eventType}`, {
      timestamp: entry.timestamp,
      userId: entry.userId,
      username: entry.username,
      details: entry.details
    });
  }

  /** Get appropriate console method based on severity */
  private getConsoleMethod(severity: AuditSeverity) {
    switch (severity) {
      case AuditSeverity.CRITICAL:
        return console.error;
      case AuditSeverity.HIGH:
        return console.warn;
      case AuditSeverity.MEDIUM:
        return console.info;
      case AuditSeverity.LOW:
      default:
        return console.log;
    }
  }

  /** LocalStorage logging */
  private localStorageLog(entry: AuditLogEntry) {
    try {
      const existingLogs = this.getStoredLogs();
      existingLogs.push(entry);
      
      // Keep only recent logs in localStorage
      const maxStorageLogs = 100;
      if (existingLogs.length > maxStorageLogs) {
        existingLogs.splice(0, existingLogs.length - maxStorageLogs);
      }
      
      localStorage.setItem('audit_logs', JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Failed to store audit log in localStorage:', error);
    }
  }

  /** Get stored logs from localStorage */
  private getStoredLogs(): AuditLogEntry[] {
    try {
      const stored = localStorage.getItem('audit_logs');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load stored audit logs:', error);
      return [];
    }
  }

  /** Load stored logs on initialization */
  private loadStoredLogs() {
    if (this.options.localStorageLog) {
      this.logs = this.getStoredLogs();
    }
  }

  /** Remote logging (placeholder implementation) */
  private async remoteLog(entry: AuditLogEntry) {
    try {
      // In production, this would send logs to a remote logging service
      await fetch(this.options.remoteEndpoint!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.error('Failed to send audit log to remote endpoint:', error);
    }
  }

  /** Log authentication success */
  logLoginSuccess(userId: string, username: string, details?: any) {
    const entry = this.createLogEntry(
      AuditEventType.LOGIN_SUCCESS,
      AuditSeverity.MEDIUM,
      details,
      { userId, username, success: true }
    );
    this.addLog(entry);
  }

  /** Log authentication failure */
  logLoginFailed(details: any, errorMessage?: string) {
    const entry = this.createLogEntry(
      AuditEventType.LOGIN_FAILED,
      AuditSeverity.HIGH,
      details,
      { success: false, errorMessage }
    );
    this.addLog(entry);
  }

  /** Log logout */
  logLogout(details?: any) {
    const entry = this.createLogEntry(
      AuditEventType.LOGOUT,
      AuditSeverity.LOW,
      details
    );
    this.addLog(entry);
  }

  /** Log access denied */
  logAccessDenied(resource: string, action: string, details?: any) {
    const entry = this.createLogEntry(
      AuditEventType.ACCESS_DENIED,
      AuditSeverity.HIGH,
      details,
      { resource, action, success: false }
    );
    this.addLog(entry);
  }

  /** Log suspicious activity */
  logSuspiciousActivity(details: any, severity: AuditSeverity = AuditSeverity.HIGH) {
    const entry = this.createLogEntry(
      AuditEventType.SUSPICIOUS_ACTIVITY,
      severity,
      details
    );
    this.addLog(entry);
  }

  /** Log session timeout */
  logSessionTimeout(details?: any) {
    const entry = this.createLogEntry(
      AuditEventType.SESSION_TIMEOUT,
      AuditSeverity.MEDIUM,
      details
    );
    this.addLog(entry);
  }

  /** Log token refresh */
  logTokenRefresh(success: boolean, details?: any) {
    const eventType = success ? AuditEventType.TOKEN_REFRESH : AuditEventType.TOKEN_REFRESH_FAILED;
    const severity = success ? AuditSeverity.LOW : AuditSeverity.MEDIUM;
    
    const entry = this.createLogEntry(
      eventType,
      severity,
      details,
      { success }
    );
    this.addLog(entry);
  }

  /** Get all logs */
  getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  /** Get logs by event type */
  getLogsByEventType(eventType: AuditEventType): AuditLogEntry[] {
    return this.logs.filter(log => log.eventType === eventType);
  }

  /** Get logs by severity */
  getLogsBySeverity(severity: AuditSeverity): AuditLogEntry[] {
    return this.logs.filter(log => log.severity === severity);
  }

  /** Get logs by user */
  getLogsByUserId(userId: string): AuditLogEntry[] {
    return this.logs.filter(log => log.userId === userId);
  }

  /** Get recent logs */
  getRecentLogs(count: number = 50): AuditLogEntry[] {
    return this.logs.slice(-count);
  }

  /** Clear all logs */
  clearLogs() {
    this.logs = [];
    if (this.options.localStorageLog) {
      localStorage.removeItem('audit_logs');
    }
  }

  /** Export logs */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Global audit logger instance
export const auditLogger = new AuditLogger();

/**
 * Hook for using audit logger
 */
export const useAuditLogger = () => {
  return {
    logLoginSuccess: auditLogger.logLoginSuccess.bind(auditLogger),
    logLoginFailed: auditLogger.logLoginFailed.bind(auditLogger),
    logLogout: auditLogger.logLogout.bind(auditLogger),
    logAccessDenied: auditLogger.logAccessDenied.bind(auditLogger),
    logSuspiciousActivity: auditLogger.logSuspiciousActivity.bind(auditLogger),
    logSessionTimeout: auditLogger.logSessionTimeout.bind(auditLogger),
    logTokenRefresh: auditLogger.logTokenRefresh.bind(auditLogger),
    getLogs: auditLogger.getLogs.bind(auditLogger),
    getRecentLogs: auditLogger.getRecentLogs.bind(auditLogger),
    exportLogs: auditLogger.exportLogs.bind(auditLogger)
  };
};

export default auditLogger;
