/**
 * Security Utilities Tests
 * 
 * Unit tests for security and compliance features.
 */

import { DataSanitizer, SecurityFilters, ComplianceRules } from '../security';
import { ISecurityConfig, IComplianceConfig } from '../types';

describe('DataSanitizer', () => {
  let sanitizer: DataSanitizer;

  beforeEach(() => {
    const config: ISecurityConfig = {
      enableSanitization: true,
      sensitiveFields: ['password', 'token', 'secret'],
      maskChar: '*',
      partialMask: true
    };
    sanitizer = new DataSanitizer(config);
  });

  describe('sanitize', () => {
    it('should sanitize strings with sensitive data', () => {
      const input = 'User password: secret123 and token: abc123';
      const result = sanitizer.sanitize(input);
      
      expect(result).toContain('***');
      expect(result).not.toContain('secret123');
      expect(result).not.toContain('abc123');
    });

    it('should sanitize objects recursively', () => {
      const input = {
        username: 'john',
        password: 'secret123',
        profile: {
          email: 'john@example.com',
          token: 'abc123'
        }
      };
      
      const result = sanitizer.sanitize(input);
      
      expect(result.username).toBe('john');
      expect(result.password).toBe('***');
      expect(result.profile.email).toBe('john@example.com');
      expect(result.profile.token).toBe('***');
    });

    it('should handle arrays', () => {
      const input = [
        { username: 'john', password: 'secret123' },
        { token: 'abc123' }
      ];
      
      const result = sanitizer.sanitize(input);
      
      expect(result[0].username).toBe('john');
      expect(result[0].password).toBe('***');
      expect(result[1].token).toBe('***');
    });

    it('should handle null and undefined', () => {
      expect(sanitizer.sanitize(null)).toBeNull();
      expect(sanitizer.sanitize(undefined)).toBeUndefined();
    });

    it('should handle primitive values', () => {
      expect(sanitizer.sanitize('string')).toBe('string');
      expect(sanitizer.sanitize(123)).toBe(123);
      expect(sanitizer.sanitize(true)).toBe(true);
    });
  });

  describe('addCustomRule', () => {
    it('should add custom sanitization rule', () => {
      sanitizer.addCustomRule({
        name: 'custom-rule',
        priority: 100,
        filter: (entry) => {
          entry.message = entry.message.replace(/custom/g, '***');
          return entry;
        },
        enabled: true
      });
      
      const entry = {
        id: 'test',
        timestamp: new Date(),
        level: 'INFO',
        category: 'test',
        message: 'custom message'
      };
      
      const result = sanitizer.sanitize(entry);
      
      expect(result.message).toBe('*** message');
    });
  });

  describe('removeCustomRule', () => {
    it('should remove custom rule', () => {
      const rule = {
        name: 'test-rule',
        priority: 100,
        filter: (entry: any) => entry,
        enabled: true
      };
      
      sanitizer.addCustomRule(rule);
      sanitizer.removeCustomRule('test-rule');
      
      expect(() => {
        sanitizer.removeCustomRule('non-existent');
      }).not.toThrow();
    });
  });

  describe('updateConfig', () => {
    it('should update configuration', () => {
      const newConfig: Partial<ISecurityConfig = {
        maskChar: '#',
        partialMask: false
      };
      
      sanitizer.updateConfig(newConfig);
      
      const result = sanitizer.sanitize('password: secret123');
      expect(result).toContain('#');
    });
  });

  describe('testSanitization', () => {
    it('should test sanitization on sample data', () => {
      const testData = {
        username: 'john',
        password: 'secret123',
        email: 'john@example.com'
      };
      
      const result = sanitizer.testSanitization(testData);
      
      expect(result.original).toEqual(testData);
      expect(result.sanitized).not.toEqual(testData);
      expect(result.changed).toBe(true);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics', () => {
      const stats = sanitizer.getStatistics();
      
      expect(stats.enabled).toBe(true);
      expect(stats.sensitiveFieldsCount).toBeGreaterThan(0);
      expect(stats.patternsCount).toBeGreaterThan(0);
    });
  });
});

describe('SecurityFilters', () => {
  let sanitizer: DataSanitizer;
  let filters: SecurityFilters;

  beforeEach(() => {
    const config: ISecurityConfig = {
      enableSanitization: true,
      sensitiveFields: ['password', 'token'],
      maskChar: '*',
      partialMask: true
    };
    sanitizer = new DataSanitizer(config);
    filters = new SecurityFilters(sanitizer);
  });

  describe('applyFilters', () => {
    it('should apply PII sanitization filter', () => {
      const entry = {
        id: 'test',
        timestamp: new Date(),
        level: 'INFO',
        category: 'test',
        message: 'User email: user@example.com',
        context: { userId: 'user123' }
      };
      
      const result = filters.applyFilters(entry);
      
      expect(result).toBeDefined();
      expect(result!.message).toContain('***');
    });

    it('should filter high-security level logs', () => {
      const entry = {
        id: 'test',
        timestamp: new Date(),
        level: 'SECURITY',
        category: 'test',
        message: 'Security event',
        context: { userId: 'user123', sensitiveData: 'secret' }
      };
      
      const result = filters.applyFilters(entry);
      
      expect(result).toBeDefined();
      expect(result!.context).toEqual({
        component: undefined,
        action: undefined
      });
    });

    it('should filter user data protection', () => {
      const entry = {
        id: 'test',
        timestamp: new Date(),
        level: 'INFO',
        category: 'test',
        message: 'User action',
        context: { userId: 'user123', sessionId: 'sess456' }
      };
      
      const result = filters.applyFilters(entry);
      
      expect(result).toBeDefined();
      expect(result!.context).toEqual({
        userId: 'user123',
        sessionId: 'sess456',
        component: undefined,
        action: undefined
      });
    });

    it('should filter out entries completely', () => {
      // Add a filter that removes entries
      filters.addFilter({
        name: 'remove-all',
        priority: 200,
        enabled: true,
        filter: () => null
      });
      
      const entry = {
        id: 'test',
        timestamp: new Date(),
        level: 'INFO',
        category: 'test',
        message: 'Test message'
      };
      
      const result = filters.applyFilters(entry);
      
      expect(result).toBeNull();
    });
  });

  describe('addFilter', () => {
    it('should add custom filter', () => {
      const filter = {
        name: 'custom-filter',
        priority: 100,
        enabled: true,
        filter: (entry: any) => entry
      };
      
      filters.addFilter(filter);
      
      const addedFilter = filters.getFilter('custom-filter');
      expect(addedFilter).toBeDefined();
      expect(addedFilter!.name).toBe('custom-filter');
    });
  });

  describe('setFilterEnabled', () => {
    it('should enable/disable filter', () => {
      filters.setFilterEnabled('pii-sanitization', false);
      
      const filter = filters.getFilter('pii-sanitization');
      expect(filter!.enabled).toBe(false);
      
      filters.setFilterEnabled('pii-sanitization', true);
      expect(filter!.enabled).toBe(true);
    });
  });

  describe('testFilters', () => {
    it('should test filters on sample entry', () => {
      const entry = {
        id: 'test',
        timestamp: new Date(),
        level: 'INFO',
        category: 'test',
        message: 'User email: user@example.com',
        context: { userId: 'user123' }
      };
      
      const result = filters.testFilters(entry);
      
      expect(result.original).toEqual(entry);
      expect(result.filtered).toBeDefined();
      expect(result.filteredOut).toBe(false);
      expect(result.changes.length).toBeGreaterThan(0);
    });
  });
});

describe('ComplianceRules', () => {
  let compliance: ComplianceRules;

  beforeEach(() => {
    const config: IComplianceConfig = {
      enabled: true,
      dataRetentionDays: 30,
      requireConsent: false,
      anonymizeIPs: false,
      enableAuditTrail: true,
      restrictedRegions: ['EU', 'CA'],
      consentStorageKey: 'logging-consent'
    };
    compliance = new ComplianceRules(config);
  });

  describe('isLoggingAllowed', () => {
    it('should allow logging when compliance is disabled', () => {
      compliance.updateConfig({ enabled: false });
      
      const result = compliance.isLoggingAllowed({ userId: 'user123' });
      expect(result).toBe(true);
    });

    it('should check user consent when required', () => {
      compliance.updateConfig({ requireConsent: true });
      
      const result = compliance.isLoggingAllowed({ userId: 'user123' });
      expect(result).toBe(false); // No consent given
      
      compliance.grantConsent('user123');
      const result2 = compliance.isLoggingAllowed({ userId: 'user123' });
      expect(result2).toBe(true);
    });

    it('should check regional restrictions', () => {
      const result = compliance.isLoggingAllowed({ environment: 'EU' });
      expect(result).toBe(false); // Restricted region
      
      const result2 = compliance.isLoggingAllowed({ environment: 'US' });
      expect(result2).toBe(true); // Not restricted
    });
  });

  describe('applyComplianceRules', () => {
    it('should anonymize IP addresses when enabled', () => {
      compliance.updateConfig({ anonymizeIPs: true });
      
      const entry = {
        id: 'test',
        timestamp: new Date(),
        level: 'INFO',
        category: 'test',
        message: 'Test message',
        context: {
          additionalData: {
            ip: '192.168.1.100',
            clientIP: '10.0.0.1'
          }
        }
      };
      
      const result = compliance.applyComplianceRules(entry);
      
      expect(result.context!.additionalData!.ip).toBe('192.168.1.0');
      expect(result.context!.additionalData!.clientIP).toBe('10.0.0.0');
    });

    it('should add retention metadata', () => {
      const entry = {
        id: 'test',
        timestamp: new Date(),
        level: 'INFO',
        category: 'test',
        message: 'Test message'
      };
      
      const result = compliance.applyComplianceRules(entry);
      
      expect(result.metadata).toBeDefined();
      expect(result.metadata!.retentionDate).toBeDefined();
      expect(result.metadata!.complianceEnabled).toBe(true);
    });
  });

  describe('grantConsent', () => {
    it('should grant user consent', () => {
      compliance.grantConsent('user123', '192.168.1.100', 'Mozilla/5.0');
      
      const consent = compliance.getConsentRecord('user123');
      expect(consent).toBeDefined();
      expect(consent!.granted).toBe(true);
      expect(consent!.userId).toBe('user123');
      expect(consent!.ipAddress).toBe('192.168.1.100');
    });
  });

  describe('revokeConsent', () => {
    it('should revoke user consent', () => {
      compliance.grantConsent('user123');
      compliance.revokeConsent('user123');
      
      const consent = compliance.getConsentRecord('user123');
      expect(consent!.granted).toBe(false);
    });
  });

  describe('addAuditTrailEntry', () => {
    it('should add audit trail entry', () => {
      compliance.addAuditTrailEntry({
        id: 'audit-1',
        timestamp: new Date(),
        action: 'test-action',
        userId: 'user123',
        resource: 'test-resource',
        result: 'success',
        details: { test: 'data' }
      });
      
      const trail = compliance.getAuditTrail();
      expect(trail).toHaveLength(1);
      expect(trail[0].action).toBe('test-action');
    });
  });

  describe('clearOldAuditTrail', () => {
    it('should clear old audit trail entries', () => {
      // Add old entry
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10);
      
      compliance.addAuditTrailEntry({
        id: 'old-entry',
        timestamp: oldDate,
        action: 'old-action',
        result: 'success'
      });
      
      // Add recent entry
      compliance.addAuditTrailEntry({
        id: 'recent-entry',
        timestamp: new Date(),
        action: 'recent-action',
        result: 'success'
      });
      
      compliance.clearOldAuditTrail(5); // Clear entries older than 5 days
      
      const trail = compliance.getAuditTrail();
      expect(trail).toHaveLength(1);
      expect(trail[0].action).toBe('recent-action');
    });
  });

  describe('exportComplianceData', () => {
    it('should export compliance data', () => {
      compliance.grantConsent('user123');
      compliance.addAuditTrailEntry({
        id: 'audit-1',
        timestamp: new Date(),
        action: 'test-action',
        result: 'success'
      });
      
      const exported = compliance.exportComplianceData();
      
      expect(exported.consentRecords).toHaveLength(1);
      expect(exported.auditTrail).toHaveLength(1);
      expect(exported.config).toBeDefined();
      expect(exported.exportTimestamp).toBeDefined();
    });
  });

  describe('getStatistics', () => {
    it('should return compliance statistics', () => {
      compliance.grantConsent('user123');
      compliance.addAuditTrailEntry({
        id: 'audit-1',
        timestamp: new Date(),
        action: 'test-action',
        result: 'success'
      });
      
      const stats = compliance.getStatistics();
      
      expect(stats.enabled).toBe(true);
      expect(stats.consentRecordsCount).toBe(1);
      expect(stats.auditTrailSize).toBe(1);
      expect(stats.dataRetentionDays).toBe(30);
    });
  });
});
