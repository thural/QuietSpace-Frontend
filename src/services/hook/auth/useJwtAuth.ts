import {
    LoginBody,
    SetAuthState,
    SignupBody
} from '@/types/authTypes';
import { JwtAuthProps } from '@/types/hookPropTypes';
import {
    authenticateUser,
    createTokenRefreshManager,
    registerUser,
    signoutUser,
    signupUser
} from '@/utils/jwtAuthUtils';
import { useCallback, useMemo } from 'react';

interface UseJwtAuthReturn {
    loadAccessToken: () => void;
    signup: (formData: SignupBody) => void;
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

    // Register user and move to activation page
    const register = useCallback(async (setAuthState: SetAuthState, formData: SignupBody) => {
        await registerUser({
            setAuthState,
            formData,
            onErrorFn
        });
    }, [onErrorFn]);

    // Authenticate user
    const authenticate = useCallback(async (formData: LoginBody) => {
        await authenticateUser({
            formData,
            onSuccessFn,
            onErrorFn,
            onLoadFn
        });
    }, [onSuccessFn, onErrorFn, onLoadFn]);

    // Signup user
    const signup = useCallback(async (formData: SignupBody) => {
        await signupUser({
            formData,
            onSuccessFn,
            onErrorFn,
            onLoadFn
        });
    }, [onSuccessFn, onErrorFn, onLoadFn]);

    // Sign out user
    const signout = useCallback(async () => {
        // Stop token refresh before signing out
        stopTokenAutoRefresh();

        await signoutUser({
            onSuccessFn,
            onErrorFn,
            onLoadFn
        });
    }, [stopTokenAutoRefresh, onSuccessFn, onErrorFn, onLoadFn]);

    // Load and start auto-refreshing access token
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
        signout,
        authenticate,
        register,
    };
};

export default useJwtAuth;