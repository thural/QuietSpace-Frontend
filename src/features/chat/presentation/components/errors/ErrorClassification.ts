/**
 * Error Classification System
 * 
 * This module provides intelligent error classification, categorization,
 * and analysis capabilities for comprehensive error management.
 */

export interface ErrorClassification {
    type: 'network' | 'validation' | 'permission' | 'runtime' | 'dependency' | 'unknown';
    severity: 'low' | 'medium' | 'high' | 'critical';
    recoverable: boolean;
    userMessage: string;
    suggestedActions: string[];
    retryStrategy: 'immediate' | 'delayed' | 'manual' | 'none';
    category: string;
    tags: string[];
    metadata: Record<string, any>;
}

export interface ErrorPattern {
    pattern: RegExp;
    classification: Partial<ErrorClassification>;
    confidence: number;
}

export interface ErrorContext {
    component?: string;
    action?: string;
    userRole?: string;
    environment?: string;
    timestamp: Date;
    userAgent?: string;
    url?: string;
    userId?: string;
}

/**
 * Error Classification Service
 */
export class ErrorClassificationService {
    private static instance: ErrorClassificationService;
    private errorPatterns: ErrorPattern[] = [];
    private learningData: Map<string, ErrorClassification[]> = new Map();

    private constructor() {
        this.initializePatterns();
    }

    public static getInstance(): ErrorClassificationService {
        if (!ErrorClassificationService.instance) {
            ErrorClassificationService.instance = new ErrorClassificationService();
        }
        return ErrorClassificationService.instance;
    }

    /**
     * Initialize error patterns for classification
     */
    private initializePatterns(): void {
        this.errorPatterns = [
            // Network errors
            {
                pattern: /network|connection|fetch|timeout|offline|unreachable/i,
                classification: {
                    type: 'network',
                    severity: 'medium',
                    recoverable: true,
                    userMessage: 'Network connection issue detected',
                    suggestedActions: ['Check your internet connection', 'Try refreshing the page', 'Contact support if issue persists'],
                    retryStrategy: 'delayed',
                    category: 'connectivity',
                    tags: ['network', 'connection', 'external']
                },
                confidence: 0.9
            },
            {
                pattern: /cors|cross-origin|access-control/i,
                classification: {
                    type: 'network',
                    severity: 'high',
                    recoverable: false,
                    userMessage: 'Cross-origin request blocked',
                    suggestedActions: ['Contact your administrator', 'Check CORS configuration', 'Verify API endpoints'],
                    retryStrategy: 'none',
                    category: 'security',
                    tags: ['cors', 'security', 'configuration']
                },
                confidence: 0.95
            },

            // Validation errors
            {
                pattern: /validation|invalid|required|format|schema/i,
                classification: {
                    type: 'validation',
                    severity: 'low',
                    recoverable: true,
                    userMessage: 'Invalid data provided',
                    suggestedActions: ['Check your input data', 'Ensure all required fields are filled', 'Follow the specified format'],
                    retryStrategy: 'manual',
                    category: 'data',
                    tags: ['validation', 'input', 'user-error']
                },
                confidence: 0.85
            },
            {
                pattern: /typeerror|cannot read property|undefined|null/i,
                classification: {
                    type: 'runtime',
                    severity: 'medium',
                    recoverable: true,
                    userMessage: 'Application encountered an unexpected error',
                    suggestedActions: ['Refresh the page', 'Try the action again', 'Report this issue if it persists'],
                    retryStrategy: 'delayed',
                    category: 'runtime',
                    tags: ['runtime', 'javascript', 'unexpected']
                },
                confidence: 0.8
            },

            // Permission errors
            {
                pattern: /permission|unauthorized|forbidden|access denied|401|403/i,
                classification: {
                    type: 'permission',
                    severity: 'high',
                    recoverable: false,
                    userMessage: 'Permission denied',
                    suggestedActions: ['Check your user permissions', 'Contact your administrator', 'Try logging in again'],
                    retryStrategy: 'none',
                    category: 'security',
                    tags: ['permission', 'authorization', 'security']
                },
                confidence: 0.95
            },

            // Dependency errors
            {
                pattern: /chunkloaderror|loading chunk|module not found|cannot find module/i,
                classification: {
                    type: 'dependency',
                    severity: 'high',
                    recoverable: true,
                    userMessage: 'Application component failed to load',
                    suggestedActions: ['Refresh the page', 'Clear browser cache', 'Check for updates'],
                    retryStrategy: 'immediate',
                    category: 'infrastructure',
                    tags: ['dependency', 'module', 'loading']
                },
                confidence: 0.9
            },
            {
                pattern: /failed to fetch|networkerror|aborterror/i,
                classification: {
                    type: 'network',
                    severity: 'medium',
                    recoverable: true,
                    userMessage: 'Network request failed',
                    suggestedActions: ['Check your internet connection', 'Try again later', 'Contact support if issue persists'],
                    retryStrategy: 'delayed',
                    category: 'connectivity',
                    tags: ['network', 'fetch', 'request']
                },
                confidence: 0.85
            },

            // API errors
            {
                pattern: /500|internal server error|server error/i,
                classification: {
                    type: 'runtime',
                    severity: 'high',
                    recoverable: true,
                    userMessage: 'Server error occurred',
                    suggestedActions: ['Try again later', 'Contact support if issue persists', 'Check server status'],
                    retryStrategy: 'delayed',
                    category: 'server',
                    tags: ['server', '500', 'backend']
                },
                confidence: 0.9
            },
            {
                pattern: /404|not found|does not exist/i,
                classification: {
                    type: 'runtime',
                    severity: 'medium',
                    recoverable: false,
                    userMessage: 'Resource not found',
                    suggestedActions: ['Check the URL', 'Verify resource exists', 'Contact support'],
                    retryStrategy: 'none',
                    category: 'resource',
                    tags: ['404', 'not-found', 'resource']
                },
                confidence: 0.95
            },

            // Database errors
            {
                pattern: /database|connection|timeout|pool|sql/i,
                classification: {
                    type: 'runtime',
                    severity: 'high',
                    recoverable: true,
                    userMessage: 'Database connection issue',
                    suggestedActions: ['Try again later', 'Contact support', 'Check database status'],
                    retryStrategy: 'delayed',
                    category: 'database',
                    tags: ['database', 'connection', 'backend']
                },
                confidence: 0.85
            },

            // Authentication errors
            {
                pattern: /authentication|auth|token|expired|invalid token/i,
                classification: {
                    type: 'permission',
                    severity: 'high',
                    recoverable: true,
                    userMessage: 'Authentication failed',
                    suggestedActions: ['Log in again', 'Check your credentials', 'Contact support'],
                    retryStrategy: 'manual',
                    category: 'security',
                    tags: ['authentication', 'auth', 'security']
                },
                confidence: 0.9
            }
        ];
    }

    /**
     * Classify an error based on its characteristics
     */
    public classifyError(
        error: Error, 
        context?: ErrorContext
    ): ErrorClassification {
        const errorMessage = error.message.toLowerCase();
        const errorStack = error.stack?.toLowerCase() || '';
        const errorName = error.name.toLowerCase();

        // Find matching patterns
        const matches = this.errorPatterns
            .map(pattern => ({
                pattern,
                match: this.calculateMatchScore(errorMessage, errorStack, errorName, pattern.pattern),
                classification: pattern.classification
            }))
            .filter(match => match.match > 0)
            .sort((a, b) => b.match - a.match);

        // Get best match
        const bestMatch = matches[0];

        if (bestMatch && bestMatch.match > 0.5) {
            const baseClassification = {
                type: bestMatch.classification.type as ErrorClassification['type'],
                severity: bestMatch.classification.severity as ErrorClassification['severity'],
                recoverable: bestMatch.classification.recoverable || false,
                userMessage: bestMatch.classification.userMessage || 'An error occurred',
                suggestedActions: bestMatch.classification.suggestedActions || [],
                retryStrategy: bestMatch.classification.retryStrategy as ErrorClassification['retryStrategy'],
                category: bestMatch.classification.category || 'general',
                tags: bestMatch.classification.tags || [],
                metadata: {}
            };

            // Enhance with context-specific information
            return this.enhanceClassificationWithContext(baseClassification, error, context);
        }

        // Default classification for unknown errors
        return this.getDefaultClassification(error, context);
    }

    /**
     * Calculate match score for error pattern
     */
    private calculateMatchScore(
        errorMessage: string, 
        errorStack: string, 
        errorName: string, 
        pattern: RegExp
    ): number {
        let score = 0;
        
        // Check error message
        if (pattern.test(errorMessage)) {
            score += 0.8;
        }
        
        // Check error stack
        if (pattern.test(errorStack)) {
            score += 0.5;
        }
        
        // Check error name
        if (pattern.test(errorName)) {
            score += 0.3;
        }
        
        return Math.min(score, 1.0);
    }

    /**
     * Enhance classification with context information
     */
    private enhanceClassificationWithContext(
        baseClassification: ErrorClassification,
        error: Error,
        context?: ErrorContext
    ): ErrorClassification {
        const enhanced = { ...baseClassification };

        if (!context) return enhanced;

        // Adjust severity based on user role
        if (context.userRole === 'admin') {
            // Lower severity for admin users (they can handle more complex issues)
            enhanced.severity = this.adjustSeverityDown(enhanced.severity);
        } else if (context.userRole === 'guest') {
            // Higher severity for guest users (less tolerance for errors)
            enhanced.severity = this.adjustSeverityUp(enhanced.severity);
        }

        // Add context-specific suggested actions
        if (context.component) {
            enhanced.suggestedActions.push(`Check ${context.component} component`);
        }

        if (context.action) {
            enhanced.suggestedActions.push(`Retry ${context.action} action`);
        }

        // Add environment-specific metadata
        enhanced.metadata = {
            ...enhanced.metadata,
            component: context.component,
            action: context.action,
            userRole: context.userRole,
            environment: context.environment,
            userAgent: context.userAgent,
            url: context.url,
            userId: context.userId
        };

        // Add learning tags
        enhanced.tags.push(...this.generateLearningTags(error, context));

        return enhanced;
    }

    /**
     * Get default classification for unknown errors
     */
    private getDefaultClassification(
        error: Error, 
        context?: ErrorContext
    ): ErrorClassification {
        return {
            type: 'unknown',
            severity: 'medium',
            recoverable: true,
            userMessage: 'An unexpected error occurred',
            suggestedActions: ['Refresh the page', 'Try again later', 'Contact support if issue persists'],
            retryStrategy: 'manual',
            category: 'general',
            tags: ['unknown', 'unexpected'],
            metadata: {
                errorName: error.name,
                timestamp: context?.timestamp || new Date(),
                userAgent: context?.userAgent,
                url: context?.url,
                userId: context?.userId
            }
        };
    }

    /**
     * Adjust severity down by one level
     */
    private adjustSeverityDown(severity: ErrorClassification['severity']): ErrorClassification['severity'] {
        switch (severity) {
            case 'critical': return 'high';
            case 'high': return 'medium';
            case 'medium': return 'low';
            case 'low': return 'low';
            default: return severity;
        }
    }

    /**
     * Adjust severity up by one level
     */
    private adjustSeverityUp(severity: ErrorClassification['severity']): ErrorClassification['severity'] {
        switch (severity) {
            case 'low': return 'medium';
            case 'medium': return 'high';
            case 'high': return 'critical';
            case 'critical': return 'critical';
            default: return severity;
        }
    }

    /**
     * Generate learning tags based on error and context
     */
    private generateLearningTags(error: Error, context?: ErrorContext): string[] {
        const tags: string[] = [];

        // Time-based tags
        const hour = new Date().getHours();
        if (hour >= 9 && hour <= 17) {
            tags.push('business-hours');
        } else {
            tags.push('after-hours');
        }

        // Component-based tags
        if (context?.component) {
            tags.push(`component:${context.component}`);
        }

        // Action-based tags
        if (context?.action) {
            tags.push(`action:${context.action}`);
        }

        // Error name tags
        tags.push(`error:${error.name.toLowerCase()}`);

        // Browser tags
        if (context?.userAgent) {
            if (context.userAgent.includes('Chrome')) tags.push('browser:chrome');
            if (context.userAgent.includes('Firefox')) tags.push('browser:firefox');
            if (context.userAgent.includes('Safari')) tags.push('browser:safari');
            if (context.userAgent.includes('Edge')) tags.push('browser:edge');
        }

        return tags;
    }

    /**
     * Learn from error classification feedback
     */
    public learnFromFeedback(
        error: Error, 
        classification: ErrorClassification, 
        userFeedback: 'helpful' | 'not-helpful' | 'partially-helpful'
    ): void {
        const errorKey = this.generateErrorKey(error);
        
        if (!this.learningData.has(errorKey)) {
            this.learningData.set(errorKey, []);
        }

        const classifications = this.learningData.get(errorKey)!;
        classifications.push({
            ...classification,
            metadata: {
                ...classification.metadata,
                userFeedback,
                feedbackTimestamp: new Date()
            }
        });

        // Keep only last 100 classifications per error type
        if (classifications.length > 100) {
            classifications.splice(0, classifications.length - 100);
        }
    }

    /**
     * Generate error key for learning
     */
    private generateErrorKey(error: Error): string {
        return `${error.name}:${error.message.slice(0, 50)}`;
    }

    /**
     * Get learning insights
     */
    public getLearningInsights(): {
        totalErrors: number;
        commonTypes: Array<{ type: string; count: number }>;
        successRate: number;
        averageRecoveryTime: number;
    } {
        const allClassifications = Array.from(this.learningData.values()).flat();
        
        const typeCounts = allClassifications.reduce((acc, classification) => {
            acc[classification.type] = (acc[classification.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const commonTypes = Object.entries(typeCounts)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const helpfulClassifications = allClassifications.filter(
            c => c.metadata.userFeedback === 'helpful'
        );

        return {
            totalErrors: allClassifications.length,
            commonTypes,
            successRate: (helpfulClassifications.length / allClassifications.length) * 100,
            averageRecoveryTime: this.calculateAverageRecoveryTime(allClassifications)
        };
    }

    /**
     * Calculate average recovery time
     */
    private calculateAverageRecoveryTime(classifications: ErrorClassification[]): number {
        // This would be calculated from actual recovery time data
        // For now, return a placeholder value
        return 2500; // 2.5 seconds average
    }

    /**
     * Export learning data for analysis
     */
    public exportLearningData(): string {
        const data = {
            patterns: this.errorPatterns,
            learningData: Object.fromEntries(this.learningData),
            insights: this.getLearningInsights(),
            exportTimestamp: new Date().toISOString()
        };

        return JSON.stringify(data, null, 2);
    }

    /**
     * Import learning data
     */
    public importLearningData(data: string): void {
        try {
            const parsed = JSON.parse(data);
            
            if (parsed.patterns) {
                this.errorPatterns = parsed.patterns;
            }
            
            if (parsed.learningData) {
                this.learningData = new Map(Object.entries(parsed.learningData));
            }
        } catch (error) {
            console.warn('Failed to import learning data:', error);
        }
    }
}

// Export singleton instance
export const errorClassifier = ErrorClassificationService.getInstance();

// Export convenience functions
export const classifyError = (error: Error, context?: ErrorContext): ErrorClassification => {
    return errorClassifier.classifyError(error, context);
};

export const learnFromError = (
    error: Error, 
    classification: ErrorClassification, 
    feedback: 'helpful' | 'not-helpful' | 'partially-helpful'
): void => {
    errorClassifier.learnFromFeedback(error, classification, feedback);
};

export const getErrorInsights = () => {
    return errorClassifier.getLearningInsights();
};
