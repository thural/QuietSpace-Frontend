/**
 * ErrorFallback Component Interface
 * 
 * Defines the contract for the ErrorFallback component with
 * enterprise-grade error handling and recovery options.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { BaseComponentProps } from '../../../types';

/**
 * ErrorFallback component props interface
 */
export interface IErrorFallbackProps extends BaseComponentProps {
  /** Error message to display */
  error?: string;
  /** Retry handler function */
  onRetry?: () => void;
  /** Error variant type */
  variant?: 'default' | 'auth';
  /** Custom error title */
  title?: string;
  /** Show error icon */
  showIcon?: boolean;
  /** Custom icon component */
  customIcon?: ReactNode;
  /** Additional actions */
  actions?: ReactNode;
  /** Error code for tracking */
  errorCode?: string;
  /** Show detailed error information */
  showDetails?: boolean;
}
