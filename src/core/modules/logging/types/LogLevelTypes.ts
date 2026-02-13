/**
 * Log Level Types
 * 
 * Defines log levels with priorities for filtering and performance optimization.
 * Inspired by SLF4J and Log4j level systems.
 */

/**
 * Standard log levels with priority values
 * Lower values = higher priority (more verbose)
 */
export enum LogLevel {
  TRACE = 0,
  DEBUG = 10,
  INFO = 20,
  AUDIT = 25,
  WARN = 30,
  METRICS = 35,
  ERROR = 40,
  SECURITY = 45,
  FATAL = 50
}

/**
 * Log level priority mapping for dynamic level management
 */
export interface LogLevelPriority {
  [key: string]: number;
}

/**
 * Default log level priorities
 */
export const DEFAULT_LOG_LEVELS: LogLevelPriority = {
  TRACE: LogLevel.TRACE,
  DEBUG: LogLevel.DEBUG,
  INFO: LogLevel.INFO,
  AUDIT: LogLevel.AUDIT,
  WARN: LogLevel.WARN,
  METRICS: LogLevel.METRICS,
  ERROR: LogLevel.ERROR,
  SECURITY: LogLevel.SECURITY,
  FATAL: LogLevel.FATAL
};

/**
 * Log level configuration
 */
export interface LogLevelConfig {
  /** Level name */
  name: string;
  /** Priority value */
  priority: number;
  /** Whether level is enabled */
  enabled: boolean;
  /** Color for console output */
  color?: string;
  /** Icon for visual representation */
  icon?: string;
}

/**
 * Type guard for log level validation
 */
export function isValidLogLevel(level: string): level is keyof typeof LogLevel {
  return Object.keys(LogLevel).includes(level);
}

/**
 * Get level priority by name
 */
export function getLevelPriority(level: string): number {
  return DEFAULT_LOG_LEVELS[level.toUpperCase()] ?? Number.MAX_SAFE_INTEGER;
}

/**
 * Compare two log levels
 * @returns -1 if level1 < level2, 0 if equal, 1 if level1 > level2
 */
export function compareLevels(level1: string, level2: string): number {
  const priority1 = getLevelPriority(level1);
  const priority2 = getLevelPriority(level2);
  
  if (priority1 < priority2) return -1;
  if (priority1 > priority2) return 1;
  return 0;
}

/**
 * Check if level1 is enabled for level2 threshold
 */
export function isLevelEnabled(currentLevel: string, thresholdLevel: string): boolean {
  return getLevelPriority(currentLevel) >= getLevelPriority(thresholdLevel);
}
