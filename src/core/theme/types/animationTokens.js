/**
 * Animation Token Types.
 * 
 * Type definitions for animation-related theme tokens.
 * Provides clean separation of animation type definitions.
 */

/**
 * Animation tokens interface
 * @interface AnimationTokens
 * @description Defines the structure for animation theme tokens
 */
export class AnimationTokens {
  /**
   * @param {Object} duration - Animation duration settings
   * @param {Object} easing - Animation easing functions
   */
  constructor(duration, easing) {
    this.duration = duration;
    this.easing = easing;
  }

  /**
   * @type {Object}
   * @description Animation duration settings
   * @property {string} fast - Fast animation duration
   * @property {string} normal - Normal animation duration
   * @property {string} slow - Slow animation duration
   */
  duration;

  /**
   * @type {Object}
   * @description Animation easing functions
   * @property {string} ease - Standard ease function
   * @property {string} easeIn - Ease in function
   * @property {string} easeOut - Ease out function
   * @property {string} easeInOut - Ease in-out function
   */
  easing;
}
