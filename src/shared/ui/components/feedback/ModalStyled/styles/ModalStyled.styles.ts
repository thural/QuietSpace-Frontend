/**
 * ModalStyled Component Styles
 * 
 * Enterprise-grade modal styles using Emotion CSS with theme integration.
 * Includes overlay, container, animations, and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import {
  getSpacing,
  getColor,
  getRadius,
  getBorderWidth,
  getShadow,
  getTransition
} from '../../../utils';

/**
 * Modal overlay styles with backdrop and blur effects
 */
export const modalOverlayStyles = (theme?: any, options?: {
  backdropBlur?: boolean;
  showOverlay?: boolean;
} = {}) => css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: options.showOverlay !== false 
    ? `${ getColor(theme, 'text.primary')}20` // 20% opacity
    : 'transparent';
  z-index: getZIndex(theme, 'overlay');
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: ${options.backdropBlur ? 'blur(4px)' : 'none'};
  transition: ${getTransition(theme, 'opacity', 'normal', 'ease')};
`;

/**
 * Modal container styles with positioning and animations
 */
export const modalContainerStyles = (theme?: any, options?: {
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  position?: 'center' | 'top' | 'bottom';
} = {}) => {
  const sizeStyles = {
    small: css`
      width: 320px;
      max-width: 90vw;
    `,
    medium: css`
      width: 640px;
      max-width: 90vw;
    `,
    large: css`
      width: 960px;
      max-width: 95vw;
    `,
    fullscreen: css`
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
      border-radius: 0;
    `,
  };

  const positionStyles = {
    center: css`
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `,
    top: css`
      top: ${getSpacing(theme, 'lg')};
      left: 50%;
      transform: translateX(-50%);
    `,
    bottom: css`
      bottom: ${getSpacing(theme, 'lg')};
      left: 50%;
      transform: translateX(-50%);
    `,
  };

  return css`
    gap: ${getSpacing(theme, 'md')};
    color: ${getColor(theme, 'text.primary')};
    border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.light')};
    display: flex;
    padding: ${getSpacing(theme, 'lg')};
    z-index: ${theme?.zIndex?.modal || 1000};
    position: fixed;
    flex-direction: column;
    border-radius: ${getRadius(theme, 'md')};
    background: ${getColor(theme, 'background.primary')};
    box-shadow: ${getShadow(theme, 'lg')};
    transition: ${getTransition(theme, 'all', 'normal', 'ease')};
    
    ${sizeStyles[options.size || 'medium']}
    ${positionStyles[options.position || 'center']}
    
    @media (max-width: 720px) {
      gap: ${getSpacing(theme, 'md')};
      width: 95vw;
      padding: ${getSpacing(theme, 'md')};
      
      ${options.position === 'center' && css`
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `}
      
      ${options.position === 'top' && css`
        top: ${getSpacing(theme, 'md')};
        left: 50%;
        transform: translateX(-50%);
      `}
      
      ${options.position === 'bottom' && css`
        bottom: ${getSpacing(theme, 'md')};
        left: 50%;
        transform: translateX(-50%);
      `}
    }
  `;
};

/**
 * Modal close button styles
 */
export const modalCloseButtonStyles = (theme?: any) => css`
  position: absolute;
  top: ${getSpacing(theme, 'sm')};
  right: ${getSpacing(theme, 'sm')};
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${getColor(theme, 'text.secondary')};
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border-radius: ${getRadius(theme, 'sm')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  
  &:hover {
    background: ${getColor(theme, 'background.secondary')};
    color: ${getColor(theme, 'text.primary')};
  }
  
  &:focus {
    outline: 2px solid ${getColor(theme, 'brand.500')};
    outline-offset: 2px;
  }
`;

/**
 * Modal header styles
 */
export const modalHeaderStyles = (theme?: any) => css`
  margin-bottom: ${getSpacing(theme, 'md')};
  padding-bottom: ${getSpacing(theme, 'sm')};
  border-bottom: ${getBorderWidth(theme, 'thin')} solid ${getColor(theme, 'border.light')};
  
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    color: ${getColor(theme, 'text.primary')};
    font-weight: 600;
  }
`;

/**
 * Modal content styles
 */
export const modalContentStyles = (theme?: any) => css`
  flex: 1;
  overflow-y: auto;
  color: ${getColor(theme, 'text.primary')};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${getColor(theme, 'background.secondary')};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${getColor(theme, 'border.medium')};
    border-radius: ${getRadius(theme, 'sm')};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${getColor(theme, 'border.dark')};
  }
`;

/**
 * Modal footer styles
 */
export const modalFooterStyles = (theme?: any) => css`
  margin-top: ${getSpacing(theme, 'md')};
  padding-top: ${getSpacing(theme, 'sm')};
  border-top: ${getBorderWidth(theme, 'thin')} solid ${getColor(theme, 'border.light')};
  display: flex;
  gap: ${getSpacing(theme, 'sm')};
  justify-content: flex-end;
  align-items: center;
`;
