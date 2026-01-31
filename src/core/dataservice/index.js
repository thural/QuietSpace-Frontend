/**
 * Data Service Module - Public API
 * 
 * Clean Black Box Module pattern with clean public API exports.
 * Only interfaces, factory functions, and types are exported.
 * Implementation classes are hidden to maintain Black Box principles.
 */

// Factory functions
export {
  createDataService,
  createDefaultDataService,
  createDataServiceWithCache,
  createDataServiceWithServices,
  createDataServiceWithFullConfig,
  createDataServices,
  createDataServicesWithIndividualConfig,
  createDataServiceForEnvironment,
} from './factory.js';

// Export configuration
export { DataServiceConfig } from './config/DataServiceConfig.js';

// DI integration
export {
  createDataServiceFromDI,
  createDefaultDataServiceFromDI,
  createDataServiceWithCacheFromDI,
  registerDataServiceInDI,
  DataServiceDI
} from './di.js';

/**
 * Data Service Module Version
 */
export const DATA_SERVICE_VERSION = '2.0.0';

/**
 * Data Service Module Information
 */
export const DATA_SERVICE_INFO = Object.freeze({
  name: 'Data Service Module',
  version: DATA_SERVICE_VERSION,
  description: 'Intelligent data coordination service with caching, WebSocket integration, and optimistic updates',
  features: [
    'Cache-first data fetching',
    'Real-time WebSocket integration',
    'Optimistic updates with rollback',
    'Intelligent cache invalidation',
    'Multiple cache strategies',
    'Dependency injection support',
    'JavaScript with JSDoc support',
    'Single Responsibility Principle',
    'Black Box architecture',
  ],
  architecture: '7-layer: Component → Hook → DI → Service → Data → Cache/Repository/WebSocket',
});

// Types are available via JSDoc typedefs in interfaces.js
// Service interfaces are available via JSDoc typedefs in services/
