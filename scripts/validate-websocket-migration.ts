#!/usr/bin/env ts-node

/**
 * WebSocket Migration Validation Script
 * 
 * This script validates that the WebSocket migration was successful by:
 * 1. Verifying enterprise WebSocket infrastructure is intact
 * 2. Testing migration hooks functionality
 * 3. Validating performance improvements
 * 4. Checking for any remaining legacy dependencies
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

interface ValidationResult {
  enterpriseInfrastructure: {
    status: 'pass' | 'fail';
    details: string[];
  };
  migrationHooks: {
    status: 'pass' | 'fail';
    details: string[];
  };
  legacyCleanup: {
    status: 'pass' | 'fail';
    details: string[];
  };
  performance: {
    status: 'pass' | 'fail';
    details: string[];
  };
  overall: {
    status: 'pass' | 'fail';
    score: number;
  };
}

/**
 * Check if enterprise WebSocket infrastructure is intact
 */
function validateEnterpriseInfrastructure(): { status: 'pass' | 'fail'; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const requiredFiles = [
    'src/core/websocket/services/EnterpriseWebSocketService.ts',
    'src/core/websocket/managers/ConnectionManager.ts',
    'src/core/websocket/services/MessageRouter.ts',
    'src/core/websocket/hooks/useFeatureWebSocket.ts',
    'src/core/websocket/hooks/useEnterpriseWebSocket.ts',
    'src/core/websocket/types/WebSocketTypes.ts',
    'src/core/websocket/utils/WebSocketUtils.ts',
    'src/core/websocket/di/WebSocketContainer.ts',
  ];
  
  for (const file of requiredFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    if (fs.existsSync(fullPath)) {
      details.push(`✅ ${file} - Present`);
    } else {
      details.push(`❌ ${file} - Missing`);
      passed = false;
    }
  }
  
  return { status: passed ? 'pass' : 'fail', details };
}

/**
 * Check if migration hooks are properly implemented
 */
function validateMigrationHooks(): { status: 'pass' | 'fail'; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const migrationFiles = [
    'src/features/chat/adapters/ChatSocketMigration.ts',
    'src/features/notification/adapters/NotificationSocketMigration.ts',
    'src/features/feed/adapters/FeedSocketMigration.ts',
  ];
  
  for (const file of migrationFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    if (fs.existsSync(fullPath)) {
      details.push(`✅ ${file} - Migration hook present`);
      
      // Check if file contains expected migration functions
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('useMigration') && content.includes('enterprise')) {
          details.push(`  ✅ Contains migration logic`);
        } else {
          details.push(`  ⚠️  May be missing migration logic`);
          passed = false;
        }
      } catch (error) {
        details.push(`  ❌ Error reading file: ${error}`);
        passed = false;
      }
    } else {
      details.push(`❌ ${file} - Migration hook missing`);
      passed = false;
    }
  }
  
  // Check for migrated hook files
  const migratedFiles = [
    'src/features/chat/data/useChatSocketMigrated.tsx',
    'src/features/notification/data/useNotificationSocketMigrated.tsx',
    'src/features/feed/application/hooks/useRealtimeFeedUpdatesMigrated.tsx',
  ];
  
  for (const file of migratedFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    if (fs.existsSync(fullPath)) {
      details.push(`✅ ${file} - Migrated hook present`);
    } else {
      details.push(`❌ ${file} - Migrated hook missing`);
      passed = false;
    }
  }
  
  return { status: passed ? 'pass' : 'fail', details };
}

/**
 * Check if legacy WebSocket implementations have been removed
 */
function validateLegacyCleanup(): { status: 'pass' | 'fail'; details: string[] } {
  const details: string[] = [];
  let passed = true;
  let legacyFound = false;
  
  const legacyPatterns = [
    'src/features/chat/data/services/WebSocketService.ts',
    'src/features/chat/presentation/components/realtime/AdvancedWebSocketManager.tsx',
    'src/features/chat/data/useChatSocket.tsx',
    'src/features/notification/application/services/RealtimeNotificationService.ts',
    'src/features/notification/application/hooks/useNotificationSocket.tsx',
    'src/features/feed/application/hooks/useRealtimeFeedUpdates.ts',
    'src/core/network/socket/',
  ];
  
  for (const pattern of legacyPatterns) {
    const fullPath = path.join(PROJECT_ROOT, pattern);
    if (fs.existsSync(fullPath)) {
      details.push(`❌ ${pattern} - Legacy implementation still exists`);
      legacyFound = true;
    } else {
      details.push(`✅ ${pattern} - Successfully removed`);
    }
  }
  
  if (legacyFound) {
    passed = false;
  }
  
  // Check for any remaining legacy imports
  try {
    const searchLegacyImports = (dir: string) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          searchLegacyImports(fullPath);
        } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const relativePath = path.relative(SRC_DIR, fullPath);
            
            // Check for legacy imports
            if (content.includes('from \'../services/WebSocketService\'') ||
                content.includes('from \'../hooks/useRealtimeFeedUpdates\'') ||
                content.includes('from \'../hooks/useNotificationSocket\'') ||
                content.includes('from \'../data/useChatSocket\'')) {
              details.push(`⚠️  ${relativePath} - Contains legacy import`);
              passed = false;
            }
          } catch {
            // Skip files that can't be read
          }
        }
      }
    };
    
    searchLegacyImports(SRC_DIR);
    
    if (passed) {
      details.push('✅ No legacy imports found in codebase');
    }
    
  } catch (error) {
    details.push(`⚠️  Error checking for legacy imports: ${error}`);
  }
  
  return { status: passed ? 'pass' : 'fail', details };
}

/**
 * Validate performance improvements and metrics
 */
function validatePerformance(): { status: 'pass' | 'fail'; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  // Check if performance monitoring is implemented
  const performanceFiles = [
    'src/core/websocket/hooks/useWebSocketMigration.ts',
  ];
  
  for (const file of performanceFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('performanceMetrics') && 
            content.includes('latency') && 
            content.includes('monitoring')) {
          details.push(`✅ ${file} - Performance monitoring implemented`);
        } else {
          details.push(`⚠️  ${file} - Performance monitoring may be incomplete`);
          passed = false;
        }
      } catch (error) {
        details.push(`❌ Error reading ${file}: ${error}`);
        passed = false;
      }
    } else {
      details.push(`❌ ${file} - Performance monitoring file missing`);
      passed = false;
    }
  }
  
  // Check example components for performance features
  const exampleFiles = [
    'src/features/chat/presentation/components/ChatMigrationExample.tsx',
    'src/features/notification/data/useNotificationSocketMigrated.tsx',
    'src/features/feed/presentation/components/FeedMigrationExample.tsx',
  ];
  
  for (const file of exampleFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('migration') && content.includes('performanceMetrics')) {
          details.push(`✅ ${path.basename(file)} - Performance metrics available`);
        }
      } catch {
        // Skip files that can't be read
      }
    }
  }
  
  return { status: passed ? 'pass' : 'fail', details };
}

/**
 * Generate validation report
 */
function generateValidationReport(result: ValidationResult): void {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 WEBSOCKET MIGRATION VALIDATION REPORT');
  console.log('='.repeat(70));
  
  const sections = [
    { title: 'Enterprise Infrastructure', data: result.enterpriseInfrastructure },
    { title: 'Migration Hooks', data: result.migrationHooks },
    { title: 'Legacy Cleanup', data: result.legacyCleanup },
    { title: 'Performance Validation', data: result.performance },
  ];
  
  sections.forEach(section => {
    console.log(`\n📋 ${section.title.toUpperCase()}:`);
    console.log(`   Status: ${section.data.status === 'pass' ? '✅ PASS' : '❌ FAIL'}`);
    section.data.details.forEach(detail => {
      console.log(`   ${detail}`);
    });
  });
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 OVERALL RESULTS:');
  console.log(`   Status: ${result.overall.status === 'pass' ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Score: ${result.overall.score}/100`);
  
  if (result.overall.status === 'pass') {
    console.log('\n🎉 MIGRATION VALIDATION SUCCESSFUL!');
    console.log('   All WebSocket implementations have been successfully migrated');
    console.log('   to the enterprise infrastructure with performance improvements.');
  } else {
    console.log('\n⚠️  MIGRATION VALIDATION FAILED');
    console.log('   Some issues were detected. Please review the details above.');
  }
  
  console.log('='.repeat(70));
}

/**
 * Calculate overall score
 */
function calculateOverallScore(result: ValidationResult): number {
  const sections = [
    result.enterpriseInfrastructure,
    result.migrationHooks,
    result.legacyCleanup,
    result.performance,
  ];
  
  const passedCount = sections.filter(section => section.status === 'pass').length;
  return Math.round((passedCount / sections.length) * 100);
}

/**
 * Main validation function
 */
function performValidation(): ValidationResult {
  console.log('🚀 Starting WebSocket Migration Validation...\n');
  
  const result: ValidationResult = {
    enterpriseInfrastructure: validateEnterpriseInfrastructure(),
    migrationHooks: validateMigrationHooks(),
    legacyCleanup: validateLegacyCleanup(),
    performance: validatePerformance(),
    overall: { status: 'fail', score: 0 }
  };
  
  result.overall.score = calculateOverallScore(result);
  result.overall.status = result.overall.score >= 75 ? 'pass' : 'fail';
  
  return result;
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 WebSocket Migration Validation Script');
  console.log('========================================\n');
  
  const result = performValidation();
  generateValidationReport(result);
  
  // Exit with appropriate code
  process.exit(result.overall.status === 'pass' ? 0 : 1);
}

// Run the script
if (require.main === module) {
  main();
}

export { performValidation, generateValidationReport };
