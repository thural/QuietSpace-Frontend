/**
 * Server Exceptions.
 * 
 * Custom error classes for server-side exceptions.
 * Used for handling API responses and server errors.
 */

/**
 * Base server exception class
 */
export class ServerException extends Error {
  /** @type {number} */
  statusCode;
  /** @type {string} */
  errorCode;
  /** @type {Date} */
  timestamp;

  /**
   * Creates a new server exception
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {string} errorCode - Application error code
   */
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date();
    this.name = 'ServerException';
  }
}

/**
 * Bad request exception (400)
 */
export class BadRequestException extends ServerException {
  /**
   * Creates a new bad request exception
   * @param {string} message - Error message
   * @param {string} errorCode - Error code, defaults to 'BAD_REQUEST'
   */
  constructor(message, errorCode = 'BAD_REQUEST') {
    super(message, 400, errorCode);
  }
}

/**
 * Unauthorized exception (401)
 */
export class UnauthorizedException extends ServerException {
  /**
   * Creates a new unauthorized exception
   * @param {string} message - Error message
   * @param {string} errorCode - Error code, defaults to 'UNAUTHORIZED'
   */
  constructor(message, errorCode = 'UNAUTHORIZED') {
    super(message, 401, errorCode);
  }
}

/**
 * Forbidden exception (403)
 */
export class ForbiddenException extends ServerException {
  /**
   * Creates a new forbidden exception
   * @param {string} message - Error message
   * @param {string} errorCode - Error code, defaults to 'FORBIDDEN'
   */
  constructor(message, errorCode = 'FORBIDDEN') {
    super(message, 403, errorCode);
  }
}

/**
 * Not found exception (404)
 */
export class NotFoundException extends ServerException {
  /**
   * Creates a new not found exception
   * @param {string} message - Error message
   * @param {string} errorCode - Error code, defaults to 'NOT_FOUND'
   */
  constructor(message, errorCode = 'NOT_FOUND') {
    super(message, 404, errorCode);
  }
}

/**
 * Conflict exception (409)
 */
export class ConflictException extends ServerException {
  /**
   * Creates a new conflict exception
   * @param {string} message - Error message
   * @param {string} errorCode - Error code, defaults to 'CONFLICT'
   */
  constructor(message, errorCode = 'CONFLICT') {
    super(message, 409, errorCode);
  }
}

/**
 * Too many requests exception (429)
 */
export class TooManyRequestsException extends ServerException {
  /**
   * Creates a new too many requests exception
   * @param {string} message - Error message
   * @param {string} errorCode - Error code, defaults to 'TOO_MANY_REQUESTS'
   */
  constructor(message, errorCode = 'TOO_MANY_REQUESTS') {
    super(message, 429, errorCode);
  }
}

/**
 * Internal server exception (500)
 */
export class InternalServerException extends ServerException {
  /**
   * Creates a new internal server exception
   * @param {string} message - Error message
   * @param {string} errorCode - Error code, defaults to 'INTERNAL_SERVER_ERROR'
   */
  constructor(message, errorCode = 'INTERNAL_SERVER_ERROR') {
    super(message, 500, errorCode);
  }
}

/**
 * Service unavailable exception (503)
 */
export class ServiceUnavailableException extends ServerException {
  /**
   * Creates a new service unavailable exception
   * @param {string} message - Error message
   * @param {string} errorCode - Error code, defaults to 'SERVICE_UNAVAILABLE'
   */
  constructor(message, errorCode = 'SERVICE_UNAVAILABLE') {
    super(message, 503, errorCode);
  }
}
