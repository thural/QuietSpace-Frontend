/**
 * Test Runner Script
 * 
 * Runs tests for the test directory with proper configuration
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running Tests for Test Directory...\n');

// Set the test directory as the working directory
process.chdir(__dirname);

try {
    console.log('📁 Test Directory:', process.cwd());
    console.log('🔧 Running Jest with test configuration...\n');

    // Run Jest with the test configuration
    const result = execSync('npx jest --config jest.config.cjs', {
        stdio: 'inherit',
        cwd: __dirname
    });

    console.log('\n✅ Tests completed successfully!');

} catch (error) {
    console.error('\n❌ Tests failed!');
    process.exit(1);
}
