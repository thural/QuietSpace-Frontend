/**
 * Settings Hook Tests.
 * 
 * Tests for Settings hooks with dependency injection.
 */

import { renderHook, act } from '@testing-library/react';
import { useSettings } from '../application/hooks/useSettings';
import { useSettingsDI } from '../di/useSettingsDI';
import type { ProfileSettingsRequest } from '@/api/schemas/inferred/user';
import type { PrivacySettings, NotificationSettings } from '../domain/entities/SettingsEntities';

// Mock the DI container
jest.mock('../di/useSettingsDI', () => ({
    useSettingsDI: jest.fn(() => ({
        getConfig: jest.fn(() => ({
            useMockRepositories: true,
            enableLogging: false,
            useReactQuery: false // Test with traditional approach first
        })),
        getSettingsService: jest.fn(() => ({
            getProfileSettings: jest.fn().mockResolvedValue({
                id: 'test-user-123',
                bio: 'Test bio',
                isPrivateAccount: false
            }),
            updateProfileSettings: jest.fn().mockResolvedValue({
                id: 'test-user-123',
                bio: 'Updated bio',
                isPrivateAccount: true
            }),
            uploadProfilePhoto: jest.fn().mockResolvedValue({
                id: 'test-user-123',
                photo: 'new-photo-url'
            }),
            removeProfilePhoto: jest.fn().mockResolvedValue({
                id: 'test-user-123',
                photo: null
            }),
            getPrivacySettings: jest.fn().mockResolvedValue({
                isPrivateAccount: false,
                showEmail: true,
                allowTagging: true
            }),
            updatePrivacySettings: jest.fn().mockResolvedValue({
                isPrivateAccount: true,
                showEmail: false,
                allowTagging: true
            }),
            getNotificationSettings: jest.fn().mockResolvedValue({
                emailNotifications: true,
                pushNotifications: true,
                mentionNotifications: true
            }),
            updateNotificationSettings: jest.fn().mockResolvedValue({
                emailNotifications: false,
                pushNotifications: true,
                mentionNotifications: true
            })
        }))
    }))
}));

describe('Settings Hook Tests', () => {
    let testUserId: string;

    beforeEach(() => {
        testUserId = 'test-user-123';
        jest.clearAllMocks();
    });

    describe('useSettings Hook', () => {
        it('should initialize with correct state', () => {
            const { result } = renderHook(() => useSettings(testUserId));

            expect(result.current).toBeDefined();
            expect(result.current.profile).toBeNull();
            expect(result.current.privacy).toBeNull();
            expect(result.current.notifications).toBeNull();
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBeNull();
        });

        it('should provide all required actions', () => {
            const { result } = renderHook(() => useSettings(testUserId));

            expect(typeof result.current.getProfileSettings).toBe('function');
            expect(typeof result.current.updateProfileSettings).toBe('function');
            expect(typeof result.current.uploadProfilePhoto).toBe('function');
            expect(typeof result.current.removeProfilePhoto).toBe('function');
            expect(typeof result.current.getPrivacySettings).toBe('function');
            expect(typeof result.current.updatePrivacySettings).toBe('function');
            expect(typeof result.current.getNotificationSettings).toBe('function');
            expect(typeof result.current.updateNotificationSettings).toBe('function');
            expect(typeof result.current.clearError).toBe('function');
        });

        it('should get profile settings', async () => {
            const { result } = renderHook(() => useSettings(testUserId));

            await act(async () => {
                await result.current.getProfileSettings();
            });

            expect(result.current.profile).toBeDefined();
            expect(result.current.profile?.id).toBe(testUserId);
        });

        it('should update profile settings', async () => {
            const { result } = renderHook(() => useSettings(testUserId));
            const settings: ProfileSettingsRequest = {
                bio: 'Updated bio',
                isPrivateAccount: true
            };

            await act(async () => {
                await result.current.updateProfileSettings(settings);
            });

            expect(result.current.profile?.bio).toBe('Updated bio');
            expect(result.current.profile?.isPrivateAccount).toBe(true);
        });

        it('should upload profile photo', async () => {
            const { result } = renderHook(() => useSettings(testUserId));
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

            await act(async () => {
                await result.current.uploadProfilePhoto(file);
            });

            expect(result.current.profile?.photo).toBeDefined();
        });

        it('should remove profile photo', async () => {
            const { result } = renderHook(() => useSettings(testUserId));

            await act(async () => {
                await result.current.removeProfilePhoto();
            });

            expect(result.current.profile?.photo).toBeNull();
        });

        it('should get privacy settings', async () => {
            const { result } = renderHook(() => useSettings(testUserId));

            await act(async () => {
                await result.current.getPrivacySettings();
            });

            expect(result.current.privacy).toBeDefined();
            expect(typeof result.current.privacy?.isPrivateAccount).toBe('boolean');
            expect(typeof result.current.privacy?.showEmail).toBe('boolean');
            expect(typeof result.current.privacy?.showPhone).toBe('boolean');
            expect(typeof result.current.privacy?.allowTagging).toBe('boolean');
            expect(typeof result.current.privacy?.allowMentions).toBe('boolean');
            expect(typeof result.current.privacy?.allowDirectMessages).toBe('boolean');
        });

        it('should update privacy settings', async () => {
            const { result } = renderHook(() => useSettings(testUserId));
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
        });

        it('should get notification settings', async () => {
            const { result } = renderHook(() => useSettings(testUserId));

            await act(async () => {
                await result.current.getNotificationSettings();
            });

            expect(result.current.notifications).toBeDefined();
            expect(typeof result.current.notifications?.emailNotifications).toBe('boolean');
            expect(typeof result.current.notifications?.pushNotifications).toBe('boolean');
            expect(typeof result.current.notifications?.mentionNotifications).toBe('boolean');
            expect(typeof result.current.notifications?.followNotifications).toBe('boolean');
            expect(typeof result.current.notifications?.likeNotifications).toBe('boolean');
            expect(typeof result.current.notifications?.commentNotifications).toBe('boolean');
            expect(typeof result.current.notifications?.messageNotifications).toBe('boolean');
        });

        it('should update notification settings', async () => {
            const { result } = renderHook(() => useSettings(testUserId));
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
        });

        it('should clear errors', () => {
            const { result } = renderHook(() => useSettings(testUserId));

            act(() => {
                result.current.clearError();
            });

            expect(result.current.error).toBeNull();
        });

        it('should handle loading states', async () => {
            const { result } = renderHook(() => useSettings(testUserId));

            // Start loading
            act(() => {
                // Simulate loading start
            });

            // Complete loading
            await act(async () => {
                await result.current.getProfileSettings();
            });

            expect(result.current.isLoading).toBe(false);
        });

        it('should handle errors gracefully', async () => {
            // Mock service to throw error
            const mockService = {
                getProfileSettings: jest.fn().mockRejectedValue(new Error('Service error')),
                updateProfileSettings: jest.fn().mockRejectedValue(new Error('Service error')),
                // ... other methods
            };

            jest.doMock('../di/useSettingsDI', () => ({
                useSettingsDI: jest.fn(() => ({
                    getConfig: jest.fn(() => ({ useReactQuery: false })),
                    getSettingsService: jest.fn(() => mockService)
                }))
            }));

            const { result } = renderHook(() => useSettings(testUserId));

            await act(async () => {
                await result.current.getProfileSettings();
            });

            expect(result.current.error).toBeDefined();
            expect(result.current.error?.message).toBe('Service error');
        });
    });

    describe('React Query Integration', () => {
        it('should use React Query when enabled', () => {
            jest.doMock('../di/useSettingsDI', () => ({
                useSettingsDI: jest.fn(() => ({
                    getConfig: jest.fn(() => ({
                        useReactQuery: true,
                        useMockRepositories: true,
                        enableLogging: false
                    })),
                    getSettingsService: jest.fn(() => ({}))
                }))
            }));

            const { result } = renderHook(() => useSettings(testUserId));

            expect(result.current.invalidateCache).toBeDefined();
            expect(result.current.prefetchProfileSettings).toBeDefined();
            expect(result.current.prefetchPrivacySettings).toBeDefined();
            expect(result.current.prefetchNotificationSettings).toBeDefined();
        });

        it('should use traditional approach when React Query disabled', () => {
            jest.doMock('../di/useSettingsDI', () => ({
                useSettingsDI: jest.fn(() => ({
                    getConfig: jest.fn(() => ({
                        useReactQuery: false,
                        useMockRepositories: true,
                        enableLogging: false
                    })),
                    getSettingsService: jest.fn(() => ({}))
                }))
            }));

            const { result } = renderHook(() => useSettings(testUserId));

            expect(result.current.invalidateCache).toBeUndefined();
            expect(result.current.prefetchProfileSettings).toBeUndefined();
            expect(result.current.prefetchPrivacySettings).toBeUndefined();
            expect(result.current.prefetchNotificationSettings).toBeUndefined();
        });
    });
});
