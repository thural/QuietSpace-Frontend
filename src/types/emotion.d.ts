/**
 * Emotion CSS prop type definitions
 * 
 * Adds support for the css prop to all React components
 */

import { Interpolation } from '@emotion/react';

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: Interpolation<unknown>;
    }
  }
}
