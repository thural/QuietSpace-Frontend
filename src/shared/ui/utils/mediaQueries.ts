/**
 * Media Query Utilities.
 *
 * Responsive design utilities for media queries.
 * Provides clean separation of media query logic.
 * 
 * Moved from core theming to shared UI utilities.
 */

import { css, CSSObject } from 'styled-components';

/**
 * Responsive utility for media queries
 */
export const media = {
  mobile: (styles: CSSObject) => css`
    @media (max-width: 768px) {
      ${styles}
    }
  `,
  wide: (styles: CSSObject) => css`
    @media (min-width: 769px) {
      ${styles}
    }
  `,
  tablet: (styles: CSSObject) => css`
    @media (min-width: 769px) and (max-width: 1024px) {
      ${styles}
    }
  `,
  desktop: (styles: CSSObject) => css`
    @media (min-width: 1025px) {
      ${styles}
    }
  `
};
