/**
 * WebSocket Manager Interface
 * 
 * Single responsibility: WebSocket connection and message handling
 */

/**
 * WebSocket Manager interface
 * @typedef {Object} IWebSocketManager
 * @property {function} setupListeners - Set up WebSocket listeners for real-time updates
 * @property {function} handleMessage - Handle WebSocket message and update cache
 * @property {function} cleanup - Clean up WebSocket listeners
 * @property {function} storeUnsubscribeFunction - Store unsubscribe function for cleanup
 */

// Export for JSDoc usage
export {};
