/**
 * User Queries Hook
 * 
 * Provides user-related query functionality including
 * signed user access and authentication utilities.
 */

import { useGetCurrentUser } from './useUserData';

/**
 * Hook that provides user query functions.
 * 
 * @returns {Object} - Object containing user query functions
 * @returns {Function} returns.getSignedUserElseThrow - Function to get current signed user or throw error
 */
export const useUserQueries = () => {
    const { user, loading, error } = useGetCurrentUser();

    /**
     * Gets the current signed user or throws an error if not available.
     * 
     * @returns {Object} - The current signed user object
     * @throws {Error} - Throws error if user is not available or not signed in
     */
    const getSignedUserElseThrow = () => {
        if (loading) {
            throw new Error('User data is still loading');
        }

        if (error) {
            throw new Error(`Authentication error: ${error}`);
        }

        if (!user) {
            throw new Error('No signed user found - user may not be authenticated');
        }

        return user;
    };

    return {
        getSignedUserElseThrow,
        currentUser: user,
        isLoading: loading,
        error
    };
};

// Default export for compatibility with existing imports
export default useUserQueries;
