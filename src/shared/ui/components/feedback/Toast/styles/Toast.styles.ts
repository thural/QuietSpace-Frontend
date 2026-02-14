/**
 * Toast Component Styles
 * 
 * Enterprise-grade toast notification styles using Emotion CSS with
 * theme integration. Includes container, items, animations, and
 * responsive positioning.
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
 * Toast container styles with positioning
 */
export const toastContainerStyles = (theme?: any, position: string = 'top-right') => {
  const positionStyles = {
    'top-right': css`
      top: ${getSpacing(theme, 'md')};
      right: ${getSpacing(theme, 'md')};
    `,
    'top-left': css`
      top: ${getSpacing(theme, 'md')};
      left: ${getSpacing(theme, 'md')};
    `,
    'bottom-right': css`
      bottom: ${getSpacing(theme, 'md')};
      right: ${getSpacing(theme, 'md')};
    `,
    'bottom-left': css`
      bottom: ${getSpacing(theme, 'md')};
      left: ${getSpacing(theme, 'md')};
    `,
    'top-center': css`
      top: ${getSpacing(theme, 'md')};
      left: 50%;
      transform: translateX(-50%);
    `,
    'bottom-center': css`
      bottom: ${getSpacing(theme, 'md')};
      left: 50%;
      transform: translateX(-50%);
    `,
  };

  return css`
    position: fixed;
    z-index: ${theme?.zIndex?.toast || 1001};
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(theme, 'sm')};
    pointer-events: none;
    
    ${positionStyles[position as keyof typeof positionStyles]}
    
    @media (max-width: 720px) {
      top: ${getSpacing(theme, 'sm')};
      right: ${getSpacing(theme, 'sm')};
      left: ${getSpacing(theme, 'sm')};
      bottom: auto;
      transform: none;
    }
  `;
};

/**
 * Individual toast item styles
 */
export const toastItemStyles = (theme?: any, type: string = 'info', size: string = 'medium') => {
  const typeStyles = {
    success: css`
      background: ${getColor(theme, 'semantic.success')};
      color: ${getColor(theme, 'text.inverse')};
      border: 1px solid ${getColor(theme, 'semantic.success')};
    `,
    error: css`
      background: ${getColor(theme, 'semantic.error')};
      color: ${getColor(theme, 'text.inverse')};
      border: 1px solid ${getColor(theme, 'semantic.error')};
    `,
    warning: css`
      background: ${getColor(theme, 'semantic.warning')};
      color: ${getColor(theme, 'text.inverse')};
      border: 1px solid ${getColor(theme, 'semantic.warning')};
    `,
    info: css`
      background: ${getColor(theme, 'semantic.info')};
      color: ${getColor(theme, 'text.inverse')};
      border: 1px solid ${getColor(theme, 'semantic.info')};
    `,
  };

  const sizeStyles = {
    small: css`
      padding: ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')};
      font-size: 12px;
      min-height: 32px;
    `,
    medium: css`
      padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')};
      font-size: 14px;
      min-height: 40px;
    `,
    large: css`
      padding: ${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')};
      font-size: 16px;
      min-height: 48px;
    `,
  };

  return css`
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: ${getSpacing(theme, 'sm')};
    border-radius: ${getRadius(theme, 'md')};
    box-shadow: ${getShadow(theme, 'md')};
    transition: ${getTransition(theme, 'all', 'fast', 'ease')};
    font-weight: 500;
    line-height: 1.4;
    max-width: 400px;
    word-wrap: break-word;
    
    ${typeStyles[type as keyof typeof typeStyles]}
    ${sizeStyles[size as keyof typeof sizeStyles]}
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${getShadow(theme, 'lg')};
    }
    
    &.toast-paused {
      animation-play-state: paused;
    }
    
    @media (max-width: 720px) {
      max-width: calc(100vw - 32px);
      font-size: 13px;
    }
  `;
};

/**
 * Toast content styles
 */
export const toastContentStyles = (theme?: any) => css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme, 'xs')};
  min-width: 0;
`;

/**
 * Toast title styles
 */
export const toastTitleStyles = (theme?: any) => css`
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
`;

/**
 * Toast message styles
 */
export const toastMessageStyles = (theme?: any) => css`
  margin: 0;
  line-height: 1.4;
  opacity: 0.9;
`;

/**
 * Toast icon styles
 */
export const toastIconStyles = (theme?: any) => css`
  flex-shrink: 0;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

/**
 * Toast close button styles
 */
export const toastCloseButtonStyles = (theme?: any) => css`
  flex-shrink: 0;
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  margin-left: ${getSpacing(theme, 'xs')};
  opacity: 0.7;
  transition: ${getTransition(theme, 'opacity', 'fast', 'ease')};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: ${getRadius(theme, 'sm')};
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 1px;
  }
`;

/**
 * Toast progress bar styles
 */
export const toastProgressStyles = (theme?: any) => css`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0 0 ${getRadius(theme, 'md')} ${getRadius(theme, 'md')};
  overflow: hidden;
`;

/**
 * Toast progress bar fill styles
 */
export const toastProgressFillStyles = (theme?: any, duration: number = 5000) => css`
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  animation: toastProgress ${duration}ms linear forwards;
  
  @keyframes toastProgress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;
