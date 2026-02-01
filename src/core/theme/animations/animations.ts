/**
 * Animation Definitions.
 *
 * Predefined animations for styled components.
 * Provides clean separation of animation logic.
 */

import { keyframes } from 'styled-components';

/**
 * Optimized keyframes for animations
 */
export const animations = {
    fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
    slideUp: keyframes`
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `,
    scaleIn: keyframes`
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  `
};
