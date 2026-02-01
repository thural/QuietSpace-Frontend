/**
 * Layout Components.
 *
 * Pre-built layout components using styled components.
 * Provides clean separation of layout component logic.
 */

import { css } from 'styled-components';

import { createStyledComponent } from '../factories/styledFactory';
import { media } from '../utils/mediaQueries';

// Extend DefaultTheme to include our enhanced theme
declare module 'styled-components' {
    export interface DefaultTheme {
        spacing: {
            md: string;
            sm: string;
        };
    }
}

/**
 * Performance-optimized container component
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
 */
export const FlexContainer = createStyledComponent('div') <{
    direction?: 'row' | 'column';
    align?: 'flex-start' | 'center' | 'flex-end';
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
    gap?: string;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  align-items: ${({ align = 'center' }) => align};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  gap: ${({ gap = '0' }) => gap};
`;

/**
 * Optimized grid container
 */
export const GridContainer = createStyledComponent('div') <{
    columns?: number;
    gap?: string;
}>`
  display: grid;
  grid-template-columns: ${({ columns = 1 }) => `repeat(${columns}, 1fr)`};
  gap: ${({ gap = '0' }) => gap};
  
  ${media.mobile(css`
    grid-template-columns: 1fr;
  `)}
`;
