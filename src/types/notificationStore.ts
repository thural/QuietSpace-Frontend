export interface NotificationStoreProps {
    clientMethods: Object
    isLoading: boolean
    isError: boolean
    error: null | Error
    setClientMethods: (methods: Record<string, Function>) => void
    setIsLoading: (value: boolean) => void
    setIsError: (value: boolean) => void
    setError: (value: Error) => void
}