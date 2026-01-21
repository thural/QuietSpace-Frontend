/**
 * Settings Service Tests.
 * 
 * Tests for Settings service implementations.
 */

import { jest } from '@jest/globals';
import { SettingsService } from '../application/services/SettingsService';
import { MockSettingsRepository } from '../data/repositories/MockSettingsRepository';
import type { ISettingsService } from '../application/services/SettingsService';
import type { ProfileSettingsRequest, UserProfileResponse } from '@/features/profile/data/models/user';
import type { PrivacySettings, NotificationSettings } from '../domain/entities/SettingsEntities';

describe('Settings Service Tests', () => {
    let settingsService: ISettingsService;
    let mockRepository: MockSettingsRepository;
    let testUserId: string;

    beforeEach(() => {
        testUserId = 'test-user-123';
        mockRepository = new MockSettingsRepository('mock-token');
        settingsService = new SettingsService(mockRepository);
    });

    describe('SettingsService', () => {
        it('should initialize with repository', () => {
            expect(settingsService).toBeDefined();
        });

        it('should get profile settings', async () => {
            const result = await settingsService.getProfileSettings(testUserId);
            expect(result).toBeDefined();
            expect(result.id).toBe(testUserId);
        });

        it('should update profile settings with validation', async () => {
            const settings: ProfileSettingsRequest = {
                bio: 'Valid bio update',
                isPrivateAccount: true
            };

            const result = await settingsService.updateProfileSettings(testUserId, settings);
            expect(result).toBeDefined();
            expect(result.bio).toBe('Valid bio update');
        });

        it('should validate settings before update', async () => {
            const invalidSettings = { invalid: 'settings' } as any;

            await expect(settingsService.updateProfileSettings(testUserId, invalidSettings))
                .rejects.toThrow('Invalid settings provided');
        });

        it('should sanitize settings before update', async () => {
            const settings: ProfileSettingsRequest = {
                bio: '   Long bio with spaces   '.repeat(100), // Very long bio
                isPrivateAccount: 'true' as any // String instead of boolean
            };

            const result = await settingsService.updateProfileSettings(testUserId, settings);
            expect(result).toBeDefined();
            expect(result.bio?.length).toBeLessThanOrEqual(500); // Should be truncated
            expect(typeof result.isPrivateAccount).toBe('boolean'); // Should be converted to boolean
        });

        it('should upload profile photo with validation', async () => {
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

            const result = await settingsService.uploadProfilePhoto(testUserId, file);
            expect(result).toBeDefined();
            expect(result.photo).toBeDefined();
        });

        it('should validate photo file', async () => {
            const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });

            await expect(settingsService.uploadProfilePhoto(testUserId, invalidFile))
                .rejects.toThrow('Invalid photo file');
        });

        it('should remove profile photo', async () => {
            const result = await settingsService.removeProfilePhoto(testUserId);
            expect(result).toBeDefined();
            expect(result.photo).toBeNull();
        });

        it('should get privacy settings', async () => {
            const result = await settingsService.getPrivacySettings(testUserId);
            expect(result).toBeDefined();
            expect(typeof result.isPrivateAccount).toBe('boolean');
        });

        it('should update privacy settings with validation', async () => {
            const settings: PrivacySettings = {
                isPrivateAccount: true,
                showEmail: false,
                showPhone: false,
                allowTagging: true,
                allowMentions: true,
                allowDirectMessages: false
            };

            const result = await settingsService.updatePrivacySettings(testUserId, settings);
            expect(result).toBeDefined();
            expect(result.isPrivateAccount).toBe(true);
        });

        it('should validate privacy settings', async () => {
            const invalidSettings = { invalid: true } as any;

            await expect(settingsService.updatePrivacySettings(testUserId, invalidSettings))
                .rejects.toThrow('Invalid privacy settings provided');
        });

        it('should get notification settings', async () => {
            const result = await settingsService.getNotificationSettings(testUserId);
            expect(result).toBeDefined();
            expect(typeof result.emailNotifications).toBe('boolean');
        });

        it('should update notification settings with validation', async () => {
            const settings: NotificationSettings = {
                emailNotifications: false,
                pushNotifications: true,
                mentionNotifications: true,
                followNotifications: false,
                likeNotifications: true,
                commentNotifications: false,
                messageNotifications: true
            };

            const result = await settingsService.updateNotificationSettings(testUserId, settings);
            expect(result).toBeDefined();
            expect(result.emailNotifications).toBe(false);
        });

        it('should validate notification settings', async () => {
            const invalidSettings = { invalid: true } as any;

            await expect(settingsService.updateNotificationSettings(testUserId, invalidSettings))
                .rejects.toThrow('Invalid notification settings provided');
        });
    });

    describe('Settings Service Interface Compliance', () => {
        it('should implement ISettingsService interface', () => {
            expect(settingsService).toMatchObject({
                getProfileSettings: expect.any(Function),
                updateProfileSettings: expect.any(Function),
                uploadProfilePhoto: expect.any(Function),
                removeProfilePhoto: expect.any(Function),
                getPrivacySettings: expect.any(Function),
                updatePrivacySettings: expect.any(Function),
                getNotificationSettings: expect.any(Function),
                updateNotificationSettings: expect.any(Function),
                validateSettings: expect.any(Function),
                sanitizeSettings: expect.any(Function)
            });
        });

        it('should handle errors gracefully', async () => {
            // Mock repository to throw error
            const errorRepository = {
                getProfileSettings: jest.fn().mockRejectedValue(new Error('Repository error')),
                updateProfileSettings: jest.fn().mockRejectedValue(new Error('Repository error')),
                uploadProfilePhoto: jest.fn().mockRejectedValue(new Error('Repository error')),
                removeProfilePhoto: jest.fn().mockRejectedValue(new Error('Repository error')),
                getPrivacySettings: jest.fn().mockRejectedValue(new Error('Repository error')),
                updatePrivacySettings: jest.fn().mockRejectedValue(new Error('Repository error')),
                getNotificationSettings: jest.fn().mockRejectedValue(new Error('Repository error')),
                updateNotificationSettings: jest.fn().mockRejectedValue(new Error('Repository error'))
            } as any;

            const errorService = new SettingsService(errorRepository);

            await expect(errorService.getProfileSettings(testUserId)).rejects.toThrow('Repository error');
            await expect(errorService.updateProfileSettings(testUserId, {} as any)).rejects.toThrow('Repository error');
        });
    });
});
