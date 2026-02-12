/**
 * Enhanced Error Types for Network Module
 *
 * Provides specific error types for better error handling and user experience.
 */

/**
 * Base network error class
 */
export class NetworkError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Token refresh specific error
 */
export class TokenRefreshError extends NetworkError {
  constructor(message: string, public readonly originalError?: Error) {
    super(message, 'TOKEN_REFRESH_ERROR', 401, true);
    this.name = 'TokenRefreshError';
  }
}

/**
 * Network timeout error
 */
export class NetworkTimeoutError extends NetworkError {
  constructor(message: string, public readonly timeout: number) {
    super(message, 'NETWORK_TIMEOUT', 408, true);
    this.name = 'NetworkTimeoutError';
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends NetworkError {
  constructor(message: string, public readonly authType?: string) {
    super(message, 'AUTHENTICATION_ERROR', 401, false);
    this.name = 'AuthenticationError';
  }
}

/**
 * Rate limiting error
 */
export class RateLimitError extends NetworkError {
  constructor(message: string, public readonly retryAfter?: number) {
    super(message, 'RATE_LIMIT_ERROR', 429, true);
    this.name = 'RateLimitError';
  }
}

/**
 * Network connection error
 */
export class NetworkConnectionError extends NetworkError {
  constructor(message: string, public readonly endpoint?: string) {
    super(message, 'NETWORK_CONNECTION_ERROR', undefined, true);
    this.name = 'NetworkConnectionError';
  }
}

/**
 * Bad request error (client error)
 */
export class BadRequestError extends NetworkError {
  constructor(message: string, public readonly validationErrors?: string[]) {
    super(message, 'BAD_REQUEST_ERROR', 400, false);
    this.name = 'BadRequestError';
  }
}

/**
 * Server error (5xx)
 */
export class ServerError extends NetworkError {
  constructor(message: string, public readonly serverCode?: string) {
    super(message, 'SERVER_ERROR', 500, true);
    this.name = 'ServerError';
  }
}

/**
 * Error factory for creating appropriate error types
 */
export class NetworkErrorFactory {
  /**
   * Create appropriate error from HTTP response
   */
  static fromHttpResponse(
    message: string,
    statusCode: number,
    _originalError?: Error
  ): NetworkError {
    switch (statusCode) {
      case 400:
        return new BadRequestError(message);
      case 401:
        return new AuthenticationError(message);
      case 408:
        return new NetworkTimeoutError(message, 30000);
      case 429:
        return new RateLimitError(message);
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(message);
      default:
        if (statusCode >= 400 && statusCode < 500) {
          return new NetworkError(message, 'CLIENT_ERROR', statusCode, false);
        } else if (statusCode >= 500) {
          return new NetworkError(message, 'SERVER_ERROR', statusCode, true);
        }
        return new NetworkError(message, 'UNKNOWN_ERROR', statusCode, true);
    }
  }

  /**
   * Create appropriate error from network exception
   */
  static fromNetworkException(
    error: Error,
    endpoint?: string
  ): NetworkError {
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return new NetworkTimeoutError(error.message, 30000);
    }

    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      return new NetworkConnectionError(error.message, endpoint);
    }

    return new NetworkConnectionError(error.message, endpoint);
  }
}

/**
 * Error handler utilities
 */
export class NetworkErrorHandler {
  /**
   * Check if error is retryable
   */
  static isRetryable(error: Error): boolean {
    return error instanceof NetworkError && error.retryable;
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: Error): string {
    if (error instanceof TokenRefreshError) {
      return 'Your session has expired. Please log in again.';
    }

    if (error instanceof NetworkTimeoutError) {
      return 'Request timed out. Please check your connection and try again.';
    }

    if (error instanceof AuthenticationError) {
      return 'Authentication failed. Please check your credentials.';
    }

    if (error instanceof RateLimitError) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    if (error instanceof NetworkConnectionError) {
      return 'Network connection failed. Please check your internet connection.';
    }

    if (error instanceof BadRequestError) {
      return 'Invalid request. Please check your input and try again.';
    }

    if (error instanceof ServerError) {
      return 'Server error occurred. Please try again later.';
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Get retry delay for retryable errors
   */
  static getRetryDelay(error: Error, attempt: number): number {
    if (error instanceof RateLimitError && error.retryAfter) {
      return error.retryAfter * 1000;
    }

    if (error instanceof NetworkTimeoutError) {
      return Math.min(1000 * Math.pow(2, attempt), 30000);
    }

    // Default exponential backoff
    return Math.min(1000 * Math.pow(2, attempt), 10000);
  }
}
