/**
 * Test Runner Script for Profile Feature.
 * 
 * Script to run all profile tests with proper configuration
 * and generate comprehensive test reports.
 */

import { execSync } from 'child_process';
import * as process from 'process';

const runTests = (): void => {
    console.log('🧪 Running Profile Feature Tests...\n');
    console.log('=====================================');
    console.log('📋 Domain Layer Tests');
    console.log('=====================================');

    try {
        execSync('npm test', {
            cwd: process.cwd(),
            stdio: 'inherit'
        });

        console.log('✅ Domain Layer Tests');
        const domainResult = execSync('npm test -- --testPathPattern="src/features/profile/**/*.{test,spec}.{js,jsx,ts,tsx}" --testNamePattern="Domain.*\\.test\\.[jt]s$"', { encoding: 'utf8' });

        if (domainResult.includes('FAIL')) {
            console.error('❌ Domain Layer Tests Failed:');
            console.error(domainResult);
            process.exit(1);
            return;
        }

        console.log('✅ Domain Layer Tests Passed');

        console.log('=====================================');
        console.log('📋 Data Layer Tests');
        const dataResult = execSync('npm test -- --testPathPattern="src/features/profile/**/*.{test,spec}.{js,jsx,ts,tsx}" --testNamePattern="Data.*\\.test\\.[jt]s$"', { encoding: 'utf8' });

        if (dataResult.includes('FAIL')) {
            console.error('❌ Data Layer Tests Failed:');
            console.error(dataResult);
            process.exit(1);
            return;
        }

        console.log('✅ Data Layer Tests Passed');

        console.log('=====================================');
        console.log('📋 Application Layer Tests');
        const appResult = execSync('npm test -- --testPathPattern="src/features/profile/**/*.{test,spec}.{js,jsx,ts,tsx}" --testNamePattern="Application.*\\.test\\.[jt]s$"', { encoding: 'utf8' });

        if (appResult.includes('FAIL')) {
            console.error('❌ Application Layer Tests Failed:');
            console.error(appResult);
            process.exit(1);
            return;
        }

        console.log('✅ Application Layer Tests Passed');

        console.log('=====================================');
        console.log('📋 Integration Tests');
        const integrationResult = execSync('npm test -- --testPathPattern="src/features/profile/**/*.{test,spec}.{js,jsx,ts,tsx}" --testNamePattern="Integration.*\\.test\\.[jt]s$"', { encoding: 'utf8' });

        if (integrationResult.includes('FAIL')) {
            console.error('❌ Integration Tests Failed:');
            console.error(integrationResult);
            process.exit(1);
            return;
        }

        console.log('✅ Integration Tests Passed');

        console.log('=====================================');
        console.log('📋 Performance Tests');
        const perfResult = execSync('npm test --testPathPattern="src/features/profile/**/*.{test,spec}.{js,jsx,ts,tsx}" --testNamePattern="Performance.*\\.test\\.[jt]s$"', { encoding: 'utf8' });

        if (perfResult.includes('FAIL')) {
            console.error('❌ Performance Tests Failed:');
            console.error(perfResult);
            process.exit(1);
            return;
        }

        console.log('✅ Performance Tests Passed');

        console.log('=====================================');
        console.log('📊 Test Summary');
        const allPassed = domainResult.includes('PASS') && dataResult.includes('PASS') && appResult.includes('PASS') && integrationResult.includes('PASS') && perfResult.includes('PASS');
        console.log(`Total Tests: ${allPassed ? '✅ ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);

        console.log('📊 Coverage Report');
        const coverageResult = execSync('npm test -- --coverage', { encoding: 'utf8' });

        if (coverageResult.includes('FAIL')) {
            console.error('❌ Coverage Report Failed:');
            console.error(coverageResult);
            process.exit(1);
            return;
        }

        console.log('Coverage report generated');

        console.log('====================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Test execution failed:');
        console.error(error);
        process.exit(1);
    }
};

// Run tests if script is executed directly
if (require.main === module) {
    runTests();
}
