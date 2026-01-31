/**
 * Configuration Watcher
 * 
 * Provides file watching capabilities for configuration hot reload
 * 
 * Features:
 * - File system monitoring for configuration changes
 * - Runtime configuration updates
 * - Graceful session handling during config changes
 * - Debounced change detection
 * - Multiple file format support
 */

/**
 * Configuration change event
 */
export class ConfigurationChangeEvent {
    /** @type {'added'|'modified'|'removed'} */
    type;
    /** @type {string} */
    filePath;
    /** @type {Date} */
    timestamp;
    /** @type {string|undefined} */
    content;

    /**
     * @param {Object} data 
     */
    constructor(data) {
        this.type = data.type;
        this.filePath = data.filePath;
        this.timestamp = data.timestamp;
        this.content = data.content;
    }
}

/**
 * Configuration watcher options
 */
export class ConfigurationWatcherOptions {
    /** @type {number|undefined} */
    debounceMs;
    /** @type {number|undefined} */
    watchInterval;
    /** @type {string[]|undefined} */
    ignorePatterns;
    /** @type {string[]|undefined} */
    includePatterns;

    /**
     * @param {Object} options 
     */
    constructor(options = {}) {
        this.debounceMs = options.debounceMs;
        this.watchInterval = options.watchInterval;
        this.ignorePatterns = options.ignorePatterns;
        this.includePatterns = options.includePatterns;
    }
}

/**
 * Configuration change listener
 * @typedef {Function} ConfigurationChangeListener
 * @param {ConfigurationChangeEvent} event
 * @returns {Promise<void>|void}
 */

/**
 * Configuration Watcher Implementation
 */
export class ConfigurationWatcher {
    /** @type {Map} */
    #watchers = new Map();
    /** @type {Map} */
    #listeners = new Map();
    /** @type {ConfigurationWatcherOptions} */
    #options;
    /** @type {boolean} */
    #isWatching = false;
    /** @type {number|null} */
    #watchIntervalId = null;
    /** @type {Map} */
    #debounceTimers = new Map();

    constructor(options = {}) {
        this.#options = new ConfigurationWatcherOptions({
            debounceMs: 300,
            watchInterval: 1000,
            ignorePatterns: [
                '**/node_modules/**',
                '**/.git/**',
                '**/dist/**',
                '**/build/**',
                '**/*.log',
                '**/*.tmp'
            ],
            includePatterns: [
                '**/*.json',
                '**/*.js',
                '**/*.ts',
                '**/*.env',
                '**/*.config'
            ],
            ...options
        });
    }

    /**
     * Starts watching configuration files
     * @param {string[]} watchPaths 
     * @returns {Promise<Object>} Result
     */
    async startWatching(watchPaths) {
        try {
            if (this.#isWatching) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: 'Configuration watcher is already active',
                        code: 'WATCHER_ALREADY_ACTIVE'
                    }
                };
            }

            // Validate watch paths
            if (!Array.isArray(watchPaths) || watchPaths.length === 0) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: 'Watch paths must be a non-empty array',
                        code: 'INVALID_WATCH_PATHS'
                    }
                };
            }

            // Initialize watchers for each path
            for (const path of watchPaths) {
                this.#watchers.set(path, {
                    lastModified: null,
                    content: null,
                    isActive: true
                });
            }

            this.#isWatching = true;

            // Start watching interval
            this.#watchIntervalId = setInterval(() => {
                this.#checkForChanges(watchPaths);
            }, this.#options.watchInterval);

            console.log('Configuration watcher started for paths:', watchPaths);
            
            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Failed to start configuration watcher: ${error.message}`,
                    code: 'WATCHER_START_ERROR'
                }
            };
        }
    }

    /**
     * Stops watching configuration files
     * @returns {Object} Result
     */
    stopWatching() {
        try {
            if (!this.#isWatching) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: 'Configuration watcher is not active',
                        code: 'WATCHER_NOT_ACTIVE'
                    }
                };
            }

            // Clear interval
            if (this.#watchIntervalId) {
                clearInterval(this.#watchIntervalId);
                this.#watchIntervalId = null;
            }

            // Clear debounce timers
            for (const timer of this.#debounceTimers.values()) {
                clearTimeout(timer);
            }
            this.#debounceTimers.clear();

            // Clear watchers
            this.#watchers.clear();
            this.#isWatching = false;

            console.log('Configuration watcher stopped');
            
            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Failed to stop configuration watcher: ${error.message}`,
                    code: 'WATCHER_STOP_ERROR'
                }
            };
        }
    }

    /**
     * Adds configuration change listener
     * @param {string} filePath 
     * @param {ConfigurationChangeListener} listener 
     * @returns {Function} Remove listener function
     */
    addListener(filePath, listener) {
        if (!this.#listeners.has(filePath)) {
            this.#listeners.set(filePath, []);
        }
        
        this.#listeners.get(filePath).push(listener);
        
        // Return remove function
        return () => {
            const listeners = this.#listeners.get(filePath);
            if (listeners) {
                const index = listeners.indexOf(listener);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            }
        };
    }

    /**
     * Removes configuration change listener
     * @param {string} filePath 
     * @param {ConfigurationChangeListener} listener 
     * @returns {boolean} True if listener was removed
     */
    removeListener(filePath, listener) {
        const listeners = this.#listeners.get(filePath);
        if (!listeners) return false;
        
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
            return true;
        }
        
        return false;
    }

    /**
     * Gets watcher status
     * @returns {boolean} True if watching
     */
    isWatching() {
        return this.#isWatching;
    }

    /**
     * Gets watched paths
     * @returns {string[]} Array of watched paths
     */
    getWatchedPaths() {
        return Array.from(this.#watchers.keys());
    }

    /**
     * Manually triggers configuration check
     * @returns {Promise<void>}
     */
    async checkNow() {
        if (!this.#isWatching) {
            return;
        }

        const watchPaths = Array.from(this.#watchers.keys());
        await this.#checkForChanges(watchPaths);
    }

    /**
     * Checks for file changes
     * @param {string[]} watchPaths 
     * @returns {Promise<void>}
     * @private
     */
    async #checkForChanges(watchPaths) {
        for (const path of watchPaths) {
            try {
                // Skip if path doesn't match include patterns
                if (!this.#shouldIncludePath(path)) {
                    continue;
                }

                // Check if file exists and get stats
                const stats = await this.#getFileStats(path);
                if (!stats) {
                    // File was removed
                    await this.#handleFileChange(path, 'removed');
                    continue;
                }

                const lastModified = stats.mtime.getTime();
                const watcher = this.#watchers.get(path);

                if (!watcher) {
                    // New file
                    this.#watchers.set(path, {
                        lastModified,
                        content: null,
                        isActive: true
                    });
                    await this.#handleFileChange(path, 'added');
                } else if (lastModified !== watcher.lastModified) {
                    // File was modified
                    await this.#handleFileChange(path, 'modified');
                    watcher.lastModified = lastModified;
                }
            } catch (error) {
                console.error(`Error checking file ${path}:`, error);
            }
        }
    }

    /**
     * Handles file change event
     * @param {string} filePath 
     * @param {'added'|'modified'|'removed'} type 
     * @returns {Promise<void>}
     * @private
     */
    async #handleFileChange(filePath, type) {
        try {
            let content;
            
            if (type !== 'removed') {
                content = await this.#readFileContent(filePath);
            }

            const event = new ConfigurationChangeEvent({
                type,
                filePath,
                timestamp: new Date(),
                content
            });

            // Debounce the event
            this.#debounceEvent(filePath, event);
        } catch (error) {
            console.error(`Error handling file change for ${filePath}:`, error);
        }
    }

    /**
     * Debounces file change events
     * @param {string} filePath 
     * @param {ConfigurationChangeEvent} event 
     * @returns {void}
     * @private
     */
    #debounceEvent(filePath, event) {
        // Clear existing timer
        const existingTimer = this.#debounceTimers.get(filePath);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        // Set new timer
        const timer = setTimeout(() => {
            this.#notifyListeners(filePath, event);
            this.#debounceTimers.delete(filePath);
        }, this.#options.debounceMs);

        this.#debounceTimers.set(filePath, timer);
    }

    /**
     * Notifies listeners of file change
     * @param {string} filePath 
     * @param {ConfigurationChangeEvent} event 
     * @returns {void}
     * @private
     */
    async #notifyListeners(filePath, event) {
        const listeners = this.#listeners.get(filePath);
        if (!listeners) return;

        for (const listener of listeners) {
            try {
                await listener(event);
            } catch (error) {
                console.error(`Error in configuration listener for ${filePath}:`, error);
            }
        }
    }

    /**
     * Checks if path should be included
     * @param {string} path 
     * @returns {boolean} True if should include
     * @private
     */
    #shouldIncludePath(path) {
        // Check ignore patterns
        for (const pattern of this.#options.ignorePatterns || []) {
            if (this.#matchesPattern(path, pattern)) {
                return false;
            }
        }

        // Check include patterns
        for (const pattern of this.#options.includePatterns || []) {
            if (this.#matchesPattern(path, pattern)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if path matches pattern
     * @param {string} path 
     * @param {string} pattern 
     * @returns {boolean} True if matches
     * @private
     */
    #matchesPattern(path, pattern) {
        // Simple glob pattern matching
        const regexPattern = pattern
            .replace(/\*\*/g, '.*')
            .replace(/\?/g, '.');
        
        const regex = new RegExp(regexPattern);
        return regex.test(path);
    }

    /**
     * Gets file stats
     * @param {string} filePath 
     * @returns {Promise<Object|null>} File stats or null
     * @private
     */
    async #getFileStats(filePath) {
        try {
            // In a real implementation, this would use Node.js fs module
            // For demo purposes, return mock stats
            return {
                mtime: new Date(),
                size: 0,
                isFile: true
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Reads file content
     * @param {string} filePath 
     * @returns {Promise<string>} File content
     * @private
     */
    async #readFileContent(filePath) {
        try {
            // In a real implementation, this would use Node.js fs module
            // For demo purposes, return mock content
            return `Mock content for ${filePath}`;
        } catch (error) {
            throw new Error(`Failed to read file ${filePath}: ${error.message}`);
        }
    }
}
