/**
 * Example of JavaScript interfaces using JSDoc
 * This demonstrates how our refactored files will work
 * without TypeScript dependencies
 */

/**
 * User interface for type checking
 * 
 * @interface User
 * @description Defines user structure for type safety
 */
export class User {
  /**
   * User ID
   * 
   * @type {number}
   */
  id = 0;
  
  /**
   * User name
   * 
   * @type {string}
   */
  name = '';
  
  /**
   * User email
   * 
   * @type {string}
   */
  email = '';
  
  /**
   * User creation date
   * 
   * @type {Date}
   */
  createdAt = new Date();
  
  /**
   * Creates a new user
   * 
   * @constructor
   * @param {number} id - User ID
   * @param {string} name - User name
   * @param {string} email - User email
   * @description Creates a new user instance
   */
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }
}

/**
 * Authentication result type
 * 
 * @typedef {Object} AuthResult
 * @property {boolean} success - Whether operation was successful
 * @property {T|null} data - Result data
 * @property {string|null} error - Error message if failed
 * @template T
 */

/**
 * Authentication provider interface
 * 
 * @interface IAuthProvider
 * @description Defines contract for authentication providers
 */
export class IAuthProvider {
  /**
   * Provider name
   * 
   * @type {string}
   */
  name;
  
  /**
   * Provider type
   * 
   * @type {string}
   */
  type;
  
  /**
   * Authenticates user
   * 
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<AuthResult<User>>} Authentication result
   * @description Authenticates user with provided credentials
   */
  async authenticate(credentials) {
    // Implementation would go here
    return {
      success: false,
      data: null,
      error: 'Not implemented'
    };
  }
}

/**
 * Creates a new user
 * 
 * @function createUser
 * @param {string} name - User name
 * @param {string} email - User email
 * @returns {User} New user instance
 * @description Creates a new user with provided data
 */
export function createUser(name, email) {
  const id = Math.floor(Math.random() * 1000);
  return new User(id, name, email);
}

// Example usage
const user = createUser('John Doe', 'john@example.com');
console.log(user.name); // TypeScript will know this is a string
console.log(user.email); // TypeScript will know this is a string

const provider = new IAuthProvider();
provider.name = 'LocalAuth';
provider.type = 'local';
