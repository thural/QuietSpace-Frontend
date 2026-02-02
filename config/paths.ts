/**
 * Shared Path Configuration
 * 
 * Centralized path definitions for all build tools
 * to eliminate duplication across configuration files.
 */

import path from 'path';

export interface PathConfig {
  [key: string]: string | string[];
}

/**
 * Base path mappings shared across all configurations
 */
export const sharedPaths: PathConfig = {
  // Core paths
  '@': path.resolve(__dirname, '../src'),
  '@components': path.resolve(__dirname, '../src/components'),
  '@shared': path.resolve(__dirname, '../src/shared'),
  '@utils': path.resolve(__dirname, '../src/shared/utils'),
  '@hooks': path.resolve(__dirname, '../src/hooks'),
  '@services': path.resolve(__dirname, '../src/services'),
  '@api': path.resolve(__dirname, '../src/api'),

  // Feature paths
  '@features': path.resolve(__dirname, '../src/features'),
  '@chat': path.resolve(__dirname, '../src/features/chat'),
  '@notification': path.resolve(__dirname, '../src/features/notification'),
  '@analytics': path.resolve(__dirname, '../src/features/analytics'),
  '@content': path.resolve(__dirname, '../src/features/content'),
  '@feed': path.resolve(__dirname, '../src/features/feed'),
  '@profile': path.resolve(__dirname, '../src/features/profile'),
  '@search': path.resolve(__dirname, '../src/features/search'),
  '@settings': path.resolve(__dirname, '../src/features/settings'),
  '@navbar': path.resolve(__dirname, '../src/features/navbar'),

  // Utility paths
  '@core': path.resolve(__dirname, '../src/core'),
  '@styles': path.resolve(__dirname, '../src/styles'),
  '@constants': path.resolve(__dirname, '../src/shared/constants'),
  '@shared-types': path.resolve(__dirname, '../src/shared/types'),
};

/**
 * TypeScript path mappings (for tsconfig.json)
 * Converted to relative paths for TypeScript compiler
 */
export const tsPaths: PathConfig = {
  '@': ['src'],
  '@components': ['src/components'],
  '@shared': ['src/shared'],
  '@utils': ['src/shared/utils'],
  '@hooks': ['src/hooks'],
  '@services': ['src/services'],
  '@api': ['src/api'],
  '@features': ['src/features'],
  '@chat': ['src/features/chat'],
  '@notification': ['src/features/notification'],
  '@analytics': ['src/features/analytics'],
  '@content': ['src/features/content'],
  '@feed': ['src/features/feed'],
  '@profile': ['src/features/profile'],
  '@search': ['src/features/search'],
  '@settings': ['src/features/settings'],
  '@navbar': ['src/features/navbar'],
  '@core': ['src/core'],
  '@styles': ['src/styles'],
  '@constants': ['src/shared/constants'],
  '@shared-types': ['src/shared/types'],
};

/**
 * Get Vite resolve aliases from shared paths
 * Returns Record<string, string> for Vite compatibility
 */
export function getViteAliases(): Record<string, string> {
  return sharedPaths as Record<string, string>;
}

/**
 * Get TypeScript path mappings
 */
export function getTsPaths(): PathConfig {
  return tsPaths;
}

/**
 * Default export for convenience
 */
export default {
  sharedPaths,
  tsPaths,
  getViteAliases,
  getTsPaths,
};
