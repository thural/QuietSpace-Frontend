/**
 * OverlayComponent Component Styles
 */

import { css } from '@emotion/react';

/**
 * Overlay wrapper styles
 */
export const overlayWrapperStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Overlay backdrop styles
 */
export const overlayBackdropStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
`;

/**
 * Overlay content styles
 */
export const overlayContentStyles = css`
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  padding: 1.5rem;
`;

/**
 * Overlay close button styles
 */
export const overlayCloseButtonStyles = css`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;
