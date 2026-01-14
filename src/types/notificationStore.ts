export interface NotificationStoreProps {
    clientMethods: Record<string, any>
    isLoading: boolean
    isError: boolean
    error: null | Error
    setClientMethods: (methods: Record<string, any>) => void
    setIsLoading: (value: boolean) => void
    setIsError: (value: boolean) => void
    setError: (value: Error) => void
}