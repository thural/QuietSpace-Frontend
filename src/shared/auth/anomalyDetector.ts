import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/services/store/zustand';
import { auditLogger, AuditEventType, AuditSeverity } from './auditLogger';

// Anomaly types
export enum AnomalyType {
  MULTIPLE_LOGIN_ATTEMPTS = 'MULTIPLE_LOGIN_ATTEMPTS',
  RAPID_REQUEST_PATTERN = 'RAPID_REQUEST_PATTERN',
  UNUSUAL_LOCATION = 'UNUSUAL_LOCATION',
  STRANGE_BEHAVIOR = 'STRANGE_BEHAVIOR',
  CONCURRENT_SESSIONS = 'CONCURRENT_SESSIONS',
  TIME_PATTERN_ANOMALY = 'TIME_PATTERN_ANOMALY',
  PERMISSION_ESCALATION = 'PERMISSION_ESCALATION',
  DATA_ACCESS_ANOMALY = 'DATA_ACCESS_ANOMALY'
}

// Anomaly severity
export enum AnomalySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Anomaly detection options
export interface AnomalyDetectionOptions {
  /** Enable/disable anomaly detection (default: true) */
  enabled?: boolean;
  /** Maximum failed login attempts before flagging (default: 5) */
  maxFailedLogins?: number;
  /** Time window for failed login tracking in minutes (default: 15) */
  failedLoginWindow?: number;
  /** Maximum requests per minute before flagging (default: 100) */
  maxRequestsPerMinute?: number;
  /** Enable location-based detection (default: false) */
  enableLocationDetection?: boolean;
  /** Enable concurrent session detection (default: true) */
  enableConcurrentSessionDetection?: boolean;
}

// Anomaly event interface
export interface AnomalyEvent {
  id: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  timestamp: string;
  userId?: string;
  description: string;
  details: any;
  riskScore: number;
  mitigations?: string[];
}

/**
 * Anomaly detection system for authentication patterns
 * 
 * Monitors user behavior and detects suspicious patterns that may indicate
 * security threats such as brute force attacks, unusual access patterns, etc.
 */
export class AnomalyDetector {
  private options: Required<AnomalyDetectionOptions>;
  private failedLoginAttempts: Map<string, number[]> = new Map();
  private requestTimestamps: number[] = [];
  private userSessions: Map<string, Set<string>> = new Map();
  private knownLocations: Map<string, string[]> = new Map();
  private anomalies: AnomalyEvent[] = [];

  constructor(options: AnomalyDetectionOptions = {}) {
    this.options = {
      enabled: options.enabled !== false,
      maxFailedLogins: options.maxFailedLogins || 5,
      failedLoginWindow: options.failedLoginWindow || 15,
      maxRequestsPerMinute: options.maxRequestsPerMinute || 100,
      enableLocationDetection: options.enableLocationDetection || false,
      enableConcurrentSessionDetection: options.enableConcurrentSessionDetection !== false
    };
  }

  /** Generate unique anomaly ID */
  private generateAnomalyId(): string {
    return `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /** Calculate risk score for anomaly */
  private calculateRiskScore(type: AnomalyType, details: any): number {
    let baseScore = 50;

    switch (type) {
      case AnomalyType.MULTIPLE_LOGIN_ATTEMPTS:
        baseScore = Math.min(100, details.attemptCount * 20);
        break;
      case AnomalyType.RAPID_REQUEST_PATTERN:
        baseScore = Math.min(90, details.requestRate * 2);
        break;
      case AnomalyType.CONCURRENT_SESSIONS:
        baseScore = 70;
        break;
      case AnomalyType.UNUSUAL_LOCATION:
        baseScore = 80;
        break;
      case AnomalyType.PERMISSION_ESCALATION:
        baseScore = 85;
        break;
      case AnomalyType.DATA_ACCESS_ANOMALY:
        baseScore = 60;
        break;
    }

    return baseScore;
  }

  /** Create and log anomaly event */
  private createAnomaly(
    type: AnomalyType,
    severity: AnomalySeverity,
    description: string,
    details: any,
    userId?: string
  ): AnomalyEvent {
    const anomaly: AnomalyEvent = {
      id: this.generateAnomalyId(),
      type,
      severity,
      timestamp: new Date().toISOString(),
      userId,
      description,
      details,
      riskScore: this.calculateRiskScore(type, details),
      mitigations: this.getSuggestedMitigations(type)
    };

    this.anomalies.push(anomaly);
    this.logAnomaly(anomaly);

    return anomaly;
  }

  /** Get suggested mitigations for anomaly type */
  private getSuggestedMitigations(type: AnomalyType): string[] {
    switch (type) {
      case AnomalyType.MULTIPLE_LOGIN_ATTEMPTS:
        return ['Lock account temporarily', 'Require additional verification', 'Notify user'];
      case AnomalyType.RAPID_REQUEST_PATTERN:
        return ['Rate limiting', 'Require CAPTCHA', 'Temporary block'];
      case AnomalyType.CONCURRENT_SESSIONS:
        return ['Force logout other sessions', 'Notify user', 'Require re-authentication'];
      case AnomalyType.UNUSUAL_LOCATION:
        return ['Require email verification', 'Security questions', 'Temporary block'];
      case AnomalyType.PERMISSION_ESCALATION:
        return ['Require admin approval', 'Audit permissions', 'Temporary restriction'];
      default:
        return ['Monitor closely', 'Log additional context', 'Security review'];
    }
  }

  /** Log anomaly to audit system */
  private logAnomaly(anomaly: AnomalyEvent) {
    auditLogger.logSuspiciousActivity(
      {
        anomalyId: anomaly.id,
        type: anomaly.type,
        severity: anomaly.severity,
        riskScore: anomaly.riskScore,
        details: anomaly.details
      },
      anomaly.severity === AnomalySeverity.CRITICAL ? AuditSeverity.CRITICAL :
      anomaly.severity === AnomalySeverity.HIGH ? AuditSeverity.HIGH :
      anomaly.severity === AnomalySeverity.MEDIUM ? AuditSeverity.MEDIUM :
      AuditSeverity.LOW
    );
  }

  /** Track failed login attempt */
  trackFailedLogin(email: string, details?: any) {
    if (!this.options.enabled) return;

    const now = Date.now();
    const attempts = this.failedLoginAttempts.get(email) || [];
    attempts.push(now);

    // Clean old attempts outside window
    const windowMs = this.options.failedLoginWindow * 60 * 1000;
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    this.failedLoginAttempts.set(email, recentAttempts);

    // Check for anomaly
    if (recentAttempts.length >= this.options.maxFailedLogins) {
      this.createAnomaly(
        AnomalyType.MULTIPLE_LOGIN_ATTEMPTS,
        AnomalySeverity.HIGH,
        `Multiple failed login attempts detected for ${email}`,
        { email, attemptCount: recentAttempts.length, timeWindow: this.options.failedLoginWindow },
        email
      );
    }
  }

  /** Track API request for rate limiting detection */
  trackRequest(userId?: string) {
    if (!this.options.enabled) return;

    const now = Date.now();
    this.requestTimestamps.push(now);

    // Clean old requests (keep last minute)
    const oneMinuteAgo = now - 60 * 1000;
    const recentRequests = this.requestTimestamps.filter(time => time > oneMinuteAgo);
    this.requestTimestamps = recentRequests;

    // Check for rapid request pattern
    if (recentRequests.length > this.options.maxRequestsPerMinute) {
      this.createAnomaly(
        AnomalyType.RAPID_REQUEST_PATTERN,
        AnomalySeverity.MEDIUM,
        `Rapid request pattern detected: ${recentRequests.length} requests in last minute`,
        { requestCount: recentRequests.length, timeWindow: '1 minute' },
        userId
      );
    }
  }

  /** Track user session for concurrent session detection */
  trackUserSession(userId: string, sessionId: string) {
    if (!this.options.enabled || !this.options.enableConcurrentSessionDetection) return;

    const sessions = this.userSessions.get(userId) || new Set();
    sessions.add(sessionId);
    this.userSessions.set(userId, sessions);

    // Check for concurrent sessions
    if (sessions.size > 3) { // Allow up to 3 concurrent sessions
      this.createAnomaly(
        AnomalyType.CONCURRENT_SESSIONS,
        AnomalySeverity.MEDIUM,
        `Multiple concurrent sessions detected for user ${userId}`,
        { sessionCount: sessions.size, sessions: Array.from(sessions) },
        userId
      );
    }
  }

  /** Track location change */
  trackLocationChange(userId: string, location: string) {
    if (!this.options.enabled || !this.options.enableLocationDetection) return;

    const knownLocations = this.knownLocations.get(userId) || [];
    
    if (knownLocations.length > 0 && !knownLocations.includes(location)) {
      this.createAnomaly(
        AnomalyType.UNUSUAL_LOCATION,
        AnomalySeverity.HIGH,
        `Unusual location detected for user ${userId}: ${location}`,
        { newLocation: location, knownLocations, previousLocations: knownLocations },
        userId
      );
    }

    knownLocations.push(location);
    this.knownLocations.set(userId, knownLocations.slice(-10)); // Keep last 10 locations
  }

  /** Track permission escalation */
  trackPermissionEscalation(userId: string, oldPermissions: string[], newPermissions: string[]) {
    if (!this.options.enabled) return;

    const addedPermissions = newPermissions.filter(p => !oldPermissions.includes(p));
    
    if (addedPermissions.some(p => p.includes('admin') || p.includes('system'))) {
      this.createAnomaly(
        AnomalyType.PERMISSION_ESCALATION,
        AnomalySeverity.HIGH,
        `Permission escalation detected for user ${userId}`,
        { oldPermissions, newPermissions, addedPermissions },
        userId
      );
    }
  }

  /** Get all anomalies */
  getAnomalies(): AnomalyEvent[] {
    return [...this.anomalies];
  }

  /** Get anomalies by user */
  getAnomaliesByUser(userId: string): AnomalyEvent[] {
    return this.anomalies.filter(anomaly => anomaly.userId === userId);
  }

  /** Get anomalies by severity */
  getAnomaliesBySeverity(severity: AnomalySeverity): AnomalyEvent[] {
    return this.anomalies.filter(anomaly => anomaly.severity === severity);
  }

  /** Get recent anomalies */
  getRecentAnomalies(count: number = 50): AnomalyEvent[] {
    return this.anomalies.slice(-count);
  }

  /** Clear anomalies */
  clearAnomalies() {
    this.anomalies = [];
    this.failedLoginAttempts.clear();
    this.requestTimestamps = [];
    this.userSessions.clear();
    this.knownLocations.clear();
  }

  /** Get risk score for user */
  getUserRiskScore(userId: string): number {
    const userAnomalies = this.getAnomaliesByUser(userId);
    if (userAnomalies.length === 0) return 0;

    const totalScore = userAnomalies.reduce((sum, anomaly) => sum + anomaly.riskScore, 0);
    return Math.min(100, totalScore / userAnomalies.length);
  }

  /** Check if user is high risk */
  isHighRiskUser(userId: string): boolean {
    return this.getUserRiskScore(userId) > 70;
  }
}

/**
 * Hook for using anomaly detector
 */
export const useAnomalyDetector = (options: AnomalyDetectionOptions = {}) => {
  const detectorRef = useRef<AnomalyDetector | null>(null);

  if (!detectorRef.current) {
    detectorRef.current = new AnomalyDetector(options);
  }

  const detector = detectorRef.current;

  return {
    trackFailedLogin: detector.trackFailedLogin.bind(detector),
    trackRequest: detector.trackRequest.bind(detector),
    trackUserSession: detector.trackUserSession.bind(detector),
    trackLocationChange: detector.trackLocationChange.bind(detector),
    trackPermissionEscalation: detector.trackPermissionEscalation.bind(detector),
    getAnomalies: detector.getAnomalies.bind(detector),
    getRecentAnomalies: detector.getRecentAnomalies.bind(detector),
    getUserRiskScore: detector.getUserRiskScore.bind(detector),
    isHighRiskUser: detector.isHighRiskUser.bind(detector)
  };
};

export default AnomalyDetector;
