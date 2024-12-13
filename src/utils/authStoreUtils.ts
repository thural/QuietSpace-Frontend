/**
 * Retrieves the refresh token from local storage.
 *
 * @returns {string} - The refresh token stored in local storage.
 * @throws {Error} - Throws an error if the refresh token is not found.
 */
export const getRefreshToken = (): string => {
    const refreshToken: string | null = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("refreshToken is undefined");
    return refreshToken;
}

/**
 * Clears the refresh token from local storage.
 *
 * This function removes the refresh token entry from local storage, effectively logging out the user.
 */
export const clearRefreshToken = (): void => {
    localStorage.removeItem("refreshToken");
}

/**
 * Clears the access token from local storage.
 *
 * This function removes the access token entry from local storage, which is typically used for authentication.
 */
export const clearAccessToken = (): void => {
    localStorage.removeItem("accessToken");
}

/**
 * Clears both the refresh and access tokens from local storage.
 *
 * This function is useful for logging out the user by removing all authentication tokens.
 */
export const clearAuthTokens = (): void => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
}

/**
 * Sets the refresh token in local storage.
 *
 * @param {string} token - The refresh token to be stored.
 */
export const setRefreshToken = (token: string): void => {
    localStorage.setItem("refreshToken", token);
}