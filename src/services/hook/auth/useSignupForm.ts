import { AuthPages, AuthState, SetAuthState, SignupBody } from "@/types/authTypes";
import useJwtAuth from "@/services/hook/auth/useJwtAuth";
import { ChangeEvent, useEffect, useState } from "react";

/**
 * useSignupForm hook.
 * 
 * This hook manages the signup form state and handles the signup process. It provides 
 * functions for handling form submission, input changes, and navigation to the login page.
 * 
 * @param {SetAuthState} setAuthState - Function to set the authentication state.
 * @param {AuthState} authState - The current authentication state, including form data.
 * @returns {Object} - An object containing loading status, error information, form data, 
 *                     and functions to handle form events.
 */
export const useSignupForm = (setAuthState: SetAuthState, authState: AuthState) => {
    const [isLoading, setIsLoading] = useState(false); // Loading state for signup process
    const [isError, setIsError] = useState(false); // Error state for signup process
    const [error, setError] = useState<Error | null>(null); // Error message state
    const [formData, setFormData] = useState<SignupBody>({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    }); // Form data state for signup

    /**
     * Function called when signup process starts.
     */
    const onLoadFn = () => {
        setIsLoading(true); // Set loading state to true
    };

    /**
     * Function called when signup succeeds.
     */
    const onSuccessFn = () => {
        setIsLoading(false); // Set loading state to false
        setAuthState({ page: AuthPages.ACTIVATION, formData }); // Navigate to activation page
    };

    /**
     * Function called when signup fails.
     * 
     * @param {Error} error - The error that occurred during signup.
     */
    const onErrorFn = (error: Error) => {
        setIsLoading(false); // Set loading state to false
        setError(error); // Set error state
        setIsError(true); // Set error flag
    };

    const { signup } = useJwtAuth({ onSuccessFn, onErrorFn, onLoadFn });

    useEffect(() => {
        setFormData({ ...formData, ...authState.formData }); // Update form data based on authState
    }, [authState.formData]); // Dependency on authState.formData

    /**
     * Handles the form submission event.
     * 
     * @param {SubmitEvent} event - The form submission event.
     */
    const handleSubmit = async (event: SubmitEvent) => {
        const { password, confirmPassword } = formData; // Destructure password and confirmPassword
        event.preventDefault(); // Prevent default form submission

        if (password !== confirmPassword) {
            alert("Passwords don't match, please try again"); // Alert if passwords don't match
            setFormData((prev) => {
                const newData: SignupBody = { ...prev };
                newData.confirmPassword = ''; // Clear confirmPassword field
                return newData;
            });
        } else {
            signup(formData); // Call signup function with form data
        }
    };

    /**
     * Handles changes to form input fields.
     * 
     * @param {ChangeEvent<HTMLInputElement>} event - The change event triggered by input fields.
     */
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target; // Destructure name and value from the target
        setFormData({ ...formData, [name]: value }); // Update form data state
    };

    /**
     * Handles clicking the login button to navigate to the login page.
     */
    const handleLoginClick = () => setAuthState({ page: AuthPages.LOGIN, formData });

    return {
        isLoading,
        isError,
        error,
        formData,
        handleSubmit,
        handleChange,
        handleLoginClick,
    };
};