/**
 * Enterprise Session Timeout Manager
 *
 * Provides intelligent session timeout management with:
 * - Proactive timeout detection and warnings
 * - User-friendly countdown timers
 * - Graceful session extension capabilities
 * - Automatic session cleanup and termination
 * - Cross-tab synchronization
 * - Performance monitoring and analytics
 * - Accessibility compliance
 */

export interface SessionTimeoutConfig {
  /** Total session duration in milliseconds (default: 30 minutes) */
  sessionDuration: number;
  /** Warning time before timeout in milliseconds (default: 5 minutes) */
  warningTime: number;
  /** Final warning time in milliseconds (default: 1 minute) */
  finalWarningTime: number;
  /** Grace period for session extension in milliseconds (default: 30 seconds) */
  gracePeriod: number;
  /** Enable cross-tab synchronization (default: true) */
  enableCrossTabSync: boolean;
  /** Enable activity tracking (default: true) */
  enableActivityTracking: boolean;
  /** Inactivity timeout in milliseconds (default: 15 minutes) */
  inactivityTimeout: number;
  /** Enable performance monitoring (default: true) */
  enableMonitoring: boolean;
}

export interface SessionTimeoutState {
  /** Current session status */
  status: 'active' | 'warning' | 'final-warning' | 'expired' | 'extended';
  /** Time remaining until timeout in milliseconds */
  timeRemaining: number;
  /** Session start timestamp */
  sessionStart: number;
  /** Last activity timestamp */
  lastActivity: number;
  /** Number of warnings shown */
  warningsShown: number;
  /** Number of extensions granted */
  extensionsGranted: number;
  /** Maximum extensions allowed */
  maxExtensions: number;
}

export interface SessionTimeoutEvents {
  /** Fired when warning is shown */
  onWarning?: (timeRemaining: number) => void;
  /** Fired when final warning is shown */
  onFinalWarning?: (timeRemaining: number) => void;
  /** Fired when session expires */
  onTimeout?: () => void;
  /** Fired when session is extended */
  onExtended?: (newExpiryTime: number) => void;
  /** Fired when session state changes */
  onStateChange?: (state: SessionTimeoutState) => void;
  /** Fired on user activity */
  onActivity?: (activityType: string) => void;
}

export interface SessionTimeoutMetrics {
  /** Total session duration */
  totalSessionTime: number;
  /** Active time (user interaction) */
  activeTime: number;
  /** Idle time (no interaction) */
  idleTime: number;
  /** Number of timeouts occurred */
  timeoutCount: number;
  /** Number of extensions granted */
  extensionCount: number;
  /** Average session length */
  averageSessionLength: number;
  /** Session abandonment rate */
  abandonmentRate: number;
}

export class SessionTimeoutManager {
  private config: SessionTimeoutConfig;
  private readonly events: SessionTimeoutEvents;
  private state: SessionTimeoutState;
  private readonly timers: Map<string, NodeJS.Timeout> = new Map();
  private readonly metrics: SessionTimeoutMetrics;
  private isDestroyed = false;
  private activityListeners: (() => void)[] = [];

  constructor(config: Partial<SessionTimeoutConfig> = {}, events: SessionTimeoutEvents = {}) {
    this.config = {
      sessionDuration: 30 * 60 * 1000, // 30 minutes
      warningTime: 5 * 60 * 1000, // 5 minutes
      finalWarningTime: 60 * 1000, // 1 minute
      gracePeriod: 30 * 1000, // 30 seconds
      enableCrossTabSync: true,
      enableActivityTracking: true,
      inactivityTimeout: 15 * 60 * 1000, // 15 minutes
      enableMonitoring: true,
      maxExtensions: 3,
      ...config
    };

    this.events = events;

    this.state = {
      status: 'active',
      timeRemaining: this.config.sessionDuration,
      sessionStart: Date.now(),
      lastActivity: Date.now(),
      warningsShown: 0,
      extensionsGranted: 0,
      maxExtensions: this.config.maxExtensions
    };

    this.metrics = {
      totalSessionTime: 0,
      activeTime: 0,
      idleTime: 0,
      timeoutCount: 0,
      extensionCount: 0,
      averageSessionLength: 0,
      abandonmentRate: 0
    };

    this.initialize();
  }

  private initialize(): void {
    if (this.config.enableCrossTabSync) {
      this.setupCrossTabSync();
    }

    if (this.config.enableActivityTracking) {
      this.setupActivityTracking();
    }

    this.startSessionMonitoring();
    this.updateMetrics();
  }

  private setupCrossTabSync(): void {
    if (typeof window === 'undefined') return;

    // Listen for storage events from other tabs
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'session-timeout-sync') {
        const data = JSON.parse(event.newValue || '{}');
        if (data.action === 'extend') {
          this.extendSession();
        } else if (data.action === 'timeout') {
          this.handleTimeout();
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);
  }

  private setupActivityTracking(): void {
    if (typeof document === 'undefined') return;

    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
    ];

    const handleActivity = (event: Event) => {
      this.recordActivity(event.type);
    };

    activityEvents.forEach(eventType => {
      document.addEventListener(eventType, handleActivity, { passive: true });
      this.activityListeners.push(() => {
        document.removeEventListener(eventType, handleActivity);
      });
    });

    // Track visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        this.recordActivity('page-hidden');
      } else {
        this.recordActivity('page-visible');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    this.activityListeners.push(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
  }

  private recordActivity(activityType: string): void {
    const now = Date.now();
    const timeSinceLastActivity = now - this.state.lastActivity;

    // Update metrics
    if (timeSinceLastActivity > 1000) { // Only count significant gaps
      this.metrics.idleTime += timeSinceLastActivity;
    } else {
      this.metrics.activeTime += timeSinceLastActivity;
    }

    this.state.lastActivity = now;

    // Reset inactivity timer
    this.resetInactivityTimer();

    // Notify listeners
    this.events.onActivity?.(activityType);

    // Sync across tabs
    if (this.config.enableCrossTabSync) {
      this.syncActivity(activityType);
    }
  }

  private syncActivity(activityType: string): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem('session-activity', JSON.stringify({
        timestamp: Date.now(),
        activityType,
        tabId: this.getTabId()
      }));
    } catch (error) {
      console.warn('Failed to sync activity:', error);
    }
  }

  private getTabId(): string {
    if (typeof sessionStorage === 'undefined') return 'unknown';

    let tabId = sessionStorage.getItem('tab-id');
    if (!tabId) {
      tabId = `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('tab-id', tabId);
    }
    return tabId;
  }

  private startSessionMonitoring(): void {
    // Clear existing timers
    this.clearAllTimers();

    // Main session timer
    this.timers.set('session', setTimeout(() => {
      this.handleTimeout();
    }, this.config.sessionDuration));

    // Warning timer
    this.timers.set('warning', setTimeout(() => {
      this.showWarning();
    }, this.config.sessionDuration - this.config.warningTime));

    // Final warning timer
    this.timers.set('final-warning', setTimeout(() => {
      this.showFinalWarning();
    }, this.config.sessionDuration - this.config.finalWarningTime));

    // Inactivity timer
    this.resetInactivityTimer();

    // Update timer
    this.timers.set('update', setInterval(() => {
      this.updateSessionState();
    }, 1000)); // Update every second
  }

  private resetInactivityTimer(): void {
    const existingTimer = this.timers.get('inactivity');
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    this.timers.set('inactivity', setTimeout(() => {
      this.handleInactivityTimeout();
    }, this.config.inactivityTimeout));
  }

  private handleInactivityTimeout(): void {
    this.events.onTimeout?.();
    this.metrics.timeoutCount++;
    this.updateMetrics();
  }

  private updateSessionState(): void {
    if (this.isDestroyed) return;

    const now = Date.now();
    const elapsed = now - this.state.sessionStart;
    this.state.timeRemaining = Math.max(0, this.config.sessionDuration - elapsed);

    // Check for state changes
    if (this.state.timeRemaining <= 0 && this.state.status !== 'expired') {
      this.handleTimeout();
    } else if (this.state.timeRemaining <= this.config.finalWarningTime && this.state.status !== 'final-warning') {
      this.showFinalWarning();
    } else if (this.state.timeRemaining <= this.config.warningTime && this.state.status !== 'warning') {
      this.showWarning();
    }

    // Notify state change
    this.events.onStateChange?.({ ...this.state });
  }

  private showWarning(): void {
    if (this.state.status === 'warning') return;

    this.state.status = 'warning';
    this.state.warningsShown++;
    this.events.onWarning?.(this.state.timeRemaining);
  }

  private showFinalWarning(): void {
    if (this.state.status === 'final-warning') return;

    this.state.status = 'final-warning';
    this.state.warningsShown++;
    this.events.onFinalWarning?.(this.state.timeRemaining);
  }

  private handleTimeout(): void {
    if (this.state.status === 'expired') return;

    this.state.status = 'expired';
    this.metrics.timeoutCount++;
    this.events.onTimeout?.();
    this.updateMetrics();

    // Sync timeout across tabs
    if (this.config.enableCrossTabSync) {
      this.syncTimeout();
    }
  }

  private syncTimeout(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem('session-timeout-sync', JSON.stringify({
        action: 'timeout',
        timestamp: Date.now(),
        tabId: this.getTabId()
      }));
    } catch (error) {
      console.warn('Failed to sync timeout:', error);
    }
  }

  private syncExtension(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem('session-timeout-sync', JSON.stringify({
        action: 'extend',
        timestamp: Date.now(),
        tabId: this.getTabId()
      }));
    } catch (error) {
      console.warn('Failed to sync extension:', error);
    }
  }

  private clearAllTimers(): void {
    this.timers.forEach((timer) => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    this.timers.clear();
  }

  private updateMetrics(): void {
    if (!this.config.enableMonitoring) return;

    const now = Date.now();
    const sessionDuration = now - this.state.sessionStart;

    this.metrics.totalSessionTime = sessionDuration;
    this.metrics.extensionCount = this.state.extensionsGranted;

    // Calculate abandonment rate (sessions that end without extension)
    // This would typically be calculated across multiple sessions
    this.metrics.abandonmentRate = this.metrics.timeoutCount / Math.max(1, this.metrics.timeoutCount + this.metrics.extensionCount);

    // Update average session length
    // This would typically be calculated across multiple sessions
    this.metrics.averageSessionLength = sessionDuration;
  }

  /**
   * Extend the current session
   * @param extensionTime Optional custom extension time in milliseconds
   * @returns boolean indicating if extension was granted
   */
  public extendSession(extensionTime?: number): boolean {
    if (this.state.status === 'expired') {
      return false;
    }

    if (this.state.extensionsGranted >= this.state.maxExtensions) {
      return false;
    }

    const extensionDuration = extensionTime || this.config.sessionDuration;
    const now = Date.now();

    // Update state
    this.state.status = 'extended';
    this.state.extensionsGranted++;
    this.state.timeRemaining = extensionDuration;
    this.state.sessionStart = now;
    this.state.lastActivity = now;

    // Update metrics
    this.metrics.extensionCount++;
    this.updateMetrics();

    // Restart monitoring with new session
    this.startSessionMonitoring();

    // Notify listeners
    this.events.onExtended?.(now + extensionDuration);
    this.events.onStateChange?.({ ...this.state });

    // Sync extension across tabs
    if (this.config.enableCrossTabSync) {
      this.syncExtension();
    }

    return true;
  }

  /**
   * Get current session state
   */
  public getState(): SessionTimeoutState {
    return { ...this.state };
  }

  /**
   * Get current metrics
   */
  public getMetrics(): SessionTimeoutMetrics {
    return { ...this.metrics };
  }

  /**
   * Get current configuration
   */
  public getConfig(): SessionTimeoutConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<SessionTimeoutConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.startSessionMonitoring();
  }

  /**
   * Reset session to initial state
   */
  public resetSession(): void {
    this.state = {
      status: 'active',
      timeRemaining: this.config.sessionDuration,
      sessionStart: Date.now(),
      lastActivity: Date.now(),
      warningsShown: 0,
      extensionsGranted: 0,
      maxExtensions: this.config.maxExtensions
    };

    this.startSessionMonitoring();
    this.events.onStateChange?.({ ...this.state });
  }

  /**
   * Check if session can be extended
   */
  public canExtend(): boolean {
    return this.state.status !== 'expired' &&
           this.state.extensionsGranted < this.state.maxExtensions;
  }

  /**
   * Get remaining extensions count
   */
  public getRemainingExtensions(): number {
    return Math.max(0, this.state.maxExtensions - this.state.extensionsGranted);
  }

  /**
   * Destroy the session manager and clean up resources
   */
  public destroy(): void {
    if (this.isDestroyed) return;

    this.isDestroyed = true;
    this.clearAllTimers();

    // Remove activity listeners
    this.activityListeners.forEach(cleanup => cleanup());
    this.activityListeners = [];

    // Clear storage items
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('session-timeout-sync');
        localStorage.removeItem('session-activity');
      } catch (error) {
        console.warn('Failed to clear storage:', error);
      }
    }
  }
}

/**
 * Factory function to create a session timeout manager
 */
export function createSessionTimeoutManager(
  config?: Partial<SessionTimeoutConfig>,
  events?: SessionTimeoutEvents
): SessionTimeoutManager {
  return new SessionTimeoutManager(config, events);
}
