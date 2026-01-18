/**
 * Settings Integration Tests.
 * 
 * End-to-end tests for Settings feature with DI container.
 */

import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { SettingsDIContainer } from '../di/SettingsDIContainer';
import { useSettings } from '../application/hooks/useSettings';
import type { ProfileSettingsRequest } from '@/api/schemas/inferred/user';
import type { PrivacySettings, NotificationSettings } from '../domain/entities/SettingsEntities';

// Mock auth store
jest.mock('@/services/store/zustand', () => ({
    useAuthStore: {
        getState: jest.fn(() => ({
            data: {
                accessToken: 'mock-jwt-token-123'
            }
        }))
    }
}));

describe('Settings Integration Tests', () => {
    let diContainer: SettingsDIContainer;
    let testUserId: string;

    beforeEach(() => {
        testUserId = 'test-user-123';
        diContainer = new SettingsDIContainer({
            useMockRepositories: true,
            enableLogging: false,
            useReactQuery: false
        });
        jest.clearAllMocks();
    });

    describe('DI Container Integration', () => {
        it('should initialize with mock repositories', () => {
            expect(diContainer).toBeDefined();
            
            const repository = diContainer.getSettingsRepository();
            expect(repository).toBeDefined();
            
            const service = diContainer.getSettingsService();
            expect(service).toBeDefined();
        });

        it('should provide correct configuration', () => {
            const config = diContainer.getConfig();
            expect(config.useMockRepositories).toBe(true);
            expect(config.useReactQuery).toBe(false);
            expect(config.enableLogging).toBe(false);
        });

        it('should update configuration', () => {
            diContainer.updateConfig({ useReactQuery: true });
            const config = diContainer.getConfig();
            expect(config.useReactQuery).toBe(true);
        });

        it('should reinitialize dependencies', () => {
            diContainer.reinitialize({ useMockRepositories: false });
            const config = diContainer.getConfig();
            expect(config.useMockRepositories).toBe(false);
        });
    });

    describe('End-to-End Settings Flow', () => {
        it('should complete full profile settings workflow', async () => {
            const { result } = renderHook(() => useSettings(testUserId));

            // Initial state
            expect(result.current.profile).toBeNull();
            expect(result.current.isLoading).toBe(false);

            // Get profile settings
            await act(async () => {
                await result.current.getProfileSettings();
            });

            expect(result.current.profile).toBeDefined();
            expect(result.current.profile?.id).toBe(testUserId);

            // Update profile settings
            const newSettings: ProfileSettingsRequest = {
                bio: 'New bio content',
                isPrivateAccount: true
            };

            await act(async () => {
                await result.current.updateProfileSettings(newSettings);
            });

            expect(result.current.profile?.bio).toBe('New bio content');
            expect(result.current.profile?.isPrivateAccount).toBe(true);
        });

        it('should complete full privacy settings workflow', async () => {
            const { result } = renderHook(() => useSettings(testUserId));

            // Get privacy settings
            await act(async () => {
                await result.current.getPrivacySettings();
            });

            expect(result.current.privacy).toBeDefined();
            expect(typeof result.current.privacy?.isPrivateAccount).toBe('boolean');

            // Update privacy settings
            const newPrivacySettings: PrivacySettings = {
                isPrivateAccount: true,
                showEmail: false,
                showPhone: false,
                allowTagging: true,
                allowMentions: true,
                allowDirectMessages: false
            };

            await act(async () => {
                await result.current.updatePrivacySettings(newPrivacySettings);
            });

            expect(result.current.privacy?.isPrivateAccount).toBe(true);
            expect(result.current.privacy?.showEmail).toBe(false);
            expect(result.current.privacy?.allowTagging).toBe(true);
        });

        it('should complete full notification settings workflow', async () => {
            const { result } = renderHook(() => useSettings(testUserId));

            // Get notification settings
            await act(async () => {
                await result.current.getNotificationSettings();
            });

            expect(result.current.notifications).toBeDefined();
            expect(typeof result.current.notifications?.emailNotifications).toBe('boolean');

            // Update notification settings
            const newNotificationSettings: NotificationSettings = {
                emailNotifications: false,
                pushNotifications: true,
                mentionNotifications: true,
                followNotifications: false,
                likeNotifications: true,
                commentNotifications: false,
                messageNotifications: true
            };

            await act(async () => {
                await result.current.updateNotificationSettings(newNotificationSettings);
            });

            expect(result.current.notifications?.emailNotifications).toBe(false);
            expect(result.current.notifications?.pushNotifications).toBe(true);
            expect(result.current.notifications?.mentionNotifications).toBe(true);
        });

        it('should handle profile photo upload workflow', async () => {
            const { result } = renderHook(() => useSettings(testUserId));

            // Upload profile photo
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

            await act(async () => {
                await result.current.uploadProfilePhoto(file);
            });

            expect(result.current.profile?.photo).toBeDefined();

            // Remove profile photo
            await act(async () => {
                await result.current.removeProfilePhoto();
            });

            expect(result.current.profile?.photo).toBeNull();
        });
    });

    describe('Error Handling Integration', () => {
        it('should handle repository errors gracefully', async () => {
            // Create DI container with failing repository
            const failingContainer = new SettingsDIContainer({
                useMockRepositories: false, // Use real repository which will fail without proper setup
                enableLogging: false,
                useReactQuery: false
            });

            // Mock the useSettingsDI to return failing container
            jest.doMock('../di/useSettingsDI', () => ({
                useSettingsDI: jest.fn(() => failingContainer),
                useSettingsService: jest.fn(() => failingContainer.getSettingsService())
            }));

            const { result } = renderHook(() => useSettings(testUserId));

            await act(async () => {
                await result.current.getProfileSettings();
            });

            expect(result.current.error).toBeDefined();
        });

        it('should clear errors properly', async () => {
            const { result } = renderHook(() => useSettings(testUserId));

            // Trigger an error
            await act(async () => {
                await result.current.getProfileSettings();
            });

            // Clear error
            act(() => {
                result.current.clearError();
            });

            expect(result.current.error).toBeNull();
        });
    });

    describe('React Query Integration', () => {
        it('should switch to React Query mode when enabled', () => {
            const reactQueryContainer = new SettingsDIContainer({
                useMockRepositories: true,
                enableLogging: false,
                useReactQuery: true
            });

            jest.doMock('../di/useSettingsDI', () => ({
                useSettingsDI: jest.fn(() => reactQueryContainer),
                useSettingsService: jest.fn(() => reactQueryContainer.getSettingsService())
            }));

            const { result } = renderHook(() => useSettings(testUserId));

            expect(result.current.invalidateCache).toBeDefined();
            expect(typeof result.current.invalidateCache).toBe('function');
        });

        it('should provide React Query specific actions', () => {
            const reactQueryContainer = new SettingsDIContainer({
                useMockRepositories: true,
                enableLogging: false,
                useReactQuery: true
            });

            jest.doMock('../di/useSettingsDI', () => ({
                useSettingsDI: jest.fn(() => reactQueryContainer),
                useSettingsService: jest.fn(() => reactQueryContainer.getSettingsService())
            }));

            const { result } = renderHook(() => useSettings(testUserId));

            expect(result.current.prefetchProfileSettings).toBeDefined();
            expect(result.current.prefetchPrivacySettings).toBeDefined();
            expect(result.current.prefetchNotificationSettings).toBeDefined();
        });
    });
});
