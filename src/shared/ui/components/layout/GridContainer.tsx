/**
 * GridContainer Component.
 *
 * Optimized grid container with responsive design.
 * Provides CSS Grid layout capabilities with mobile responsiveness.
 */

import { css } from 'styled-components';

import { createStyledComponent } from '../../../../core/modules/theming/factories/styledFactory';
import { media } from '../../../../core/modules/theming/utils/mediaQueries';

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
