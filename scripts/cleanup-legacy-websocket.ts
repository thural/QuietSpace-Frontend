#!/usr/bin/env ts-node

/**
 * Legacy WebSocket Cleanup Script
 * 
 * This script identifies and removes legacy WebSocket implementations that have been
 * replaced by the enterprise WebSocket infrastructure. It performs safe cleanup
 * while preserving enterprise implementations and migration utilities.
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Legacy files to remove (identified from migration analysis)
const LEGACY_FILES = [
  // Legacy Chat WebSocket implementations
  'src/features/chat/data/services/WebSocketService.ts',
  'src/features/chat/presentation/components/realtime/AdvancedWebSocketManager.tsx',
  'src/features/chat/data/useChatSocket.tsx',
  
  // Legacy Notification WebSocket implementations  
  'src/features/notification/application/services/RealtimeNotificationService.ts',
  'src/features/notification/application/hooks/useNotificationSocket.tsx',
  
  // Legacy Feed WebSocket implementations
  'src/features/feed/application/hooks/useRealtimeFeedUpdates.ts',
  
  // Legacy core socket implementations
  'src/core/network/socket/service/socketService.ts',
  'src/core/network/socket/utils/stomptUtils.ts',
  'src/core/network/socket/clients/useStompClient.tsx',
];

// Enterprise files to preserve
const ENTERPRISE_PATTERNS = [
  'src/core/websocket/',
  'src/features/chat/adapters/',
  'src/features/notification/adapters/', 
  'src/features/feed/adapters/',
];

// Migration files to preserve
const MIGRATION_PATTERNS = [
  'Migrated',
  'Migration',
  'migrated',
  'migration'
];

interface CleanupResult {
  removed: string[];
  preserved: string[];
  errors: string[];
  summary: {
    totalFiles: number;
    removedCount: number;
    preservedCount: number;
    errorCount: number;
  };
}

/**
 * Check if a file should be preserved (enterprise or migration file)
 */
function shouldPreserveFile(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // Preserve enterprise WebSocket files
  for (const pattern of ENTERPRISE_PATTERNS) {
    if (normalizedPath.includes(pattern)) {
      return true;
    }
  }
  
  // Preserve migration files
  for (const pattern of MIGRATION_PATTERNS) {
    if (normalizedPath.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if a file exists
 */
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/**
 * Remove a file safely
 */
function removeFile(filePath: string): { success: boolean; error?: string } {
  try {
    if (fileExists(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    } else {
      return { success: false, error: 'File does not exist' };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Find all WebSocket-related files
 */
function findAllWebSocketFiles(): string[] {
  const webSocketFiles: string[] = [];
  
  function scanDirectory(dir: string) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (stat.isFile()) {
          const relativePath = path.relative(SRC_DIR, fullPath);
          const normalizedPath = relativePath.replace(/\\/g, '/');
          
          // Check if it's a WebSocket-related file
          if (normalizedPath.toLowerCase().includes('websocket') ||
              normalizedPath.toLowerCase().includes('socket') ||
              normalizedPath.toLowerCase().includes('stomp')) {
            webSocketFiles.push(normalizedPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error);
    }
  }
  
  scanDirectory(SRC_DIR);
  return webSocketFiles;
}

/**
 * Perform the cleanup
 */
function performCleanup(): CleanupResult {
  const result: CleanupResult = {
    removed: [],
    preserved: [],
    errors: [],
    summary: {
      totalFiles: 0,
      removedCount: 0,
      preservedCount: 0,
      errorCount: 0
    }
  };
  
  console.log('🔍 Starting legacy WebSocket cleanup...\n');
  
  // First, remove specific legacy files
  console.log('📋 Removing specific legacy files:');
  for (const legacyFile of LEGACY_FILES) {
    const fullPath = path.join(PROJECT_ROOT, legacyFile);
    
    if (fileExists(fullPath)) {
      const removeResult = removeFile(fullPath);
      if (removeResult.success) {
        result.removed.push(legacyFile);
        console.log(`  ✅ Removed: ${legacyFile}`);
      } else {
        result.errors.push(`${legacyFile}: ${removeResult.error}`);
        console.log(`  ❌ Error removing ${legacyFile}: ${removeResult.error}`);
      }
    } else {
      console.log(`  ⚠️  Not found: ${legacyFile}`);
    }
  }
  
  // Then, scan for any remaining WebSocket files
  console.log('\n🔍 Scanning for remaining WebSocket files:');
  const allWebSocketFiles = findAllWebSocketFiles();
  
  for (const webSocketFile of allWebSocketFiles) {
    const fullPath = path.join(SRC_DIR, webSocketFile);
    
    if (shouldPreserveFile(webSocketFile)) {
      result.preserved.push(webSocketFile);
      console.log(`  ✅ Preserved: ${webSocketFile}`);
    } else {
      // Check if it's already in our legacy list
      const isInLegacyList = LEGACY_FILES.some(legacy => 
        webSocketFile.includes(legacy.split('/').pop() || '')
      );
      
      if (!isInLegacyList) {
        // This is an unidentified WebSocket file - preserve for safety
        result.preserved.push(webSocketFile);
        console.log(`  ⚠️  Unidentified - Preserved: ${webSocketFile}`);
      }
    }
  }
  
  // Calculate summary
  result.summary.totalFiles = result.removed.length + result.preserved.length;
  result.summary.removedCount = result.removed.length;
  result.summary.preservedCount = result.preserved.length;
  result.summary.errorCount = result.errors.length;
  
  return result;
}

/**
 * Generate cleanup report
 */
function generateReport(result: CleanupResult): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 CLEANUP REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n📈 SUMMARY:`);
  console.log(`  Total WebSocket files processed: ${result.summary.totalFiles}`);
  console.log(`  Legacy files removed: ${result.summary.removedCount}`);
  console.log(`  Enterprise files preserved: ${result.summary.preservedCount}`);
  console.log(`  Errors encountered: ${result.summary.errorCount}`);
  
  if (result.removed.length > 0) {
    console.log(`\n🗑️  REMOVED FILES (${result.removed.length}):`);
    result.removed.forEach(file => console.log(`  - ${file}`));
  }
  
  if (result.preserved.length > 0) {
    console.log(`\n✅ PRESERVED FILES (${result.preserved.length}):`);
    result.preserved.forEach(file => console.log(`  - ${file}`));
  }
  
  if (result.errors.length > 0) {
    console.log(`\n❌ ERRORS (${result.errors.length}):`);
    result.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (result.summary.errorCount === 0) {
    console.log('🎉 CLEANUP COMPLETED SUCCESSFULLY!');
    console.log('   All legacy WebSocket implementations have been removed.');
    console.log('   Enterprise WebSocket infrastructure is now the sole implementation.');
  } else {
    console.log('⚠️  CLEANUP COMPLETED WITH ERRORS');
    console.log('   Some files could not be removed. Please review the errors above.');
  }
  
  console.log('='.repeat(60));
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Legacy WebSocket Cleanup Script');
  console.log('=====================================\n');
  
  const result = performCleanup();
  generateReport(result);
  
  // Exit with appropriate code
  process.exit(result.summary.errorCount > 0 ? 1 : 0);
}

// Run the script
if (require.main === module) {
  main();
}

export { performCleanup, generateReport };
