import { RefreshTokenSchema } from "@/api/schemas/auth";

export interface UseAuthStoreProps {
    isAuthenticated: boolean,
    isLoading: boolean,
    isError: boolean,
    error: null | Error,
    data: RefreshTokenSchema,
    isActivationStage: boolean,
    resetAuthData: () => void,
    setAuthData: (authData: RefreshTokenSchema) => void,
    setIsActivationStage: (value: boolean) => void,
    setIsAuthenticated: (value: boolean) => void,
    setIsLoading: (value: boolean) => void,
    setIsError: (value: boolean) => void,
    setError: (value: Error) => void
}