/**
 * Layout Components.
 * 
 * Pre-built layout components using styled components.
 * Provides clean separation of layout component logic.
 */

import { css } from 'styled-components';
import { createStyledComponent } from '../factories/styledFactory.js';
import { media } from '../utils/mediaQueries.js';

/**
 * Performance-optimized container component
 * @type {Function}
 * @description Performance-optimized container component
 */
export const Container = createStyledComponent('div')`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  ${media.mobile(css`
    padding: 0 ${({ theme }) => theme.spacing.sm};
  `)}
`;

/**
 * Optimized flex container with memoization
 * @type {Function}
 * @description Optimized flex container with memoization
 */
export const FlexContainer = createStyledComponent('div')`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  align-items: ${({ align = 'center' }) => align};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  gap: ${({ gap = '0' }) => gap};
`;

/**
 * Optimized grid container
 * @type {Function}
 * @description Optimized grid container
 */
export const GridContainer = createStyledComponent('div')`
  display: grid;
  grid-template-columns: (props) => {
    const columns = props.columns || 1;
    return 'repeat(' + columns + ', 1fr)';
  };
  gap: ({ gap = '0' }) => gap;
  
  ${media.mobile(css`
    grid-template-columns: 1fr;
  `)}
`;
