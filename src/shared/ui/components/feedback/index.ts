/**
 * Feedback Components Index
 * 
 * Clean barrel export for all feedback components following
 * decoupled architecture patterns with proper type exports.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

// ModalStyled Component
export { default as ModalStyled } from './ModalStyled';
export type { IModalStyledProps } from './ModalStyled';

// Toast Component
export { default as Toast } from './Toast';
export type { IToastProps, IToastItem } from './Toast';

// ErrorFallback Component
export { default as ErrorFallback } from './ErrorFallback';
export type { IErrorFallbackProps } from './ErrorFallback';

// FullLoadingOverlay Component
export { default as FullLoadingOverlay } from './FullLoadingOverlay';
export type { IFullLoadingOverlayProps } from './FullLoadingOverlay';

// Other Components (to be migrated)
export { Drawer } from './Drawer';
export type { IDrawerProps } from './Drawer';

export { LoadingSpinner } from './LoadingSpinner';

export { NotificationItem } from './NotificationItem';

export { ErrorMessage } from './ErrorMessage';

export { default as PostMessageSkeleton } from './PostMessageSkeleton';

export { default as PostSkeleton } from './PostSkeleton';
