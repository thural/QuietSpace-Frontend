import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Security Status Props
 */
export interface ISecurityStatusProps extends IBaseComponentProps {
  requiresTwoFactor: boolean;
  deviceTrusted: boolean;
  sessionExpiry: Date | null;
  onTrustDevice?: () => void;
  showSessionExpiry?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * Security Status State
 */
export interface ISecurityStatusState extends IBaseComponentState {
  timeUntilExpiry: string;
  isExpiringSoon: boolean;
}

/**
 * Reusable Security Status Component
 * 
 * Displays authentication security information including 2FA status,
 * device trust, and session expiry information.
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class SecurityStatus extends BaseClassComponent<ISecurityStatusProps, ISecurityStatusState> {
  private expiryTimer: number | null = null;

  protected override getInitialState(): Partial<ISecurityStatusState> {
    return {
      timeUntilExpiry: '',
      isExpiringSoon: false
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.startExpiryTimer();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.clearExpiryTimer();
  }

  /**
   * Start timer to update session expiry countdown
   */
  private startExpiryTimer(): void {
    this.updateExpiryTime();
    this.expiryTimer = window.setInterval(() => {
      this.updateExpiryTime();
    }, 1000); // Update every second
  }

  /**
   * Clear expiry timer
   */
  private clearExpiryTimer(): void {
    if (this.expiryTimer) {
      clearInterval(this.expiryTimer);
      this.expiryTimer = null;
    }
  }

  /**
   * Update time until expiry
   */
  private updateExpiryTime(): void {
    const { sessionExpiry } = this.props;
    
    if (!sessionExpiry) {
      this.safeSetState({ timeUntilExpiry: '', isExpiringSoon: false });
      return;
    }

    const now = new Date().getTime();
    const expiryTime = sessionExpiry.getTime();
    const timeDiff = expiryTime - now;

    if (timeDiff <= 0) {
      this.safeSetState({ timeUntilExpiry: 'Expired', isExpiringSoon: true });
      this.clearExpiryTimer();
      return;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    let timeString = '';
    if (hours > 0) {
      timeString = `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      timeString = `${minutes}m ${seconds}s`;
    } else {
      timeString = `${seconds}s`;
    }

    const isExpiringSoon = timeDiff < 5 * 60 * 1000; // Less than 5 minutes

    this.safeSetState({ 
      timeUntilExpiry: timeString, 
      isExpiringSoon 
    });
  }

  /**
   * Handle trust device action
   */
  private handleTrustDevice = (): void => {
    const { onTrustDevice } = this.props;
    if (onTrustDevice) {
      onTrustDevice();
    }
  };

  /**
   * Get status badge classes
   */
  private getStatusBadgeClasses(isRequired: boolean, isActive: boolean): string {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    
    if (isRequired) {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
    
    if (isActive) {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    
    return `${baseClasses} bg-gray-100 text-gray-800`;
  }

  /**
   * Get variant classes
   */
  private getVariantClasses(): string {
    const { variant = 'default' } = this.props;
    const variantMap = {
      default: 'p-4',
      compact: 'p-3',
      detailed: 'p-6'
    };
    return variantMap[variant];
  }

  protected override renderContent(): React.ReactNode {
    const { 
      requiresTwoFactor, 
      deviceTrusted, 
      sessionExpiry,
      showSessionExpiry = true,
      variant = 'default',
      className = '' 
    } = this.props;
    const { timeUntilExpiry, isExpiringSoon } = this.state;

    return (
      <div 
        className={`security-status ${this.getVariantClasses()} bg-blue-50 border border-blue-200 rounded-lg ${className}`}
        data-testid="security-status"
      >
        <div className="font-medium mb-2">Security Status</div>
        
        <div className="space-y-2 text-sm">
          {/* Two-Factor Auth Status */}
          <div className="flex items-center justify-between">
            <span>Two-Factor Auth:</span>
            <span className={this.getStatusBadgeClasses(requiresTwoFactor, false)}>
              {requiresTwoFactor ? 'Required' : 'Not Required'}
            </span>
          </div>

          {/* Device Trust Status */}
          <div className="flex items-center justify-between">
            <span>Device Trust:</span>
            <span className={this.getStatusBadgeClasses(false, deviceTrusted)}>
              {deviceTrusted ? 'Trusted' : 'Not Trusted'}
            </span>
          </div>

          {/* Session Expiry */}
          {showSessionExpiry && sessionExpiry && (
            <div className="flex items-center justify-between">
              <span>Session Expires:</span>
              <div className="text-right">
                <div className={`text-xs ${isExpiringSoon ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                  {timeUntilExpiry}
                </div>
                <div className="text-xs text-gray-500">
                  {sessionExpiry.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trust Device Button */}
        {!deviceTrusted && (
          <button 
            onClick={this.handleTrustDevice}
            className="mt-3 w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            data-testid="trust-device-button"
          >
            Trust This Device
          </button>
        )}

        {/* Expiry Warning */}
        {isExpiringSoon && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-200 rounded text-xs text-yellow-800">
            ⚠️ Session expiring soon! Please refresh your session.
          </div>
        )}
      </div>
    );
  }
}

export default SecurityStatus;
