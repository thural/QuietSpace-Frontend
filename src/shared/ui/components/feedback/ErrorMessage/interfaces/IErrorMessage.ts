/**
 * ErrorMessage Component Interfaces
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';

/**
 * ErrorMessage Props
 */
export interface IErrorMessageProps extends IBaseComponentProps {
  error: string;
  onRetry?: () => void;
  onClear?: () => void;
  showRetry?: boolean;
  showClear?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * ErrorMessage State
 */
export interface IErrorMessageState extends IBaseComponentState {
  isVisible: boolean;
  isExpanded: boolean;
}
