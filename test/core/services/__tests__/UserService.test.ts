/**
 * UserService Tests
 * 
 * Comprehensive tests for the UserService implementation
 * Tests user management, repository operations, and data persistence
 */

import { UserService, UserRepository } from '../../../../src/core/services/UserService';
import { User } from '../../../../src/shared/domain/entities/User';

// Mock console methods
const mockConsole = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
};

// Store original console
const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn
};

describe('UserService', () => {
    let userService: UserService;
    let userRepository: UserRepository;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock console methods
        console.log = mockConsole.log;
        console.error = mockConsole.error;
        console.warn = mockConsole.warn;

        userRepository = new UserRepository();
        userService = new UserService(userRepository);
    });

    afterEach(() => {
        // Restore original console
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
    });

    describe('Basic User Operations', () => {
        it('should create user service instance', () => {
            expect(userService).toBeDefined();
            expect(typeof userService.getCurrentUser).toBe('function');
            expect(typeof userService.setCurrentUser).toBe('function');
            expect(typeof userService.updateUserProfile).toBe('function');
            expect(typeof userService.logout).toBe('function');
        });

        it('should initialize with no current user', () => {
            expect(userService.getCurrentUser()).toBeNull();
        });

        it('should set and get current user', () => {
            const testUser = userRepository.createSampleUser('1', 'testuser');

            userService.setCurrentUser(testUser);

            expect(userService.getCurrentUser()).toBe(testUser);
            expect(userService.getCurrentUser()?.username).toBe('testuser');
        });

        it('should logout and clear current user', () => {
            const testUser = userRepository.createSampleUser('1', 'testuser');
            userService.setCurrentUser(testUser);

            userService.logout();

            expect(userService.getCurrentUser()).toBeNull();
        });
    });

    describe('User Profile Management', () => {
        it('should update user profile successfully', async () => {
            const testUser = userRepository.createSampleUser('1', 'testuser');
            userService.setCurrentUser(testUser);

            const updates = {
                email: 'newemail@example.com',
                displayName: 'New Display Name'
            };

            const updatedUser = await userService.updateUserProfile(updates);

            expect(updatedUser.email).toBe('newemail@example.com');
            expect(updatedUser.displayName).toBe('New Display Name');
            expect(userService.getCurrentUser()?.email).toBe('newemail@example.com');
        });

        it('should handle profile updates when no current user', async () => {
            const updates = { email: 'test@example.com' };

            await expect(userService.updateUserProfile(updates)).rejects.toThrow('No current user');
        });

        it('should handle empty profile updates', async () => {
            const testUser = userRepository.createSampleUser('1', 'testuser');
            userService.setCurrentUser(testUser);

            const updatedUser = await userService.updateUserProfile({});

            expect(updatedUser).toBe(testUser);
        });
    });

    describe('Repository Integration', () => {
        it('should save user to repository', async () => {
            const testUser = userRepository.createSampleUser('1', 'testuser');

            await userRepository.save(testUser);

            const foundUser = await userRepository.findById('1');
            expect(foundUser).toBe(testUser);
        });

        it('should update user in repository', async () => {
            const testUser = userRepository.createSampleUser('1', 'testuser');
            await userRepository.save(testUser);

            const updates = { email: 'updated@example.com' };
            const updatedUser = await userRepository.update('1', updates);

            expect(updatedUser.email).toBe('updated@example.com');

            const foundUser = await userRepository.findById('1');
            expect(foundUser?.email).toBe('updated@example.com');
        });

        it('should handle updating non-existent user', async () => {
            const updates = { email: 'test@example.com' };

            await expect(userRepository.update('nonexistent', updates)).rejects.toThrow('User nonexistent not found');
        });

        it('should delete user from repository', async () => {
            const testUser = userRepository.createSampleUser('1', 'testuser');
            await userRepository.save(testUser);

            await userRepository.delete('1');

            const foundUser = await userRepository.findById('1');
            expect(foundUser).toBeNull();
        });

        it('should handle deleting non-existent user', async () => {
            await expect(userRepository.delete('nonexistent')).resolves.not.toThrow();
        });
    });

    describe('Error Handling', () => {
        it('should handle repository errors gracefully', async () => {
            const testUser = userRepository.createSampleUser('1', 'testuser');
            userService.setCurrentUser(testUser);

            // Mock repository to throw error
            jest.spyOn(userRepository, 'update').mockRejectedValue(new Error('Database error'));

            const updates = { email: 'test@example.com' };

            await expect(userService.updateUserProfile(updates)).rejects.toThrow('Database error');
        });

        it('should handle invalid user data', async () => {
            const testUser = userRepository.createSampleUser('1', 'testuser');
            userService.setCurrentUser(testUser);

            const invalidUpdates = {
                email: 'invalid-email',
                displayName: ''
            };

            // Should handle invalid data gracefully
            const updatedUser = await userService.updateUserProfile(invalidUpdates);
            expect(updatedUser).toBeDefined();
        });
    });

    describe('Performance', () => {
        it('should handle rapid user operations without performance issues', async () => {
            const startTime = performance.now();

            for (let i = 0; i < 100; i++) {
                const user = userRepository.createSampleUser(`user-${i}`, `user${i}`);
                await userRepository.save(user);
                userService.setCurrentUser(user);
                userService.logout();
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete 100 operations in under 100ms
            expect(duration).toBeLessThan(100);
        });

        it('should handle concurrent profile updates', async () => {
            const testUser = userRepository.createSampleUser('1', 'testuser');
            userService.setCurrentUser(testUser);

            const updates = [
                { email: 'email1@example.com' },
                { email: 'email2@example.com' },
                { email: 'email3@example.com' }
            ];

            const promises = updates.map(update => userService.updateUserProfile(update));
            const results = await Promise.all(promises);

            expect(results).toHaveLength(3);
            expect(results[0].email).toBe('email1@example.com');
        });
    });

    describe('Edge Cases', () => {
        it('should handle null user gracefully', () => {
            expect(() => {
                userService.setCurrentUser(null as any);
            }).not.toThrow();

            expect(userService.getCurrentUser()).toBeNull();
        });

        it('should handle undefined user gracefully', () => {
            expect(() => {
                userService.setCurrentUser(undefined as any);
            }).not.toThrow();

            expect(userService.getCurrentUser()).toBeUndefined();
        });

        it('should handle user with missing properties', () => {
            const incompleteUser = { id: '1' } as User;

            expect(() => {
                userService.setCurrentUser(incompleteUser);
            }).not.toThrow();

            expect(userService.getCurrentUser()).toBe(incompleteUser);
        });

        it('should handle very long user data', async () => {
            const testUser = userRepository.createSampleUser('1', 'testuser');
            userService.setCurrentUser(testUser);

            const longUpdates = {
                displayName: 'x'.repeat(1000),
                bio: 'y'.repeat(5000)
            };

            const updatedUser = await userService.updateUserProfile(longUpdates);
            expect(updatedUser.displayName).toHaveLength(1000);
            expect(updatedUser.bio).toHaveLength(5000);
        });
    });

    describe('Singleton Behavior', () => {
        it('should maintain separate instances', () => {
            const service1 = new UserService(userRepository);
            const service2 = new UserService(userRepository);

            expect(service1).not.toBe(service2);
        });

        it('should not interfere with each other', () => {
            const service1 = new UserService(userRepository);
            const service2 = new UserService(userRepository);

            const user1 = userRepository.createSampleUser('1', 'user1');
            const user2 = userRepository.createSampleUser('2', 'user2');

            service1.setCurrentUser(user1);
            service2.setCurrentUser(user2);

            expect(service1.getCurrentUser()?.id).toBe('1');
            expect(service2.getCurrentUser()?.id).toBe('2');
        });
    });

    describe('Integration Tests', () => {
        it('should work with complete user workflow', async () => {
            // Create user
            const testUser = userRepository.createSampleUser('1', 'testuser');
            await userRepository.save(testUser);

            // Set as current user
            userService.setCurrentUser(testUser);
            expect(userService.getCurrentUser()).toBe(testUser);

            // Update profile
            const updates = { email: 'updated@example.com' };
            const updatedUser = await userService.updateUserProfile(updates);
            expect(updatedUser.email).toBe('updated@example.com');

            // Logout
            userService.logout();
            expect(userService.getCurrentUser()).toBeNull();

            // User should still be in repository
            const storedUser = await userRepository.findById('1');
            expect(storedUser?.email).toBe('updated@example.com');
        });

        it('should handle multiple users correctly', async () => {
            const users = [
                userRepository.createSampleUser('1', 'user1'),
                userRepository.createSampleUser('2', 'user2'),
                userRepository.createSampleUser('3', 'user3')
            ];

            // Save all users
            for (const user of users) {
                await userRepository.save(user);
            }

            // Switch between users
            for (const user of users) {
                userService.setCurrentUser(user);
                expect(userService.getCurrentUser()?.id).toBe(user.id);

                const updates = { lastLogin: new Date() };
                await userService.updateUserProfile(updates);
            }

            // Verify all users are updated
            for (const user of users) {
                const storedUser = await userRepository.findById(user.id);
                expect(storedUser?.lastLogin).toBeDefined();
            }
        });
    });
});
