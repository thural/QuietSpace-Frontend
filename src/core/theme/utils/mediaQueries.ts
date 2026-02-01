/**
 * Media Query Utilities.
 *
 * Responsive design utilities for media queries.
 * Provides clean separation of media query logic.
 */

import { css } from 'styled-components';

/**
 * Responsive utility for media queries
 */
export const media = {
    mobile: (styles: any) => css`
    @media (max-width: 768px) {
      ${styles}
    }
  `,
    wide: (styles: any) => css`
    @media (min-width: 769px) {
      ${styles}
    }
  `
};
