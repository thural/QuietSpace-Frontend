/**
 * Enterprise security service implementation
 * 
 * Implements security operations with:
 * - IP detection
 * - Rate limiting
 * - Data encryption
 * - Security headers validation
 */

/**
 * Authentication security service interface
 * @interface IAuthSecurityService
 * @description Defines contract for authentication security services
 */
export class IAuthSecurityService {
    /**
     * @param {*} events - Authentication events
     * @returns {*} Suspicious activities detected
     * @description Detects suspicious activity patterns
     */
    detectSuspiciousActivity(events) {
        throw new Error('Method detectSuspiciousActivity() must be implemented');
    }

    /**
     * @param {Object} headers - Security headers
     * @returns {boolean} Whether headers are valid
     * @description Validates security headers
     */
    validateSecurityHeaders(headers) {
        throw new Error('Method validateSecurityHeaders() must be implemented');
    }

    /**
     * @param {string} userId - User ID
     * @param {number} attempts - Number of attempts
     * @param {string} [ipAddress] - IP address
     * @returns {boolean} Whether request is allowed
     * @description Checks rate limiting and IP blocking
     */
    checkRateLimit(userId, attempts, ipAddress) {
        throw new Error('Method checkRateLimit() must be implemented');
    }

    /**
     * @param {*} data - Data to encrypt
     * @returns {string} Encrypted data
     * @description Encrypts sensitive data
     */
    encryptSensitiveData(data) {
        throw new Error('Method encryptSensitiveData() must be implemented');
    }

    /**
     * @param {string} encryptedData - Encrypted data
     * @returns {*} Decrypted data
     * @description Decrypts sensitive data
     */
    decryptSensitiveData(encryptedData) {
        throw new Error('Method decryptSensitiveData() must be implemented');
    }

    /**
     * @returns {Promise<string>} Client IP address
     * @description Gets client IP address
     */
    async getClientIP() {
        throw new Error('Method getClientIP() must be implemented');
    }

    /**
     * @param {string} ipAddress - IP address
     * @returns {boolean} Whether IP is blocked
     * @description Checks if an IP address is blocked
     */
    isIPBlocked(ipAddress) {
        throw new Error('Method isIPBlocked() must be implemented');
    }

    /**
     * @param {string} ipAddress - IP address
     * @param {number} [durationMs] - Block duration
     * @returns {void}
     * @description Blocks an IP address for a specified duration
     */
    blockIP(ipAddress, durationMs) {
        throw new Error('Method blockIP() must be implemented');
    }

    /**
     * @param {string} ipAddress - IP address
     * @returns {void}
     * @description Unblocks an IP address
     */
    unblockIP(ipAddress) {
        throw new Error('Method unblockIP() must be implemented');
    }

    /**
     * @returns {string[]} Blocked IP addresses
     * @description Gets all currently blocked IPs
     */
    getBlockedIPs() {
        throw new Error('Method getBlockedIPs() must be implemented');
    }

    /**
     * @returns {Object} Security monitoring data
     * @description Gets security monitoring data
     */
    getSecurityMonitoringData() {
        throw new Error('Method getSecurityMonitoringData() must be implemented');
    }
}

/**
 * Enterprise security service implementation
 */
export class EnterpriseSecurityService extends IAuthSecurityService {
    /** @type {string} */
    name = 'EnterpriseSecurityService';

    /** @type {Map<string, {attempts: number, windowStart: number}>} */
    rateLimitStore = new Map();

    /** @type {Set<string>} */
    blockedIPs = new Set();

    /**
     * Detects suspicious activity patterns
     * @param {*} events - Authentication events
     * @returns {*} Suspicious activities detected
     */
    detectSuspiciousActivity(events) {
        const suspiciousEvents = [];

        // Analyze patterns
        for (const event of events) {
            const ipAddress = event.details?.ipAddress;

            if (ipAddress) {
                // Multiple failed attempts from same IP
                const ipEvents = events.filter(e => e.details?.ipAddress === ipAddress);
                if (ipEvents.length > 5) {
                    suspiciousEvents.push({
                        type: 'multiple_failures',
                        details: { ip: ipAddress, count: ipEvents.length }
                    });

                    // Auto-block IP after multiple failures
                    this.blockIP(ipAddress, 24 * 60 * 60 * 1000); // 24 hours
                }
            }

            // Rapid successive attempts
            const timeWindows = this.getTimeWindows(events);
            for (const window of timeWindows) {
                const windowEvents = events.filter(e =>
                    e.timestamp >= window.start && e.timestamp <= window.end
                );

                if (windowEvents.length > 10) {
                    suspiciousEvents.push({
                        type: 'rapid_attempts',
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
     * @param {Object} headers - Security headers
     * @returns {boolean} Whether headers are valid
     */
    validateSecurityHeaders(headers) {
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
     * @param {string} userId - User ID
     * @param {number} attempts - Number of attempts
     * @param {string} [ipAddress] - IP address
     * @returns {boolean} Whether request is allowed
     */
    checkRateLimit(userId, attempts, ipAddress) {
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
     * @param {*} data - Data to encrypt
     * @returns {string} Encrypted data
     */
    encryptSensitiveData(data) {
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
     * @param {string} encryptedData - Encrypted data
     * @returns {*} Decrypted data
     */
    decryptSensitiveData(encryptedData) {
        const decrypted = atob(encryptedData);
        return JSON.parse(decrypted);
    }

    /**
     * Gets client IP address
     * @returns {Promise<string>} Client IP address
     */
    async getClientIP() {
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
     * @param {string} ipAddress - IP address
     * @returns {boolean} Whether IP is blocked
     */
    isIPBlocked(ipAddress) {
        return this.blockedIPs.has(ipAddress);
    }

    /**
     * Blocks an IP address for a specified duration
     * @param {string} ipAddress - IP address
     * @param {number} [durationMs] - Block duration
     * @returns {void}
     */
    blockIP(ipAddress, durationMs = 60 * 60 * 1000) {
        this.blockedIPs.add(ipAddress);

        // Auto-unblock after duration
        setTimeout(() => {
            this.unblockIP(ipAddress);
        }, durationMs);
    }

    /**
     * Unblocks an IP address
     * @param {string} ipAddress - IP address
     * @returns {void}
     */
    unblockIP(ipAddress) {
        this.blockedIPs.delete(ipAddress);
    }

    /**
     * Gets all currently blocked IPs
     * @returns {string[]} Blocked IP addresses
     */
    getBlockedIPs() {
        return Array.from(this.blockedIPs);
    }

    /**
     * Gets security monitoring data including blocked IPs and rate limit info
     * @returns {Object} Security monitoring data
     */
    getSecurityMonitoringData() {
        return {
            blockedIPs: this.getBlockedIPs(),
            rateLimitEntries: this.rateLimitStore.size,
            totalBlockedIPs: this.blockedIPs.size
        };
    }


    /**
     * Gets time windows for analysis
     * @param {*} events - Authentication events
     * @returns {Array<{start: Date, end: Date}>} Time windows
     */
    getTimeWindows(events) {
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
