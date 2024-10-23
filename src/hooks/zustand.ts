import { AuthSchema } from '@/api/schemas/auth';
import { UseAuthStoreProps } from '@/types/authStoreTypes';
import { ChatStoreProps } from '@/types/chatStoreTypes';
import { NotificationStoreProps } from '@/types/notificationStore';
import { ViewState, ViewStoreProps } from '@/types/viewStoreTypes';
import { create } from 'zustand'


export const useAuthStore = create<UseAuthStoreProps>(set => ({
    isAuthenticated: false,
    isLoading: false,
    isError: false,
    error: null,
    data: { id: "", message: "", accessToken: "", userId: "" },
    isActivationStage: false,
    resetAuthData: () => set({
        data: { id: "", message: "", accessToken: "", userId: "" }
    }),
    setAuthData: (authData: AuthSchema) => set({ data: authData }),
    setIsActivationStage: (value: boolean) => set({ isActivationStage: value }),
    setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setIsError: (value: boolean) => set({ isError: value }),
    setError: (value: Error) => set({ error: value })
}));


export const useNotificationStore = create<NotificationStoreProps>(set => ({
    clientMethods: {},
    isLoading: false,
    isError: false,
    error: null,
    setClientMethods: (methods: Record<string, Function>) => set({ clientMethods: methods }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setIsError: (value: boolean) => set({ isError: value }),
    setError: (value: Error) => set({ error: value })
}));


export const viewStore = create<ViewStoreProps>(set => ({
    data: {
        overlay: false,
        createPost: false,
        editPost: false,
        followings: false,
        followers: false,
    },
    setViewData: (viewData: Partial<ViewState>) => set(state => ({
        data: { ...state.data, ...viewData }
    })),
}));


export const useChatStore = create<ChatStoreProps>(set => ({
    data: { activeChatId: null, messageInput: {} },
    clientMethods: {},
    isLoading: false,
    isError: false,
    error: null,
    setActiveChatId: (activeChatId: string) => set(state => ({ data: { ...state.data, activeChatId } })),
    setMessageInput: (messageInput: Record<string, string>) => set(state => ({ data: { ...state.data, messageInput } })),
    setClientMethods: (methods: Record<string, Function>) => set({ clientMethods: methods }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setIsError: (isError: boolean) => set({ isError }),
    setError: (error: Error) => set({ error })
}));


export const useStompStore = create(set => ({
    clientContext: {},
    setClientContext: (methods: Record<string, Function>) => set({
        clientContext: methods
    }),
}));