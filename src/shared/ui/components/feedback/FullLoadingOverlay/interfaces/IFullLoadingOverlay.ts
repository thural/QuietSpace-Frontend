/**
 * FullLoadingOverlay Component Interface
 * 
 * Defines the contract for the FullLoadingOverlay component with
 * enterprise-grade loading overlay functionality.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';

/**
 * FullLoadingOverlay component props interface
 */
export interface IFullLoadingOverlayProps {
  /** Loading overlay visibility */
  visible?: boolean;
  /** Border radius for overlay content */
  radius?: string;
  /** Backdrop blur intensity */
  blur?: number;
  /** Custom loading content */
  children?: ReactNode;
  /** Loading message */
  message?: string;
  /** Show spinner */
  showSpinner?: boolean;
  /** Custom spinner component */
  customSpinner?: ReactNode;
  /** Overlay background color */
  backgroundColor?: string;
  /** Z-index for overlay */
  zIndex?: number;
}
