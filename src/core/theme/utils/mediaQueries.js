/**
 * Media Query Utilities.
 * 
 * Responsive design utilities for media queries.
 * Provides clean separation of media query logic.
 */

import { css } from 'styled-components';

/**
 * Responsive utility for media queries
 * @type {Readonly<Object.<string, Function>>}
 */
export const media = Object.freeze({
    /**
     * Mobile media query (max-width: 768px)
     * @param {string} styles - CSS styles to apply
     * @returns {Function} Styled-components CSS function
     */
    mobile: (styles) => css`
    @media (max-width: 768px) {
      ${styles}
    }
  `,
    /**
     * Wide media query (min-width: 769px)
     * @param {string} styles - CSS styles to apply
     * @returns {Function} Styled-components CSS function
     */
    wide: (styles) => css`
    @media (min-width: 769px) {
      ${styles}
    }
  `,
});
