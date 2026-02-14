/**
 * ModalStyled Component Interface
 * 
 * Defines the contract for the ModalStyled component with enterprise-grade
 * modal functionality including overlay, positioning, and accessibility features.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

/**
 * ModalStyled component props interface
 */
export interface IModalStyledProps extends GenericWrapper {
  /** Modal content */
  children?: ReactNode;
  /** Ref forwarded to modal container */
  forwardedRef?: any;
  /** Modal visibility state */
  isOpen?: boolean;
  /** Close modal handler */
  onClose?: () => void;
  /** Click outside to close */
  closeOnOverlayClick?: boolean;
  /** Show overlay */
  showOverlay?: boolean;
  /** Modal size variant */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  /** Modal position */
  position?: 'center' | 'top' | 'bottom';
  /** Custom z-index */
  zIndex?: number;
  /** Enable backdrop blur */
  backdropBlur?: boolean;
  /** Animation duration */
  animationDuration?: number;
  /** Prevent body scroll when open */
  preventBodyScroll?: boolean;
  /** Custom overlay className */
  overlayClassName?: string;
  /** Custom container className */
  containerClassName?: string;
}
