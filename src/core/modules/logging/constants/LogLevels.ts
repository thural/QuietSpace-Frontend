/**
 * Log Levels Constants
 * 
 * Constants and utilities for log levels.
 */

/**
 * Log level priorities
 */
export const LOG_LEVEL_PRIORITIES = {
  TRACE: 0,
  DEBUG: 10,
  INFO: 20,
  AUDIT: 25,
  WARN: 30,
  METRICS: 35,
  ERROR: 40,
  SECURITY: 45,
  FATAL: 50
} as const;

/**
 * Log level names
 */
export const LOG_LEVEL_NAMES = [
  'TRACE',
  'DEBUG',
  'INFO',
  'AUDIT',
  'WARN',
  'METRICS',
  'ERROR',
  'SECURITY',
  'FATAL'
] as const;

/**
 * Log level colors for console output
 */
export const LOG_LEVEL_COLORS = {
  TRACE: '#6b7280', // Gray
  DEBUG: '#06b6d4', // Cyan
  INFO: '#10b981',  // Green
  AUDIT: '#3b82f6', // Blue
  WARN: '#f59e0b',  // Yellow
  METRICS: '#8b5cf6', // Purple
  ERROR: '#ef4444', // Red
  SECURITY: '#dc2626', // Dark Red
  FATAL: '#991b1b'   // Darker Red
} as const;

/**
 * Log level icons
 */
export const LOG_LEVEL_ICONS = {
  TRACE: '🔍',
  DEBUG: '🐛',
  INFO: 'ℹ️',
  AUDIT: '📋',
  WARN: '⚠️',
  METRICS: '📊',
  ERROR: '❌',
  SECURITY: '🔒',
  FATAL: '💀'
} as const;

/**
 * Default log levels by environment
 */
export const DEFAULT_LOG_LEVELS_BY_ENVIRONMENT = {
  development: 'DEBUG',
  test: 'ERROR',
  staging: 'INFO',
  production: 'WARN'
} as const;

/**
 * Log level descriptions
 */
export const LOG_LEVEL_DESCRIPTIONS = {
  TRACE: 'Most detailed information, typically only of interest when diagnosing problems',
  DEBUG: 'Detailed information on the flow through the system',
  INFO: 'Interesting runtime events (startup/shutdown)',
  AUDIT: 'Security and compliance related events',
  WARN: 'Use of deprecated APIs, poor use of API, almost errors, other runtime situations that are undesirable or unexpected',
  METRICS: 'Performance and business metrics',
  ERROR: 'Runtime errors or unexpected conditions',
  SECURITY: 'Security-related events and violations',
  FATAL: 'Very severe error events that will presumably lead the application to abort'
} as const;

/**
 * Type for log level
 */
export type LogLevel = keyof typeof LOG_LEVEL_PRIORITIES;

/**
 * Check if a string is a valid log level
 */
export function isValidLogLevel(level: string): level is LogLevel {
  return Object.keys(LOG_LEVEL_PRIORITIES).includes(level);
}

/**
 * Get log level priority
 */
export function getLogLevelPriority(level: LogLevel): number {
  return LOG_LEVEL_PRIORITIES[level];
}

/**
 * Compare two log levels
 */
export function compareLogLevels(level1: LogLevel, level2: LogLevel): number {
  const priority1 = getLogLevelPriority(level1);
  const priority2 = getLogLevelPriority(level2);
  
  if (priority1 < priority2) return -1;
  if (priority1 > priority2) return 1;
  return 0;
}

/**
 * Check if level1 is enabled for level2 threshold
 */
export function isLogLevelEnabled(currentLevel: LogLevel, thresholdLevel: LogLevel): boolean {
  return getLogLevelPriority(currentLevel) >= getLogLevelPriority(thresholdLevel);
}

/**
 * Get log level color
 */
export function getLogLevelColor(level: LogLevel): string {
  return LOG_LEVEL_COLORS[level];
}

/**
 * Get log level icon
 */
export function getLogLevelIcon(level: LogLevel): string {
  return LOG_LEVEL_ICONS[level];
}

/**
 * Get log level description
 */
export function getLogLevelDescription(level: LogLevel): string {
  return LOG_LEVEL_DESCRIPTIONS[level];
}

/**
 * Get default log level for environment
 */
export function getDefaultLogLevelForEnvironment(environment: string): LogLevel {
  return (DEFAULT_LOG_LEVELS_BY_ENVIRONMENT as any)[environment] || 'INFO';
}

/**
 * Get all log levels
 */
export function getAllLogLevels(): LogLevel[] {
  return [...LOG_LEVEL_NAMES];
}

/**
 * Get log levels above or equal to a threshold
 */
export function getLogLevelsAboveOrEqual(threshold: LogLevel): LogLevel[] {
  const thresholdPriority = getLogLevelPriority(threshold);
  return LOG_LEVEL_NAMES.filter(level => getLogLevelPriority(level) >= thresholdPriority);
}

/**
 * Get log levels below a threshold
 */
export function getLogLevelsBelow(threshold: LogLevel): LogLevel[] {
  const thresholdPriority = getLogLevelPriority(threshold);
  return LOG_LEVEL_NAMES.filter(level => getLogLevelPriority(level) < thresholdPriority);
}
