import { useJwtAuth } from "@features/auth/application/hooks/useJwtAuth";
import {useAuthStore} from "@/core/store/zustand";
import React from "react";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AuthPages} from "@/features/auth/types/auth.ui.types";

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
 * useLoginForm hook.
 * 
 * This hook manages the login form state and handles authentication logic. It provides 
 * functions for handling form submission, input changes, and navigation to the signup page.
 */
export const useLoginForm = (): LoginFormReturn => {
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
     * @param {React.FormEvent} event - The form submission event.
     */
    const handleLoginForm = async (event: React.FormEvent): Promise<void> => {
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
        formData: {
            email: formData.email || '',
            password: formData.password || ''
        },
        isAuthenticating: isLoading,
        isError,
        error: error?.message || null,
        handleLoginForm,
        handleFormChange,
        handleSignupBtn,
    };
};