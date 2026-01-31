/**
 * Business Logic Failures.
 * 
 * Custom error classes for business logic failures.
 * Extends Error class for proper error handling.
 */

/**
 * Post creation failure error
 */
export class PostCreationFailure extends Error {
  /**
   * Creates a new post creation failure
   * @param {string} message - Error message
   */
  constructor(message) {
    super(message);
    this.name = 'PostCreationFailure';
  }
}

/**
 * Post update failure error
 */
export class PostUpdateFailure extends Error {
  /**
   * Creates a new post update failure
   * @param {string} message - Error message
   */
  constructor(message) {
    super(message);
    this.name = 'PostUpdateFailure';
  }
}

/**
 * Post deletion failure error
 */
export class PostDeletionFailure extends Error {
  /**
   * Creates a new post deletion failure
   * @param {string} message - Error message
   */
  constructor(message) {
    super(message);
    this.name = 'PostDeletionFailure';
  }
}

/**
 * Validation failure error
 */
export class ValidationError extends Error {
  /**
   * Creates a new validation failure
   * @param {string} message - Error message
   */
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication failure error
 */
export class AuthenticationFailure extends Error {
  /**
   * Creates a new authentication failure
   * @param {string} message - Error message
   */
  constructor(message) {
    super(message);
    this.name = 'AuthenticationFailure';
  }
}

/**
 * Authorization failure error
 */
export class AuthorizationFailure extends Error {
  /**
   * Creates a new authorization failure
   * @param {string} message - Error message
   */
  constructor(message) {
    super(message);
    this.name = 'AuthorizationFailure';
  }
}

/**
 * Network failure error
 */
export class NetworkFailure extends Error {
  /**
   * Creates a new network failure
   * @param {string} message - Error message
   */
  constructor(message) {
    super(message);
    this.name = 'NetworkFailure';
  }
}

/**
 * Cache failure error
 */
export class CacheFailure extends Error {
  /**
   * Creates a new cache failure
   * @param {string} message - Error message
   */
  constructor(message) {
    super(message);
    this.name = 'CacheFailure';
  }
}

/**
 * Real-time connection failure error
 */
export class RealTimeConnectionFailure extends Error {
  /**
   * Creates a new real-time connection failure
   * @param {string} message - Error message
   */
  constructor(message) {
    super(message);
    this.name = 'RealTimeConnectionFailure';
  }
}
