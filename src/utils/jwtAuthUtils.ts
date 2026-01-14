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
     * Stops the automatic token refresh process.
     *
     * This function clears the interval set for refreshing the access token
     * and resets the interval reference to zero. It should be called when
     * the token refresh is no longer needed.
     */
    const stopTokenAutoRefresh = (): void => {
        if (refreshIntervalRef.current) {
            window.clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = 0;
        }
    };

    /**
     * Starts the automatic access token refresh process.
     *
     * @param {Object} options - Token refresh options.
     * @param {number} [options.refreshInterval=540000] - The interval (in milliseconds) at which to refresh the token (default is 9 minutes).
     * @param {(data: unknown) => void} options.onSuccessFn - Callback function to be called on successful token refresh.
     * @param {(error: Error) => void} options.onErrorFn - Callback function to be called if an error occurs during the token refresh.
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
 * Registers a new user.
 *
 * This function handles the user registration process. It attempts to register the user
 * with the provided form data. On success, it sets the application state to prompt
 * for account activation.
 *
 * @param {Object} options - Registration options.
 * @param {(state: { page: string, formData: SignupBody }) => void} options.setAuthState - Function to update the authentication state.
 * @param {SignupBody} options.formData - The data for user signup.
 * @param {(error: Error) => void} options.onErrorFn - Callback function to handle errors during the registration process.
 * @returns {Promise<void>} - A promise that resolves when the registration is complete.
 */
export const registerUser = async ({
    setAuthState,
    formData,
    onErrorFn
}: {
    setAuthState: (state: { page: AuthPages, formData: SignupBody }) => void;
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
 * Authenticates a user with login credentials.
 *
 * This function logs in the user using the provided credentials. On successful login,
 * it stores the refresh token and invokes the success callback.
 *
 * @param {Object} options - Authentication options.
 * @param {LoginBody} options.formData - The login credentials.
 * @param {(data: AuthResponse) => void} options.onSuccessFn - Callback function to be called on successful login.
 * @param {(error: Error) => void} options.onErrorFn - Callback function to handle errors during authentication.
 * @param {() => void} options.onLoadFn - Callback function to indicate loading state.
 * @returns {Promise<void>} - A promise that resolves when authentication is complete.
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
 * Retrieves a new access token using the refresh token.
 *
 * This function fetches a new access token by sending the stored refresh token to the server.
 * On success, it invokes the success callback with the new token data.
 *
 * @param {Object} options - Access token retrieval options.
 * @param {(data: unknown) => void} options.onSuccessFn - Callback function to be called on successful retrieval of the access token.
 * @param {(error: Error) => void} options.onErrorFn - Callback function to handle errors during token retrieval.
 * @returns {Promise<void>} - A promise that resolves when the token retrieval is complete.
 * @throws {Error} - Throws an error if no refresh token is available.
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
 * Signs out the current user.
 *
 * This function logs out the user by sending a logout request to the server and clearing
 * the stored authentication tokens. On success, it invokes the success callback.
 *
 * @param {Object} options - Signout options.
 * @param {(response?: Response) => void} options.onSuccessFn - Callback function to be called on successful signout.
 * @param {(error: Error) => void} options.onErrorFn - Callback function to handle errors during signout.
 * @param {() => void} options.onLoadFn - Callback function to indicate loading state.
 * @returns {Promise<void>} - A promise that resolves when signout is complete.
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
 * Signs up a new user.
 *
 * This function handles the user signup process. It sends the user's signup data to the
 * server and invokes the appropriate callback functions based on the outcome.
 *
 * @param {Object} options - Signup options.
 * @param {SignupBody} options.formData - The data for user signup.
 * @param {() => void} options.onSuccessFn - Callback function to be called on successful signup.
 * @param {(error: Error) => void} options.onErrorFn - Callback function to handle errors during signup.
 * @param {() => void} options.onLoadFn - Callback function to indicate loading state.
 * @returns {Promise<void>} - A promise that resolves when signup is complete.
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
 * Activates a user account.
 *
 * This function sends an activation code to the server to activate a user account.
 * On success, it invokes the success callback.
 *
 * @param {Object} options - Activation options.
 * @param {string} options.code - The activation code.
 * @param {() => void} options.onSuccessFn - Callback function to be called on successful activation.
 * @param {(error: Error) => void} options.onErrorFn - Callback function to handle errors during activation.
 * @param {() => void} options.onLoadFn - Callback function to indicate loading state.
 * @returns {Promise<void>} - A promise that resolves when activation is complete.
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