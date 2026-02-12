/**
 * Animation Definitions.
 *
 * Predefined animations for styled components.
 * Provides clean separation of animation logic.
 * 
 * Moved from core theming to shared UI utilities.
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
    slideDown: keyframes`
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `,
    slideLeft: keyframes`
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `,
    slideRight: keyframes`
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `,
    scaleIn: keyframes`
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  `,
    pulse: keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `,
    spin: keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `
};
