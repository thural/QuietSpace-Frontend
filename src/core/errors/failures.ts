/**
 * Business Logic Failures.
 * 
 * Custom error classes for business logic failures.
 * Extends Error class for proper error handling.
 */

export class PostCreationFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostCreationFailure';
  }
}

export class PostUpdateFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostUpdateFailure';
  }
}

export class PostDeletionFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostDeletionFailure';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationFailure';
  }
}

export class AuthorizationFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationFailure';
  }
}

export class NetworkFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkFailure';
  }
}

export class CacheFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CacheFailure';
  }
}

export class RealTimeConnectionFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RealTimeConnectionFailure';
  }
}
