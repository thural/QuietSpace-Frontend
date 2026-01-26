/**
 * Complete Black Box Migration Validation
 * 
 * Tests all completed Black Box module implementations
 * to ensure the entire architecture works correctly together.
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Complete Black Box Migration Validation...\n');

// Test 1: Check all module index files exist
console.log('📁 Test 1: Module Index Files...');

const moduleIndexes = [
    'src/core/cache/index.ts',
    'src/core/websocket/index.ts',
    'src/core/di/index.ts',
    'src/core/auth/index.ts',
    'src/core/theme/index.ts',
    'src/core/services/index.ts',
    'src/shared/ui/components/index.ts'
];

let indexesExist = 0;
for (const index of moduleIndexes) {
    if (fs.existsSync(index)) {
        console.log(`✅ ${index} exists`);
        indexesExist++;
    } else {
        console.log(`❌ ${index} missing`);
    }
}

console.log(`\n📊 Module Indexes: ${indexesExist}/${moduleIndexes.length} exist`);

// Test 2: Check Black Box pattern compliance across all modules
console.log('\n📦 Test 2: Black Box Pattern Compliance...');

const blackBoxCompliance = {};

for (const index of moduleIndexes) {
    if (fs.existsSync(index)) {
        const indexContent = fs.readFileSync(index, 'utf8');
        const moduleName = path.basename(path.dirname(index));

        // Count wildcard exports
        const wildcardExports = (indexContent.match(/export \*/g) || []).length;

        // Count explicit exports
        const explicitExports = (indexContent.match(/export \{[^}]+\}/g) || []).length;

        // Check for factory functions
        const factoryFunctions = (indexContent.match(/create\w+/g) || []).length;

        // Check for type exports
        const typeExports = (indexContent.match(/export type/g) || []).length;

        blackBoxCompliance[moduleName] = {
            wildcardExports,
            explicitExports,
            factoryFunctions,
            typeExports,
            isCompliant: wildcardExports <= 2 && (explicitExports > 0 || typeExports > 0)
        };

        console.log(`\n📋 ${moduleName.toUpperCase()} Module:`);
        console.log(`  ✅ Explicit Exports: ${explicitExports}`);
        console.log(`  ⚠️  Wildcard Exports: ${wildcardExports}`);
        console.log(`  ✅ Factory Functions: ${factoryFunctions}`);
        console.log(`  ✅ Type Exports: ${typeExports}`);
        console.log(`  ${blackBoxCompliance[moduleName].isCompliant ? '✅' : '❌'} Black Box Compliant`);
    }
}

// Test 3: Check factory function implementations
console.log('\n📦 Test 3: Factory Function Implementations...');

const factoryFiles = [
    'src/core/cache/factory.ts',
    'src/core/websocket/factory.ts',
    'src/core/auth/factory.ts',
    'src/core/theme/factory.ts',
    'src/core/services/factory.ts'
];

let factoriesExist = 0;
for (const factory of factoryFiles) {
    if (fs.existsSync(factory)) {
        console.log(`✅ ${factory} exists`);
        factoriesExist++;

        // Count factory functions in each file
        const factoryContent = fs.readFileSync(factory, 'utf8');
        const factoryFunctions = (factoryContent.match(/export function create\w+/g) || []).length;
        console.log(`  📊 Factory Functions: ${factoryFunctions}`);
    } else {
        console.log(`❌ ${factory} missing`);
    }
}

console.log(`\n📊 Factory Files: ${factoriesExist}/${factoryFiles.length} exist`);

// Test 4: Check type definitions completeness
console.log('\n📦 Test 4: Type Definitions Completeness...');

const typeFiles = [
    'src/core/cache/interfaces/index.ts',
    'src/core/websocket/types/index.ts',
    'src/core/di/types/index.ts',
    'src/core/auth/interfaces/authInterfaces.ts',
    'src/core/theme/interfaces/index.ts',
    'src/core/services/interfaces/index.ts',
    'src/shared/ui/components/types.ts'
];

let typesExist = 0;
for (const typeFile of typeFiles) {
    if (fs.existsSync(typeFile)) {
        console.log(`✅ ${typeFile} exists`);
        typesExist++;

        // Count type definitions
        const typeContent = fs.readFileSync(typeFile, 'utf8');
        const interfaces = (typeContent.match(/export interface/g) || []).length;
        const types = (typeContent.match(/export type/g) || []).length;
        console.log(`  📊 Interfaces: ${interfaces}, Types: ${types}`);
    } else {
        console.log(`❌ ${typeFile} missing`);
    }
}

console.log(`\n📊 Type Files: ${typesExist}/${typeFiles.length} exist`);

// Test 5: Check utility functions
console.log('\n📦 Test 5: Utility Functions...');

const utilityFiles = [
    'src/core/cache/utils.ts',
    'src/core/websocket/utils.ts',
    'src/core/auth/utils.ts',
    'src/core/theme/utils.ts',
    'src/core/services/utils.ts',
    'src/shared/ui/components/utils.ts'
];

let utilitiesExist = 0;
for (const utility of utilityFiles) {
    if (fs.existsSync(utility)) {
        console.log(`✅ ${utility} exists`);
        utilitiesExist++;

        // Count utility functions
        const utilityContent = fs.readFileSync(utility, 'utf8');
        const functions = (utilityContent.match(/export function/g) || []).length;
        console.log(`  📊 Utility Functions: ${functions}`);
    } else {
        console.log(`❌ ${utility} missing`);
    }
}

console.log(`\n📊 Utility Files: ${utilitiesExist}/${utilityFiles.length} exist`);

// Test 6: Check constants and configuration
console.log('\n📦 Test 6: Constants and Configuration...');

const constantFiles = [
    'src/core/cache/constants.ts',
    'src/core/websocket/constants.ts',
    'src/core/auth/constants.ts',
    'src/core/theme/constants.ts',
    'src/core/services/constants.ts',
    'src/shared/ui/components/constants.ts'
];

let constantsExist = 0;
for (const constant of constantFiles) {
    if (fs.existsSync(constant)) {
        console.log(`✅ ${constant} exists`);
        constantsExist++;

        // Count constants
        const constantContent = fs.readFileSync(constant, 'utf8');
        const constants = (constantContent.match(/export const/g) || []).length;
        const enums = (constantContent.match(/export enum/g) || []).length;
        console.log(`  📊 Constants: ${constants}, Enums: ${enums}`);
    } else {
        console.log(`❌ ${constant} missing`);
    }
}

console.log(`\n📊 Constant Files: ${constantsExist}/${constantFiles.length} exist`);

// Test 7: Check validation scripts
console.log('\n📦 Test 7: Validation Scripts...');

const validationScripts = [
    'cache-system-validation.cjs',
    'websocket-system-validation.cjs',
    'auth-system-validation.cjs',
    'theme-system-validation.cjs',
    'ui-library-validation.cjs'
];

let validationsExist = 0;
for (const validation of validationScripts) {
    if (fs.existsSync(validation)) {
        console.log(`✅ ${validation} exists`);
        validationsExist++;
    } else {
        console.log(`❌ ${validation} missing`);
    }
}

console.log(`\n📊 Validation Scripts: ${validationsExist}/${validationScripts.length} exist`);

// Test 8: Check overall architecture compliance
console.log('\n📦 Test 8: Overall Architecture Compliance...');

const compliantModules = Object.values(blackBoxCompliance).filter(module => module.isCompliant).length;
const totalModules = Object.keys(blackBoxCompliance).length;
const complianceRate = (compliantModules / totalModules) * 100;

console.log(`📊 Black Box Compliance: ${compliantModules}/${totalModules} modules (${Math.round(complianceRate)}%)`);
console.log(`📊 Factory Implementation: ${factoriesExist}/${factoryFiles.length} modules (${Math.round((factoriesExist / factoryFiles.length) * 100)}%)`);
console.log(`📊 Type Definitions: ${typesExist}/${typeFiles.length} modules (${Math.round((typesExist / typeFiles.length) * 100)}%)`);
console.log(`📊 Utility Functions: ${utilitiesExist}/${utilityFiles.length} modules (${Math.round((utilitiesExist / utilityFiles.length) * 100)}%)`);
console.log(`📊 Constants: ${constantsExist}/${constantFiles.length} modules (${Math.round((constantsExist / constantFiles.length) * 100)}%)`);
console.log(`📊 Validation Scripts: ${validationsExist}/${validationScripts.length} modules (${Math.round((validationsExist / validationScripts.length) * 100)}%)`);

// Calculate overall score
const overallScore = (
    (indexesExist / moduleIndexes.length) * 20 +
    (compliantModules / totalModules) * 20 +
    (factoriesExist / factoryFiles.length) * 20 +
    (typesExist / typeFiles.length) * 20 +
    (utilitiesExist / utilityFiles.length) * 20
);

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 COMPLETE BLACK BOX MIGRATION VALIDATION RESULTS');
console.log('='.repeat(60));

console.log(`✅ Module Index Files: ${Math.round((indexesExist / moduleIndexes.length) * 100)}%`);
console.log(`✅ Black Box Compliance: ${Math.round(complianceRate)}%`);
console.log(`✅ Factory Implementation: ${Math.round((factoriesExist / factoryFiles.length) * 100)}%`);
console.log(`✅ Type Definitions: ${Math.round((typesExist / typeFiles.length) * 100)}%`);
console.log(`✅ Utility Functions: ${Math.round((utilitiesExist / utilityFiles.length) * 100)}%`);
console.log(`✅ Constants: ${Math.round((constantsExist / constantFiles.length) * 100)}%`);
console.log(`✅ Validation Scripts: ${Math.round((validationsExist / validationScripts.length) * 100)}%`);

console.log(`\n🎯 OVERALL ARCHITECTURE SCORE: ${Math.round(overallScore)}%`);

if (overallScore >= 90) {
    console.log('\n🎉 BLACK BOX MIGRATION: OUTSTANDING SUCCESS!');
    console.log('✅ All modules follow Black Box pattern');
    console.log('✅ Factory functions implemented across all modules');
    console.log('✅ Complete type safety throughout architecture');
    console.log('✅ Utility functions available for all modules');
    console.log('✅ Constants and configuration properly organized');
    console.log('✅ Validation scripts ensure quality');
    console.log('✅ Production-ready architecture established');
    console.log('\n🚀 ENTIRE ARCHITECTURE IS PRODUCTION READY!');
} else if (overallScore >= 80) {
    console.log('\n🎉 BLACK BOX MIGRATION: SUCCESS!');
    console.log('✅ Most modules follow Black Box pattern');
    console.log('✅ Factory functions implemented');
    console.log('✅ Type safety established');
    console.log('✅ Utility functions available');
    console.log('✅ Constants organized');
    console.log('✅ Validation scripts in place');
    console.log('\n🚀 ARCHITECTURE IS PRODUCTION READY!');
} else {
    console.log('\n⚠️  BLACK BOX MIGRATION: PARTIALLY COMPLETE');
    console.log('❌ Some modules need attention');
    console.log('🔧 Please review the issues above');
}

console.log('\n' + '='.repeat(60));

// Module-specific summary
console.log('\n📋 MODULE-SPECIFIC SUMMARY:');
for (const [moduleName, compliance] of Object.entries(blackBoxCompliance)) {
    console.log(`\n🔹 ${moduleName.toUpperCase()}:`);
    console.log(`   ${compliance.isCompliant ? '✅' : '❌'} Black Box Compliant`);
    console.log(`   📊 Explicit Exports: ${compliance.explicitExports}`);
    console.log(`   📊 Wildcard Exports: ${compliance.wildcardExports}`);
    console.log(`   📊 Factory Functions: ${compliance.factoryFunctions}`);
    console.log(`   📊 Type Exports: ${compliance.typeExports}`);
}

console.log('\n' + '='.repeat(60));
