/**
 * Test file to verify Google TypeScript Style Guide implementation
 * @file Demonstrates proper Google Style Guide compliance
 */

/**
 * Example interface following Google Style Guide
 * @interface
 */
export interface ITestUser {
  /** The user's unique identifier */
  readonly id: string;
  /** The user's display name */
  readonly name: string;
  /** The user's email address */
  readonly email: string;
}

/**
 * Example class demonstrating Google Style Guide conventions
 * @class
 */
export class TestService {
  private readonly retryAttempts: number = MAX_RETRY_ATTEMPTS;

  /**
   * Creates an instance of TestService
   */
  public constructor() { }

  /**
   * Processes a user request
   * @param user - The user to process
   * @returns True if successful, false otherwise
   */
  public processUser(user: ITestUser): boolean {
    if (!user.id) {
      return false;
    }

    try {
      // Process user logic here
      console.log(`Processing user: ${user.name}`);
      return true;
    } catch (error) {
      console.error('Failed to process user:', error);
      return false;
    }
  }

  /**
   * Gets the retry attempts count
   * @returns The number of retry attempts
   */
  public getRetryAttempts(): number {
    return this.retryAttempts;
  }
}

/**
 * Constants following Google Style Guide
 * @readonly
 * @enum {string}
 */
export const HTTP_METHODS = Object.freeze({
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const);

/**
 * Maximum number of retry attempts
 * @type {number}
 */
export const MAX_RETRY_ATTEMPTS = 3;

/**
 * Default timeout in milliseconds
 * @type {number}
 */
export const DEFAULT_TIMEOUT_MS = 5000;
