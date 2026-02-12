/**
 * Validation Error Classes
 * 
 * Error classes for validation-related issues with enhanced functionality.
 */

import { BaseError } from './BaseError';
import { ErrorCategory, ErrorSeverity, ErrorRecoveryStrategy } from '../types/index';

/**
 * Base validation error class
 */
export class ValidationError extends BaseError {
    public readonly field?: string;
    public readonly value?: any;
    public readonly validationRule?: string;
    public readonly validationErrors?: Array<{
        field: string;
        message: string;
        value: any;
        rule?: string;
    }>;

    constructor(
        message: string,
        code: string = 'VALIDATION_ERROR',
        field?: string,
        value?: any,
        validationRule?: string,
        options: {
            severity?: ErrorSeverity;
            recoverable?: boolean;
            recoveryStrategy?: ErrorRecoveryStrategy;
            userMessage?: string;
            suggestedActions?: string[];
            metadata?: Record<string, any>;
            cause?: Error;
            context?: any;
            validationErrors?: Array<{
                field: string;
                message: string;
                value: any;
                rule?: string;
            }>;
        } = {}
    ) {
        const {
            severity = ErrorSeverity.LOW,
            recoverable = true,
            recoveryStrategy = ErrorRecoveryStrategy.MANUAL,
            userMessage,
            suggestedActions = [],
            metadata = {},
            cause,
            context,
            validationErrors
        } = options;

        super(
            message,
            code,
            ErrorCategory.VALIDATION,
            severity,
            recoverable,
            recoveryStrategy,
            userMessage || 'Invalid data provided',
            suggestedActions,
            { ...metadata, field, value, validationRule, validationErrors },
            cause,
            context
        );

        this.field = field;
        this.value = value;
        this.validationRule = validationRule;
        this.validationErrors = validationErrors;
    }

    /**
     * Check if error is for a specific field
     */
    public isForField(fieldName: string): boolean {
        return this.field === fieldName ||
            this.validationErrors?.some(error => error.field === fieldName) ||
            false;
    }

    /**
     * Get validation errors for a specific field
     */
    public getErrorsForField(fieldName: string): Array<{
        field: string;
        message: string;
        value: any;
        rule?: string;
    }> {
        if (!this.validationErrors) return [];

        return this.validationErrors.filter(error => error.field === fieldName);
    }

    /**
     * Get all field names with validation errors
     */
    public getErrorFields(): string[] {
        if (!this.validationErrors) return [];

        return Array.from(new Set(this.validationErrors.map(error => error.field)));
    }

    /**
     * Check if error has multiple validation errors
     */
    public hasMultipleErrors(): boolean {
        return this.validationErrors !== undefined && this.validationErrors.length > 1;
    }

    /**
     * Get total number of validation errors
     */
    public getErrorCount(): number {
        if (!this.validationErrors) return 1;
        return this.validationErrors.length;
    }
}

/**
 * Required field validation error
 */
export class RequiredFieldError extends ValidationError {
    constructor(
        field: string,
        value?: any,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            `Required field '${field}' is missing`,
            'REQUIRED_FIELD_ERROR',
            field,
            value,
            'required',
            {
                severity: ErrorSeverity.LOW,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: `The ${field} field is required`,
                suggestedActions: [
                    `Enter a value for ${field}`,
                    'Check if the field was accidentally left empty',
                    'Ensure all required fields are filled'
                ],
                cause,
                context
            }
        );
    }
}

/**
 * Invalid format validation error
 */
export class InvalidFormatError extends ValidationError {
    public readonly expectedFormat?: string;
    public readonly actualFormat?: string;

    constructor(
        field: string,
        value: any,
        expectedFormat: string,
        actualFormat?: string,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            `Invalid format for field '${field}'. Expected: ${expectedFormat}`,
            'INVALID_FORMAT_ERROR',
            field,
            value,
            'format',
            {
                severity: ErrorSeverity.LOW,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: `The ${field} field has an invalid format`,
                suggestedActions: [
                    `Ensure ${field} follows the ${expectedFormat} format`,
                    'Check the format requirements',
                    'Use the provided format example'
                ],
                metadata: { expectedFormat, actualFormat },
                cause,
                context
            }
        );

        this.expectedFormat = expectedFormat;
        this.actualFormat = actualFormat;
    }
}

/**
 * Range validation error
 */
export class RangeError extends ValidationError {
    public readonly min?: number;
    public readonly max?: number;
    public readonly actualValue?: number;

    constructor(
        field: string,
        value: number,
        min?: number,
        max?: number,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        let message = `Value for field '${field}' is out of range`;
        if (min !== undefined && max !== undefined) {
            message += `. Expected between ${min} and ${max}`;
        } else if (min !== undefined) {
            message += `. Expected minimum ${min}`;
        } else if (max !== undefined) {
            message += `. Expected maximum ${max}`;
        }

        super(
            message,
            'RANGE_ERROR',
            field,
            value,
            'range',
            {
                severity: ErrorSeverity.LOW,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: `The ${field} value is outside the allowed range`,
                suggestedActions: [
                    'Enter a value within the allowed range',
                    'Check the minimum and maximum requirements',
                    'Use a valid value'
                ],
                metadata: { min, max, actualValue: value },
                cause,
                context
            }
        );

        this.min = min;
        this.max = max;
        this.actualValue = value;
    }

    /**
     * Check if value is too small
     */
    public isTooSmall(): boolean {
        return this.min !== undefined && this.actualValue !== undefined && this.actualValue < this.min;
    }

    /**
     * Check if value is too large
     */
    public isTooLarge(): boolean {
        return this.max !== undefined && this.actualValue !== undefined && this.actualValue > this.max;
    }
}

/**
 * Length validation error
 */
export class LengthError extends ValidationError {
    public readonly minLength?: number;
    public readonly maxLength?: number;
    public readonly actualLength?: number;

    constructor(
        field: string,
        value: string,
        minLength?: number,
        maxLength?: number,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;
        const actualLength = value ? value.length : 0;

        let message = `Length of field '${field}' is invalid`;
        if (minLength !== undefined && maxLength !== undefined) {
            message += `. Expected between ${minLength} and ${maxLength} characters`;
        } else if (minLength !== undefined) {
            message += `. Expected minimum ${minLength} characters`;
        } else if (maxLength !== undefined) {
            message += `. Expected maximum ${maxLength} characters`;
        }

        super(
            message,
            'LENGTH_ERROR',
            field,
            value,
            'length',
            {
                severity: ErrorSeverity.LOW,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: `The ${field} length is not within the allowed limits`,
                suggestedActions: [
                    'Adjust the text length',
                    'Check the minimum and maximum length requirements',
                    'Use a text of appropriate length'
                ],
                metadata: { minLength, maxLength, actualLength },
                cause,
                context
            }
        );

        this.minLength = minLength;
        this.maxLength = maxLength;
        this.actualLength = actualLength;
    }

    /**
     * Check if value is too short
     */
    public isTooShort(): boolean {
        return this.minLength !== undefined && this.actualLength !== undefined && this.actualLength < this.minLength;
    }

    /**
     * Check if value is too long
     */
    public isTooLong(): boolean {
        return this.maxLength !== undefined && this.actualLength !== undefined && this.actualLength > this.maxLength;
    }
}
