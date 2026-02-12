/**
 * Error Classification System Types
 * 
 * Enhanced error classification system with pattern matching,
 * learning capabilities, and context-aware analysis.
 */

import { IError, IErrorContext, IErrorClassification } from './ErrorTypes';
import { ErrorCategory, ErrorSeverity, ErrorRecoveryStrategy } from './ErrorEnums';

/**
 * Error pattern matching result
 */
export interface IErrorPatternMatch {
    /** Pattern that matched */
    pattern: IErrorClassificationPattern;
    /** Match confidence score (0-1) */
    confidence: number;
    /** Matched text segments */
    matches: Array<{
        text: string;
        startIndex: number;
        endIndex: number;
    }>;
}

/**
 * Enhanced error classification pattern
 */
export interface IErrorClassificationPattern {
    /** Unique pattern identifier */
    id: string;
    /** Regular expression pattern */
    pattern: RegExp;
    /** Classification result when pattern matches */
    classification: Omit<IErrorClassification, 'confidence' | 'tags' | 'metadata'>;
    /** Base confidence score for this pattern */
    baseConfidence: number;
    /** Pattern priority (higher = more important) */
    priority: number;
    /** Pattern category for organization */
    patternCategory: string;
    /** Tags to apply when pattern matches */
    tags: string[];
    /** Context conditions for this pattern */
    contextConditions?: IContextCondition[];
    /** Learning data for this pattern */
    learningData?: IPatternLearningData;
}

/**
 * Context condition for pattern matching
 */
export interface IContextCondition {
    /** Context field to check */
    field: keyof IErrorContext;
    /** Condition operator */
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex' | 'in' | 'notIn';
    /** Expected value */
    value: any;
    /** Whether this condition is required */
    required: boolean;
}

/**
 * Pattern learning data
 */
export interface IPatternLearningData {
    /** Number of times pattern was applied */
    applications: number;
    /** User feedback on pattern effectiveness */
    feedback: Array<{
        helpful: boolean;
        timestamp: Date;
        userId?: string;
    }>;
    /** Average effectiveness score */
    effectivenessScore: number;
    /** Last updated timestamp */
    lastUpdated: Date;
}

/**
 * Classification context
 */
export interface IClassificationContext {
    /** Error context */
    errorContext: IErrorContext;
    /** Application state */
    applicationState: {
        environment: string;
        version: string;
        buildNumber?: string;
        featureFlags: Record<string, boolean>;
    };
    /** User information */
    userInfo: {
        id?: string;
        role?: string;
        permissions?: string[];
        preferences?: Record<string, any>;
    };
    /** Browser information */
    browserInfo: {
        type: string;
        version: string;
        engine: string;
        mobile: boolean;
        language: string;
    };
    /** Network information */
    networkInfo: {
        online: boolean;
        connectionType?: string;
        effectiveType?: string;
    };
}

/**
 * Classification result with detailed information
 */
export interface IDetailedClassificationResult extends IErrorClassification {
    /** All pattern matches found */
    allMatches: IErrorPatternMatch[];
    /** Selected pattern match */
    selectedMatch?: IErrorPatternMatch;
    /** Alternative classifications */
    alternatives: Array<{
        classification: IErrorClassification;
        confidence: number;
        reason: string;
    }>;
    /** Classification metadata */
    classificationMetadata: {
        processingTime: number;
        patternsEvaluated: number;
        contextApplied: boolean;
        learningAdjusted: boolean;
    };
}

/**
 * Learning feedback data
 */
export interface IClassificationFeedback {
    /** Error identifier */
    errorId: string;
    /** Classification result */
    classification: IErrorClassification;
    /** User feedback */
    feedback: 'helpful' | 'not-helpful' | 'partially-helpful';
    /** User comments */
    comments?: string;
    /** User information */
    userId?: string;
    /** Feedback timestamp */
    timestamp: Date;
    /** Suggested improvements */
    suggestions?: {
        category?: ErrorCategory;
        severity?: ErrorSeverity;
        userMessage?: string;
        suggestedActions?: string[];
        recoveryStrategy?: ErrorRecoveryStrategy;
    };
}

/**
 * Learning insights data
 */
export interface ILearningInsights {
    /** Total classifications performed */
    totalClassifications: number;
    /** Classification accuracy rate */
    accuracyRate: number;
    /** Most effective patterns */
    effectivePatterns: Array<{
        patternId: string;
        effectiveness: number;
        applications: number;
    }>;
    /** Common error types */
    commonErrorTypes: Array<{
        category: ErrorCategory;
        count: number;
        percentage: number;
    }>;
    /** User feedback summary */
    feedbackSummary: {
        helpful: number;
        notHelpful: number;
        partiallyHelpful: number;
        total: number;
    };
    /** Improvement suggestions */
    improvementSuggestions: Array<{
        type: 'add_pattern' | 'modify_pattern' | 'remove_pattern' | 'adjust_confidence';
        description: string;
        priority: 'high' | 'medium' | 'low';
        data?: any;
    }>;
}

/**
 * Classification cache entry
 */
export interface IClassificationCache {
    /** Cache key */
    key: string;
    /** Classification result */
    classification: IErrorClassification;
    /** Cache timestamp */
    timestamp: Date;
    /** Cache expiration */
    expiresAt: Date;
    /** Hit count */
    hitCount: number;
}

/**
 * Classification service configuration
 */
export interface IClassificationServiceConfig {
    /** Enable learning system */
    enableLearning?: boolean;
    /** Cache size limit */
    cacheSize?: number;
    /** Cache TTL in milliseconds */
    cacheTTL?: number;
    /** Maximum patterns to evaluate */
    maxPatterns?: number;
    /** Minimum confidence threshold */
    minConfidence?: number;
    /** Enable context-aware classification */
    enableContextAware?: boolean;
    /** Classification timeout in milliseconds */
    classificationTimeout?: number;
    /** Learning data retention period in days */
    learningRetentionDays?: number;
}

/**
 * Pattern optimization result
 */
export interface IPatternOptimizationResult {
    /** Pattern identifier */
    patternId: string;
    /** Optimization type */
    optimizationType: 'confidence_adjustment' | 'priority_change' | 'pattern_refinement' | 'pattern_removal';
    /** Old value */
    oldValue: any;
    /** New value */
    newValue: any;
    /** Reason for optimization */
    reason: string;
    /** Expected improvement */
    expectedImprovement: number;
    /** Optimization timestamp */
    timestamp: Date;
}

/**
 * Classification analytics data
 */
export interface IClassificationAnalytics {
    /** Classification volume over time */
    volumeOverTime: Array<{
        date: Date;
        classifications: number;
        uniqueErrors: number;
    }>;
    /** Category distribution */
    categoryDistribution: Record<ErrorCategory, number>;
    /** Severity distribution */
    severityDistribution: Record<ErrorSeverity, number>;
    /** Recovery strategy effectiveness */
    recoveryEffectiveness: Record<ErrorRecoveryStrategy, {
        usage: number;
        success: number;
        successRate: number;
    }>;
    /** Context correlation data */
    contextCorrelation: Array<{
        contextField: string;
        correlation: number;
        sampleSize: number;
    }>;
    /** Performance metrics */
    performance: {
        averageClassificationTime: number;
        cacheHitRate: number;
        patternMatchRate: number;
        learningAccuracy: number;
    };
}

/**
 * Export request for learning data
 */
export interface ILearningDataExport {
    /** Export format */
    format: 'json' | 'csv' | 'xml';
    /** Include patterns */
    includePatterns: boolean;
    /** Include learning data */
    includeLearningData: boolean;
    /** Include analytics */
    includeAnalytics: boolean;
    /** Date range filter */
    dateRange?: {
        start: Date;
        end: Date;
    };
    /** Category filter */
    categoryFilter?: ErrorCategory[];
}

/**
 * Import request for learning data
 */
export interface ILearningDataImport {
    /** Import data */
    data: any;
    /** Import options */
    options: {
        mergeWithExisting: boolean;
        validatePatterns: boolean;
        updateLearningData: boolean;
        backupExisting: boolean;
    };
}

/**
 * Classification service interface
 */
export interface IErrorClassificationService {
    /** Classify an error */
    classify(error: IError, context?: IErrorContext): Promise<IDetailedClassificationResult>;
    /** Add classification pattern */
    addPattern(pattern: IErrorClassificationPattern): void;
    /** Remove classification pattern */
    removePattern(patternId: string): boolean;
    /** Update classification pattern */
    updatePattern(patternId: string, updates: Partial<IErrorClassificationPattern>): boolean;
    /** Get all patterns */
    getPatterns(): IErrorClassificationPattern[];
    /** Submit feedback for classification */
    submitFeedback(feedback: IClassificationFeedback): void;
    /** Get learning insights */
    getLearningInsights(): ILearningInsights;
    /** Optimize patterns based on learning data */
    optimizePatterns(): IPatternOptimizationResult[];
    /** Export learning data */
    exportLearningData(request: ILearningDataExport): string;
    /** Import learning data */
    importLearningData(data: string, format: 'json' | 'csv' | 'xml'): Promise<void>;
    /** Clear learning data */
    clearLearningData(): void;
    /** Get classification analytics */
    getAnalytics(): IClassificationAnalytics;
    /** Configure service */
    configure(config: Partial<IClassificationServiceConfig>): void;
}
