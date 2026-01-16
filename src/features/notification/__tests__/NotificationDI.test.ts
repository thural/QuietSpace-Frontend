/**
 * Notification DI Test.
 * 
 * Test to verify dependency injection works correctly.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { NotificationDIContainer } from '../di/NotificationDIContainer';
import { getNotificationConfig } from '../di/NotificationDIConfig';

describe('Notification DI Test', () => {
    let diContainer: NotificationDIContainer;

    beforeEach(() => {
        const config = getNotificationConfig();
        diContainer = new NotificationDIContainer(config);
    });

    it('should create DI container successfully', () => {
        expect(diContainer).toBeDefined();
        expect(diContainer).toBeInstanceOf(NotificationDIContainer);
    });

    it('should provide notification repository', () => {
        const repository = diContainer.getNotificationRepository();
        expect(repository).toBeDefined();
        expect(repository).toHaveProperty('getNotifications');
        expect(repository).toHaveProperty('markNotificationAsSeen');
        expect(repository).toHaveProperty('getPendingNotificationsCount');
    });

    it('should use mock repository in test environment', () => {
        const config = diContainer.getConfig();
        expect(config.useMockRepositories).toBe(true);
    });

    it('should provide configuration', () => {
        const config = diContainer.getConfig();
        expect(config).toBeDefined();
        expect(typeof config.useMockRepositories).toBe('boolean');
        expect(typeof config.enableLogging).toBe('boolean');
    });

    it('should allow configuration updates', () => {
        diContainer.updateConfig({ useMockRepositories: false });
        const config = diContainer.getConfig();
        expect(config.useMockRepositories).toBe(false);
    });
});
