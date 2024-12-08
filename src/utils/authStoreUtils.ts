
export const getRefreshToken = (): string => {
    const refreshToken: string | null = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("refreshToken is undefined");
    return refreshToken;
}

export const clearRefreshToken = (): void => {
    localStorage.removeItem("refreshToken");
}

export const clearAccessToken = (): void => {
    localStorage.removeItem("accessToken");
}

export const clearAuthTokens = (): void => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
}

export const setRefreshToken = (token: string): void => {
    localStorage.setItem("refreshToken", token);
}