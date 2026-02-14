/**
 * GridContainer Component Styles
 * 
 * Enterprise-grade grid container styles using Emotion CSS with
 * theme integration. Includes responsive grid design and gap management.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import { getSpacing } from '../../../utils';

/**
 * GridContainer base styles
 */
export const gridContainerBaseStyles = (theme?: any) => css`
  box-sizing: border-box;
  display: grid;
`;

/**
 * GridContainer columns styles
 */
export const gridContainerColumnsStyles = (columns?: number) => css`
  grid-template-columns: repeat(${columns || 1}, 1fr);
`;

/**
 * GridContainer gap styles
 */
export const gridContainerGapStyles = (gap?: string, theme?: any) => {
  if (!gap) return '';
  
  return css`
    gap: ${gap.includes('px') ? gap : getSpacing(theme, gap)};
  `;
};

/**
 * GridContainer responsive styles
 */
export const gridContainerResponsiveStyles = (theme?: any) => css`
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
