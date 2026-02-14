/**
 * FullLoadingOverlay Component Styles
 * 
 * Enterprise-grade full loading overlay styles using Emotion CSS with
 * theme integration. Includes backdrop, content, and blur effects.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import { 
  getSpacing, 
  getColor, 
  getRadius, 
  getShadow, 
  getTransition 
} from '../../../utils';

/**
 * Full loading overlay container styles
 */
export const fullLoadingOverlayStyles = (theme?: any, options?: {
  blur?: number;
  backgroundColor?: string;
  zIndex?: number;
} = {}) => css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: options.backgroundColor || `${getColor(theme, 'text.primary')}10`;
  backdrop-filter: ${options.blur ? `blur(${options.blur}px)` : 'none'};
  z-index: options.zIndex || theme?.zIndex?.overlay || 999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${getTransition(theme, 'opacity', 'normal', 'ease')};
`;

/**
 * Loading content container styles
 */
export const loadingContentStyles = (theme?: any, radius?: string) => css`
  background: ${getColor(theme, 'background.primary')};
  border-radius: ${getRadius(theme, radius || 'md')};
  padding: ${getSpacing(theme, 'xl')};
  box-shadow: ${getShadow(theme, 'lg')};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${getSpacing(theme, 'md')};
  max-width: 90vw;
  max-height: 90vh;
`;

/**
 * Loading spinner container styles
 */
export const loadingSpinnerStyles = (theme?: any) => css`
  width: 40px;
  height: 40px;
  border: 3px solid ${getColor(theme, 'border.light')};
  border-top: 3px solid ${getColor(theme, 'brand.500')};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

/**
 * Loading message styles
 */
export const loadingMessageStyles = (theme?: any) => css`
  color: ${getColor(theme, 'text.primary')};
  font-size: ${theme?.typography?.fontSize?.base || '14px'};
  font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
  text-align: center;
  margin: 0;
  line-height: 1.4;
`;

/**
 * Loading overlay hidden styles
 */
export const loadingOverlayHiddenStyles = css`
  opacity: 0;
  pointer-events: none;
`;

/**
 * Loading overlay visible styles
 */
export const loadingOverlayVisibleStyles = css`
  opacity: 1;
  pointer-events: auto;
`;
