/**
 * Enterprise security service implementation
 *
 * Implements security operations with:
 * - IP detection
 * - Rate limiting
 * - Data encryption
 * - Security headers validation
 */

import type { IAuthSecurityService } from '../interfaces/authInterfaces';
import type { AuthEvent } from '../types/auth.domain.types';
import { AuthEventType } from '../types/auth.domain.types';

/**
 * Enterprise security service implementation
 */
export class EnterpriseSecurityService implements IAuthSecurityService {
    readonly name = 'EnterpriseSecurityService';

    private readonly rateLimitStore = new Map<string, { attempts: number; windowStart: number }>();
    private readonly blockedIPs = new Set<string>();

    /**
     * Detects suspicious activity patterns
     */
    detectSuspiciousActivity(events: AuthEvent[]): AuthEvent[] {
        const suspiciousEvents: AuthEvent[] = [];
        const typedEvents = events as Array<{ details?: { ipAddress?: string }; timestamp: Date }>;

        // Analyze patterns
        for (const event of typedEvents) {
            const ipAddress = event.details?.ipAddress;

            if (ipAddress) {
                // Multiple failed attempts from same IP
                const ipEvents = typedEvents.filter(e => e.details?.ipAddress === ipAddress);
                if (ipEvents.length > 5) {
                    suspiciousEvents.push({
                        type: AuthEventType.SECURITY,
                        timestamp: new Date(),
                        details: { ip: ipAddress, count: ipEvents.length, reason: 'multiple_failures' }
                    });

                    // Auto-block IP after multiple failures
                    this.blockIP(ipAddress, 24 * 60 * 60 * 1000); // 24 hours
                }
            }

            // Rapid successive attempts
            const timeWindows = this.getTimeWindows(events);
            for (const window of timeWindows) {
                const windowEvents = typedEvents.filter(e =>
                    e.timestamp >= window.start && e.timestamp <= window.end
                );

                if (windowEvents.length > 10) {
                    suspiciousEvents.push({
                        type: AuthEventType.SECURITY,
                        timestamp: new Date(),
                        details: {
                            timeWindow: `${window.start.toISOString()} - ${window.end.toISOString()}`,
                            count: windowEvents.length,
                            reason: 'rapid_attempts'
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
     * Checks rate limiting and IP blocking
     */
    checkRateLimit(userId: string, attempts: number, ipAddress?: string): boolean {
        // Check if IP is blocked first
        if (ipAddress && this.isIPBlocked(ipAddress)) {
            return false; // Blocked IP, deny access
        }

        const userLimit = this.rateLimitStore.get(userId) || { attempts: 5, windowStart: Date.now() };

        if (attempts < userLimit.attempts) {
            return true; // Within limit
        }

        const timeSinceLastAttempt = Date.now() - userLimit.windowStart;
        const isWithinWindow = timeSinceLastAttempt < 15 * 60 * 1000;

        return !isWithinWindow; // Allow only if window has expired
    }

    /**
     * Encrypts sensitive data
     */
    encryptSensitiveData(data: unknown): string {
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
    decryptSensitiveData(encryptedData: string): unknown {
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
     * Checks if an IP address is blocked
     */
    isIPBlocked(ipAddress: string): boolean {
        return this.blockedIPs.has(ipAddress);
    }

    /**
     * Blocks an IP address for a specified duration
     */
    blockIP(ipAddress: string, durationMs: number = 60 * 60 * 1000): void {
        this.blockedIPs.add(ipAddress);

        // Auto-unblock after duration
        setTimeout(() => {
            this.unblockIP(ipAddress);
        }, durationMs);
    }

    /**
     * Unblocks an IP address
     */
    unblockIP(ipAddress: string): void {
        this.blockedIPs.delete(ipAddress);
    }

    /**
     * Gets all currently blocked IPs
     */
    getBlockedIPs(): string[] {
        return Array.from(this.blockedIPs);
    }

    /**
     * Gets security monitoring data including blocked IPs and rate limit info
     */
    getSecurityMonitoringData(): {
        blockedIPs: string[];
        rateLimitEntries: number;
        totalBlockedIPs: number;
    } {
        return {
            blockedIPs: this.getBlockedIPs(),
            rateLimitEntries: this.rateLimitStore.size,
            totalBlockedIPs: this.blockedIPs.size
        };
    }


    /**
     * Gets time windows for analysis
     */
    private getTimeWindows(events: AuthEvent[]): { start: Date; end: Date }[] {
        const windows = [];
        const sortedEvents = events.sort((a: AuthEvent, b: AuthEvent) => a.timestamp.getTime() - b.timestamp.getTime());

        for (let i = 0; i < sortedEvents.length; i++) {
            const event = sortedEvents[i];
            if (!event) continue;
            const windowStart = new Date(event.timestamp.getTime() - 5 * 60 * 1000);
            const windowEnd = new Date(event.timestamp.getTime() + 5 * 60 * 1000);

            windows.push({ start: windowStart, end: windowEnd });
        }

        return windows;
    }
}
