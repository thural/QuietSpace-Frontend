import useJwtAuth from "@/services/hook/auth/useJwtAuth";
import { useAuthStore } from "@/services/store/zustand";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthFormProps, AuthPages } from "@/types/authTypes";
import { AuthResponse } from "@/api/schemas/inferred/auth";

/**
 * useLoginForm hook.
 * 
 * This hook manages the login form state and handles authentication logic. It provides 
 * functions for handling form submission, input changes, and navigation to the signup page.
 * 
 * @param {AuthFormProps} params - The authentication form properties.
 * @param {Function} params.setAuthState - Function to set the authentication state.
 * @param {Object} params.authState - The current authentication state, including form data.
 * @returns {Object} - An object containing form data, authentication status, error information, 
 *                     and functions to handle form events.
 */
export const useLoginForm = ({ setAuthState, authState }: AuthFormProps) => {
    const { setAuthData, resetAuthData, setIsAuthenticated } = useAuthStore();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Function called when authentication starts.
     */
    const onLoadFn = () => setIsAuthenticating(true);

    /**
     * Function called when authentication succeeds.
     * 
     * @param {AuthResponse} data - The authentication response data.
     */
    const onSuccessFn = (data: AuthResponse): void => {
        setIsAuthenticating(false);
        setIsAuthenticated(true);
        setAuthData(data);
        navigate("/");
    };

    /**
     * Function called when authentication fails.
     * 
     * @param {Error} error - The error that occurred during authentication.
     */
    const onErrorFn = (error: Error): void => {
        setIsAuthenticating(false);
        resetAuthData();
        setError(error);
        setIsError(true);
    };

    const { authenticate } = useJwtAuth({ onSuccessFn, onErrorFn, onLoadFn });

    useEffect(() => {
        setFormData({ ...formData, ...authState.formData });
    }, [authState.formData]); // Dependency on authState.formData

    /**
     * Handles the form submission event.
     * 
     * @param {Event} event - The form submission event.
     */
    const handleLoginForm = async (event: Event): Promise<void> => {
        event.preventDefault(); // Prevent default form submission
        authenticate(formData); // Call the authenticate function with the form data
    };

    /**
     * Handles changes to form input fields.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event triggered by input fields.
     */
    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const { name, value }: { name: string; value: string } = target;
        setFormData({ ...formData, [name]: value }); // Update form data state
    };

    /**
     * Handles navigating to the signup page.
     */
    const handleSignupBtn = () => setAuthState({ page: AuthPages.SIGNUP, formData });

    return {
        formData,
        isAuthenticating,
        isError,
        error,
        handleLoginForm,
        handleFormChange,
        handleSignupBtn,
    };
};