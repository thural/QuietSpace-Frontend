/**
 * Core Module Index.
 * 
 * Barrel exports for all core infrastructure components.
 * Provides centralized access to DI, network, theme, errors, and utilities.
 */

// Dependency Injection
export { container, initializeContainer, getContainer, createMockContainer } from './di/injection';
export { TYPES } from './di/types';

// Network
export { apiClient } from './network/rest/apiClient';
export { socketService } from './network/socket/service/socketService';

// Theme
export { colors } from './theme/appColors';
export { typography } from './theme/appTypography';

// Errors
export * from './errors/failures';
export * from './errors/exceptions';

// Utils
export {
  transformPost,
  transformError,
  sanitizeInput,
  isValidEmail,
  formatFileSize
} from './utils/transformers';
export {
  formatRelativeTime,
  formatDate,
  formatDateTime,
  isToday,
  isYesterday,
  getStartOfDay,
  getEndOfDay
} from './utils/dateFormatter';
