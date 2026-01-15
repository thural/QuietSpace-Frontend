/**
 * Test Runner Script for Profile Feature.
 * 
 * Script to run all profile tests with proper configuration
 * and generate comprehensive test reports.
 */

const { execSync } = require('child_process').execSync;

const runTests = () => {
  console.log('🧪 Running Profile Feature Tests...\n');
  console.log('=====================================');
  console.log('📋 Domain Layer Tests');
  console.log('=====================================');
  
  try {
    const { stdout, stderr } = execSync('npm test', { 
      cwd: process.cwd(),
      stdio: 'inherit'
    });
    
    if (stderr) {
      console.error('❌ Test execution failed:');
      console.error(stderr);
      process.exit(1);
      return;
    }
    
    console.log('✅ Domain Layer Tests');
    const domainResult = execSync('npm test -- --testPathPattern="src/features/profile/**/*.{test,spec}.{js,jsx,ts,tsx}" --testNamePattern="Domain.*\\.test\\.[jt]s$"');
    
    if (domainResult.stderr) {
      console.error('❌ Domain Layer Tests Failed:');
      console.error(domainResult.stderr);
      process.exit(1);
      return;
    }
    
    console.log('✅ Domain Layer Tests Passed');
    
    console.log('=====================================');
    console.log('📋 Data Layer Tests');
    const dataResult = execSync('npm test -- --testPathPattern="src/features/profile/**/*.{test,spec}.{js,jsx,ts,tsx}" --testNamePattern="Data.*\\.test\\.[jt]s$"');
    
    if (dataResult.stderr) {
      console.error('❌ Data Layer Tests Failed:');
      console.error(dataResult.stderr);
      process.exit(1);
      return;
    }
    
    console.log('✅ Data Layer Tests Passed');
    
    console.log('=====================================');
    console.log('📋 Application Layer Tests');
    const appResult = execSync('npm test -- --testPathPattern="src/features/profile/**/*.{test,spec}.{js,jsx,ts,tsx}" --testNamePattern="Application.*\\.test\\.[jt]s$"');
    
    if (appResult.stderr) {
      console.error('❌ Application Layer Tests Failed:');
      console.error(appResult.stderr);
      process.exit(1);
      return;
    }
    
    console.log('✅ Application Layer Tests Passed');
    
    console.log('=====================================');
    console.log('📋 Integration Tests');
    const integrationResult = execSync('npm test -- --testPathPattern="src/features/profile/**/*.{test,spec}.{js,jsx,ts,tsx}" --testNamePattern="Integration.*\\.test\\.[jt]s$"');
    
    if (integrationResult.stderr) {
      console.error('❌ Integration Tests Failed:');
      console.error(integrationResult.stderr);
      process.exit(1);
      return;
    }
    
    console.log('✅ Integration Tests Passed');
    
    console.log('=====================================');
    console.log('📋 Performance Tests');
    const perfResult = execSync('npm test --testPathPattern="src/features/profile/**/*.{test,spec}.{js,jsx,ts,tsx}" --testNamePattern="Performance.*\\.test\\.[jt]s$"');
    
    if (perfResult.stderr) {
      console.error('❌ Performance Tests Failed:');
      console.error(perfResult.stderr);
      process.exit(1);
      return;
    }
    
    console.log('✅ Performance Tests Passed');
    
    console.log('=====================================');
    console.log('📊 Test Summary');
    console.log(`Total Tests: ${domainResult.stdout.includes('✅') + dataResult.stdout.includes('✅') + appResult.stdout.includes('✅') + integrationResult.stdout.includes('✅') + perfResult.stdout.includes('✅') ? '✅ ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
    
    console.log('📊 Coverage Report');
    const coverageResult = execSync('npm test -- --coverage');
    
    if (coverageResult.stderr) {
      console.error('❌ Coverage Report Failed:');
      console.error(coverageResult.stderr);
      process.exit(1);
      return;
    }
    
    console.log('Coverage report generated at: coverageResult.stdout');
    
    console.log('====================================');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test execution failed:');
      console.error(error);
      process.exit(1);
    }
  }
};

// Run tests if script is executed directly
if (require.main === module) {
  runTests();
}
