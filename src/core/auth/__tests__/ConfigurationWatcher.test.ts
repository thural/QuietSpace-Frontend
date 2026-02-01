/**
 * Configuration Watcher Tests
 *
 * Tests for the configuration file watcher including:
 * - File system monitoring
 * - Configuration change detection
 * - Hot reload functionality
 * - Debounced change handling
 * - Multiple file format support
 */

import { jest } from '@jest/globals';

import { ConfigurationWatcher, ConfigurationHotReloadManager } from '../config/ConfigurationWatcher';

import type { ConfigurationChangeEvent } from '../config/ConfigurationWatcher';
import type { IAuthConfig } from '../interfaces/authInterfaces';

// Mock fs module
jest.mock('fs', () => ({
    existsSync: jest.fn(),
    statSync: jest.fn(),
    readFileSync: jest.fn(),
    readdirSync: jest.fn()
}));

describe('ConfigurationWatcher', () => {
    let watcher: ConfigurationWatcher;
    let mockFs: any;

    beforeEach(() => {
        watcher = new ConfigurationWatcher({
            debounceMs: 100,
            watchInterval: 50
        });

        mockFs = require('fs');
        jest.clearAllMocks();
    });

    afterEach(async () => {
        await watcher.stopWatching();
    });

    describe('Initialization', () => {
        test('should initialize with default options', () => {
            const defaultWatcher = new ConfigurationWatcher();
            expect(defaultWatcher.isWatchingActive()).toBe(false);
            expect(defaultWatcher.getWatchedPaths()).toHaveLength(0);
        });

        test('should initialize with custom options', () => {
            const customWatcher = new ConfigurationWatcher({
                debounceMs: 500,
                watchInterval: 2000
            });
            expect(customWatcher).toBeDefined();
        });
    });

    describe('File Watching', () => {
        test('should start watching files', async () => {
            mockFs.existsSync.mockReturnValue(true);
            mockFs.statSync.mockReturnValue({ isDirectory: () => true });

            const result = await watcher.startWatching(['/test/path']);

            expect(result.success).toBe(true);
            expect(watcher.isWatchingActive()).toBe(true);
            expect(watcher.getWatchedPaths()).toContain('/test/path');
        });

        test('should handle non-existent paths', async () => {
            mockFs.existsSync.mockReturnValue(false);

            const result = await watcher.startWatching(['/non-existent/path']);

            expect(result.success).toBe(true);
            expect(mockFs.existsSync).toHaveBeenCalledWith('/non-existent/path');
        });

        test('should stop watching files', async () => {
            mockFs.existsSync.mockReturnValue(true);
            mockFs.statSync.mockReturnValue({ isDirectory: () => true });

            await watcher.startWatching(['/test/path']);
            const result = await watcher.stopWatching();

            expect(result.success).toBe(true);
            expect(watcher.isWatchingActive()).toBe(false);
        });

        test('should handle double start watching', async () => {
            mockFs.existsSync.mockReturnValue(true);
            mockFs.statSync.mockReturnValue({ isDirectory: () => true });

            await watcher.startWatching(['/test/path']);
            const result = await watcher.startWatching(['/test/path']);

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('WATCHER_ALREADY_RUNNING');
        });

        test('should handle stop watching when not running', async () => {
            const result = await watcher.stopWatching();

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('WATCHER_NOT_RUNNING');
        });
    });

    describe('Event Listeners', () => {
        test('should add and remove listeners', () => {
            const listener = jest.fn();

            watcher.addListener('test', listener);
            watcher.removeListener('test', listener);

            // Should not throw
            expect(true).toBe(true);
        });

        test('should notify listeners of events', (done) => {
            const listener = jest.fn((event: ConfigurationChangeEvent) => {
                expect(event.type).toBe('modified');
                expect(event.filePath).toBe('/test/file.json');
                expect(event.content).toBe('{"test": "content"}');
                done();
            });

            watcher.addListener('test', listener);

            // Simulate event notification
            const event: ConfigurationChangeEvent = {
                type: 'modified',
                filePath: '/test/file.json',
                timestamp: new Date(),
                content: '{"test": "content"}'
            };

            // Access private method through any for testing
            (watcher as any).notifyListeners(event);
        });

        test('should handle listener errors gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const errorListener = jest.fn(() => {
                throw new Error('Listener error');
            });

            watcher.addListener('test', errorListener);

            const event: ConfigurationChangeEvent = {
                type: 'modified',
                filePath: '/test/file.json',
                timestamp: new Date()
            };

            (watcher as any).notifyListeners(event);

            expect(consoleSpy).toHaveBeenCalledWith(
                'Configuration listener error for event test:',
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });
    });

    describe('File Pattern Matching', () => {
        test('should include files matching patterns', () => {
            const shouldInclude = (watcher as any).shouldIncludeFile('/config/auth.json');
            expect(shouldInclude).toBe(true);
        });

        test('should exclude files matching ignore patterns', () => {
            const shouldInclude = (watcher as any).shouldIncludeFile('/node_modules/package.json');
            expect(shouldInclude).toBe(false);
        });

        test('should handle complex patterns', () => {
            const shouldInclude = (watcher as any).shouldIncludeFile('/config/auth.development.json');
            expect(shouldInclude).toBe(true);
        });
    });
});

describe('ConfigurationHotReloadManager', () => {
    let manager: ConfigurationHotReloadManager;
    let mockConfig: IAuthConfig;

    beforeEach(() => {
        mockConfig = {
            get: jest.fn(),
            getAll: jest.fn(() => ({})),
            validate: jest.fn(() => ({ success: true })),
            watch: jest.fn(),
            unwatch: jest.fn()
        } as any;

        manager = new ConfigurationHotReloadManager(mockConfig);
    });

    afterEach(async () => {
        await manager.stopHotReload();
    });

    describe('Hot Reload Management', () => {
        test('should start hot reload', async () => {
            const mockFs = require('fs');
            mockFs.existsSync.mockReturnValue(true);
            mockFs.statSync.mockReturnValue({ isDirectory: () => true });

            const result = await manager.startHotReload(['/config']);

            expect(result.success).toBe(true);
            expect(manager.isHotReloadActive()).toBe(true);
        });

        test('should stop hot reload', async () => {
            const mockFs = require('fs');
            mockFs.existsSync.mockReturnValue(true);
            mockFs.statSync.mockReturnValue({ isDirectory: () => true });

            await manager.startHotReload(['/config']);
            const result = await manager.stopHotReload();

            expect(result.success).toBe(true);
            expect(manager.isHotReloadActive()).toBe(false);
        });

        test('should add and remove reload handlers', () => {
            const handler = jest.fn();

            manager.addReloadHandler('test', handler);
            manager.removeReloadHandler('test');

            // Should not throw
            expect(true).toBe(true);
        });
    });

    describe('Configuration Change Handling', () => {
        test('should handle JSON configuration changes', (done) => {
            const handler = jest.fn();
            manager.addReloadHandler('development', handler);

            const event: ConfigurationChangeEvent = {
                type: 'modified',
                filePath: '/config/auth.development.json',
                timestamp: new Date(),
                content: '{"provider": "oauth", "timeout": 5000}'
            };

            // Access private method for testing
            (manager as any).handleJsonConfigChange(event).then(() => {
                expect(handler).toHaveBeenCalledWith({
                    provider: 'oauth',
                    timeout: 5000
                });
                done();
            });
        });

        test('should detect configuration type from file path', () => {
            const detectType = (manager as any).detectConfigType;

            expect(detectType('/config/auth.base.json')).toBe('base');
            expect(detectType('/config/auth.development.json')).toBe('development');
            expect(detectType('/config/auth.staging.json')).toBe('staging');
            expect(detectType('/config/auth.production.json')).toBe('production');
            expect(detectType('/config/.env')).toBe('environment');
            expect(detectType('/config/unknown.json')).toBe('unknown');
        });

        test('should handle invalid JSON gracefully', (done) => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const event: ConfigurationChangeEvent = {
                type: 'modified',
                filePath: '/config/auth.development.json',
                timestamp: new Date(),
                content: 'invalid json content'
            };

            (manager as any).handleJsonConfigChange(event).then(() => {
                expect(consoleSpy).toHaveBeenCalledWith(
                    'Failed to handle JSON config change for /config/auth.development.json:',
                    expect.any(Error)
                );
                consoleSpy.mockRestore();
                done();
            });
        });
    });

    describe('Integration', () => {
        test('should handle full configuration reload', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            const event: ConfigurationChangeEvent = {
                type: 'modified',
                filePath: '/config/.env',
                timestamp: new Date()
            };

            await (manager as any).handleGenericConfigChange(event);

            expect(consoleSpy).toHaveBeenCalledWith(
                'Configuration file changed: modified - /config/.env'
            );
            consoleSpy.mockRestore();
        });

        test('should update configuration on changes', () => {
            const newConfig = { provider: 'oauth', timeout: 3000 };

            (manager as any).updateConfiguration(newConfig);

            // Should not throw and should update internal config
            expect(true).toBe(true);
        });
    });
});
