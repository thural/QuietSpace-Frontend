import {
    clearAuthTokens,
    getRefreshToken,
    setRefreshToken
} from '@/utils/authStoreUtils';
import {
    fetchAccessToken,
    fetchActivation,
    fetchLogin,
    fetchLogout,
    fetchSignup
} from '@/api/requests/authRequests';
import { AuthResponse } from '@/api/schemas/inferred/auth';
import { AuthPages, SignupBody, LoginBody } from '@/types/authTypes';

// Use a ref object to manage interval ID 
export const createTokenRefreshManager = () => {
    const refreshIntervalRef = { current: 0 };

    /**
     * Stops the automatic token refresh process
     */
    const stopTokenAutoRefresh = (): void => {
        if (refreshIntervalRef.current) {
            window.clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = 0;
        }
    };

    /**
     * Start automatic access token refresh
     * @param options - Token refresh options
     */
    const startTokenAutoRefresh = ({
        refreshInterval = 540000,
        onSuccessFn,
        onErrorFn
    }: {
        refreshInterval?: number;
        onSuccessFn: (data: unknown) => void;
        onErrorFn: (error: Error) => void;
    }): void => {
        // Clear any existing interval
        stopTokenAutoRefresh();

        // Initial token fetch
        getAccessToken({ onSuccessFn, onErrorFn });

        // Set up periodic refresh
        refreshIntervalRef.current = window.setInterval(
            () => getAccessToken({ onSuccessFn, onErrorFn }),
            refreshInterval
        );
    };

    return {
        stopTokenAutoRefresh,
        startTokenAutoRefresh
    };
};

/**
 * Register a new user
 * @param options - Registration options
 */
export const registerUser = async ({
    setAuthState,
    formData,
    onErrorFn
}: {
    setAuthState: (state: { page: string, formData: SignupBody }) => void;
    formData: SignupBody;
    onErrorFn: (error: Error) => void;
}): Promise<void> => {
    try {
        await fetchSignup(formData);
        setAuthState({ page: AuthPages.ACTIVATION, formData });
    } catch (error) {
        onErrorFn(error instanceof Error ? error : new Error(String(error)));
    }
};

/**
 * Authenticate user with login credentials
 * @param options - Authentication options
 */
export const authenticateUser = async ({
    formData,
    onSuccessFn,
    onErrorFn,
    onLoadFn
}: {
    formData: LoginBody;
    onSuccessFn: (data: AuthResponse) => void;
    onErrorFn: (error: Error) => void;
    onLoadFn: () => void;
}): Promise<void> => {
    try {
        onLoadFn();
        const data = await fetchLogin(formData);
        setRefreshToken(data.refreshToken);
        onSuccessFn(data);
    } catch (error) {
        onErrorFn(error instanceof Error ? error : new Error(String(error)));
    }
};

/**
 * Retrieve a new access token using refresh token
 * @param options - Access token retrieval options
 */
export const getAccessToken = async ({
    onSuccessFn,
    onErrorFn
}: {
    onSuccessFn: (data: unknown) => void;
    onErrorFn: (error: Error) => void;
}): Promise<void> => {
    try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const data = await fetchAccessToken(refreshToken);
        onSuccessFn(data);
    } catch (error) {
        onErrorFn(error instanceof Error ? error : new Error(String(error)));
    }
};

/**
 * Sign out the current user
 * @param options - Signout options
 */
export const signoutUser = async ({
    onSuccessFn,
    onErrorFn,
    onLoadFn
}: {
    onSuccessFn: (response?: Response) => void;
    onErrorFn: (error: Error) => void;
    onLoadFn: () => void;
}): Promise<void> => {
    try {
        const refreshToken = getRefreshToken();

        onLoadFn();

        const response = await fetchLogout(refreshToken);
        clearAuthTokens();
        onSuccessFn(response);
    } catch (error) {
        console.error("(!) server side error on logging out, local credentials are cleared");
        clearAuthTokens();
        onErrorFn(error instanceof Error ? error : new Error(String(error)));
    }
};

/**
 * Signup a new user
 * @param options - Signup options
 */
export const signupUser = async ({
    formData,
    onSuccessFn,
    onErrorFn,
    onLoadFn
}: {
    formData: SignupBody;
    onSuccessFn: () => void;
    onErrorFn: (error: Error) => void;
    onLoadFn: () => void;
}): Promise<void> => {
    try {
        onLoadFn();
        await fetchSignup(formData);
        onSuccessFn();
    } catch (error) {
        onErrorFn(error instanceof Error ? error : new Error(String(error)));
    }
};

/**
 * Acitvate user
 * @param options - Activation options
 */
export const activateUser = async ({
    code,
    onSuccessFn,
    onErrorFn,
    onLoadFn
}: {
    code: string;
    onSuccessFn: () => void;
    onErrorFn: (error: Error) => void;
    onLoadFn: () => void;
}): Promise<void> => {
    try {
        onLoadFn();
        await fetchActivation(code);
        onSuccessFn();
    } catch (error) {
        onErrorFn(error instanceof Error ? error : new Error(String(error)));
    }
};