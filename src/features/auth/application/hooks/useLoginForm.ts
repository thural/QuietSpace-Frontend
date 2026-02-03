import { useCustomMutation } from '@/core/hooks/useCustomMutation';
import { useCacheInvalidation } from '@/core/hooks/useCacheInvalidation';
import { useAuthServices } from './useAuthServices';
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPages } from '@/features/auth/types/auth.ui.types';

interface LoginFormReturn {
    formData: { email: string; password: string };
    isAuthenticating: boolean;
    isError: boolean;
    error: string | null;
    handleLoginForm: (event: React.FormEvent) => Promise<void>;
    handleFormChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSignupBtn: () => void;
}

/**
 * useLoginForm hook - Enterprise Edition
 * 
 * This hook manages the login form state and handles authentication logic
 * using the new enterprise architecture with custom query system and caching.
 * 
 * Features:
 * - Custom mutation with optimistic updates
 * - Intelligent cache invalidation
 * - Enhanced error handling and retry logic
 * - Security monitoring integration
 */
export const useLoginForm = (): LoginFormReturn => {
    // Using local state instead of auth store for form management
    const [formData, setFormData] = React.useState({ email: '', password: '' });
    const [currentPage, setCurrentPage] = React.useState(AuthPages.LOGIN);
    const { authFeatureService } = useAuthServices();
    const invalidateCache = useCacheInvalidation();
    const navigate = useNavigate();

    // Custom mutation for login with enterprise features
    const loginMutation = useCustomMutation(
        (credentials: { email: string; password: string }) =>
            authFeatureService.authenticateUser(credentials),
        {
            onSuccess: (data, variables) => {
                console.log('Login successful:', { userId: data.userId, email: variables.email });

                // Invalidate auth-related caches
                invalidateCache.invalidateAuth();
                invalidateCache.invalidateUser(data.userId);

                // Navigate to dashboard on successful login
                navigate("/");
            },
            onError: (error, variables) => {
                console.error('Login failed:', {
                    email: variables.email,
                    error: error.message,
                    status: error.status
                });

                // Track failed login attempts for security monitoring
                if (error.status === 401) {
                    invalidateCache.invalidateAuthAttempts(variables.email);
                }

                // Rate limiting feedback
                if (error.status === 429) {
                    console.warn('Rate limit exceeded for login attempts');
                }
            },
            retry: (failureCount, error) => {
                // Don't retry on authentication errors
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                // Retry up to 2 times for network errors
                return failureCount < 2;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
            // Optimistic updates for better UX
            optimisticUpdate: (cache, variables) => {
                // Optimistically set loading state in cache
                const optimisticKey = `auth:login:${variables.email}:optimistic`;
                cache.set(optimisticKey, { loading: true, timestamp: Date.now() }, 5000);

                return () => {
                    // Rollback on error
                    cache.delete(optimisticKey);
                };
            }
        }
    );

    useEffect(() => {
        // Initialize form data if empty
        if (!formData.email) {
            setFormData({ email: "", password: "" });
        }
    }, []);

    /**
     * Handles the form submission event.
     * 
     * @param {React.FormEvent} event - The form submission event.
     */
    const handleLoginForm = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();

        const credentials = {
            email: formData.email || '',
            password: formData.password || ''
        };

        try {
            await loginMutation.mutateAsync(credentials);
        } catch (error) {
            // Error is handled by the mutation's onError callback
            console.error("Login submission error:", error);
        }
    };

    /**
     * Handles changes to form input fields.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event triggered by input fields.
     */
    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const { name, value }: { name: string; value: string } = target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Handles navigating to the signup page.
     */
    const handleSignupBtn = () => setCurrentPage(AuthPages.SIGNUP);

    return {
        formData: {
            email: formData.email || '',
            password: formData.password || ''
        },
        isAuthenticating: loginMutation.isLoading,
        isError: loginMutation.isError,
        error: loginMutation.error?.message || null,
        handleLoginForm,
        handleFormChange,
        handleSignupBtn,
    };
};