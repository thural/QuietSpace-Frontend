/**
 * Query Validation Service.
 * 
 * Pure domain logic for validating search queries.
 * Contains business rules for query validation.
 */

import type { SearchQuery, SearchFilters } from '@search/domain/entities';

/**
 * QueryValidation interface.
 * 
 * Defines the contract for query validation logic.
 */
export interface IQueryValidation {
    validateQuery(query: string): QueryValidationResult;
    validateFilters(filters: SearchFilters): FilterValidationResult;
    sanitizeQuery(query: string): string;
    isValidQueryLength(query: string): boolean;
    containsForbiddenContent(query: string): boolean;
}

/**
 * QueryValidationResult interface.
 * 
 * Represents the result of query validation.
 */
export interface QueryValidationResult {
    /** Whether the query is valid */
    isValid: boolean;
    
    /** Validation errors, if any */
    errors: ValidationError[];
    
    /** Validation warnings, if any */
    warnings: ValidationWarning[];
    
    /** Sanitized query */
    sanitizedQuery: string;
    
    /** Suggested improvements */
    suggestions: string[];
}

/**
 * FilterValidationResult interface.
 * 
 * Represents the result of filter validation.
 */
export interface FilterValidationResult {
    /** Whether the filters are valid */
    isValid: boolean;
    
    /** Validation errors, if any */
    errors: ValidationError[];
    
    /** Validated and normalized filters */
    normalizedFilters: SearchFilters;
}

/**
 * ValidationError interface.
 * 
 * Represents a validation error.
 */
export interface ValidationError {
    /** Error code */
    code: string;
    
    /** Error message */
    message: string;
    
    /** Error severity */
    severity: 'error' | 'warning';
    
    /** Field that caused the error */
    field?: string;
    
    /** Suggested fix */
    suggestion?: string;
}

/**
 * ValidationWarning interface.
 * 
 * Represents a validation warning.
 */
export interface ValidationWarning {
    /** Warning code */
    code: string;
    
    /** Warning message */
    message: string;
    
    /** Warning type */
    type: 'performance' | 'relevance' | 'security';
}

/**
 * QueryValidation implementation.
 * 
 * Provides pure business logic for query validation.
 * No external dependencies, only pure functions.
 */
export class QueryValidation implements IQueryValidation {
    private readonly MIN_QUERY_LENGTH = 1;
    private readonly MAX_QUERY_LENGTH = 100;
    private readonly MAX_FILTER_ITEMS = 10;
    
    private readonly FORBIDDEN_PATTERNS = [
        /admin/i,
        /root/i,
        /system/i,
        /\bdrop\s+table\b/i,
        /\bdelete\s+from\b/i,
        /\binsert\s+into\b/i,
        /\bupdate\s+set\b/i,
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
    ];

    private readonly FORBIDDEN_WORDS = [
        'admin',
        'root',
        'system',
        'password',
        'secret',
        'token',
        'key',
        'hack',
        'crack',
        'exploit'
    ];

    /**
     * Validates a search query.
     * 
     * @param query - The query to validate
     * @returns QueryValidationResult with validation details
     */
    validateQuery(query: string): QueryValidationResult {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];
        const suggestions: string[] = [];

        // Basic validation
        if (!query || typeof query !== 'string') {
            errors.push({
                code: 'INVALID_INPUT',
                message: 'Query must be a non-empty string',
                severity: 'error',
                suggestion: 'Please enter a search term'
            });
            return {
                isValid: false,
                errors,
                warnings,
                sanitizedQuery: '',
                suggestions
            };
        }

        const sanitizedQuery = this.sanitizeQuery(query);

        // Length validation
        if (!this.isValidQueryLength(sanitizedQuery)) {
            if (sanitizedQuery.length < this.MIN_QUERY_LENGTH) {
                errors.push({
                    code: 'QUERY_TOO_SHORT',
                    message: `Query must be at least ${this.MIN_QUERY_LENGTH} character long`,
                    severity: 'error',
                    field: 'query',
                    suggestion: 'Please enter a longer search term'
                });
            } else {
                errors.push({
                    code: 'QUERY_TOO_LONG',
                    message: `Query cannot exceed ${this.MAX_QUERY_LENGTH} characters`,
                    severity: 'error',
                    field: 'query',
                    suggestion: 'Please shorten your search term'
                });
            }
        }

        // Content validation
        if (this.containsForbiddenContent(sanitizedQuery)) {
            errors.push({
                code: 'FORBIDDEN_CONTENT',
                message: 'Query contains forbidden content',
                severity: 'error',
                field: 'query',
                suggestion: 'Please modify your search terms'
            });
        }

        // Performance warnings
        if (sanitizedQuery.length > 50) {
            warnings.push({
                code: 'LONG_QUERY',
                message: 'Long queries may return fewer results',
                type: 'performance'
            });
        }

        // Relevance warnings
        if (this.hasCommonWords(sanitizedQuery)) {
            warnings.push({
                code: 'COMMON_WORDS',
                message: 'Query contains very common words that may affect relevance',
                type: 'relevance'
            });
            suggestions.push('Try using more specific terms');
        }

        // Special characters warning
        if (this.hasManySpecialChars(sanitizedQuery)) {
            warnings.push({
                code: 'SPECIAL_CHARS',
                message: 'Query contains many special characters',
                type: 'relevance'
            });
            suggestions.push('Consider using simpler search terms');
        }

        const isValid = errors.length === 0;

        return {
            isValid,
            errors,
            warnings,
            sanitizedQuery,
            suggestions
        };
    }

    /**
     * Validates search filters.
     * 
     * @param filters - The filters to validate
     * @returns FilterValidationResult with validation details
     */
    validateFilters(filters: SearchFilters): FilterValidationResult {
        const errors: ValidationError[] = [];
        const normalizedFilters = { ...filters };

        // Validate date range
        if (filters.dateRange) {
            if (filters.dateRange.from && !this.isValidDate(filters.dateRange.from)) {
                errors.push({
                    code: 'INVALID_DATE_FROM',
                    message: 'Invalid start date',
                    severity: 'error',
                    field: 'dateRange.from'
                });
            }

            if (filters.dateRange.to && !this.isValidDate(filters.dateRange.to)) {
                errors.push({
                    code: 'INVALID_DATE_TO',
                    message: 'Invalid end date',
                    severity: 'error',
                    field: 'dateRange.to'
                });
            }

            if (filters.dateRange.from && filters.dateRange.to) {
                const fromDate = new Date(filters.dateRange.from);
                const toDate = new Date(filters.dateRange.to);
                
                if (fromDate > toDate) {
                    errors.push({
                        code: 'INVALID_DATE_RANGE',
                        message: 'Start date must be before end date',
                        severity: 'error',
                        field: 'dateRange'
                    });
                }
            }
        }

        // Validate tags
        if (filters.tags && filters.tags.length > 0) {
            if (filters.tags.length > this.MAX_FILTER_ITEMS) {
                errors.push({
                    code: 'TOO_MANY_TAGS',
                    message: `Cannot filter by more than ${this.MAX_FILTER_ITEMS} tags`,
                    severity: 'error',
                    field: 'tags',
                    suggestion: `Please select up to ${this.MAX_FILTER_ITEMS} tags`
                });
            }

            // Validate individual tags
            const invalidTags = filters.tags.filter(tag => 
                !tag || typeof tag !== 'string' || tag.trim().length === 0
            );

            if (invalidTags.length > 0) {
                errors.push({
                    code: 'INVALID_TAGS',
                    message: 'Invalid tag format',
                    severity: 'error',
                    field: 'tags',
                    suggestion: 'Tags must be non-empty strings'
                });
            }

            // Normalize tags
            normalizedFilters.tags = filters.tags
                .filter(tag => tag && typeof tag === 'string')
                .map(tag => tag.trim().toLowerCase())
                .filter((tag, index, arr) => arr.indexOf(tag) === index);
        }

        // Validate pagination
        if (filters.pagination) {
            if (filters.pagination.page && filters.pagination.page < 1) {
                errors.push({
                    code: 'INVALID_PAGE',
                    message: 'Page number must be greater than 0',
                    severity: 'error',
                    field: 'pagination.page'
                });
                normalizedFilters.pagination = {
                    ...filters.pagination,
                    page: 1
                };
            }

            if (filters.pagination.limit && filters.pagination.limit < 1) {
                errors.push({
                    code: 'INVALID_LIMIT',
                    message: 'Limit must be greater than 0',
                    severity: 'error',
                    field: 'pagination.limit'
                });
                normalizedFilters.pagination = {
                    ...filters.pagination,
                    limit: 10
                };
            }
        }

        const isValid = errors.length === 0;

        return {
            isValid,
            errors,
            normalizedFilters
        };
    }

    /**
     * Sanitizes a search query.
     * 
     * @param query - The query to sanitize
     * @returns Sanitized query string
     */
    sanitizeQuery(query: string): string {
        if (!query) {
            return '';
        }

        return query
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/['"]/g, '') // Remove quotes
            .replace(/\s+/g, ' ') // Normalize whitespace
            .slice(0, this.MAX_QUERY_LENGTH);
    }

    /**
     * Checks if query length is valid.
     * 
     * @param query - The query to check
     * @returns True if length is valid
     */
    isValidQueryLength(query: string): boolean {
        const trimmedQuery = query.trim();
        return trimmedQuery.length >= this.MIN_QUERY_LENGTH && 
               trimmedQuery.length <= this.MAX_QUERY_LENGTH;
    }

    /**
     * Checks if query contains forbidden content.
     * 
     * @param query - The query to check
     * @returns True if contains forbidden content
     */
    containsForbiddenContent(query: string): boolean {
        const queryLower = query.toLowerCase();

        // Check forbidden patterns
        for (const pattern of this.FORBIDDEN_PATTERNS) {
            if (pattern.test(queryLower)) {
                return true;
            }
        }

        // Check forbidden words
        for (const word of this.FORBIDDEN_WORDS) {
            if (queryLower.includes(word)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if query contains common words.
     * 
     * @param query - The query to check
     * @returns True if contains common words
     */
    private hasCommonWords(query: string): boolean {
        const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
        const queryWords = query.toLowerCase().split(' ');
        
        return queryWords.filter(word => commonWords.includes(word)).length > queryWords.length / 2;
    }

    /**
     * Checks if query has many special characters.
     * 
     * @param query - The query to check
     * @returns True if has many special characters
     */
    private hasManySpecialChars(query: string): boolean {
        const specialChars = query.match(/[^a-zA-Z0-9\s]/g);
        return specialChars && specialChars.length > query.length * 0.3;
    }

    /**
     * Validates a date string.
     * 
     * @param dateString - The date string to validate
     * @returns True if valid date
     */
    private isValidDate(dateString: string): boolean {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }
}
