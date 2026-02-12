/**
 * Main Error Handler
 * 
 * Central error handling service that coordinates error classification,
 * reporting, and recovery strategies.
 */

import { IError, IErrorHandler, IErrorContext, IErrorStatistics, IErrorEvent, ErrorEventType } from '../types';
import { ErrorSeverity, ErrorCategory, ErrorRecoveryStrategy } from '../types';
import { IErrorClassificationService } from '../types/ErrorClassification';

/**
 * Main error handler implementation
 */
export class ErrorHandler implements IErrorHandler {
    private errorStatistics: IErrorStatistics;
    private errorHistory: IError[] = [];
    private eventListeners: Map<string, (event: IErrorEvent) => void> = new Map();
    private maxHistorySize: number = 1000;
    private classificationService?: IErrorClassificationService;

    constructor(options?: {
        maxHistorySize?: number;
        classificationService?: IErrorClassificationService;
    }) {
        this.maxHistorySize = options?.maxHistorySize || 1000;
        this.classificationService = options?.classificationService;
        this.errorStatistics = this.initializeStatistics();
    }

    /**
     * Handle an error
     */
    public async handle(error: Error, context?: IErrorContext): Promise<IError> {
        // Convert to standardized error
        const standardError = this.standardizeError(error, context);
        
        // Add to history
        this.addToHistory(standardError);
        
        // Update statistics
        this.updateStatistics(standardError);
        
        // Emit error event
        this.emitEvent('error_occurred', standardError, context);
        
        // Classify error if service is available
        if (this.classificationService) {
            try {
                const classification = await this.classificationService.classify(standardError, context);
                this.emitEvent('error_classified', standardError, context, { classification });
            } catch (classificationError) {
                console.warn('Error classification failed:', classificationError);
            }
        }
        
        return standardError;
    }

    /**
     * Classify an error
     */
    public classify(error: Error, context?: IErrorContext): IErrorClassification {
        if (!this.classificationService) {
            // Fallback classification
            return this.fallbackClassify(error, context);
        }
        
        return this.classificationService.classify(error, context);
    }

    /**
     * Report an error
     */
    public async report(error: IError, context?: IErrorContext): Promise<void> {
        // Create error report
        const report = this.createErrorReport(error, context);
        
        // Emit reporting event
        this.emitEvent('error_reported', error, context, { report });
        
        // In a real implementation, this would send to a reporting service
        console.log('Error reported:', report);
        
        // Update statistics
        this.errorStatistics.totalErrors++;
    }

    /**
     * Attempt error recovery
     */
    public async recover(error: IError, options?: {
        maxRetries?: number;
        retryDelay?: number;
        backoffMultiplier?: number;
        timeout?: number;
        customRecovery?: (error: IError) => Promise<boolean>;
        fallbackAction?: () => void;
    }): Promise<boolean> {
        const {
            maxRetries = 3,
            retryDelay = 1000,
            backoffMultiplier = 2,
            timeout = 30000,
            customRecovery,
            fallbackAction
        } = options || {};

        // Check if error is recoverable
        if (!error.recoverable || error.recoveryStrategy === ErrorRecoveryStrategy.NONE) {
            return false;
        }

        // Use custom recovery if provided
        if (customRecovery) {
            try {
                const success = await Promise.race([
                    customRecovery(error),
                    this.createTimeoutPromise(timeout)
                ]);
                
                if (success) {
                    this.emitEvent('error_recovered', error);
                    return true;
                }
            } catch (recoveryError) {
                console.warn('Custom recovery failed:', recoveryError);
            }
        }

        // Default recovery based on strategy
        return await this.defaultRecovery(error, {
            maxRetries,
            retryDelay,
            backoffMultiplier,
            timeout,
            fallbackAction
        });
    }

    /**
     * Get error statistics
     */
    public getStatistics(): IErrorStatistics {
        return { ...this.errorStatistics };
    }

    /**
     * Subscribe to error events
     */
    public subscribe(eventType: ErrorEventType, listener: (event: IErrorEvent) => void): () => void {
        const key = `${eventType}_${Date.now()}_${Math.random()}`;
        this.eventListeners.set(key, listener);
        
        return () => {
            this.eventListeners.delete(key);
        };
    }

    /**
     * Get error history
     */
    public getErrorHistory(limit?: number): IError[] {
        return limit ? this.errorHistory.slice(-limit) : [...this.errorHistory];
    }

    /**
     * Clear error history
     */
    public clearHistory(): void {
        this.errorHistory = [];
        this.errorStatistics = this.initializeStatistics();
    }

    /**
     * Standardize an error to IError format
     */
    private standardizeError(error: Error, context?: IErrorContext): IError {
        // Check if it's already a standardized error
        if (this.isStandardError(error)) {
            return error as IError;
        }

        // Convert plain Error to IError
        return {
            id: this.generateErrorId(),
            message: error.message,
            code: 'UNKNOWN_ERROR',
            category: ErrorCategory.UNKNOWN,
            severity: ErrorSeverity.MEDIUM,
            recoverable: true,
            recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
            userMessage: error.message,
            suggestedActions: ['Try again', 'Contact support if issue persists'],
            timestamp: new Date(),
            metadata: { stack: error.stack },
            cause: error,
            context,
            toJSON: () => ({
                id: (error as any).id || this.generateErrorId(),
                message: error.message,
                code: 'UNKNOWN_ERROR',
                category: ErrorCategory.UNKNOWN,
                severity: ErrorSeverity.MEDIUM,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: error.message,
                suggestedActions: ['Try again', 'Contact support if issue persists'],
                timestamp: new Date(),
                metadata: { stack: error.stack },
                cause: error,
                context,
                stack: error.stack
            }),
            copy: (modifications) => ({ ...error, ...modifications } as IError)
        };
    }

    /**
     * Check if error is already standardized
     */
    private isStandardError(error: any): error is IError {
        return error &&
            typeof error.id === 'string' &&
            typeof error.message === 'string' &&
            typeof error.code === 'string' &&
            typeof error.category === 'string' &&
            typeof error.severity === 'string' &&
            typeof error.recoverable === 'boolean' &&
            typeof error.recoveryStrategy === 'string' &&
            typeof error.userMessage === 'string' &&
            Array.isArray(error.suggestedActions) &&
            error.timestamp instanceof Date &&
            typeof error.metadata === 'object';
    }

    /**
     * Add error to history
     */
    private addToHistory(error: IError): void {
        this.errorHistory.push(error);
        
        // Maintain history size limit
        if (this.errorHistory.length > this.maxHistorySize) {
            this.errorHistory = this.errorHistory.slice(-this.maxHistorySize);
        }
    }

    /**
     * Update error statistics
     */
    private updateStatistics(error: IError): void {
        this.errorStatistics.totalErrors++;
        
        // Update category statistics
        this.errorStatistics.byCategory[error.category] = 
            (this.errorStatistics.byCategory[error.category] || 0) + 1;
        
        // Update severity statistics
        this.errorStatistics.bySeverity[error.severity] = 
            (this.errorStatistics.bySeverity[error.severity] || 0) + 1;
        
        // Update recoverable statistics
        if (error.recoverable) {
            this.errorStatistics.recoverable++;
        } else {
            this.errorStatistics.nonRecoverable++;
        }
        
        // Update oldest/newest errors
        if (!this.errorStatistics.oldestError || error.timestamp < this.errorStatistics.oldestError.timestamp) {
            this.errorStatistics.oldestError = error;
        }
        if (!this.errorStatistics.newestError || error.timestamp > this.errorStatistics.newestError.timestamp) {
            this.errorStatistics.newestError = error;
        }
    }

    /**
     * Initialize statistics
     */
    private initializeStatistics(): IErrorStatistics {
        return {
            totalErrors: 0,
            byCategory: {} as Record<ErrorCategory, number>,
            bySeverity: {} as Record<ErrorSeverity, number>,
            recoverable: 0,
            nonRecoverable: 0,
            recoverySuccessRate: 0,
            averageRecoveryTime: 0,
            mostCommonErrors: [],
            errorTrends: []
        };
    }

    /**
     * Emit error event
     */
    private emitEvent(
        type: ErrorEventType, 
        error: IError, 
        context?: IErrorContext, 
        data?: any
    ): void {
        const event: IErrorEvent = {
            type,
            timestamp: new Date(),
            error,
            context,
            data
        };

        this.eventListeners.forEach(listener => {
            try {
                listener(event);
            } catch (listenerError) {
                console.warn('Error event listener failed:', listenerError);
            }
        });
    }

    /**
     * Create error report
     */
    private createErrorReport(error: IError, context?: IErrorContext): any {
        return {
            errorId: error.id,
            error: {
                message: error.message,
                code: error.code,
                category: error.category,
                severity: error.severity,
                userMessage: error.userMessage,
                suggestedActions: error.suggestedActions
            },
            context,
            timestamp: error.timestamp,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            url: typeof window !== 'undefined' ? window.location.href : undefined
        };
    }

    /**
     * Fallback classification
     */
    private fallbackClassify(error: Error, context?: IErrorContext): IErrorClassification {
        const message = error.message.toLowerCase();
        
        // Simple pattern matching for fallback classification
        if (message.includes('network') || message.includes('fetch') || message.includes('axios')) {
            return {
                type: ErrorCategory.NETWORK,
                severity: ErrorSeverity.MEDIUM,
                recoverable: true,
                userMessage: 'Network connection issue',
                suggestedActions: ['Check internet connection', 'Try again'],
                retryStrategy: ErrorRecoveryStrategy.DELAYED,
                category: 'network',
                tags: ['network', 'connection'],
                metadata: {},
                confidence: 0.7
            };
        }
        
        if (message.includes('validation') || message.includes('required') || message.includes('invalid')) {
            return {
                type: ErrorCategory.VALIDATION,
                severity: ErrorSeverity.LOW,
                recoverable: true,
                userMessage: 'Invalid input provided',
                suggestedActions: ['Check input data', 'Ensure all fields are filled'],
                retryStrategy: ErrorRecoveryStrategy.MANUAL,
                category: 'validation',
                tags: ['validation', 'input'],
                metadata: {},
                confidence: 0.8
            };
        }
        
        if (message.includes('unauthorized') || message.includes('forbidden') || message.includes('auth')) {
            return {
                type: ErrorCategory.AUTHENTICATION,
                severity: ErrorSeverity.HIGH,
                recoverable: true,
                userMessage: 'Authentication required',
                suggestedActions: ['Log in again', 'Check credentials'],
                retryStrategy: ErrorRecoveryStrategy.MANUAL,
                category: 'authentication',
                tags: ['auth', 'security'],
                metadata: {},
                confidence: 0.9
            };
        }
        
        // Default classification
        return {
            type: ErrorCategory.UNKNOWN,
            severity: ErrorSeverity.MEDIUM,
            recoverable: true,
            userMessage: 'An error occurred',
            suggestedActions: ['Try again', 'Contact support'],
            retryStrategy: ErrorRecoveryStrategy.MANUAL,
            category: 'unknown',
            tags: ['unknown'],
            metadata: {},
            confidence: 0.5
        };
    }

    /**
     * Default recovery implementation
     */
    private async defaultRecovery(
        error: IError, 
        options: {
            maxRetries: number;
            retryDelay: number;
            backoffMultiplier: number;
            timeout: number;
            fallbackAction?: () => void;
        }
    ): Promise<boolean> {
        const { maxRetries, retryDelay, backoffMultiplier, timeout, fallbackAction } = options;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Simulate recovery attempt
                await this.simulateRecoveryAttempt(error, attempt, retryDelay * Math.pow(backoffMultiplier, attempt - 1));
                
                // If we get here, recovery succeeded
                this.emitEvent('error_recovered', error);
                return true;
            } catch (recoveryError) {
                console.warn(`Recovery attempt ${attempt} failed:`, recoveryError);
                
                if (attempt === maxRetries) {
                    // All attempts failed
                    if (fallbackAction) {
                        fallbackAction();
                    }
                    this.emitEvent('error_recovery_failed', error);
                    return false;
                }
            }
        }
        
        return false;
    }

    /**
     * Simulate recovery attempt (placeholder for actual recovery logic)
     */
    private async simulateRecoveryAttempt(error: IError, attempt: number, delay: number): Promise<void> {
        // In a real implementation, this would contain actual recovery logic
        // For now, we just wait to simulate the attempt
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Create timeout promise
     */
    private createTimeoutPromise(timeout: number): Promise<never> {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Recovery timeout')), timeout);
        });
    }

    /**
     * Generate error ID
     */
    private generateErrorId(): string {
        return 'error_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export convenience functions
export const handleError = (error: Error, context?: IErrorContext) => 
    errorHandler.handle(error, context);

export const classifyError = (error: Error, context?: IErrorContext) => 
    errorHandler.classify(error, context);

export const reportError = (error: IError, context?: IErrorContext) => 
    errorHandler.report(error, context);

export const recoverFromError = (error: IError, options?: any) => 
    errorHandler.recover(error, options);

export const getErrorStatistics = () => 
    errorHandler.getStatistics();
