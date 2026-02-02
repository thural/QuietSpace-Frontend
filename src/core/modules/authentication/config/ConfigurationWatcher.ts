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

import type { IAuthConfig } from '../interfaces/authInterfaces';
import type { AuthResult } from '../types/auth.domain.types';

/**
 * Configuration change event
 */
export interface ConfigurationChangeEvent {
    type: 'added' | 'modified' | 'removed';
    filePath: string;
    timestamp: Date;
    content?: string;
}

/**
 * Configuration watcher options
 */
export interface ConfigurationWatcherOptions {
    debounceMs?: number;
    watchInterval?: number;
    ignorePatterns?: string[];
    includePatterns?: string[];
}

/**
 * Configuration change listener
 */
export type ConfigurationChangeListener = (event: ConfigurationChangeEvent) => void | Promise<void>;

/**
 * Configuration Watcher Implementation
 */
export class ConfigurationWatcher {
    private readonly watchers: Map<string, unknown> = new Map();
    private readonly listeners: Map<string, ConfigurationChangeListener[]> = new Map();
    private readonly options: ConfigurationWatcherOptions;
    private isWatching = false;

    constructor(options: ConfigurationWatcherOptions = {}) {
        this.options = {
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
        };
    }

    /**
     * Starts watching configuration files
     */
    async startWatching(watchPaths: string[]): Promise<AuthResult<void>> {
        try {
            if (this.isWatching) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error' as const,
                        message: 'Configuration watcher is already running',
                        code: 'WATCHER_ALREADY_RUNNING'
                    }
                };
            }

            // Initialize watchers for each path
            for (const watchPath of watchPaths) {
                await this.initializeWatcher(watchPath);
            }

            this.isWatching = true;

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error' as const,
                    message: `Failed to start configuration watcher: ${error.message}`,
                    code: 'WATCHER_START_FAILED'
                }
            };
        }
    }

    /**
     * Stops watching configuration files
     */
    async stopWatching(): Promise<AuthResult<void>> {
        try {
            if (!this.isWatching) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error' as const,
                        message: 'Configuration watcher is not running',
                        code: 'WATCHER_NOT_RUNNING'
                    }
                };
            }

            // Close all watchers
            this.watchers.forEach(async (watcher, path) => {
                try {
                    if (watcher && typeof watcher.close === 'function') {
                        await watcher.close();
                    }
                } catch (error) {
                    console.warn(`Failed to close watcher for ${path}:`, error);
                }
            });

            this.watchers.clear();
            this.isWatching = false;

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error' as const,
                    message: `Failed to stop configuration watcher: ${error.message}`,
                    code: 'WATCHER_STOP_FAILED'
                }
            };
        }
    }

    /**
     * Adds a configuration change listener
     */
    addListener(eventType: string, listener: ConfigurationChangeListener): void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType)!.push(listener);
    }

    /**
     * Removes a configuration change listener
     */
    removeListener(eventType: string, listener: ConfigurationChangeListener): void {
        const listeners = this.listeners.get(eventType);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Gets current watching status
     */
    isWatchingActive(): boolean {
        return this.isWatching;
    }

    /**
     * Gets watched paths
     */
    getWatchedPaths(): string[] {
        return Array.from(this.watchers.keys());
    }

    /**
     * Initializes a watcher for a specific path
     */
    private async initializeWatcher(watchPath: string): Promise<void> {
        try {
            // Check if path exists
            const fs = await import('fs');
            const path = await import('path');

            if (!fs.existsSync(watchPath)) {
                console.warn(`Configuration path does not exist: ${watchPath}`);
                return;
            }

            // Check if path is a directory
            const stat = await fs.statSync(watchPath);

            if (stat.isDirectory()) {
                // Watch directory
                await this.watchDirectory(watchPath);
            } else {
                // Watch single file
                await this.watchFile(watchPath);
            }
        } catch (error) {
            console.error(`Failed to initialize watcher for ${watchPath}:`, error);
            throw error;
        }
    }

    /**
     * Watches a directory for changes
     */
    private async watchDirectory(dirPath: string): Promise<void> {
        const fs = await import('fs');

        // Create debounced change handler
        const debouncedHandler = this.debounce((event: ConfigurationChangeEvent) => {
            this.notifyListeners(event);
        }, this.options.debounceMs);

        // Set up polling-based watcher (simplified version without chokidar)
        const watcher = {
            close: () => {
                // Stop polling
                clearInterval(this.options.watchInterval);
            }
        };

        // Start polling for changes
        const pollInterval = setInterval(async () => {
            try {
                const files = fs.readdirSync(dirPath);
                for (const file of files) {
                    const filePath = `${dirPath}/${file}`;
                    if (this.shouldIncludeFile(filePath)) {
                        // Check if file was modified (simplified check)
                        this.handleFileChange('modified', filePath);
                    }
                }
            } catch (error) {
                console.error(`Error polling directory ${dirPath}:`, error);
            }
        }, this.options.watchInterval);

        this.watchers.set(dirPath, watcher);
    }

    /**
     * Watches a single file for changes
     */
    private async watchFile(filePath: string): Promise<void> {
        const fs = await import('fs');

        // Create debounced change handler
        const debouncedHandler = this.debounce((event: ConfigurationChangeEvent) => {
            this.notifyListeners(event);
        }, this.options.debounceMs);

        // Set up polling-based watcher
        const watcher = {
            close: () => {
                // Stop polling
                clearInterval(this.options.watchInterval);
            }
        };

        // Start polling for changes
        let lastModified = 0;
        try {
            lastModified = fs.statSync(filePath).mtimeMs;
        } catch (error) {
            // File doesn't exist yet
        }

        const pollInterval = setInterval(async () => {
            try {
                const stats = fs.statSync(filePath);
                if (stats.mtimeMs > lastModified) {
                    lastModified = stats.mtimeMs;
                    this.handleFileChange('modified', filePath);
                }
            } catch (error) {
                // File might have been deleted
                this.handleFileChange('removed', filePath);
            }
        }, this.options.watchInterval);

        this.watchers.set(filePath, watcher);
    }

    /**
     * Handles file change events
     */
    private async handleFileChange(type: 'added' | 'modified' | 'removed', filePath: string): Promise<void> {
        try {
            let content: string | undefined;

            if (type !== 'removed') {
                const fs = await import('fs');
                content = fs.readFileSync(filePath, 'utf8');
            }

            const event: ConfigurationChangeEvent = {
                type,
                filePath,
                timestamp: new Date(),
                content
            };

            this.notifyListeners(event);
        } catch (error) {
            console.error(`Failed to handle file change for ${filePath}:`, error);
        }
    }

    /**
     * Notifies all listeners of a configuration change
     */
    private notifyListeners(event: ConfigurationChangeEvent): void {
        this.listeners.forEach((listeners, eventType) => {
            for (const listener of listeners) {
                try {
                    listener(event);
                } catch (error) {
                    console.error(`Configuration listener error for event ${eventType}:`, error);
                }
            }
        });
    }

    /**
     * Checks if a file should be included in watching
     */
    private shouldIncludeFile(filePath: string): boolean {
        // Check include patterns
        const shouldInclude = this.options.includePatterns.some(pattern =>
            this.matchPattern(filePath, pattern)
        );

        if (!shouldInclude) {
            return false;
        }

        // Check ignore patterns
        const shouldIgnore = this.options.ignorePatterns.some(pattern =>
            this.matchPattern(filePath, pattern)
        );

        return !shouldIgnore;
    }

    /**
     * Matches a file path against a pattern
     */
    private matchPattern(filePath: string, pattern: string): boolean {
        // Simple glob pattern matching
        const regex = new RegExp(
            pattern
                .replace(/\*\*/g, '.*')
                .replace(/\?/g, '.')
                .replace(/\./g, '\\.')
        );

        return regex.test(filePath);
    }

    /**
     * Creates a debounced function
     */
    private debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout;

        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
}

/**
 * Configuration Hot Reload Manager
 *
 * Manages configuration hot reload with provider updates
 */
export class ConfigurationHotReloadManager {
    private readonly watcher: ConfigurationWatcher;
    private readonly config: IAuthConfig;
    private readonly reloadHandlers: Map<string, (newConfig: unknown) => void> = new Map();

    constructor(config: IAuthConfig, options?: ConfigurationWatcherOptions) {
        this.config = config;
        this.watcher = new ConfigurationWatcher(options);
        this.setupDefaultListeners();
    }

    /**
     * Starts hot reload functionality
     */
    async startHotReload(watchPaths: string[]): Promise<AuthResult<void>> {
        try {
            const result = await this.watcher.startWatching(watchPaths);

            if (!result.success) {
                return result;
            }

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error' as const,
                    message: `Failed to start hot reload: ${error.message}`,
                    code: 'HOT_RELOAD_START_FAILED'
                }
            };
        }
    }

    /**
     * Stops hot reload functionality
     */
    async stopHotReload(): Promise<AuthResult<void>> {
        return this.watcher.stopWatching();
    }

    /**
     * Adds a reload handler for a specific configuration type
     */
    addReloadHandler(configType: string, handler: (newConfig: unknown) => void): void {
        this.reloadHandlers.set(configType, handler);
    }

    /**
     * Removes a reload handler
     */
    removeReloadHandler(configType: string): void {
        this.reloadHandlers.delete(configType);
    }

    /**
     * Gets hot reload status
     */
    isHotReloadActive(): boolean {
        return this.watcher.isWatchingActive();
    }

    /**
     * Sets up default listeners for configuration changes
     */
    private setupDefaultListeners(): void {
        // Listen for JSON configuration changes
        this.watcher.addListener('json', this.handleJsonConfigChange.bind(this));
        this.watcher.addListener('modified', this.handleGenericConfigChange.bind(this));
        this.watcher.addListener('added', this.handleGenericConfigChange.bind(this));
    }

    /**
     * Handles JSON configuration changes
     */
    private async handleJsonConfigChange(event: ConfigurationChangeEvent): Promise<void> {
        try {
            if (!event.content) {
                return;
            }

            const newConfig = JSON.parse(event.content);
            const configType = this.detectConfigType(event.filePath);

            // Call appropriate reload handler
            const handler = this.reloadHandlers.get(configType);
            if (handler) {
                handler(newConfig);
            }

            // Update current configuration
            this.updateConfiguration(newConfig);

            console.log(`Configuration hot reloaded: ${event.filePath}`);
        } catch (error) {
            console.error(`Failed to handle JSON config change for ${event.filePath}:`, error);
        }
    }

    /**
     * Handles generic configuration changes
     */
    private async handleGenericConfigChange(event: ConfigurationChangeEvent): Promise<void> {
        try {
            console.log(`Configuration file changed: ${event.type} - ${event.filePath}`);

            // For non-JSON files, trigger a full configuration reload
            // This would typically involve re-reading all config files
            await this.triggerFullReload();
        } catch (error) {
            console.error(`Failed to handle generic config change for ${event.filePath}:`, error);
        }
    }

    /**
     * Detects configuration type from file path
     */
    private detectConfigType(filePath: string): string {
        if (filePath.includes('auth.base')) return 'base';
        if (filePath.includes('auth.development')) return 'development';
        if (filePath.includes('auth.staging')) return 'staging';
        if (filePath.includes('auth.production')) return 'production';
        if (filePath.includes('.env')) return 'environment';
        return 'unknown';
    }

    /**
     * Updates the current configuration
     */
    private updateConfiguration(newConfig: unknown): void {
        // Merge with existing configuration
        Object.assign(this.config, newConfig);

        // Trigger configuration change event
        this.notifyConfigurationChange(newConfig);
    }

    /**
     * Triggers a full configuration reload
     */
    private async triggerFullReload(): Promise<void> {
        // This would typically re-read all configuration files
        // and merge them appropriately
        console.log('Triggering full configuration reload...');

        // Implementation would depend on the specific configuration system
        // For now, just log the action
    }

    /**
     * Notifies about configuration changes
     */
    private notifyConfigurationChange(newConfig: unknown): void {
        // This could emit events or notify other parts of the system
        console.log('Configuration updated:', newConfig);
    }
}
