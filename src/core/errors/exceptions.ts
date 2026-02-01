/**
 * Server Exceptions.
 *
 * Custom error classes for server-side exceptions.
 * Used for handling API responses and server errors.
 */

/**
 * Server exception for API errors
 * @class
 * @augments {Error}
 */
export class ServerException extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly timestamp: Date;

  /**
   * Creates a server exception
   * @param message - Error message
   * @param statusCode - HTTP status code
   * @param errorCode - Application error code
   */
  public constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'SERVER_ERROR'
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date();
    this.name = 'ServerException';
  }
}

/**
 *
 */
export class BadRequestException extends ServerException {
  /**
   *
   * @param message
   * @param errorCode
   */
  public constructor(message: string, errorCode: string = 'BAD_REQUEST') {
    super(message, 400, errorCode);
  }
}

/**
 *
 */
export class UnauthorizedException extends ServerException {
  /**
   *
   * @param message
   * @param errorCode
   */
  public constructor(message: string, errorCode: string = 'UNAUTHORIZED') {
    super(message, 401, errorCode);
  }
}

/**
 *
 */
export class ForbiddenException extends ServerException {
  /**
   *
   * @param message
   * @param errorCode
   */
  public constructor(message: string, errorCode: string = 'FORBIDDEN') {
    super(message, 403, errorCode);
  }
}

/**
 *
 */
export class NotFoundException extends ServerException {
  /**
   *
   * @param message
   * @param errorCode
   */
  public constructor(message: string, errorCode: string = 'NOT_FOUND') {
    super(message, 404, errorCode);
  }
}

/**
 *
 */
export class ConflictException extends ServerException {
  /**
   *
   * @param message
   * @param errorCode
   */
  public constructor(message: string, errorCode: string = 'CONFLICT') {
    super(message, 409, errorCode);
  }
}

/**
 *
 */
export class TooManyRequestsException extends ServerException {
  /**
   *
   * @param message
   * @param errorCode
   */
  public constructor(message: string, errorCode: string = 'TOO_MANY_REQUESTS') {
    super(message, 429, errorCode);
  }
}

/**
 *
 */
export class InternalServerException extends ServerException {
  /**
   *
   * @param message
   * @param errorCode
   */
  public constructor(message: string, errorCode: string = 'INTERNAL_SERVER_ERROR') {
    super(message, 500, errorCode);
  }
}

/**
 *
 */
export class ServiceUnavailableException extends ServerException {
  /**
   *
   * @param message
   * @param errorCode
   */
  public constructor(message: string, errorCode: string = 'SERVICE_UNAVAILABLE') {
    super(message, 503, errorCode);
  }
}
