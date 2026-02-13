/**
 * Compliance Rules
 * 
 * Implements GDPR/CCPA compliance rules for logging.
 * Provides data retention, consent management, and audit trail features.
 */

import { ILogEntry, ILoggingContext } from '../types';

/**
 * Compliance configuration
 */
export interface IComplianceConfig {
  /** Enable compliance features */
  enabled: boolean;
  /** Data retention period in days */
  dataRetentionDays: number;
  /** Require user consent for logging */
  requireConsent: boolean;
  /** Anonymize IP addresses */
  anonymizeIPs: boolean;
  /** Enable audit trail */
  enableAuditTrail: boolean;
  /** Sensitive data regions */
  restrictedRegions: string[];
  /** Consent storage key */
  consentStorageKey: string;
}

/**
 * Consent record
 */
export interface IConsentRecord {
  /** User ID */
  userId: string;
  /** Consent granted */
  granted: boolean;
  /** Consent timestamp */
  timestamp: Date;
  /** Consent version */
  version: string;
  /** IP address */
  ipAddress?: string;
  /** User agent */
  userAgent?: string;
}

/**
 * Audit trail entry
 */
export interface IAuditTrailEntry {
  /** Entry ID */
  id: string;
  /** Timestamp */
  timestamp: Date;
  /** Action */
  action: string;
  /** User ID */
  userId?: string;
  /** Resource */
  resource?: string;
  /** Result */
  result: 'success' | 'failure';
  /** Details */
  details?: Record<string, any>;
}

/**
 * Compliance rules implementation
 */
export class ComplianceRules {
  private _config: IComplianceConfig;
  private _consentRecords: Map<string, IConsentRecord> = new Map();
  private _auditTrail: IAuditTrailEntry[] = [];
  private _maxAuditTrailSize: number = 10000;

  constructor(config: IComplianceConfig) {
    this._config = config;
    this.loadConsentFromStorage();
  }

  /**
   * Check if logging is allowed for this context
   */
  isLoggingAllowed(context?: ILoggingContext): boolean {
    if (!this._config.enabled) {
      return true; // Compliance disabled, allow all logging
    }

    // Check user consent if required
    if (this._config.requireConsent && context?.userId) {
      return this.hasUserConsent(context.userId);
    }

    // Check regional restrictions
    if (context?.environment && this.isRestrictedRegion(context.environment)) {
      return false;
    }

    return true;
  }

  /**
   * Apply compliance rules to log entry
   */
  applyComplianceRules(entry: ILogEntry): ILogEntry {
    if (!this._config.enabled) {
      return entry;
    }

    const compliantEntry = { ...entry };

    // Anonymize IP addresses if enabled
    if (this._config.anonymizeIPs) {
      compliantEntry.context = this.anonymizeIPs(compliantEntry.context);
    }

    // Apply data retention rules
    this.applyDataRetention(compliantEntry);

    // Add audit trail entry if enabled
    if (this._config.enableAuditTrail) {
      this.addAuditTrailEntry({
        id: this.generateId(),
        timestamp: new Date(),
        action: 'log_entry',
        userId: compliantEntry.context?.userId,
        resource: compliantEntry.category,
        result: 'success',
        details: {
          level: compliantEntry.level,
          messageLength: compliantEntry.message.length
        }
      });
    }

    return compliantEntry;
  }

  /**
   * Check if user has granted consent
   */
  hasUserConsent(userId: string): boolean {
    const consent = this._consentRecords.get(userId);
    return consent?.granted ?? false;
  }

  /**
   * Grant user consent
   */
  grantConsent(userId: string, ipAddress?: string, userAgent?: string): void {
    const consent: IConsentRecord = {
      userId,
      granted: true,
      timestamp: new Date(),
      version: '1.0',
      ipAddress,
      userAgent
    };

    this._consentRecords.set(userId, consent);
    this.saveConsentToStorage();

    this.addAuditTrailEntry({
      id: this.generateId(),
      timestamp: new Date(),
      action: 'consent_granted',
      userId,
      result: 'success',
      details: { version: consent.version }
    });
  }

  /**
   * Revoke user consent
   */
  revokeConsent(userId: string): void {
    const consent = this._consentRecords.get(userId);
    if (consent) {
      consent.granted = false;
      consent.timestamp = new Date();
      this.saveConsentToStorage();

      this.addAuditTrailEntry({
        id: this.generateId(),
        timestamp: new Date(),
        action: 'consent_revoked',
        userId,
        result: 'success'
      });
    }
  }

  /**
   * Get consent record
   */
  getConsentRecord(userId: string): IConsentRecord | undefined {
    return this._consentRecords.get(userId);
  }

  /**
   * Get all consent records
   */
  getAllConsentRecords(): IConsentRecord[] {
    return Array.from(this._consentRecords.values());
  }

  /**
   * Add audit trail entry
   */
  addAuditTrailEntry(entry: IAuditTrailEntry): void {
    this._auditTrail.push(entry);

    // Maintain maximum size
    if (this._auditTrail.length > this._maxAuditTrailSize) {
      this._auditTrail = this._auditTrail.slice(-this._maxAuditTrailSize);
    }
  }

  /**
   * Get audit trail
   */
  getAuditTrail(limit?: number): IAuditTrailEntry[] {
    if (limit) {
      return this._auditTrail.slice(-limit);
    }
    return [...this._auditTrail];
  }

  /**
   * Clear old audit trail entries
   */
  clearOldAuditTrail(olderThanDays: number): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    this._auditTrail = this._auditTrail.filter(entry => entry.timestamp >= cutoffDate);
  }

  /**
   * Check if region is restricted
   */
  private isRestrictedRegion(region: string): boolean {
    return this._config.restrictedRegions.includes(region);
  }

  /**
   * Anonymize IP addresses in context
   */
  private anonymizeIPs(context?: ILoggingContext): ILoggingContext | undefined {
    if (!context) {
      return context;
    }

    const anonymized = { ...context };

    // Anonymize common IP fields
    if (anonymized.additionalData?.ip) {
      anonymized.additionalData.ip = this.anonymizeIP(anonymized.additionalData.ip);
    }

    if (anonymized.additionalData?.clientIP) {
      anonymized.additionalData.clientIP = this.anonymizeIP(anonymized.additionalData.clientIP);
    }

    if (anonymized.additionalData?.remoteAddress) {
      anonymized.additionalData.remoteAddress = this.anonymizeIP(anonymized.additionalData.remoteAddress);
    }

    return anonymized;
  }

  /**
   * Anonymize a single IP address
   */
  private anonymizeIP(ip: string): string {
    // Simple IP anonymization - replace last octet with 0
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0';
      return parts.join('.');
    }
    return ip;
  }

  /**
   * Apply data retention rules
   */
  private applyDataRetention(entry: ILogEntry): void {
    // Add retention metadata
    if (!entry.metadata) {
      entry.metadata = {};
    }

    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() + this._config.dataRetentionDays);
    
    entry.metadata.retentionDate = retentionDate.toISOString();
    entry.metadata.complianceEnabled = this._config.enabled;
  }

  /**
   * Load consent from local storage
   */
  private loadConsentFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(this._config.consentStorageKey);
        if (stored) {
          const records = JSON.parse(stored) as IConsentRecord[];
          this._consentRecords = new Map(
            records.map(record => [record.userId, record])
          );
        }
      } catch (error) {
        console.warn('Failed to load consent records from storage:', error);
      }
    }
  }

  /**
   * Save consent to local storage
   */
  private saveConsentToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const records = Array.from(this._consentRecords.values());
        localStorage.setItem(this._config.consentStorageKey, JSON.stringify(records));
      } catch (error) {
        console.warn('Failed to save consent records to storage:', error);
      }
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<IComplianceConfig>): void {
    this._config = { ...this._config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): IComplianceConfig {
    return { ...this._config };
  }

  /**
   * Get compliance statistics
   */
  getStatistics(): {
    enabled: boolean;
    consentRecordsCount: number;
    auditTrailSize: number;
    dataRetentionDays: number;
    restrictedRegionsCount: number;
  } {
    return {
      enabled: this._config.enabled,
      consentRecordsCount: this._consentRecords.size,
      auditTrailSize: this._auditTrail.length,
      dataRetentionDays: this._config.dataRetentionDays,
      restrictedRegionsCount: this._config.restrictedRegions.length
    };
  }

  /**
   * Export compliance data
   */
  exportComplianceData(): {
    consentRecords: IConsentRecord[];
    auditTrail: IAuditTrailEntry[];
    config: IComplianceConfig;
    exportTimestamp: string;
  } {
    return {
      consentRecords: this.getAllConsentRecords(),
      auditTrail: this.getAuditTrail(),
      config: this.getConfig(),
      exportTimestamp: new Date().toISOString()
    };
  }
}
