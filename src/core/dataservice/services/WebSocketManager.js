/**
 * WebSocket Manager Implementation
 * 
 * Handles WebSocket connections and real-time data updates
 */

/**
 * WebSocket Manager implementation class
 */
export class WebSocketManager {
    /**
     * @type {Map}
     */
    #unsubscribeFunctions = new Map();

    /**
     * @type {Object}
     */
    #webSocket;

    /**
     * @type {Object}
     */
    #updateStrategy;

    /**
     * Creates a WebSocket manager instance
     * @param {Object} webSocket - WebSocket instance
     * @param {Object} updateStrategy - Update strategy instance
     */
    constructor(webSocket, updateStrategy) {
        this.#webSocket = webSocket;
        this.#updateStrategy = updateStrategy;
    }

    /**
     * Set up WebSocket listeners for real-time updates
     * @param {string|string[]} queryKey - Query key
     * @param {string[]} topics - WebSocket topics to subscribe to
     * @param {string} updateStrategyType - Update strategy type
     * @param {Object} cacheManager - Cache manager instance
     * @param {Object} cacheConfig - Cache configuration
     */
    setupListeners(queryKey, topics, updateStrategyType, cacheManager, cacheConfig) {
        const cacheKey = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;

        topics.forEach(topic => {
            const unsubscribe = this.#webSocket.subscribe(topic, (data) => {
                this.#updateStrategy.update(cacheKey, data, updateStrategyType, cacheManager, cacheConfig);
            });

            this.#unsubscribeFunctions.set(cacheKey, unsubscribe);
        });
    }

    /**
     * Clean up WebSocket listeners
     * @param {string|string[]} queryKey - Query key to clean up
     */
    cleanupListeners(queryKey) {
        const cacheKey = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
        const unsubscribe = this.#unsubscribeFunctions.get(cacheKey);

        if (unsubscribe) {
            unsubscribe();
            this.#unsubscribeFunctions.delete(cacheKey);
        }
    }

    /**
     * Get WebSocket instance
     * @returns {Object} WebSocket instance
     */
    getWebSocket() {
        return this.#webSocket;
    }

    /**
     * Get update strategy instance
     * @returns {Object} Update strategy instance
     */
    getUpdateStrategy() {
        return this.#updateStrategy;
    }

    /**
     * Check if manager has active listeners
     * @param {string|string[]} queryKey - Query key to check
     * @returns {boolean} Whether listeners are active
     */
    hasListeners(queryKey) {
        const cacheKey = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
        return this.#unsubscribeFunctions.has(cacheKey);
    }

    /**
     * Get number of active listeners
     * @returns {number} Number of active listeners
     */
    getListenerCount() {
        return this.#unsubscribeFunctions.size;
    }

    /**
     * Clean up all listeners
     */
    cleanupAllListeners() {
        this.#unsubscribeFunctions.forEach((unsubscribe) => {
            unsubscribe();
        });
        this.#unsubscribeFunctions.clear();
    }
}
