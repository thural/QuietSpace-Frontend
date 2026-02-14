import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Two Factor Auth Props
 */
export interface ITwoFactorAuthProps extends IBaseComponentProps {
  onVerify: (code: string) => Promise<void>;
  isLoading?: boolean;
  maxLength?: number;
  placeholder?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

/**
 * Two Factor Auth State
 */
export interface ITwoFactorAuthState extends IBaseComponentState {
  code: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  attempts: number;
  lastAttemptTime: Date | null;
}
