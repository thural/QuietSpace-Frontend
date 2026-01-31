/**
 * Data Service Module - Data State Manager Implementation
 * 
 * Provides state management capabilities for data services
 * with loading, error, and success state tracking.
 */

/**
 * Data State Manager Implementation
 * 
 * Manages data service state with subscription support
 * and metadata tracking for operations.
 */
export class DataStateManager {
  /** @type {Object} */
  #state;
  /** @type {Object} */
  #dataState;
  /** @type {Set} */
  #subscribers = new Set();

  constructor(initialState = {}) {
    this.#state = {
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: false,
      error: null,
      lastUpdated: null,
      refetchCount: 0,
      ...initialState
    };

    this.#dataState = {
      ...this.#state,
      data: null,
      metadata: {
        source: 'network',
        cacheHit: false,
        requestDuration: 0,
        retryCount: 0
      }
    };
  }

  /**
   * Get current data state
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.#state };
  }

  /**
   * Get data state with data payload
   * @returns {Object} Data state with metadata
   */
  getStateWithData() {
    return { ...this.#dataState };
  }

  /**
   * Set loading state
   * @param {boolean} [isFetching] - Whether data is being fetched
   */
  setLoading(isFetching = false) {
    this.#state = {
      ...this.#state,
      isLoading: true,
      isFetching,
      isError: false,
      isSuccess: false,
      error: null
    };

    this.#dataState = {
      ...this.#dataState,
      ...this.#state
    };

    this.#notifySubscribers();
  }

  /**
   * Set success state with data
   * @param {*} data - Success data
   * @param {Object} [metadata] - Additional metadata
   */
  setSuccess(data, metadata) {
    const now = Date.now();
    
    this.#state = {
      ...this.#state,
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
      lastUpdated: now,
      refetchCount: this.#state.refetchCount + (this.#state.lastUpdated ? 1 : 0)
    };

    this.#dataState = {
      ...this.#state,
      data,
      metadata: {
        ...this.#dataState.metadata,
        source: 'network',
        cacheHit: false,
        requestDuration: 0,
        retryCount: 0,
        ...metadata
      }
    };

    this.#notifySubscribers();
  }

  /**
   * Set error state
   * @param {Error} error - Error object
   */
  setError(error) {
    this.#state = {
      ...this.#state,
      isLoading: false,
      isFetching: false,
      isError: true,
      isSuccess: false,
      error,
      lastUpdated: Date.now()
    };

    this.#dataState = {
      ...this.#state,
      data: null,
      metadata: {
        ...this.#dataState.metadata,
        source: 'network',
        cacheHit: false,
        requestDuration: 0,
        retryCount: this.#dataState.metadata.retryCount + 1
      }
    };

    this.#notifySubscribers();
  }

  /**
   * Reset state to initial
   */
  reset() {
    this.#state = {
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: false,
      error: null,
      lastUpdated: null,
      refetchCount: 0
    };

    this.#dataState = {
      ...this.#state,
      data: null,
      metadata: {
        source: 'network',
        cacheHit: false,
        requestDuration: 0,
        retryCount: 0
      }
    };

    this.#notifySubscribers();
  }

  /**
   * Subscribe to state changes
   * @param {function} callback - Callback function
   * @returns {function} Unsubscribe function
   */
  subscribe(callback) {
    this.#subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.#subscribers.delete(callback);
    };
  }

  /**
   * Notify all subscribers of state change
   * @private
   */
  #notifySubscribers() {
    this.#subscribers.forEach(callback => {
      try {
        callback(this.getState());
      } catch (error) {
        console.error('Error in state subscriber:', error);
      }
    });
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.#subscribers.clear();
    this.reset();
  }
}
