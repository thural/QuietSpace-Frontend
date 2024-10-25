import { Auth, RefreshToken } from "@/api/schemas/inferred/auth";

export interface UseAuthStoreProps {
    isAuthenticated: boolean,
    isLoading: boolean,
    isError: boolean,
    error: null | Error,
    data: RefreshToken,
    isActivationStage: boolean,
    resetAuthData: () => void,
    setAuthData: (authData: Auth) => void,
    setIsActivationStage: (value: boolean) => void,
    setIsAuthenticated: (value: boolean) => void,
    setIsLoading: (value: boolean) => void,
    setIsError: (value: boolean) => void,
    setError: (value: Error) => void
}