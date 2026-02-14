/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getShadow, getTransition, getTypography } from '../utils';

// Enterprise Emotion CSS for overlay styling
export const overlayWrapperStyles = (theme?: any) => css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

export const overlayBackdropStyles = (theme?: any) => css`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: block;
  backdrop-filter: blur(32px);
  background: rgba(128, 128, 128, 0.1);
  transition: all ${getTransition(theme, 'all', 'normal', 'ease')};
  
  &:hover {
    background: rgba(128, 128, 128, 0.15);
  }
`;

export const overlayContentStyles = (theme?: any) => css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${getColor(theme, 'background.primary')};
  border-radius: ${getRadius(theme, 'lg')};
  box-shadow: ${getShadow(theme, 'lg')};
  padding: ${getSpacing(theme, 'lg')};
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
  
  // Responsive design
  @media (max-width: 768px) {
    padding: ${getSpacing(theme, 'md')};
    max-width: 95vw;
    max-height: 95vh;
  }
`;

export const overlayCloseButtonStyles = (theme?: any) => css`
  position: absolute;
  top: ${getSpacing(theme, 'sm')};
  right: ${getSpacing(theme, 'sm')};
  background: transparent;
  border: none;
  font-size: ${getTypography(theme, 'lg')};
  color: ${getColor(theme, 'text.secondary')};
  cursor: pointer;
  padding: ${getSpacing(theme, 'xs')};
  border-radius: ${getRadius(theme, 'sm')};
  transition: all ${getTransition(theme, 'all', 'fast', 'ease')};
  
  &:hover {
    background: ${getColor(theme, 'background.secondary')};
    color: ${getColor(theme, 'text.primary')};
  }
  
  &:focus {
    outline: 2px solid ${getColor(theme, 'brand.300')};
    outline-offset: 2px;
  }
`;
