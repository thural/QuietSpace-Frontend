/**
 * Core System Legacy Exports
 *
 * Legacy exports for backward compatibility.
 * These exports are deprecated and will be removed in a future major version.
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

// Legacy export function (deprecated)
export function getLegacyExport(name: string): unknown {
    return _LegacyExports[name as keyof typeof _LegacyExports];
}
