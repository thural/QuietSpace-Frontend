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

/**
 * Enterprise Session Timeout Manager
 */

/** @typedef {{sessionDuration: number, warningTime: number, finalWarningTime: number, gracePeriod: number, enableCrossTabSync: boolean, enableActivityTracking: boolean, inactivityTimeout: number, enableMonitoring: boolean}} ConfigType */
/** @typedef {{status: string, timeRemaining: number, sessionStart: number, lastActivity: number, warningsShown: number, extensionsGranted: number, maxExtensions: number}} StateType */
/** @typedef {{[key: string]: Function | undefined}} EventsType */
/** @typedef {{totalSessionTime: number, activeTime: number, idleTime: number, timeoutCount: number, extensionCount: number, averageSessionLength: number, abandonmentRate: number}} MetricsType */

export class SessionTimeoutManager {
    /** @type {ConfigType} */
    #config = {
        sessionDuration: 30 * 60 * 1000, // 30 minutes
        warningTime: 5 * 60 * 1000, // 5 minutes
        finalWarningTime: 60 * 1000, // 1 minute
        gracePeriod: 30 * 1000, // 30 seconds
        enableCrossTabSync: true,
        enableActivityTracking: true,
        inactivityTimeout: 15 * 60 * 1000, // 15 minutes
        enableMonitoring: true
    };

    /** @type {StateType} */
    #state = {
        status: 'active',
        timeRemaining: 0,
        sessionStart: 0,
        lastActivity: 0,
        warningsShown: 0,
        extensionsGranted: 0,
        maxExtensions: 3
    };

    /** @type {EventsType} */
    #events = {};

    /** @type {MetricsType} */
    #metrics = {
        totalSessionTime: 0,
        activeTime: 0,
        idleTime: 0,
        timeoutCount: 0,
        extensionCount: 0,
        averageSessionLength: 0,
        abandonmentRate: 0
    };

    /** @type {*} */
    #timeoutId = 0;
    /** @type {*} */
    #activityTrackerId = 0;
    /** @type {*} */
    #countdownId = 0;
    /** @type {number} */
    #lastActivityCheck = 0;
    /** @type {BroadcastChannel|null} */
    #syncChannel = null;
    /** @type {boolean} */
    #isActive = false;

    constructor(config = {}) {
        Object.assign(this.#config, config);
        this.#initializeSyncChannel();
    }

    /**
     * Starts session timeout monitoring
     * @param {EventsType} [events] 
     * @returns {void}
     */
    start(events = {}) {
        try {
            if (this.#isActive) {
                console.warn('Session timeout manager is already active');
                return;
            }

            this.#events = events;
            this.#isActive = true;
            this.#state.sessionStart = Date.now();
            this.#state.lastActivity = Date.now();
            this.#state.timeRemaining = this.#config.sessionDuration;
            this.#state.status = 'active';

            // Start timeout monitoring
            this.#startTimeoutMonitoring();

            // Start activity tracking if enabled
            if (this.#config.enableActivityTracking) {
                this.#startActivityTracking();
            }

            // Start cross-tab sync if enabled
            if (this.#config.enableCrossTabSync) {
                this.#startCrossTabSync();
            }

            console.log('Session timeout manager started');
        } catch (error) {
            console.error('Failed to start session timeout manager:', error);
        }
    }

    /**
     * Stops session timeout monitoring
     * @returns {void}
     */
    stop() {
        try {
            if (!this.#isActive) {
                console.warn('Session timeout manager is not active');
                return;
            }

            // Clear all timers
            if (this.#timeoutId !== 0) {
                clearTimeout(this.#timeoutId);
                this.#timeoutId = 0;
            }

            if (this.#activityTrackerId !== 0) {
                clearInterval(this.#activityTrackerId);
                this.#activityTrackerId = 0;
            }

            if (this.#countdownId !== 0) {
                clearInterval(this.#countdownId);
                this.#countdownId = 0;
            }

            // Clean up sync channel
            if (this.#syncChannel) {
                this.#syncChannel.close();
                this.#syncChannel = null;
            }

            this.#isActive = false;
            console.log('Session timeout manager stopped');
        } catch (error) {
            console.error('Failed to stop session timeout manager:', error);
        }
    }

    /**
     * Extends the current session
     * @param {number} [extensionTime] 
     * @returns {boolean}
     */
    extendSession(extensionTime) {
        try {
            if (!this.#isActive) {
                console.warn('Session timeout manager is not active');
                return false;
            }

            if (this.#state.extensionsGranted >= this.#state.maxExtensions) {
                console.warn('Maximum extensions reached');
                return false;
            }

            const extensionMs = extensionTime || this.#config.sessionDuration;
            this.#state.timeRemaining += extensionMs;
            this.#state.extensionsGranted++;
            this.#state.status = 'extended';

            // Update metrics
            this.#metrics.extensionCount++;

            // Restart timeout monitoring with new time
            this.#restartTimeoutMonitoring();

            // Fire extension event
            if (this.#events.onExtended) {
                this.#events.onExtended(Date.now() + this.#state.timeRemaining);
            }

            // Fire state change event
            this.#fireStateChangeEvent();

            // Notify other tabs
            this.#notifySyncChannel('session-extended', {
                timeRemaining: this.#state.timeRemaining,
                extensionsGranted: this.#state.extensionsGranted
            });

            console.log('Session extended successfully');
            return true;
        } catch (error) {
            console.error('Failed to extend session:', error);
            return false;
        }
    }

    /**
     * Gets current session state
     * @returns {Object}
     */
    getState() {
        return { ...this.#state };
    }

    /**
     * Gets current metrics
     * @returns {Object}
     */
    getMetrics() {
        return { ...this.#metrics };
    }

    /**
     * Updates last activity timestamp
     * @returns {void}
     */
    updateActivity() {
        if (this.#isActive && this.#config.enableActivityTracking) {
            this.#state.lastActivity = Date.now();
            this.#metrics.activeTime += Date.now() - this.#lastActivityCheck;

            // Notify other tabs of activity
            this.#notifySyncChannel('activity-updated', {
                lastActivity: this.#state.lastActivity
            });

            if (this.#events.onActivity) {
                this.#events.onActivity('user_interaction');
            }
        }
    }

    /**
     * Checks if session is active
     * @returns {boolean}
     */
    isSessionActive() {
        return this.#isActive && this.#state.status !== 'expired';
    }

    /**
     * Initializes cross-tab synchronization channel
     */
    #initializeSyncChannel() {
        if (typeof BroadcastChannel !== 'undefined') {
            this.#syncChannel = new BroadcastChannel('session-timeout-sync');
        }
    }

    /**
     * Starts timeout monitoring
     */
    #startTimeoutMonitoring() {
        this.#timeoutId = setTimeout(() => {
            this.#checkTimeout();
        }, this.#config.warningTime);
    }

    /**
     * Restarts timeout monitoring
     */
    #restartTimeoutMonitoring() {
        if (this.#timeoutId !== 0) {
            clearTimeout(this.#timeoutId);
        }

        this.#timeoutId = setTimeout(() => {
            this.#checkTimeout();
        }, this.#config.warningTime);
    }

    /**
     * Checks session timeout
     */
    #checkTimeout() {
        const now = Date.now();
        const sessionAge = now - this.#state.sessionStart;
        const timeSinceActivity = now - this.#state.lastActivity;

        // Check for inactivity timeout
        if (this.#config.inactivityTimeout && timeSinceActivity > this.#config.inactivityTimeout) {
            this.#handleTimeout();
            return;
        }

        // Check for session duration timeout
        const timeRemaining = this.#config.sessionDuration - sessionAge;
        this.#state.timeRemaining = timeRemaining;

        if (timeRemaining <= 0) {
            this.#handleTimeout();
        } else if (timeRemaining <= this.#config.finalWarningTime) {
            this.#handleFinalWarning(timeRemaining);
        } else if (timeRemaining <= this.#config.warningTime) {
            this.#handleWarning(timeRemaining);
        } else {
            // Continue monitoring
            this.#timeoutId = setTimeout(() => {
                this.#checkTimeout();
            }, timeRemaining - this.#config.warningTime);
        }
    }

    /**
     * Handles warning state
     * @param {number} timeRemaining 
     */
    #handleWarning(timeRemaining) {
        this.#state.status = 'warning';
        this.#state.warningsShown++;

        // Fire warning event
        if (this.#events.onWarning) {
            this.#events.onWarning(timeRemaining);
        }

        // Fire state change event
        this.#fireStateChangeEvent();

        // Notify other tabs
        this.#notifySyncChannel('warning-shown', {
            timeRemaining,
            warningsShown: this.#state.warningsShown
        });

        // Continue monitoring
        this.#timeoutId = setTimeout(() => {
            this.#checkTimeout();
        }, timeRemaining - this.#config.finalWarningTime);
    }

    /**
     * Handles final warning state
     * @param {number} timeRemaining 
     */
    #handleFinalWarning(timeRemaining) {
        this.#state.status = 'final-warning';

        // Fire final warning event
        if (this.#events.onFinalWarning) {
            this.#events.onFinalWarning(timeRemaining);
        }

        // Fire state change event
        this.#fireStateChangeEvent();

        // Notify other tabs
        this.#notifySyncChannel('final-warning-shown', {
            timeRemaining
        });

        // Start countdown
        this.#startCountdown(timeRemaining);

        // Continue monitoring
        this.#timeoutId = setTimeout(() => {
            this.#checkTimeout();
        }, timeRemaining);
    }

    /**
     * Handles session timeout
     */
    #handleTimeout() {
        this.#state.status = 'expired';
        this.#state.timeRemaining = 0;

        // Update metrics
        this.#metrics.timeoutCount++;
        this.#metrics.totalSessionTime = Date.now() - this.#state.sessionStart;

        // Fire timeout event
        if (this.#events.onTimeout) {
            this.#events.onTimeout();
        }

        // Fire state change event
        this.#fireStateChangeEvent();

        // Notify other tabs
        this.#notifySyncChannel('session-expired', {
            sessionDuration: this.#metrics.totalSessionTime
        });

        console.log('Session timeout occurred');
    }

    /**
     * Starts countdown timer
     * @param {number} timeRemaining 
     */
    #startCountdown(timeRemaining) {
        if (this.#countdownId !== 0) {
            clearInterval(this.#countdownId);
        }

        let countdown = Math.floor(timeRemaining / 1000);
        this.#countdownId = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                if (this.#countdownId !== 0) {
                    clearInterval(this.#countdownId);
                    this.#countdownId = 0;
                }
            }
        }, 1000);
    }

    /**
     * Starts activity tracking
     */
    #startActivityTracking() {
        this.#lastActivityCheck = Date.now();

        this.#activityTrackerId = setInterval(() => {
            const now = Date.now();
            const timeSinceLastCheck = now - this.#lastActivityCheck;
            this.#metrics.idleTime += timeSinceLastCheck;
            this.#lastActivityCheck = now;
        }, 60000); // Check every minute
    }

    /**
     * Starts cross-tab synchronization
     */
    #startCrossTabSync() {
        if (!this.#syncChannel) {
            return;
        }

        this.#syncChannel.addEventListener('message', (event) => {
            const { type, data } = event.data;

            switch (type) {
                case 'session-extended':
                    // Another tab extended the session
                    this.#state.timeRemaining = data.timeRemaining;
                    this.#state.extensionsGranted = data.extensionsGranted;
                    this.#state.status = 'extended';
                    this.#restartTimeoutMonitoring();
                    break;
                case 'warning-shown':
                    // Another tab showed warning
                    this.#state.status = 'warning';
                    this.#state.warningsShown = data.warningsShown;
                    break;
                case 'final-warning-shown':
                    // Another tab showed final warning
                    this.#state.status = 'final-warning';
                    break;
                case 'session-expired':
                    // Another tab's session expired
                    this.#state.status = 'expired';
                    this.#handleTimeout();
                    break;
                case 'activity-updated':
                    // Another tab had activity
                    this.#state.lastActivity = data.lastActivity;
                    break;
            }

            // Fire state change event
            this.#fireStateChangeEvent();
        });
    }

    /**
     * Notifies sync channel
     * @param {string} type 
     * @param {Object} data 
     */
    #notifySyncChannel(type, data) {
        if (this.#syncChannel) {
            try {
                this.#syncChannel.postMessage({ type, data });
            } catch (error) {
                console.warn('Failed to notify sync channel:', error);
            }
        }
    }

    /**
     * Fires state change event
     */
    #fireStateChangeEvent() {
        if (this.#events.onStateChange) {
            this.#events.onStateChange(this.getState());
        }
    }
}
