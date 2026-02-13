/**
 * Error Messages Constants
 * 
 * Standardized error messages for the logging system.
 */

/**
 * General error messages
 */
export const GENERAL_ERROR_MESSAGES = {
  INVALID_CONFIGURATION: 'Invalid logging configuration',
  MISSING_REQUIRED_FIELD: 'Missing required field: {}',
  INVALID_VALUE: 'Invalid value for field {}: {}',
  OPERATION_FAILED: 'Operation failed: {}',
  INITIALIZATION_FAILED: 'Logging system initialization failed',
  SHUTDOWN_FAILED: 'Logging system shutdown failed',
  VALIDATION_FAILED: 'Validation failed: {}',
  PERMISSION_DENIED: 'Permission denied: {}',
  RESOURCE_NOT_FOUND: 'Resource not found: {}',
  TIMEOUT: 'Operation timed out after {}ms',
  NETWORK_ERROR: 'Network error: {}'
} as const;

/**
 * Logger error messages
 */
export const LOGGER_ERROR_MESSAGES = {
  LOGGER_NOT_FOUND: 'Logger not found: {}',
  LOGGER_ALREADY_EXISTS: 'Logger already exists: {}',
  INVALID_LOGGER_NAME: 'Invalid logger name: {}',
  INVALID_LOG_LEVEL: 'Invalid log level: {}',
  LOGGER_DISABLED: 'Logger is disabled: {}',
  LOGGER_NOT_INITIALIZED: 'Logger not initialized: {}',
  LOGGER_SHUTDOWN: 'Logger is shutdown: {}',
  INVALID_CATEGORY: 'Invalid logger category: {}',
  APPENDER_ERROR: 'Appender error in logger {}: {}',
  LAYOUT_ERROR: 'Layout error in logger {}: {}'
} as const;

/**
 * Appender error messages
 */
export const APPENDER_ERROR_MESSAGES = {
  APPENDER_NOT_FOUND: 'Appender not found: {}',
  APPENDER_ALREADY_EXISTS: 'Appender already exists: {}',
  INVALID_APPENDER_TYPE: 'Invalid appender type: {}',
  APPENDER_NOT_STARTED: 'Appender not started: {}',
  APPENDER_START_FAILED: 'Failed to start appender {}: {}',
  APPENDER_STOP_FAILED: 'Failed to stop appender {}: {}',
  APPENDER_CONFIGURATION_ERROR: 'Appender configuration error: {}',
  APPENDER_THROTTLED: 'Appender throttled: {}',
  APPENDER_BATCH_ERROR: 'Appender batch error: {}',
  APPENDER_RETRY_EXHAUSTED: 'Appender retry attempts exhausted: {}',
  REMOTE_APPENDER_CONNECTION_FAILED: 'Remote appender connection failed: {}',
  REMOTE_APPENDER_TIMEOUT: 'Remote appender request timeout',
  REMOTE_APPENDER_SERVER_ERROR: 'Remote appender server error: {}'
} as const;

/**
 * Layout error messages
 */
export const LAYOUT_ERROR_MESSAGES = {
  LAYOUT_NOT_FOUND: 'Layout not found: {}',
  LAYOUT_ALREADY_EXISTS: 'Layout already exists: {}',
  INVALID_LAYOUT_TYPE: 'Invalid layout type: {}',
  LAYOUT_CONFIGURATION_ERROR: 'Layout configuration error: {}',
  LAYOUT_FORMAT_ERROR: 'Layout format error: {}',
  LAYOUT_TEMPLATE_ERROR: 'Layout template error: {}',
  INVALID_DATE_FORMAT: 'Invalid date format: {}',
  INVALID_PATTERN: 'Invalid layout pattern: {}'
} as const;

/**
 * Configuration error messages
 */
export const CONFIGURATION_ERROR_MESSAGES = {
  CONFIG_LOAD_FAILED: 'Failed to load configuration: {}',
  CONFIG_SAVE_FAILED: 'Failed to save configuration: {}',
  CONFIG_VALIDATION_FAILED: 'Configuration validation failed: {}',
  INVALID_CONFIG_SOURCE: 'Invalid configuration source: {}',
  CONFIG_PARSE_ERROR: 'Configuration parse error: {}',
  CONFIG_MERGE_ERROR: 'Configuration merge error: {}',
  ENVIRONMENT_DETECTION_FAILED: 'Environment detection failed: {}',
  HOT_RELOAD_FAILED: 'Hot reload failed: {}',
  CONFIG_WATCHER_ERROR: 'Configuration watcher error: {}'
} as const;

/**
 * Security error messages
 */
export const SECURITY_ERROR_MESSAGES = {
  SANITIZATION_FAILED: 'Data sanitization failed: {}',
  FILTER_ERROR: 'Security filter error: {}',
  COMPLIANCE_VIOLATION: 'Compliance violation: {}',
  CONSENT_REQUIRED: 'User consent required for logging: {}',
  CONSENT_REVOKED: 'User consent revoked: {}',
  DATA_RETENTION_VIOLATION: 'Data retention violation: {}',
  PII_DETECTED: 'PII detected in log entry: {}',
  SENSITIVE_DATA_BLOCKED: 'Sensitive data blocked: {}',
  ACCESS_DENIED: 'Access denied: {}',
  AUTHENTICATION_FAILED: 'Authentication failed: {}'
} as const;

/**
 * Performance error messages
 */
export const PERFORMANCE_ERROR_MESSAGES = {
  MEASUREMENT_ERROR: 'Performance measurement error: {}',
  MONITORING_ERROR: 'Performance monitoring error: {}',
  THRESHOLD_EXCEEDED: 'Performance threshold exceeded: {}',
  MEMORY_LIMIT_EXCEEDED: 'Memory limit exceeded: {}',
  PERFORMANCE_DEGRADATION: 'Performance degradation detected: {}',
  RESOURCE_EXHAUSTED: 'Resource exhausted: {}',
  TIMEOUT_ERROR: 'Performance timeout: {}',
  METRIC_COLLECTION_FAILED: 'Metric collection failed: {}'
} as const;

/**
 * React integration error messages
 */
export const REACT_ERROR_MESSAGES = {
  HOOK_ERROR: 'React hook error: {}',
  COMPONENT_ERROR: 'Component error: {}',
  RENDER_ERROR: 'Render error: {}',
  CONTEXT_ERROR: 'Context error: {}',
  PROVIDER_ERROR: 'Provider error: {}',
  BOUNDARY_ERROR: 'Error boundary error: {}',
  PERFORMANCE_HOOK_ERROR: 'Performance hook error: {}',
  RENDER_CYCLE_DETECTED: 'Render cycle detected: {}'
} as const;

/**
 * Validation error messages
 */
export const VALIDATION_ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed: {}',
  INVALID_INPUT: 'Invalid input: {}',
  MISSING_REQUIRED_FIELD: 'Missing required field: {}',
  INVALID_TYPE: 'Invalid type for field {}: expected {}, got {}',
  INVALID_FORMAT: 'Invalid format for field {}: {}',
  VALUE_TOO_LONG: 'Value too long for field {}: {} (max: {})',
  VALUE_TOO_SHORT: 'Value too short for field {}: {} (min: {})',
  FORBIDDEN_VALUE: 'Forbidden value in field {}: {}',
  PATTERN_MISMATCH: 'Pattern mismatch in field {}: {}',
  CIRCULAR_REFERENCE: 'Circular reference detected in field {}'
} as const;

/**
 * Network error messages
 */
export const NETWORK_ERROR_MESSAGES = {
  CONNECTION_FAILED: 'Connection failed: {}',
  REQUEST_FAILED: 'Request failed: {}',
  RESPONSE_ERROR: 'Response error: {}',
  TIMEOUT: 'Request timeout: {}',
  RATE_LIMITED: 'Rate limited: {}',
  SERVER_ERROR: 'Server error: {}',
  CLIENT_ERROR: 'Client error: {}',
  NETWORK_UNAVAILABLE: 'Network unavailable',
  DNS_ERROR: 'DNS error: {}',
  SSL_ERROR: 'SSL error: {}'
} as const;

/**
 * File system error messages
 */
export const FILESYSTEM_ERROR_MESSAGES = {
  FILE_NOT_FOUND: 'File not found: {}',
  FILE_READ_ERROR: 'File read error: {}',
  FILE_WRITE_ERROR: 'File write error: {}',
  FILE_PERMISSION_ERROR: 'File permission error: {}',
  DISK_FULL: 'Disk full',
  DIRECTORY_NOT_FOUND: 'Directory not found: {}',
  INVALID_PATH: 'Invalid path: {}',
  FILE_LOCKED: 'File locked: {}',
  FILE_CORRUPTED: 'File corrupted: {}'
} as const;

/**
 * Format error message with parameters
 */
export function formatErrorMessage(template: string, ...args: any[]): string {
  return template.replace(/\{}/g, () => String(args.shift() || ''));
}

/**
 * Get error message by key
 */
export function getErrorMessage(category: keyof typeof GENERAL_ERROR_MESSAGES, key: string, ...args: any[]): string {
  const messages = (GENERAL_ERROR_MESSAGES as any)[category];
  const template = messages[key as keyof typeof messages] || 'Unknown error';
  return formatErrorMessage(template, ...args);
}

/**
 * Get logger error message
 */
export function getLoggerErrorMessage(key: keyof typeof LOGGER_ERROR_MESSAGES, ...args: any[]): string {
  const template = LOGGER_ERROR_MESSAGES[key] || 'Unknown logger error';
  return formatErrorMessage(template, ...args);
}

/**
 * Get appender error message
 */
export function getAppenderErrorMessage(key: keyof typeof APPENDER_ERROR_MESSAGES, ...args: any[]): string {
  const template = APPENDER_ERROR_MESSAGES[key] || 'Unknown appender error';
  return formatErrorMessage(template, ...args);
}

/**
 * Get layout error message
 */
export function getLayoutErrorMessage(key: keyof typeof LAYOUT_ERROR_MESSAGES, ...args: any[]): string {
  const template = LAYOUT_ERROR_MESSAGES[key] || 'Unknown layout error';
  return formatErrorMessage(template, ...args);
}

/**
 * Get configuration error message
 */
export function getConfigurationErrorMessage(key: keyof typeof CONFIGURATION_ERROR_MESSAGES, ...args: any[]): string {
  const template = CONFIGURATION_ERROR_MESSAGES[key] || 'Unknown configuration error';
  return formatErrorMessage(template, ...args);
}

/**
 * Get security error message
 */
export function getSecurityErrorMessage(key: keyof typeof SECURITY_ERROR_MESSAGES, ...args: any[]): string {
  const template = SECURITY_ERROR_MESSAGES[key] || 'Unknown security error';
  return formatErrorMessage(template, ...args);
}

/**
 * Get performance error message
 */
export function getPerformanceErrorMessage(key: keyof typeof PERFORMANCE_ERROR_MESSAGES, ...args: any[]): string {
  const template = PERFORMANCE_ERROR_MESSAGES[key] || 'Unknown performance error';
  return formatErrorMessage(template, ...args);
}

/**
 * Get React error message
 */
export function getReactErrorMessage(key: keyof typeof REACT_ERROR_MESSAGES, ...args: any[]): string {
  const template = REACT_ERROR_MESSAGES[key] || 'Unknown React error';
  return formatErrorMessage(template, ...args);
}

/**
 * Get validation error message
 */
export function getValidationErrorMessage(key: keyof typeof VALIDATION_ERROR_MESSAGES, ...args: any[]): string {
  const template = VALIDATION_ERROR_MESSAGES[key] || 'Unknown validation error';
  return formatErrorMessage(template, ...args);
}

/**
 * Get network error message
 */
export function getNetworkErrorMessage(key: keyof typeof NETWORK_ERROR_MESSAGES, ...args: any[]): string {
  const template = NETWORK_ERROR_MESSAGES[key] || 'Unknown network error';
  return formatErrorMessage(template, ...args);
}

/**
 * Get file system error message
 */
export function getFilesystemErrorMessage(key: keyof typeof FILESYSTEM_ERROR_MESSAGES, ...args: any[]): string {
  const template = FILESYSTEM_ERROR_MESSAGES[key] || 'Unknown file system error';
  return formatErrorMessage(template, ...args);
}
