/**
 * Core System Legacy Exports
 * 
 * Legacy exports for backward compatibility.
 * These exports are deprecated and will be removed in a future major version.
 */

/**
 * Legacy exports object
 * @typedef {Object} LegacyExports
 * @property {*} CacheProvider - Legacy cache provider
 * @property {*} CacheServiceManager - Legacy cache service manager
 * @property {*} EnterpriseWebSocketService - Legacy WebSocket service
 * @property {*} apiClient - Legacy API client
 */

// Legacy exports (deprecated - will be removed in next major version)
// Note: These are intentionally minimal to avoid exposing too much implementation detail
export const _LegacyExports = {
    // Placeholder for legacy exports
    // Actual implementations would be imported here if available
    CacheProvider: null,
    CacheServiceManager: null,
    EnterpriseWebSocketService: null,
    apiClient: null
};

/**
 * Legacy export function (deprecated)
 * 
 * @param {string} name - Export name
 * @returns {*} Legacy export value
 */
export function getLegacyExport(name) {
    return _LegacyExports[name];
}
