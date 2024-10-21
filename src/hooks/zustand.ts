import { AuthData } from '@/components/shared/types/authTypes';
import { ChatState, ViewState, ViewStoreProps } from '@/components/shared/types/viewTypes';
import { create } from 'zustand'

export const useAuthStore = create(set => ({
    isAuthenticated: false,
    isLoading: false,
    isError: false,
    error: null,
    data: { message: "", accessToken: "", refreshToken: "", userId: "" },
    isActivationStage: false,
    resetAuthData: () => set({
        data: { message: "", accessToken: "", refreshToken: "", userId: "" }
    }),
    setAuthData: (authData: AuthData) => set({ data: authData }),
    setIsActivationStage: (value: boolean) => set({ isActivationStage: value }),
    setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setIsError: (value: boolean) => set({ isError: value }),
    setError: (value: Error) => set({ error: value })
}));

export const useNotificationStore = create(set => ({
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

export const useChatStore = create(set => ({
    data: { activeChatId: null, messageInput: {} },
    clientMethods: {},
    isLoading: false,
    isError: false,
    error: null,
    setActiveChatId: (activeChatId: string) => {
        set((state: ChatState) => ({
            data: { ...state, activeChatId }
        }));
    },
    setMessageInput: (messageInput: Record<string, string>) => {
        set((state: ChatState) => ({
            data: { ...state, messageInput }
        }))
    },
    setClientMethods: (methods: Record<string, Function>) => set({ clientMethods: methods }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setIsError: (value: boolean) => set({ isError: value }),
    setError: (value: Error) => set({ error: value })
}));


export const useStompStore = create(set => ({
    clientContext: {},
    setClientContext: (methods: Record<string, Function>) => set({
        clientContext: methods
    }),
}));