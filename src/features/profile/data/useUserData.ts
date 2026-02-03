/**
 * User Data Hooks - Mock Implementation
 * 
 * This is a temporary mock implementation to fix test imports.
 * In a real implementation, these would be actual data fetching hooks.
 */

import { useState, useEffect } from 'react';

// Mock user data types
interface MockUser {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    isFollowing?: boolean;
}

// Mock hook for getting current user
export const useGetCurrentUser = () => {
    const [user, setUser] = useState<MockUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Mock implementation
        setTimeout(() => {
            setUser({
                id: 'mock-user-id',
                name: 'Mock User',
                username: 'mockuser',
                email: 'mock@example.com'
            });
            setLoading(false);
        }, 100);
    }, []);

    return { user, loading, error };
};

// Mock hook for getting user by ID
export const useGetUserById = (userId: string) => {
    const [user, setUser] = useState<MockUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Mock implementation
        setTimeout(() => {
            if (userId) {
                setUser({
                    id: userId,
                    name: `User ${userId}`,
                    username: `user${userId}`,
                    email: `user${userId}@example.com`
                });
            }
            setLoading(false);
        }, 100);
    }, [userId]);

    return { user, loading, error };
};

// Mock hook for toggle follow
export const useToggleFollow = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleFollow = async (userId: string) => {
        setLoading(true);
        setError(null);

        try {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 500));
            // In real implementation, this would toggle follow status
            console.log(`Toggled follow for user: ${userId}`);
        } catch (err) {
            setError('Failed to toggle follow');
        } finally {
            setLoading(false);
        }
    };

    return { toggleFollow, loading, error };
};

// Mock hook for user data
export const useUserData = (userId?: string) => {
    const getUserById = useGetUserById(userId || '');
    const getCurrentUser = useGetCurrentUser();

    return userId ? getUserById : getCurrentUser;
};
