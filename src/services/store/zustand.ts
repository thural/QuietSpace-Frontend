import { AuthResponse } from '@/api/schemas/inferred/auth';
import type { JwtToken } from '@/api/schemas/inferred/common';
import { UseAuthStoreProps } from '@/types/authStoreTypes';
import { ActiveChatId, ChatClientMethods, ChatStoreProps } from '@/types/chatStoreTypes';
import { NotificationStoreProps } from '@/types/notificationStore';
import { StompStore } from '@/types/stompStoreTypes';
import { ViewState, ViewStoreProps } from '@/types/viewStoreTypes';
import { create } from 'zustand';


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
    setAuthData: (authData: AuthResponse) => set({ data: authData }),
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
    setClientMethods: (methods: Record<string, any>) => set({ clientMethods: methods }),
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


export const useThemeStore = create<{ data: boolean, setThemeStore: (checked: boolean) => void }>(set => ({
    data: false,
    setThemeStore: (checked: boolean) => set({ data: checked }),
}));



export const useChatStore = create<ChatStoreProps>(set => ({
    data: { activeChatId: null, messageInput: {} },
    clientMethods: {
        sendChatMessage: () => console.error("client method is not ready"),
        deleteChatMessage: () => console.error("client method is not ready"),
        setMessageSeen: () => console.error("client method is not ready"),
        isClientConnected: false
    },
    isLoading: false,
    isError: false,
    error: null,
    setActiveChatId: (activeChatId: ActiveChatId) => set(state => ({ data: { ...state.data, activeChatId } })),
    setMessageInput: (messageInput: Record<string, string>) => set(state => ({ data: { ...state.data, messageInput } })),
    setClientMethods: (methods: ChatClientMethods) => set({ clientMethods: methods }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setIsError: (isError: boolean) => set({ isError }),
    setError: (error: Error) => set({ error })
}));


export const useStompStore = create<StompStore>((set) => ({
    clientContext: {},
    setClientContext: (methods) => set({
        clientContext: { ...methods }
    }),
    resetClientContext: () => set({ clientContext: {} })
}));