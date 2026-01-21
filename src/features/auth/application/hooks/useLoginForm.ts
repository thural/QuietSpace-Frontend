import useJwtAuth from "@services/hook/auth/useJwtAuth";
import { useAuthStore } from "@/core/store/zustand";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthPages } from "@/types/authTypes";
import { AuthResponse } from "@/features/auth/data/models/auth";

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
export const useLoginForm = () => {
    const { formData, setFormData, setCurrentPage, isLoading, isError, error } = useAuthStore();
    const navigate = useNavigate();

    const { authenticate } = useJwtAuth();

    useEffect(() => {
        // Initialize form data if empty
        if (!formData.email) {
            setFormData({ email: "", password: "" });
        }
    }, []);

    /**
     * Handles the form submission event.
     * 
     * @param {Event} event - The form submission event.
     */
    const handleLoginForm = async (event: Event): Promise<void> => {
        event.preventDefault();
        try {
            await authenticate({
                email: formData.email || '',
                password: formData.password || ''
            });
            navigate("/");
        } catch (error) {
            // Error is handled by the auth store
            console.error("Login failed:", error);
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
        setFormData({ ...formData, [name]: value }); // Update form data state
    };

    /**
     * Handles navigating to the signup page.
     */
    const handleSignupBtn = () => setCurrentPage(AuthPages.SIGNUP);

    return {
        formData,
        isAuthenticating: isLoading,
        isError,
        error,
        handleLoginForm,
        handleFormChange,
        handleSignupBtn,
    };
};