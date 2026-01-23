import {UserRepository} from '@search/data/repositories/UserRepository';
import {ProfileSettingsRequest, ProfileSettingsResponse, UserPage, UserResponse} from '../data/models/user';
import {ResId} from '@/shared/api/models/common';
import {Container} from '@/core/di';

/**
 * Enhanced User Service - Provides high-level user operations
 * Wraps repository calls with business logic and validation
 */
export class UserService {

    private static getUserRepository(): UserRepository {
        // Get the global container instance - this assumes the app has been initialized
        // In a real app, you might want to inject the container or use a different pattern
        const container = (globalThis as any).appContainer || Container.create();
        return container.get(UserRepository);
    }

    static async getCurrentUser(): Promise<UserResponse> {
        return await UserService.getUserRepository().getUser();
    }

    static async getUserById(userId: ResId): Promise<UserResponse> {
        return await UserService.getUserRepository().getUserById(userId);
    }

    static async searchUsers(queryText: string, pageParams?: string): Promise<UserPage> {
        // Business logic: Validate search query
        if (!queryText || queryText.trim().length < 2) {
            throw new Error('Search query must be at least 2 characters');
        }

        return await UserService.getUserRepository().getUsersByQuery(queryText, pageParams);
    }

    static async updateUserProfile(settings: ProfileSettingsRequest): Promise<ProfileSettingsResponse> {
        // Business logic: Validate settings
        const validatedSettings = this.validateProfileSettings(settings);
        
        return await UserService.getUserRepository().saveSettings(validatedSettings);
    }

    static async followUser(userId: ResId): Promise<Response> {
        return await UserService.getUserRepository().toggleFollow(userId);
    }

    static async getUserSocialStats(userId: ResId): Promise<{
        followers: number;
        following: number;
        posts: number;
        engagement: number;
    }> {
        // Business logic: Get comprehensive user statistics
        const [followers, following] = await Promise.all([
            UserService.getUserRepository().getFollowers(userId),
            UserService.getUserRepository().getFollowings(userId)
        ]);

        return {
            followers: followers.totalElements || 0,
            following: following.totalElements || 0,
            posts: 0, // Would come from PostRepository
            engagement: 0 // Calculated metric
        };
    }

    static async uploadProfilePhoto(file: File): Promise<string> {
        // Business logic: Validate file
        this.validateImageFile(file);

        const formData = new FormData();
        formData.append('file', file);

        return await UserService.getUserRepository().uploadPhoto(formData);
    }

    // Business logic helper methods
    private static validateProfileSettings(settings: ProfileSettingsRequest): ProfileSettingsRequest {
        const validated: ProfileSettingsRequest = { ...settings };

        // Email validation
        if (validated.email && !this.isValidEmail(validated.email)) {
            throw new Error('Invalid email format');
        }

        // Username validation
        if (validated.username && !this.isValidUsername(validated.username)) {
            throw new Error('Username must be 3-20 characters, alphanumeric only');
        }

        return validated;
    }

    private static validateImageFile(file: File): void {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
        }

        if (file.size > maxSize) {
            throw new Error('Image size must be less than 5MB');
        }
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private static isValidUsername(username: string): boolean {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }
}
