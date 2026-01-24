/**
 * Error Reporting Service
 * 
 * This service provides comprehensive error reporting, logging, and analysis
 * capabilities with intelligent error aggregation and alerting.
 */

import { ErrorClassification, ErrorContext } from './ErrorClassification';

export interface ErrorReport {
    id: string;
    timestamp: Date;
    error: {
        name: string;
        message: string;
        stack?: string;
        cause?: Error;
    };
    classification: ErrorClassification;
    context: ErrorContext;
    userFeedback?: {
        rating: 1 | 2 | 3 | 4 | 5;
        comment?: string;
        helpful: boolean;
    };
    recovery: {
        attempted: boolean;
        successful: boolean;
        strategy?: string;
        attempts: number;
        duration: number;
    };
    environment: {
        userAgent: string;
        url: string;
        referrer?: string;
        screen: {
            width: number;
            height: number;
        };
        viewport: {
            width: number;
            height: number;
        };
        connection?: {
            effectiveType?: string;
            downlink?: number;
            rtt?: number;
        };
    };
    session: {
        id: string;
        startTime: Date;
        pageViews: number;
        errorsCount: number;
        userId?: string;
    };
    analytics: {
        errorFrequency: number;
        similarErrors: number;
        impactScore: number;
        priority: 'low' | 'medium' | 'high' | 'critical';
    };
}

export interface ErrorReportingConfig {
    enabled: boolean;
    endpoint?: string;
    apiKey?: string;
    batchSize: number;
    flushInterval: number;
    maxRetries: number;
    includeStackTrace: boolean;
    includeUserFeedback: boolean;
    enableRealTimeAlerts: boolean;
    alertThresholds: {
        errorRate: number;
        criticalErrors: number;
        sameErrorCount: number;
    };
}

export interface ErrorAlert {
    id: string;
    type: 'error_rate' | 'critical_error' | 'same_error' | 'performance';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: Date;
    errors: ErrorReport[];
    resolved: boolean;
    acknowledgedBy?: string;
    resolvedAt?: Date;
}

/**
 * Error Reporting Service
 */
export class ErrorReportingService {
    private static instance: ErrorReportingService;
    private config: ErrorReportingConfig;
    private errorQueue: ErrorReport[] = [];
    private alerts: ErrorAlert[] = [];
    private sessionData: {
        id: string;
        startTime: Date;
        pageViews: number;
        errorsCount: number;
        userId?: string;
    };
    private flushTimer?: NodeJS.Timeout;
    private errorCounts: Map<string, number> = new Map();

    private constructor(config: Partial<ErrorReportingConfig> = {}) {
        this.config = {
            enabled: true,
            batchSize: 10,
            flushInterval: 30000, // 30 seconds
            maxRetries: 3,
            includeStackTrace: true,
            includeUserFeedback: true,
            enableRealTimeAlerts: true,
            alertThresholds: {
                errorRate: 0.05, // 5% error rate
                criticalErrors: 3,
                sameErrorCount: 5
            },
            ...config
        };

        this.sessionData = {
            id: this.generateSessionId(),
            startTime: new Date(),
            pageViews: 0,
            errorsCount: 0
        };

        this.initializeSession();
        this.startFlushTimer();
    }

    public static getInstance(config?: Partial<ErrorReportingConfig>): ErrorReportingService {
        if (!ErrorReportingService.instance) {
            ErrorReportingService.instance = new ErrorReportingService(config);
        }
        return ErrorReportingService.instance;
    }

    /**
     * Initialize session tracking
     */
    private initializeSession(): void {
        // Track page views
        let pageViews = parseInt(sessionStorage.getItem('pageViews') || '0');
        pageViews++;
        sessionStorage.setItem('pageViews', pageViews.toString());
        this.sessionData.pageViews = pageViews;

        // Track user ID if available
        const userId = this.getUserId();
        if (userId) {
            this.sessionData.userId = userId;
        }

        // Track session start
        const sessionStart = sessionStorage.getItem('sessionStart');
        if (sessionStart) {
            this.sessionData.startTime = new Date(sessionStart);
        } else {
            sessionStorage.setItem('sessionStart', this.sessionData.startTime.toISOString());
        }
    }

    /**
     * Report an error
     */
    public async reportError(
        error: Error,
        classification: ErrorClassification,
        context: ErrorContext,
        recoveryInfo?: {
            attempted: boolean;
            successful: boolean;
            strategy?: string;
            attempts: number;
            duration: number;
        }
    ): Promise<string> {
        if (!this.config.enabled) {
            return '';
        }

        const errorReport: ErrorReport = {
            id: this.generateErrorId(),
            timestamp: new Date(),
            error: {
                name: error.name,
                message: error.message,
                stack: this.config.includeStackTrace ? error.stack : undefined,
                cause: error.cause || undefined
            },
            classification,
            context: {
                ...context,
                timestamp: context.timestamp || new Date()
            },
            recovery: recoveryInfo || {
                attempted: false,
                successful: false,
                attempts: 0,
                duration: 0
            },
            environment: this.getEnvironmentData(),
            session: { ...this.sessionData },
            analytics: this.calculateAnalytics(error, classification)
        };

        // Add to queue
        this.errorQueue.push(errorReport);
        this.sessionData.errorsCount++;

        // Track error counts for alerting
        const errorKey = this.getErrorKey(error);
        this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);

        // Check for alerts
        if (this.config.enableRealTimeAlerts) {
            this.checkForAlerts(errorReport);
        }

        // Flush if batch size reached
        if (this.errorQueue.length >= this.config.batchSize) {
            await this.flushErrors();
        }

        return errorReport.id;
    }

    /**
     * Add user feedback to an error report
     */
    public async addUserFeedback(
        errorId: string,
        feedback: {
            rating: 1 | 2 | 3 | 4 | 5;
            comment?: string;
            helpful: boolean;
        }
    ): Promise<void> {
        if (!this.config.includeUserFeedback) {
            return;
        }

        const errorReport = this.errorQueue.find(report => report.id === errorId);
        if (errorReport) {
            errorReport.userFeedback = feedback;
        }
    }

    /**
     * Get environment data
     */
    private getEnvironmentData() {
        return {
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer || undefined,
            screen: {
                width: screen.width,
                height: screen.height
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            connection: (navigator as any).connection ? {
                effectiveType: (navigator as any).connection.effectiveType,
                downlink: (navigator as any).connection.downlink,
                rtt: (navigator as any).connection.rtt
            } : undefined
        };
    }

    /**
     * Calculate analytics for error
     */
    private calculateAnalytics(error: Error, classification: ErrorClassification) {
        const errorKey = this.getErrorKey(error);
        const errorCount = this.errorCounts.get(errorKey) || 0;
        
        // Calculate error frequency (errors per minute)
        const sessionDuration = (Date.now() - this.sessionData.startTime.getTime()) / 60000;
        const errorFrequency = sessionDuration > 0 ? this.sessionData.errorsCount / sessionDuration : 0;

        // Calculate similar errors
        const similarErrors = this.errorQueue.filter(
            report => report.classification.type === classification.type
        ).length;

        // Calculate impact score (0-100)
        let impactScore = 0;
        if (classification.severity === 'critical') impactScore += 40;
        else if (classification.severity === 'high') impactScore += 30;
        else if (classification.severity === 'medium') impactScore += 20;
        else impactScore += 10;

        if (!classification.recoverable) impactScore += 20;
        if (errorCount > 3) impactScore += 15;
        if (errorFrequency > 0.1) impactScore += 15;
        if (similarErrors > 5) impactScore += 10;

        // Determine priority
        let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';
        if (impactScore >= 80) priority = 'critical';
        else if (impactScore >= 60) priority = 'high';
        else if (impactScore >= 40) priority = 'medium';

        return {
            errorFrequency,
            similarErrors,
            impactScore,
            priority
        };
    }

    /**
     * Check for alerts
     */
    private checkForAlerts(errorReport: ErrorReport): void {
        const { alertThresholds } = this.config;

        // Check critical error threshold
        if (errorReport.classification.severity === 'critical') {
            const criticalErrors = this.errorQueue.filter(
                report => report.classification.severity === 'critical'
            ).length;

            if (criticalErrors >= alertThresholds.criticalErrors) {
                this.createAlert({
                    type: 'critical_error',
                    severity: 'critical',
                    message: `Critical error threshold exceeded: ${criticalErrors} critical errors`,
                    errors: this.errorQueue.filter(
                        report => report.classification.severity === 'critical'
                    )
                });
            }
        }

        // Check same error threshold
        const errorKey = this.getErrorKeyFromReport(errorReport);
        const sameErrorCount = this.errorCounts.get(errorKey) || 0;
        
        if (sameErrorCount >= alertThresholds.sameErrorCount) {
            this.createAlert({
                type: 'same_error',
                severity: 'high',
                message: `Same error occurred ${sameErrorCount} times: ${errorReport.error.message}`,
                errors: this.errorQueue.filter(report => 
                    this.getErrorKeyFromReport(report) === errorKey
                )
            });
        }

        // Check error rate threshold
        const sessionDuration = (Date.now() - this.sessionData.startTime.getTime()) / 60000;
        if (sessionDuration > 0) {
            const errorRate = this.sessionData.errorsCount / sessionDuration;
            if (errorRate > alertThresholds.errorRate) {
                this.createAlert({
                    type: 'error_rate',
                    severity: 'medium',
                    message: `Error rate threshold exceeded: ${(errorRate * 100).toFixed(2)}%`,
                    errors: this.errorQueue.slice(-10)
                });
            }
        }
    }

    /**
     * Create an alert
     */
    private createAlert(alertData: Omit<ErrorAlert, 'id' | 'timestamp' | 'resolved'>): void {
        const alert: ErrorAlert = {
            id: this.generateAlertId(),
            timestamp: new Date(),
            resolved: false,
            ...alertData
        };

        this.alerts.push(alert);

        // Keep only last 100 alerts
        if (this.alerts.length > 100) {
            this.alerts.splice(0, this.alerts.length - 100);
        }

        // Trigger alert notification
        this.triggerAlertNotification(alert);
    }

    /**
     * Trigger alert notification
     */
    private triggerAlertNotification(alert: ErrorAlert): void {
        // In a real implementation, this would send notifications
        console.warn('ALERT:', alert.message, {
            severity: alert.severity,
            errors: alert.errors.length
        });

        // You could integrate with:
        // - Email notifications
        // - Slack/Teams webhooks
        // - Push notifications
        // - SMS alerts
        // - Dashboard alerts
    }

    /**
     * Flush errors to reporting service
     */
    private async flushErrors(): Promise<void> {
        if (!this.config.endpoint || this.errorQueue.length === 0) {
            return;
        }

        const errorsToSend = [...this.errorQueue];
        this.errorQueue = [];

        try {
            const response = await fetch(this.config.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.config.apiKey || ''
                },
                body: JSON.stringify({
                    errors: errorsToSend,
                    session: this.sessionData,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            console.log(`Successfully reported ${errorsToSend.length} errors`);
        } catch (error) {
            console.error('Failed to report errors:', error);
            
            // Re-queue errors for retry
            this.errorQueue.unshift(...errorsToSend);
        }
    }

    /**
     * Start flush timer
     */
    private startFlushTimer(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }

        this.flushTimer = setInterval(() => {
            this.flushErrors();
        }, this.config.flushInterval);
    }

    /**
     * Generate error ID
     */
    private generateErrorId(): string {
        return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Generate alert ID
     */
    private generateAlertId(): string {
        return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Generate session ID
     */
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get user ID
     */
    private getUserId(): string | undefined {
        return (window as any).currentUser?.id || 
               localStorage.getItem('userId') || 
               sessionStorage.getItem('userId') || 
               undefined;
    }

    /**
     * Get error key for counting
     */
    private getErrorKey(error: Error): string {
        return `${error.name}:${error.message.slice(0, 100)}`;
    }

    /**
     * Get error key from report
     */
    private getErrorKeyFromReport(report: ErrorReport): string {
        return `${report.error.name}:${report.error.message.slice(0, 100)}`;
    }

    /**
     * Get error statistics
     */
    public getErrorStatistics(): {
        totalErrors: number;
        errorsByType: Record<string, number>;
        errorsBySeverity: Record<string, number>;
        activeAlerts: number;
        errorRate: number;
        topErrors: Array<{ message: string; count: number; lastOccurrence: Date }>;
    } {
        const errorsByType: Record<string, number> = {};
        const errorsBySeverity: Record<string, number> = {};
        const errorCounts: Map<string, { count: number; lastOccurrence: Date }> = new Map();

        this.errorQueue.forEach(error => {
            // Count by type
            errorsByType[error.classification.type] = (errorsByType[error.classification.type] || 0) + 1;
            
            // Count by severity
            errorsBySeverity[error.classification.severity] = (errorsBySeverity[error.classification.severity] || 0) + 1;
            
            // Count by message
            const key = error.error.message;
            const existing = errorCounts.get(key);
            if (existing) {
                existing.count++;
                existing.lastOccurrence = error.timestamp;
            } else {
                errorCounts.set(key, {
                    count: 1,
                    lastOccurrence: error.timestamp
                });
            }
        });

        const topErrors = Array.from(errorCounts.entries())
            .map(([message, data]) => ({ message, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const sessionDuration = (Date.now() - this.sessionData.startTime.getTime()) / 60000;
        const errorRate = sessionDuration > 0 ? this.sessionData.errorsCount / sessionDuration : 0;

        return {
            totalErrors: this.errorQueue.length,
            errorsByType,
            errorsBySeverity,
            activeAlerts: this.alerts.filter(alert => !alert.resolved).length,
            errorRate,
            topErrors
        };
    }

    /**
     * Get alerts
     */
    public getAlerts(resolved?: boolean): ErrorAlert[] {
        return this.alerts.filter(alert => 
            resolved === undefined || alert.resolved === resolved
        );
    }

    /**
     * Acknowledge alert
     */
    public acknowledgeAlert(alertId: string, acknowledgedBy?: string): void {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledgedBy = acknowledgedBy;
        }
    }

    /**
     * Resolve alert
     */
    public resolveAlert(alertId: string): void {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.resolved = true;
            alert.resolvedAt = new Date();
        }
    }

    /**
     * Force flush errors
     */
    public async forceFlush(): Promise<void> {
        await this.flushErrors();
    }

    /**
     * Clear error queue
     */
    public clearQueue(): void {
        this.errorQueue = [];
    }

    /**
     * Update configuration
     */
    public updateConfig(newConfig: Partial<ErrorReportingConfig>): void {
        this.config = { ...this.config, ...newConfig };
        
        if (newConfig.flushInterval) {
            this.startFlushTimer();
        }
    }

    /**
     * Export error data
     */
    public exportData(): string {
        return JSON.stringify({
            errors: this.errorQueue,
            alerts: this.alerts,
            session: this.sessionData,
            statistics: this.getErrorStatistics(),
            config: this.config,
            exportTimestamp: new Date().toISOString()
        }, null, 2);
    }

    /**
     * Cleanup
     */
    public cleanup(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        this.forceFlush();
    }
}

// Export singleton instance
export const errorReporter = ErrorReportingService.getInstance();

// Export convenience functions
export const reportError = (
    error: Error,
    classification: ErrorClassification,
    context: ErrorContext,
    recoveryInfo?: {
        attempted: boolean;
        successful: boolean;
        strategy?: string;
        attempts: number;
        duration: number;
    }
): Promise<string> => {
    return errorReporter.reportError(error, classification, context, recoveryInfo);
};

export const addUserFeedback = (
    errorId: string,
    feedback: {
        rating: 1 | 2 | 3 | 4 | 5;
        comment?: string;
        helpful: boolean;
    }
): Promise<void> => {
    return errorReporter.addUserFeedback(errorId, feedback);
};

export const getErrorStatistics = () => {
    return errorReporter.getErrorStatistics();
};
