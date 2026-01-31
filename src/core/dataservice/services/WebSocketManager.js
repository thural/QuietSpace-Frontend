/**
 * WebSocket Manager Implementation
 * 
 * Handles WebSocket connections and real-time data updates
 */

/**
 * WebSocket Manager implementation class
 */
export class WebSocketManager {
  /** @type {Map} */
  #unsubscribeFunctions = new Map();

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
      const unsubscribe = this.#webSocket.subscribe(topic, (message) => {
        this.handleMessage(cacheKey, message, updateStrategyType, cacheManager, cacheConfig);
      });

      this.storeUnsubscribeFunction(cacheKey, topic, unsubscribe);
    });
  }

  /**
   * Handle WebSocket message and update cache
   * @param {string} cacheKey - Cache key
   * @param {*} message - WebSocket message
   * @param {string} updateStrategyType - Update strategy type
   * @param {Object} cacheManager - Cache manager instance
   * @param {Object} cacheConfig - Cache configuration
   */
  handleMessage(cacheKey, message, updateStrategyType, cacheManager, cacheConfig) {
    try {
      const currentEntry = cacheManager.getEntry(cacheKey);
      const currentData = currentEntry?.data;
      const newData = message.data || message;

      if (!newData) return;

      const updatedData = this.#updateStrategy.apply(currentData, newData, updateStrategyType);

      // Update cache with same TTL as original
      const ttl = currentEntry?.ttl || cacheConfig.USER_CONTENT?.cacheTime;
      cacheManager.set(cacheKey, updatedData, ttl);

    } catch (error) {
      console.error(`Error handling WebSocket update for ${cacheKey}:`, error);
    }
  }

  /**
   * Clean up WebSocket listeners
   * @param {string} cacheKey - Cache key
   * @param {string[]} topics - Topics to clean up
   */
  cleanup(cacheKey, topics) {
    topics.forEach(topic => {
      const unsubscribeKey = `${cacheKey}:${topic}`;
      const unsubscribe = this.getUnsubscribeFunction(unsubscribeKey);
      if (unsubscribe) {
        unsubscribe();
        this.removeUnsubscribeFunction(unsubscribeKey);
      }
    });
  }

  /**
   * Store unsubscribe function for cleanup
   * @param {string} cacheKey - Cache key
   * @param {string} topic - Topic name
   * @param {function} unsubscribe - Unsubscribe function
   */
  storeUnsubscribeFunction(cacheKey, topic, unsubscribe) {
    const unsubscribeKey = `${cacheKey}:${topic}`;
    
    if (!this.#unsubscribeFunctions.has(cacheKey)) {
      this.#unsubscribeFunctions.set(cacheKey, new Map());
    }
    
    this.#unsubscribeFunctions.get(cacheKey).set(topic, unsubscribe);
  }

  /**
   * Get unsubscribe function
   * @private
   * @param {string} unsubscribeKey - Unsubscribe key
   * @returns {function|undefined} Unsubscribe function
   */
  getUnsubscribeFunction(unsubscribeKey) {
    const [cacheKey, topic] = unsubscribeKey.split(':');
    const cacheMap = this.#unsubscribeFunctions.get(cacheKey);
    return cacheMap?.get(topic);
  }

  /**
   * Remove unsubscribe function
   * @private
   * @param {string} unsubscribeKey - Unsubscribe key
   */
  removeUnsubscribeFunction(unsubscribeKey) {
    const [cacheKey, topic] = unsubscribeKey.split(':');
    const cacheMap = this.#unsubscribeFunctions.get(cacheKey);
    if (cacheMap) {
      cacheMap.delete(topic);
      if (cacheMap.size === 0) {
        this.#unsubscribeFunctions.delete(cacheKey);
      }
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    // Clean up all subscriptions
    this.#unsubscribeFunctions.forEach((topicMap, cacheKey) => {
      topicMap.forEach((unsubscribe, topic) => {
        try {
          unsubscribe();
        } catch (error) {
          console.error(`Error cleaning up WebSocket subscription for ${cacheKey}:${topic}:`, error);
        }
      });
    });
    
    this.#unsubscribeFunctions.clear();
  }
}
