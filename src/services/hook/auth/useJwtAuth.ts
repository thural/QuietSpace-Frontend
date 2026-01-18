import {
    LoginBody,
    SetAuthState,
    SignupBody
} from '@/types/authTypes';
import { JwtAuthProps } from '@/types/hookPropTypes';
import {
    activateUser,
    authenticateUser,
    createTokenRefreshManager,
    registerUser,
    signoutUser,
    signupUser
} from '@/utils/jwtAuthUtils';
import { useCallback, useMemo } from 'react';

/**
 * @interface UseJwtAuthReturn
 * @property {function} loadAccessToken - Loads and starts auto-refreshing the access token.
 * @property {function} signup - Signs up a user with the provided form data.
 * @property {function} activate - Activates a user account using a code.
 * @property {function} signout - Signs out the current user.
 * @property {function} authenticate - Authenticates a user with the provided form data.
 * @property {function} register - Registers a new user and updates the authentication state.
 */

interface UseJwtAuthReturn {
    loadAccessToken: () => void;
    signup: (formData: SignupBody) => void;
    activate: (code: string) => void;
    signout: () => void;
    authenticate: (formData: LoginBody) => void;
    register: (setAuthState: SetAuthState, formData: SignupBody) => void;
}

const useJwtAuth = ({
    refreshInterval = 490000,
    onSuccessFn = () => { console.warn("No onSuccess handler provided"); },
    onErrorFn = (e: Error) => { console.error("Error in JwtAuth client:", e); },
    onLoadFn = () => { console.warn("No onLoad handler provided"); }
}: JwtAuthProps): UseJwtAuthReturn => {
    // Create token refresh manager
    const { stopTokenAutoRefresh, startTokenAutoRefresh } = useMemo(
        () => createTokenRefreshManager(), []
    );

    /**
     * Registers a new user and moves to the activation page.
     * @param {SetAuthState} setAuthState - Function to set the authentication state.
     * @param {SignupBody} formData - The form data for signing up the user.
     */
    const register = useCallback(async (setAuthState: SetAuthState, formData: SignupBody) => {
        await registerUser({
            setAuthState,
            formData,
            onErrorFn
        });
    }, [onErrorFn]);

    /**
     * Authenticates a user with the provided form data.
     * @param {LoginBody} formData - The form data for user authentication.
     */
    const authenticate = useCallback(async (formData: LoginBody) => {
        await authenticateUser({
            formData,
            onSuccessFn,
            onErrorFn,
            onLoadFn
        });
    }, [onSuccessFn, onErrorFn, onLoadFn]);

    /**
     * Signs up a user with the provided form data.
     * @param {SignupBody} formData - The form data for signing up the user.
     */
    const signup = useCallback(async (formData: SignupBody) => {
        await signupUser({
            formData,
            onSuccessFn,
            onErrorFn,
            onLoadFn
        });
    }, [onSuccessFn, onErrorFn, onLoadFn]);

    /**
     * Activates a user account using the provided code.
     * @param {string} code - The activation code for the user.
     */
    const activate = useCallback(async (code: string) => {
        await activateUser({
            code,
            onSuccessFn,
            onErrorFn,
            onLoadFn
        });
    }, [onSuccessFn, onErrorFn, onLoadFn]);

    /**
     * Signs out the current user.
     */
    const signout = useCallback(async () => {
        // Stop token refresh before signing out
        stopTokenAutoRefresh();

        await signoutUser({
            onSuccessFn,
            onErrorFn,
            onLoadFn
        });
    }, [stopTokenAutoRefresh, onSuccessFn, onErrorFn, onLoadFn]);

    /**
     * Loads and starts auto-refreshing the access token.
     */
    const loadAccessToken = useCallback(() => {
        startTokenAutoRefresh({
            refreshInterval,
            onSuccessFn,
            onErrorFn: (error) => {
                stopTokenAutoRefresh();
                onErrorFn(error);
            }
        });
    }, [refreshInterval, startTokenAutoRefresh, onSuccessFn, onErrorFn, stopTokenAutoRefresh]);

    return {
        loadAccessToken,
        signup,
        activate,
        signout,
        authenticate,
        register,
    };
};

export default useJwtAuth;