/**
 * CenterContainer Component Styles
 * 
 * Enterprise-grade centering container styles using Emotion CSS with
 * theme integration. Includes flexbox centering and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import { getSpacing } from '../../../utils';

/**
 * CenterContainer base styles
 */
export const centerContainerBaseStyles = (theme?: any) => css`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * CenterContainer responsive styles
 */
export const centerContainerResponsiveStyles = (theme?: any) => css`
  @media (max-width: 768px) {
    padding: ${getSpacing(theme, 'sm')};
  }
`;

/**
 * CenterContainer variant styles
 */
export const centerContainerVariantStyles = (variant?: string, theme?: any) => {
  const variants = {
    default: css``,
    fullscreen: css`
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
    `,
    inline: css`
      display: inline-flex;
    `,
  };

  return variants[variant as keyof typeof variants] || variants.default;
};
