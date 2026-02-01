import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

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
  error: string | null;
  attempts: number;
  lastAttemptTime: Date | null;
}

/**
 * Reusable Two-Factor Authentication Component
 * 
 * A flexible 2FA verification component with code input and validation.
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class TwoFactorAuth extends BaseClassComponent<ITwoFactorAuthProps, ITwoFactorAuthState> {
  private inputRef = React.createRef<HTMLInputElement>();

  protected override getInitialState(): Partial<ITwoFactorAuthState> {
    return {
      code: '',
      isSubmitting: false,
      error: null,
      attempts: 0,
      lastAttemptTime: null
    };
  }

  protected override onMount(): void {
    super.onMount();
    // Focus input when component mounts
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  /**
   * Handle form submission
   */
  private handleSubmit = async (e: React.FormEvent): Promise<void> => => {
    e.preventDefault();
    
    const { code, isSubmitting } = this.state;
    const { onVerify, maxLength = 6 } = this.props;

    if (isSubmitting || !code.trim()) {
      return;
    }

    if (code.length !== maxLength) {
      this.safeSetState({ 
        error: `Please enter exactly ${maxLength} digits` 
      });
      return;
    }

    this.safeSetState({ 
      isSubmitting: true, 
      error: null 
    });

    try {
      await onVerify(code.trim());
      // Success - let parent handle the result
      this.safeSetState({ 
        code: '', 
        isSubmitting: false,
        attempts: 0,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      this.safeSetState({ 
        isSubmitting: false, 
        error: errorMessage,
        attempts: this.state.attempts + 1,
        lastAttemptTime: new Date()
      });
      
      // Clear input and refocus
      this.safeSetState({ code: '' });
      if (this.inputRef.current) {
        this.inputRef.current.focus();
      }
    }
  };

  /**
   * Handle input change
   */
  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    const { maxLength = 6 } = this.props;
    
    // Only allow digits and limit to max length
    const digitsOnly = value.replace(/\D/g, '').slice(0, maxLength);
    
    this.safeSetState({ 
      code: digitsOnly,
      error: null 
    });
  };

  /**
   * Handle paste event
   */
  private handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const { maxLength = 6 } = this.props;
    
    const pastedText = e.clipboardData.getData('text');
    const digitsOnly = pastedText.replace(/\D/g, '').slice(0, maxLength);
    
    this.safeSetState({ 
      code: digitsOnly,
      error: null 
    });
  };

  /**
   * Clear the form
   */
  public clear(): void {
    this.safeSetState({ 
      code: '', 
      error: null,
      isSubmitting: false
    });
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  /**
   * Get variant classes
   */
  private getVariantClasses(): string {
    const { variant = 'default' } = this.props;
    const variantMap = {
      default: 'p-4',
      compact: 'p-3',
      inline: 'p-2'
    };
    return variantMap[variant];
  }

  /**
   * Check if user should be rate limited
   */
  private isRateLimited(): boolean {
    const { attempts, lastAttemptTime } = this.state;
    const maxAttempts = 3;
    const cooldownMinutes = 5;

    if (attempts >= maxAttempts && lastAttemptTime) {
      const timeSinceLastAttempt = Date.now() - lastAttemptTime.getTime();
      const cooldownMs = cooldownMinutes * 60 * 1000;
      return timeSinceLastAttempt < cooldownMs;
    }

    return false;
  }

  /**
   * Get time until rate limit expires
   */
  private getRateLimitTimeRemaining(): string {
    const { lastAttemptTime } = this.state;
    const cooldownMinutes = 5;

    if (!lastAttemptTime) {
      return '';
    }

    const timeSinceLastAttempt = Date.now() - lastAttemptTime.getTime();
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const remainingMs = cooldownMs - timeSinceLastAttempt;

    if (remainingMs <= 0) {
      return '';
    }

    const minutes = Math.floor(remainingMs / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  protected override renderContent(): React.ReactNode {
    const { 
      isLoading = false, 
      maxLength = 6,
      placeholder = 'Enter 6-digit code',
      title = 'Two-Factor Authentication',
      description = 'Enter the verification code from your authenticator app',
      variant = 'default',
      className = '' 
    } = this.props;
    const { code, isSubmitting, error, attempts } = this.state;

    const isRateLimited = this.isRateLimited();
    const isDisabled = isLoading || isSubmitting || isRateLimited;
    const isValidLength = code.length === maxLength;

    return (
      <div 
        className={`two-factor-auth ${this.getVariantClasses()} bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}
        data-testid="two-factor-auth"
      >
        <div className="font-medium mb-2">{title}</div>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        {/* Rate Limit Warning */}
        {isRateLimited && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded text-sm text-red-800">
            <div className="font-medium">Too many attempts</div>
            <div>Please wait {this.getRateLimitTimeRemaining()} before trying again.</div>
            <div className="text-xs mt-1">Attempts: {attempts}/3</div>
          </div>
        )}

        <form onSubmit={this.handleSubmit} className="space-y-3">
          {/* Code Input */}
          <div>
            <input
              ref={this.inputRef}
              type="text"
              value={code}
              onChange={this.handleInputChange}
              onPaste={this.handlePaste}
              placeholder={placeholder}
              disabled={isDisabled}
              className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono ${
                error 
                  ? 'border-red-300 bg-red-50' 
                  : isValidLength 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300'
              } disabled:bg-gray-100 disabled:text-gray-500`}
              maxLength={maxLength}
              inputMode="numeric"
              autoComplete="one-time-code"
              data-testid="two-factor-input"
            />
            
            {/* Character Count */}
            <div className="mt-1 text-xs text-gray-500 text-center">
              {code.length}/{maxLength} digits
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded" data-testid="two-factor-error">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isDisabled || !isValidLength}
            className={`w-full px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 ${
              isDisabled || !isValidLength
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
            data-testid="two-factor-submit"
          >
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-4 text-xs text-gray-500">
          <div>• Enter the code from your authenticator app</div>
          <div>• Codes expire after 30 seconds</div>
          <div>• You have 3 attempts before being temporarily blocked</div>
        </div>
      </div>
    );
  }
}

export default TwoFactorAuth;
