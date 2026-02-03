import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginFormReturn {
    formData: { email: string; password: string };
    isAuthenticating: boolean;
    isError: boolean;
    error: string | null;
    handleLoginForm: (event: React.FormEvent) => Promise<void>;
    handleFormChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSignupBtn: () => void;
}

interface AuthError extends Error {
    status?: number;
}

/**
 * useLoginForm hook - Fixed Version
 * 
 * This hook manages the login form state and handles authentication logic.
 * 
 * Features:
 * - Form state management
 * - Authentication handling
 * - Error handling
 * - Navigation
 */
export const useLoginForm = (): LoginFormReturn => {
    // Using local state for form management
    const [formData, setFormData] = React.useState({ email: '', password: '' });
    const [isAuthenticating, setIsAuthenticating] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const navigate = useNavigate();

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
            setIsAuthenticating(true);
            setIsError(false);
            setError(null);

            // TODO: Replace with actual authentication call
            // For now, simulate authentication
            console.log('Attempting login with:', credentials);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate successful login
            console.log('Login successful');
            navigate("/");

        } catch (err) {
            const authError = err as AuthError;
            console.error("Login failed:", authError);
            setIsError(true);
            setError(authError.message || 'Login failed');
        } finally {
            setIsAuthenticating(false);
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
    const handleSignupBtn = () => {
        // TODO: Implement navigation to signup page
        console.log('Navigate to signup page');
    };

    return {
        formData: {
            email: formData.email || '',
            password: formData.password || ''
        },
        isAuthenticating,
        isError,
        error,
        handleLoginForm,
        handleFormChange,
        handleSignupBtn,
    };
};
