#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

// Architecture validation script
class ArchitectureValidator {
    private errors: string[] = [];
    private warnings: string[] = [];
    private successCount: number = 0;

    // Validate feature structure
    validateFeatureStructure(featurePath: string, featureName: string): boolean {
        const requiredDirs = [
            'domain',
            'data',
            'application',
            'presentation'
        ];

        const requiredSubDirs = {
            'application': ['hooks', 'services'],
            'presentation': ['components']
        };

        let featureValid = true;

        // Check main directories
        requiredDirs.forEach(dir => {
            const dirPath = path.join(featurePath, dir);
            if (!fs.existsSync(dirPath)) {
                this.errors.push(`❌ Missing ${dir} directory in ${featureName}`);
                featureValid = false;
            } else {
                this.successCount++;
            }
        });

        // Check subdirectories
        Object.entries(requiredSubDirs).forEach(([parentDir, subDirs]) => {
            const parentPath = path.join(featurePath, parentDir);
            if (fs.existsSync(parentPath)) {
                subDirs.forEach(subDir => {
                    const subDirPath = path.join(parentPath, subDir);
                    if (!fs.existsSync(subDirPath)) {
                        this.warnings.push(`⚠️  Missing ${subDir} directory in ${featureName}/${parentDir}`);
                    } else {
                        this.successCount++;
                    }
                });
            }
        });

        return featureValid;
    }

    // Validate DI usage
    validateDIUsage(filePath: string): void {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Check for DI imports
            const hasDIImport = content.includes('@Inject') || content.includes('useService') || content.includes('Injectable');
            if (!hasDIImport) {
                this.warnings.push(`⚠️  No DI imports found in ${filePath}`);
            } else {
                this.successCount++;
            }

            // Check for service registration
            const hasServiceRegistration = content.includes('registerSingleton') || content.includes('registerTransient');
            if (!hasServiceRegistration) {
                this.warnings.push(`⚠️  No service registration found in ${filePath}`);
            } else {
                this.successCount++;
            }

        } catch (error) {
            this.errors.push(`❌ Error reading ${filePath}: ${(error as Error).message}`);
        }
    }

    // Validate TypeScript interfaces
    validateInterfaces(filePath: string): void {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Check for interface definitions
            const hasInterfaces = content.includes('interface I') || content.includes('export interface');
            if (!hasInterfaces) {
                this.warnings.push(`⚠️  No interfaces found in ${filePath}`);
            } else {
                this.successCount++;
            }

            // Check for proper typing
            const hasProperTyping = content.includes(': Promise<') || content.includes(': React.FC');
            if (!hasProperTyping) {
                this.warnings.push(`⚠️  Missing proper typing in ${filePath}`);
            } else {
                this.successCount++;
            }

        } catch (error) {
            this.errors.push(`❌ Error reading ${filePath}: ${(error as Error).message}`);
        }
    }

    // Validate component structure
    validateComponent(filePath: string): void {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Check for React import
            const hasReactImport = content.includes('import * as React') || content.includes('import React');
            if (!hasReactImport) {
                this.errors.push(`❌ Missing React import in ${filePath}`);
            } else {
                this.successCount++;
            }

            // Check for proper component export
            const hasProperExport = content.includes('export const') || content.includes('export default');
            if (!hasProperExport) {
                this.errors.push(`❌ Missing proper component export in ${filePath}`);
            } else {
                this.successCount++;
            }

            // Check for styles separation
            const fileName = path.basename(filePath, '.tsx');
            const stylesFile = path.join(path.dirname(filePath), `${fileName}.styles.ts`);
            if (fs.existsSync(stylesFile)) {
                this.successCount++;
            } else {
                this.warnings.push(`⚠️  No styles file found for ${fileName}`);
            }

        } catch (error) {
            this.errors.push(`❌ Error reading ${filePath}: ${(error as Error).message}`);
        }
    }

    // Validate test files
    validateTests(filePath: string): void {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Check for test imports
            const hasTestImports = content.includes('@testing-library/react') || content.includes('jest');
            if (!hasTestImports) {
                this.warnings.push(`⚠️  Missing test imports in ${filePath}`);
            } else {
                this.successCount++;
            }

            // Check for test assertions
            const hasAssertions = content.includes('expect(') || content.includes('assert');
            if (!hasAssertions) {
                this.warnings.push(`⚠️  No test assertions found in ${filePath}`);
            } else {
                this.successCount++;
            }

        } catch (error) {
            this.errors.push(`❌ Error reading ${filePath}: ${(error as Error).message}`);
        }
    }

    // Run full validation
    validateArchitecture(): boolean {
        const srcPath = path.join(process.cwd(), 'src');
        const featuresPath = path.join(srcPath, 'features');

        if (!fs.existsSync(featuresPath)) {
            this.errors.push('❌ Features directory not found');
            return false;
        }

        // Validate each feature
        const features = fs.readdirSync(featuresPath);
        let allFeaturesValid = true;

        features.forEach(feature => {
            const featurePath = path.join(featuresPath, feature);
            const stat = fs.statSync(featurePath);

            if (stat.isDirectory()) {
                console.log(`🔍 Validating feature: ${feature}`);
                const featureValid = this.validateFeatureStructure(featurePath, feature);
                if (!featureValid) {
                    allFeaturesValid = false;
                }

                // Validate files in feature
                this.validateFeatureFiles(featurePath, feature);
            }
        });

        return allFeaturesValid;
    }

    // Validate files within a feature
    validateFeatureFiles(featurePath: string, featureName: string): void {
        const walkDir = (dir: string, fileList: string[] = []): string[] => {
            const files = fs.readdirSync(dir);

            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    walkDir(filePath, fileList);
                } else {
                    fileList.push(filePath);
                }
            });

            return fileList;
        };

        const files = walkDir(featurePath);

        files.forEach(filePath => {
            const ext = path.extname(filePath);
            const fileName = path.basename(filePath);

            if (ext === '.ts' || ext === '.tsx') {
                if (fileName.includes('Service') || fileName.includes('Repository')) {
                    this.validateDIUsage(filePath);
                } else if (fileName.includes('Component')) {
                    this.validateComponent(filePath);
                } else if (fileName.includes('.test.') || fileName.includes('.spec.')) {
                    this.validateTests(filePath);
                } else if (fileName.includes('Entity') || fileName.includes('interface')) {
                    this.validateInterfaces(filePath);
                }
            }
        });
    }

    // Print results
    printResults(): boolean {
        console.log('\n🏗️  Architecture Validation Results\n');

        if (this.errors.length > 0) {
            console.log('❌ ERRORS:');
            this.errors.forEach(error => console.log(`  ${error}`));
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            this.warnings.forEach(warning => console.log(`  ${warning}`));
        }

        console.log(`\n✅ Successful checks: ${this.successCount}`);
        console.log(`⚠️  Warnings: ${this.warnings.length}`);
        console.log(`❌ Errors: ${this.errors.length}`);

        if (this.errors.length === 0) {
            console.log('\n🎉 Architecture validation passed!');
            return true;
        } else {
            console.log('\n❌ Architecture validation failed!');
            return false;
        }
    }
}

// Run validation
const validator = new ArchitectureValidator();
const isValid = validator.validateArchitecture();
validator.printResults();

// Exit with appropriate code
process.exit(isValid ? 0 : 1);
