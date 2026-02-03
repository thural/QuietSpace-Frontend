import { useEnterpriseAuth } from "@/core/modules/authentication";
import { useAuthStore } from "@/core/store/zustand";
import { useCacheInvalidation } from "@/core/hooks/migrationUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook for handling user sign-out functionality.
 * 
 * This hook manages the sign-out process, including setting loading states,
 * handling success and error scenarios, and navigating the user to the login page.
 * 
 * @returns {Object} - An object containing loading and error states.
 * @returns {boolean} isLoading - Indicates whether the sign-out process is in progress.
 * @returns {boolean} isError - Indicates whether an error occurred during sign-out.
 * @returns {Error | null} error - The error object if an error occurred, otherwise null.
 */
export const useSignout = () => {
    const { resetAuthData, setIsAuthenticated } = useAuthStore();
    const invalidateCache = useCacheInvalidation();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Sets the loading state to true when sign-out starts.
     */
    const onLoadFn = () => setIsLoading(true);

    /**
     * Callback function executed on successful sign-out.
     * 
     * This function clears the query client, resets authentication data,
     * updates the authentication state, and navigates to the login page.
     */
    const onSuccessFn = () => {
        // Clear all enterprise caches
        invalidateCache.invalidateAll();
        setIsLoading(false);
        resetAuthData();
        setIsAuthenticated(false);
        navigate("/login");
    }

    /**
     * Callback function executed on sign-out error.
     * 
     * This function resets authentication data, updates the error state,
     * and sets the loading state to false.
     * 
     * @param {Error} error - The error encountered during sign-out.
     */
    const onErrorFn = (error: Error) => {
        setIsLoading(false);
        resetAuthData();
        setError(error);
        setIsError(true);
    }

    // Calls the signout function from the authentication hook
    const { signout } = useEnterpriseAuth();

    // Executes signout when the component is mounted
    useEffect(signout, []);

    return { isLoading, isError, error }
}