import { AuthResponse, RefreshTokenResponse } from "@/features/auth/data/models/auth";

export interface UseAuthStoreProps {
    isAuthenticated: boolean,
    isLoading: boolean,
    isError: boolean,
    error: null | Error,
    data: RefreshTokenResponse,
    isActivationStage: boolean,
    resetAuthData: () => void,
    setAuthData: (authData: AuthResponse) => void,
    setIsActivationStage: (value: boolean) => void,
    setIsAuthenticated: (value: boolean) => void,
    setIsLoading: (value: boolean) => void,
    setIsError: (value: boolean) => void,
    setError: (value: Error) => void
}