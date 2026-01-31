/**
 * Animation Definitions.
 * 
 * Predefined animations for styled components.
 * Provides clean separation of animation logic.
 */

import { keyframes } from 'styled-components';

/**
 * Optimized keyframes for animations
 * @type {Readonly<Object.<string, Function>>}
 */
export const animations = Object.freeze({
    /**
     * Fade in animation
     * @type {Function}
     * @description Keyframes for fade in effect
     */
    fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
    /**
     * Slide up animation
     * @type {Function}
     * @description Keyframes for slide up effect
     */
    slideUp: keyframes`
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `,
    /**
     * Scale in animation
     * @type {Function}
     * @description Keyframes for scale in effect
     */
    scaleIn: keyframes`
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  `,
});
