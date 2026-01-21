/**
 * Enterprise security service implementation
 * 
 * Implements security operations with:
 * - IP detection
 * - Rate limiting
 * - Data encryption
 * - Security headers validation
 */

import { IAuthSecurityService } from '../interfaces/authInterfaces';

/**
 * Enterprise security service implementation
 */
export class EnterpriseSecurityService implements IAuthSecurityService {
    readonly name = 'EnterpriseSecurityService';

    private rateLimitStore = new Map<string, { attempts: number; windowStart: number }>();
    private blockedIPs = new Set<string>();

    /**
     * Detects suspicious activity patterns
     */
    detectSuspiciousActivity(events: any[]): any[] {
        const suspiciousEvents = [];

        // Analyze patterns
        for (const event of events) {
            // Multiple failed attempts from same IP
            const ipEvents = events.filter(e => e.details?.ipAddress);
            if (ipEvents.length > 5) {
                suspiciousEvents.push({
                    type: 'multiple_failures' as any,
                    details: { ip: event.details?.ipAddress, count: ipEvents.length }
                });
            }

            // Rapid successive attempts
            const timeWindows = this.getTimeWindows(events);
            for (const window of timeWindows) {
                const windowEvents = events.filter(e =>
                    e.timestamp >= window.start && e.timestamp <= window.end
                );

                if (windowEvents.length > 10) {
                    suspiciousEvents.push({
                        type: 'rapid_attempts' as any,
                        details: {
                            timeWindow: `${window.start.toISOString()} - ${window.end.toISOString()}`,
                            count: windowEvents.length
                        }
                    });
                }
            }
        }

        return suspiciousEvents;
    }

    /**
     * Validates security headers
     */
    validateSecurityHeaders(headers: Record<string, string>): boolean {
        const requiredHeaders = ['authorization', 'x-api-key', 'x-request-id'];

        for (const header of requiredHeaders) {
            if (!headers[header.toLowerCase()]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks rate limiting
     */
    checkRateLimit(userId: string, attempts: number): boolean {
        const userLimit = this.rateLimitStore.get(userId) || { attempts: 5, windowStart: Date.now() };

        if (attempts >= userLimit.attempts) {
            const timeSinceLastAttempt = Date.now() - userLimit.windowStart;

            // Lock out for 15 minutes if too many attempts
            if (timeSinceLastAttempt < 15 * 60 * 1000) {
                return false; // Still within window
            }

            return true; // Rate limited
        }
    }

    /**
     * Encrypts sensitive data
     */
    encryptSensitiveData(data: any): string {
        // Simple XOR encryption for demo (use proper encryption in production)
        const dataStr = JSON.stringify(data);
        let encrypted = '';

        for (let i = 0; i < dataStr.length; i++) {
            encrypted += String.fromCharCode(dataStr.charCodeAt(i) ^ (i % 3) + 1);
        }

        return btoa(encrypted);
    }

    /**
     * Decrypts sensitive data
     */
    decryptSensitiveData(encryptedData: string): any {
        const decrypted = atob(encryptedData);
        return JSON.parse(decrypted);
    }

    /**
     * Gets client IP address
     */
    async getClientIP(): Promise<string> {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
    }

    /**
     * Gets time windows for analysis
     */
    private getTimeWindows(events: any[]): Array<{ start: Date; end: Date }> {
        const windows = [];
        const sortedEvents = events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        for (let i = 0; i < sortedEvents.length; i++) {
            const event = sortedEvents[i];
            const windowStart = new Date(event.timestamp.getTime() - 5 * 60 * 1000);
            const windowEnd = new Date(event.timestamp.getTime() + 5 * 60 * 1000);

            windows.push({ start: windowStart, end: windowEnd });
        }

        return windows;
    }
}
