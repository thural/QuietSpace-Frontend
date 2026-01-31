/**
 * WebSocket Migration Hook
 * 
 * Utility hook to help migrate from legacy WebSocket implementations
 * to the new standardized enterprise WebSocket hooks.
 * Provides backward compatibility and gradual migration capabilities.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

// Import types via JSDoc typedefs
/**
 * @typedef {import('./useFeatureWebSocket.js').UseEnterpriseWebSocketOptions} UseEnterpriseWebSocketOptions
 */

/**
 * WebSocket migration configuration interface
 * 
 * @interface WebSocketMigrationConfig
 * @description Configuration for WebSocket migration
 */
export class WebSocketMigrationConfig {
    /**
     * Feature type
     * 
     * @type {string}
     */
    feature = '';

    /**
     * Use legacy implementation
     * 
     * @type {boolean}
     */
    useLegacyImplementation = false;

    /**
     * Enable fallback
     * 
     * @type {boolean}
     */
    enableFallback = true;

    /**
     * Migration mode
     * 
     * @type {string}
     */
    migrationMode = 'enterprise';

    /**
     * Log migration events
     * 
     * @type {boolean}
     */
    logMigrationEvents = true;

    /**
     * Fallback timeout
     * 
     * @type {number}
     */
    fallbackTimeout = 5000;

    /**
     * Creates configuration instance
     * 
     * @param {Object} options - Configuration options
     * @returns {WebSocketMigrationConfig} Configuration instance
     * @description Creates new migration configuration
     */
    static create(options = {}) {
        const config = new WebSocketMigrationConfig();
        Object.assign(config, options);
        return config;
    }
}

/**
 * WebSocket migration state interface
 * 
 * @interface WebSocketMigrationState
 * @description Current migration state
 */
export class WebSocketMigrationState {
    /**
     * Migration mode
     * 
     * @type {string}
     */
    mode = 'enterprise';

    /**
     * Whether using legacy
     * 
     * @type {boolean}
     */
    isUsingLegacy = false;

    /**
     * Whether using enterprise
     * 
     * @type {boolean}
     */
    isUsingEnterprise = true;

    /**
     * Whether fallback triggered
     * 
     * @type {boolean}
     */
    fallbackTriggered = false;

    /**
     * Migration error
     * 
     * @type {Error}
     */
    migrationError;

    /**
     * Migration progress
     * 
     * @type {number}
     */
    migrationProgress = 0;

    /**
     * Creates state instance
     * 
     * @param {Object} [state] - Initial state
     * @returns {WebSocketMigrationState} State instance
     * @description Creates new migration state
     */
    static create(state = {}) {
        const migrationState = new WebSocketMigrationState();
        Object.assign(migrationState, state);
        return migrationState;
    }
}

/**
 * WebSocket migration hook
 * 
 * @function useWebSocketMigration
 * @param {WebSocketMigrationConfig} config - Migration configuration
 * @returns {Object} Migration state and functions
 * @description Hook for WebSocket migration functionality
 */
export function useWebSocketMigration(config) {
    const migrationConfig = WebSocketMigrationConfig.create(config);
    
    const [state, setState] = useState(() => 
        WebSocketMigrationState.create({
            mode: migrationConfig.migrationMode,
            isUsingLegacy: migrationConfig.migrationMode === 'legacy',
            isUsingEnterprise: migrationConfig.migrationMode === 'enterprise'
        })
    );

    const enterpriseWebSocketRef = useRef(null);
    const legacyWebSocketRef = useRef(null);

    // Initialize enterprise WebSocket
    useEffect(() => {
        // Enterprise WebSocket initialization would go here
        enterpriseWebSocketRef.current = {
            connect: async () => {},
            disconnect: async () => {},
            sendMessage: async () => {},
            isConnected: false
        };
    }, []);

    // Initialize legacy WebSocket
    useEffect(() => {
        // Legacy WebSocket initialization would go here
        legacyWebSocketRef.current = {
            connect: async () => {},
            disconnect: async () => {},
            sendMessage: async () => {},
            isConnected: false
        };
    }, []);

    // Log migration events
    const logMigrationEvent = useCallback((event, data) => {
        if (migrationConfig.logMigrationEvents) {
            console.log(`[WebSocket Migration] ${event}:`, data);
        }
    }, [migrationConfig.logMigrationEvents]);

    // Update migration state
    const updateMigrationState = useCallback((newState) => {
        setState(prev => ({
            ...prev,
            ...newState,
            migrationProgress: newState.migrationProgress || prev.migrationProgress
        }));
    }, []);

    // Switch to enterprise mode
    const switchToEnterprise = useCallback(async () => {
        logMigrationEvent('Switching to enterprise mode', {
            feature: migrationConfig.feature
        });

        updateMigrationState({
            mode: 'enterprise',
            isUsingLegacy: false,
            isUsingEnterprise: true,
            migrationProgress: 50
        });

        try {
            // Disconnect legacy
            if (legacyWebSocketRef.current) {
                await legacyWebSocketRef.current.disconnect();
            }

            // Connect enterprise
            if (enterpriseWebSocketRef.current) {
                await enterpriseWebSocketRef.current.connect();
            }

            updateMigrationState({
                migrationProgress: 100,
                migrationError: null
            });

            logMigrationEvent('Successfully switched to enterprise mode');
        } catch (error) {
            updateMigrationState({
                migrationError: error,
                migrationProgress: 0
            });

            logMigrationEvent('Failed to switch to enterprise mode', { error });

            if (migrationConfig.enableFallback) {
                await fallbackToLegacy();
            }
        }
    }, [migrationConfig, logMigrationEvent, updateMigrationState]);

    // Switch to legacy mode
    const switchToLegacy = useCallback(async () => {
        logMigrationEvent('Switching to legacy mode', {
            feature: migrationConfig.feature
        });

        updateMigrationState({
            mode: 'legacy',
            isUsingLegacy: true,
            isUsingEnterprise: false,
            migrationProgress: 50
        });

        try {
            // Disconnect enterprise
            if (enterpriseWebSocketRef.current) {
                await enterpriseWebSocketRef.current.disconnect();
            }

            // Connect legacy
            if (legacyWebSocketRef.current) {
                await legacyWebSocketRef.current.connect();
            }

            updateMigrationState({
                migrationProgress: 100,
                migrationError: null
            });

            logMigrationEvent('Successfully switched to legacy mode');
        } catch (error) {
            updateMigrationState({
                migrationError: error,
                migrationProgress: 0
            });

            logMigrationEvent('Failed to switch to legacy mode', { error });
        }
    }, [migrationConfig, logMigrationEvent, updateMigrationState]);

    // Fallback to legacy
    const fallbackToLegacy = useCallback(async () => {
        logMigrationEvent('Falling back to legacy mode', {
            feature: migrationConfig.feature,
            timeout: migrationConfig.fallbackTimeout
        });

        updateMigrationState({
            fallbackTriggered: true,
            migrationProgress: 25
        });

        try {
            await switchToLegacy();
        } catch (error) {
            updateMigrationState({
                migrationError: error,
                migrationProgress: 0
            });

            logMigrationEvent('Fallback failed', { error });
        }
    }, [migrationConfig, logMigrationEvent, updateMigrationState, switchToLegacy]);

    // Hybrid mode - use both implementations
    const enableHybridMode = useCallback(() => {
        logMigrationEvent('Enabling hybrid mode', {
            feature: migrationConfig.feature
        });

        updateMigrationState({
            mode: 'hybrid',
            isUsingLegacy: true,
            isUsingEnterprise: true,
            migrationProgress: 75
        });
    }, [migrationConfig, logMigrationEvent, updateMigrationState]);

    // Send message with automatic fallback
    const sendMessageWithFallback = useCallback(async (message) => {
        const startTime = Date.now();

        try {
            // Try enterprise first
            if (state.isUsingEnterprise && enterpriseWebSocketRef.current) {
                await enterpriseWebSocketRef.current.sendMessage(message);
                
                logMigrationEvent('Message sent via enterprise WebSocket', {
                    feature: migrationConfig.feature,
                    messageId: message.id,
                    duration: Date.now() - startTime
                });
                
                return { success: true, method: 'enterprise' };
            }

            // Fallback to legacy
            if (state.isUsingLegacy && legacyWebSocketRef.current) {
                await legacyWebSocketRef.current.sendMessage(message);
                
                logMigrationEvent('Message sent via legacy WebSocket', {
                    feature: migrationConfig.feature,
                    messageId: message.id,
                    duration: Date.now() - startTime
                });
                
                return { success: true, method: 'legacy' };
            }

            throw new Error('No WebSocket implementation available');
        } catch (error) {
            logMigrationEvent('Message send failed', {
                feature: migrationConfig.feature,
                messageId: message.id,
                error,
                duration: Date.now() - startTime
            });

            if (migrationConfig.enableFallback && state.mode !== 'legacy') {
                await fallbackToLegacy();
            }

            throw error;
        }
    }, [state, migrationConfig, logMigrationEvent, fallbackToLegacy]);

    // Get current WebSocket implementation
    const getCurrentWebSocket = useCallback(() => {
        if (state.mode === 'enterprise') {
            return enterpriseWebSocketRef.current;
        } else if (state.mode === 'legacy') {
            return legacyWebSocketRef.current;
        } else {
            // Hybrid mode - return both
            return {
                enterprise: enterpriseWebSocketRef.current,
                legacy: legacyWebSocketRef.current
            };
        }
    }, [state.mode]);

    // Initialize based on configuration
    useEffect(() => {
        if (migrationConfig.useLegacyImplementation) {
            switchToLegacy();
        } else if (migrationConfig.migrationMode === 'hybrid') {
            enableHybridMode();
        } else {
            switchToEnterprise();
        }
    }, [migrationConfig, switchToLegacy, enableHybridMode, switchToEnterprise]);

    return {
        // State
        state,
        
        // WebSocket implementations
        enterpriseWebSocket: enterpriseWebSocketRef.current,
        legacyWebSocket: legacyWebSocketRef.current,
        currentWebSocket: getCurrentWebSocket(),
        
        // Migration actions
        switchToEnterprise,
        switchToLegacy,
        enableHybridMode,
        fallbackToLegacy,
        
        // Message handling
        sendMessageWithFallback,
        
        // Utilities
        logMigrationEvent,
        updateMigrationState
    };
}
