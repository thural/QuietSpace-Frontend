/**
 * Theme Validation System
 *
 * Single Responsibility: Provides comprehensive theme validation
 * Follows SOLID principles with dependency injection support
 */

import type { ThemeTokens } from '../../tokens';
import type { EnhancedTheme, ComposedTheme } from '../../internal/types';

import { IColorUtils, colorUtils } from '../services/ColorUtils';
import { IThemeErrorFactory, themeErrorFactory } from '../errors/ThemeErrors';

/**
 * Validation Rule Interface
 */
export interface IValidationRule {
    name: string;
    description: string;
    severity: 'error' | 'warning' | 'info';
    validate(theme: any): ValidationResult;
}

/**
 * Validation Result Interface
 */
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    info: ValidationInfo[];
    summary: ValidationSummary;
}

/**
 * Validation Error Interface
 */
export interface ValidationError {
    code: string;
    message: string;
    path: string;
    severity: 'error';
    suggestion?: string;
}

/**
 * Validation Warning Interface
 */
export interface ValidationWarning {
    code: string;
    message: string;
    path: string;
    severity: 'warning';
    suggestion?: string;
}

/**
 * Validation Info Interface
 */
export interface ValidationInfo {
    code: string;
    message: string;
    path: string;
    severity: 'info';
    suggestion?: string;
}

/**
 * Validation Summary Interface
 */
export interface ValidationSummary {
    totalIssues: number;
    errors: number;
    warnings: number;
    info: number;
    score: number; // 0-100
    status: 'pass' | 'warn' | 'fail';
}

/**
 * Theme Validator Interface - Dependency Inversion Principle
 */
export interface IThemeValidator {
    validateTheme(theme: Partial<ThemeTokens>): Promise<ValidationResult>;
    validateEnhancedTheme(theme: EnhancedTheme): Promise<ValidationResult>;
    validateComposedTheme(theme: ComposedTheme): Promise<ValidationResult>;
    addRule(rule: IValidationRule): void;
    removeRule(ruleName: string): void;
    getRules(): IValidationRule[];
}

/**
 * Theme Validator Implementation
 * 
 * Single Responsibility: Theme validation and rule management
 * Open/Closed: Extensible through validation rules
 * Liskov Substitution: Can be substituted with mock implementations
 * Interface Segregation: Focused interface for validation operations
 * Dependency Inversion: Depends on abstractions
 */
export class ThemeValidator implements IThemeValidator {
    private readonly colorUtils: IColorUtils;
    private readonly errorFactory: IThemeErrorFactory;
    private readonly rules = new Map<string, IValidationRule>();

    constructor(
        colorUtilsInstance: IColorUtils = colorUtils,
        errorFactoryInstance: IThemeErrorFactory = themeErrorFactory
    ) {
        this.colorUtils = colorUtilsInstance;
        this.errorFactory = errorFactoryInstance;
        this.initializeDefaultRules();
    }

    /**
     * Validate theme tokens
     */
    public async validateTheme(theme: Partial<ThemeTokens>): Promise<ValidationResult> {
        const results: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            summary: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                info: 0,
                score: 100,
                status: 'pass'
            }
        };

        // Apply all validation rules
        for (const rule of Array.from(this.rules.values())) {
            const ruleResult = rule.validate(theme);
            this.mergeValidationResults(results, ruleResult);
        }

        // Calculate summary
        this.calculateSummary(results);

        return results;
    }

    /**
     * Validate enhanced theme
     */
    public async validateEnhancedTheme(theme: EnhancedTheme): Promise<ValidationResult> {
        const results: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            summary: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                info: 0,
                score: 100,
                status: 'pass'
            }
        };

        // Validate base theme structure
        const baseValidation = await this.validateTheme(theme as Partial<ThemeTokens>);
        this.mergeValidationResults(results, baseValidation);

        // Validate enhanced theme specific requirements
        this.validateEnhancedThemeRequirements(theme, results);

        // Calculate summary
        this.calculateSummary(results);

        return results;
    }

    /**
     * Validate composed theme
     */
    public async validateComposedTheme(theme: ComposedTheme): Promise<ValidationResult> {
        const results: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            summary: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                info: 0,
                score: 100,
                status: 'pass'
            }
        };

        // Validate base theme structure
        const baseValidation = await this.validateTheme(theme.tokens);
        this.mergeValidationResults(results, baseValidation);

        // Validate composed theme specific requirements
        this.validateComposedThemeRequirements(theme, results);

        // Calculate summary
        this.calculateSummary(results);

        return results;
    }

    /**
     * Add validation rule
     */
    public addRule(rule: IValidationRule): void {
        this.rules.set(rule.name, rule);
    }

    /**
     * Remove validation rule
     */
    public removeRule(ruleName: string): void {
        this.rules.delete(ruleName);
    }

    /**
     * Get all validation rules
     */
    public getRules(): IValidationRule[] {
        return Array.from(this.rules.values());
    }

    /**
     * Initialize default validation rules
     */
    private initializeDefaultRules(): void {
        // Color validation rules
        this.addRule({
            name: 'required-colors',
            description: 'Validate required color properties',
            severity: 'error',
            validate: (theme) => this.validateRequiredColors(theme)
        });

        this.addRule({
            name: 'color-format',
            description: 'Validate color format',
            severity: 'error',
            validate: (theme) => this.validateColorFormat(theme)
        });

        this.addRule({
            name: 'color-contrast',
            description: 'Validate color contrast ratios',
            severity: 'warning',
            validate: (theme) => this.validateColorContrast(theme)
        });

        // Typography validation rules
        this.addRule({
            name: 'required-typography',
            description: 'Validate required typography properties',
            severity: 'error',
            validate: (theme) => this.validateRequiredTypography(theme)
        });

        this.addRule({
            name: 'typography-scale',
            description: 'Validate typography scale consistency',
            severity: 'warning',
            validate: (theme) => this.validateTypographyScale(theme)
        });

        // Spacing validation rules
        this.addRule({
            name: 'required-spacing',
            description: 'Validate required spacing properties',
            severity: 'error',
            validate: (theme) => this.validateRequiredSpacing(theme)
        });

        this.addRule({
            name: 'spacing-scale',
            description: 'Validate spacing scale consistency',
            severity: 'warning',
            validate: (theme) => this.validateSpacingScale(theme)
        });

        // Accessibility validation rules
        this.addRule({
            name: 'accessibility-wcag',
            description: 'Validate WCAG compliance',
            severity: 'warning',
            validate: (theme) => this.validateWCAGCompliance(theme)
        });
    }

    /**
     * Validate required colors
     */
    private validateRequiredColors(theme: Partial<ThemeTokens>): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            summary: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                info: 0,
                score: 100,
                status: 'pass'
            }
        };

        if (!theme.colors) {
            result.errors.push({
                code: 'COLORS_001',
                message: 'Colors object is required',
                path: 'colors',
                severity: 'error',
                suggestion: 'Add a colors object with brand and semantic colors'
            });
            return result;
        }

        const requiredColors = ['brand'];
        for (const color of requiredColors) {
            if (!theme.colors[color as keyof ThemeTokens['colors']]) {
                result.errors.push({
                    code: 'COLORS_002',
                    message: `Missing required color: ${color}`,
                    path: `colors.${color}`,
                    severity: 'error',
                    suggestion: `Add ${color} color to the theme`
                });
            }
        }

        return result;
    }

    /**
     * Validate color format
     */
    private validateColorFormat(theme: Partial<ThemeTokens>): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            summary: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                info: 0,
                score: 100,
                status: 'pass'
            }
        };

        if (!theme.colors) return result;

        const validateColorObject = (obj: unknown, path: string) => {
            if (typeof obj !== 'object' || obj === null) return;

            for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
                const fullPath = `${path}.${key}`;

                if (typeof value === 'string') {
                    if (!this.colorUtils.validateColor(value)) {
                        result.errors.push({
                            code: 'COLORS_003',
                            message: `Invalid color format: ${value}`,
                            path: fullPath,
                            severity: 'error',
                            suggestion: 'Use valid hex, rgb, rgba, hsl, hsla, or named colors'
                        });
                    }
                } else if (typeof value === 'object') {
                    validateColorObject(value, fullPath);
                }
            }
        };

        validateColorObject(theme.colors, 'colors');
        return result;
    }

    /**
     * Validate color contrast
     */
    private validateColorContrast(theme: Partial<ThemeTokens>): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            summary: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                info: 0,
                score: 100,
                status: 'pass'
            }
        };

        if (!theme.colors) return result;

        // Check common color combinations
        const combinations = [
            { background: 'background.primary', text: 'text.primary' },
            { background: 'background.secondary', text: 'text.secondary' }
        ];

        for (const combo of combinations) {
            const bgColor = this.getNestedValue(theme.colors, combo.background);
            const textColor = this.getNestedValue(theme.colors, combo.text);

            if (bgColor && textColor) {
                const ratio = this.colorUtils.getContrastRatio(bgColor, textColor);

                if (ratio < 4.5) { // WCAG AA standard
                    result.warnings.push({
                        code: 'COLORS_004',
                        message: `Low contrast ratio (${ratio.toFixed(2)}) between ${combo.background} and ${combo.text}`,
                        path: `colors.${combo.background} <-> colors.${combo.text}`,
                        severity: 'warning',
                        suggestion: 'Increase contrast ratio to meet WCAG AA standards (4.5:1)'
                    });
                }
            }
        }

        return result;
    }

    /**
     * Validate required typography
     */
    private validateRequiredTypography(theme: Partial<ThemeTokens>): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            summary: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                info: 0,
                score: 100,
                status: 'pass'
            }
        };

        if (!theme.typography) {
            result.errors.push({
                code: 'TYPO_001',
                message: 'Typography object is required',
                path: 'typography',
                severity: 'error',
                suggestion: 'Add a typography object with font families and sizes'
            });
            return result;
        }

        const requiredProps = ['fontFamily'];
        for (const prop of requiredProps) {
            if (!theme.typography[prop as keyof ThemeTokens['typography']]) {
                result.errors.push({
                    code: 'TYPO_002',
                    message: `Missing required typography property: ${prop}`,
                    path: `typography.${prop}`,
                    severity: 'error',
                    suggestion: `Add ${prop} to the typography object`
                });
            }
        }

        return result;
    }

    /**
     * Validate typography scale
     */
    private validateTypographyScale(theme: Partial<ThemeTokens>): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            summary: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                info: 0,
                score: 100,
                status: 'pass'
            }
        };

        if (!theme.typography?.fontSize) return result;

        // Check for reasonable font size progression
        const sizes = Object.entries(theme.typography.fontSize);
        for (let i = 1; i < sizes.length; i++) {
            const [key1, size1] = sizes[i - 1];
            const [key2, size2] = sizes[i];

            // Extract numeric values for comparison
            const num1 = parseFloat(size1);
            const num2 = parseFloat(size2);

            if (num2 <= num1) {
                result.warnings.push({
                    code: 'TYPO_003',
                    message: `Typography scale not progressive: ${key1} (${size1}) -> ${key2} (${size2})`,
                    path: `typography.fontSize`,
                    severity: 'warning',
                    suggestion: 'Ensure font sizes increase progressively'
                });
            }
        }

        return result;
    }

    /**
     * Validate required spacing
     */
    private validateRequiredSpacing(theme: Partial<ThemeTokens>): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            summary: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                info: 0,
                score: 100,
                status: 'pass'
            }
        };

        if (!theme.spacing) {
            result.errors.push({
                code: 'SPACE_001',
                message: 'Spacing object is required',
                path: 'spacing',
                severity: 'error',
                suggestion: 'Add a spacing object with consistent scale'
            });
            return result;
        }

        const requiredSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
        for (const size of requiredSizes) {
            if (!theme.spacing[size as keyof ThemeTokens['spacing']]) {
                result.errors.push({
                    code: 'SPACE_002',
                    message: `Missing required spacing size: ${size}`,
                    path: `spacing.${size}`,
                    severity: 'error',
                    suggestion: `Add ${size} spacing value`
                });
            }
        }

        return result;
    }

    /**
     * Validate spacing scale
     */
    private validateSpacingScale(theme: Partial<ThemeTokens>): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            summary: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                info: 0,
                score: 100,
                status: 'pass'
            }
        };

        if (!theme.spacing) return result;

        // Check for consistent spacing scale
        const sizes = Object.entries(theme.spacing);
        for (let i = 1; i < sizes.length; i++) {
            const [key1, size1] = sizes[i - 1];
            const [key2, size2] = sizes[i];

            // Extract numeric values for comparison
            const num1 = parseFloat(size1.replace(/[^\d.]/g, ''));
            const num2 = parseFloat(size2.replace(/[^\d.]/g, ''));

            if (num2 <= num1) {
                result.warnings.push({
                    code: 'SPACE_003',
                    message: `Spacing scale not progressive: ${key1} (${size1}) -> ${key2} (${size2})`,
                    path: `spacing`,
                    severity: 'warning',
                    suggestion: 'Ensure spacing values increase progressively'
                });
            }
        }

        return result;
    }

    /**
     * Validate WCAG compliance
     */
    private validateWCAGCompliance(theme: Partial<ThemeTokens>): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            summary: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                info: 0,
                score: 100,
                status: 'pass'
            }
        };

        if (!theme.colors) return result;

        // Check for accessibility-friendly color combinations
        const checks = [
            { bg: 'background.primary', text: 'text.primary', minRatio: 4.5 },
            { bg: 'background.secondary', text: 'text.secondary', minRatio: 3.0 }
        ];

        for (const check of checks) {
            const bgColor = this.getNestedValue(theme.colors, check.bg);
            const textColor = this.getNestedValue(theme.colors, check.text);

            if (bgColor && textColor) {
                const ratio = this.colorUtils.getContrastRatio(bgColor, textColor);

                if (ratio < check.minRatio) {
                    result.warnings.push({
                        code: 'A11Y_001',
                        message: `WCAG compliance issue: contrast ratio ${ratio.toFixed(2)} below ${check.minRatio}`,
                        path: `colors.${check.bg} <-> colors.${check.text}`,
                        severity: 'warning',
                        suggestion: 'Improve color contrast for better accessibility'
                    });
                }
            }
        }

        return result;
    }

    /**
     * Validate enhanced theme requirements
     */
    private validateEnhancedThemeRequirements(theme: EnhancedTheme, results: ValidationResult): void {
        // Check required methods
        const requiredMethods = ['getSpacing', 'getColor', 'getTypography', 'getBreakpoint'];
        for (const method of requiredMethods) {
            if (typeof (theme as any)[method] !== 'function') {
                results.errors.push({
                    code: 'ENH_001',
                    message: `Missing required method: ${method}`,
                    path: `methods.${method}`,
                    severity: 'error',
                    suggestion: `Implement ${method} method in enhanced theme`
                });
            }
        }

        // Check required properties
        const requiredProperties = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];
        for (const prop of requiredProperties) {
            if (!(prop in theme)) {
                results.errors.push({
                    code: 'ENH_002',
                    message: `Missing required property: ${prop}`,
                    path: `properties.${prop}`,
                    severity: 'error',
                    suggestion: `Add ${prop} property to enhanced theme`
                });
            }
        }
    }

    /**
     * Validate composed theme requirements
     */
    private validateComposedThemeRequirements(theme: ComposedTheme, results: ValidationResult): void {
        // Check required properties
        if (!theme.name) {
            results.errors.push({
                code: 'COMP_001',
                message: 'Missing required property: name',
                path: 'name',
                severity: 'error',
                suggestion: 'Add name property to composed theme'
            });
        }

        if (!theme.version) {
            results.errors.push({
                code: 'COMP_002',
                message: 'Missing required property: version',
                path: 'version',
                severity: 'error',
                suggestion: 'Add version property to composed theme'
            });
        }

        if (!theme.tokens) {
            results.errors.push({
                code: 'COMP_003',
                message: 'Missing required property: tokens',
                path: 'tokens',
                severity: 'error',
                suggestion: 'Add tokens property to composed theme'
            });
        }

        if (!theme.metadata) {
            results.errors.push({
                code: 'COMP_004',
                message: 'Missing required property: metadata',
                path: 'metadata',
                severity: 'error',
                suggestion: 'Add metadata property to composed theme'
            });
        }
    }

    /**
     * Get nested value from object path
     */
    private getNestedValue(obj: unknown, path: string): string | undefined {
        try {
            const result = path.split('.').reduce((current: unknown, key: string) => {
                if (current && typeof current === 'object' && key in current) {
                    return (current as Record<string, unknown>)[key];
                }
                return undefined;
            }, obj);

            return typeof result === 'string' ? result : undefined;
        } catch {
            return undefined;
        }
    }

    /**
     * Merge validation results
     */
    private mergeValidationResults(target: ValidationResult, source: ValidationResult): void {
        target.errors.push(...source.errors);
        target.warnings.push(...source.warnings);
        target.info.push(...source.info);
    }

    /**
     * Calculate validation summary
     */
    private calculateSummary(results: ValidationResult): void {
        const totalIssues = results.errors.length + results.warnings.length + results.info.length;
        const errorWeight = 10;
        const warningWeight = 3;
        const infoWeight = 1;

        const weightedScore = results.errors.length * errorWeight +
            results.warnings.length * warningWeight +
            results.info.length * infoWeight;

        const maxPossibleScore = totalIssues * errorWeight;
        const score = maxPossibleScore > 0 ? Math.max(0, 100 - (weightedScore / maxPossibleScore * 100)) : 100;

        results.summary = {
            totalIssues,
            errors: results.errors.length,
            warnings: results.warnings.length,
            info: results.info.length,
            score: Math.round(score),
            status: results.errors.length > 0 ? 'fail' :
                results.warnings.length > 0 ? 'warn' : 'pass'
        };

        results.isValid = results.errors.length === 0;
    }
}

/**
 * Export singleton instance for convenience
 */
export const themeValidator = new ThemeValidator();
