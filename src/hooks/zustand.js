import { create } from 'zustand'

export const bearStore = create((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
    updateBears: (newBears) => set({ bears: newBears }),
}));

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
    setAuthData: (authData) => set({
        data: authData
    }),
    setIsActivationStage: (value) => set({
        isActivationStage: value
    }),
    setIsAuthenticated: (value) => set({
        isAuthenticated: value
    }),
    setIsLoading: (value) => set({
        isLoading: value
    }),
    setIsError: (value) => set({
        isError: value
    }),
    setError: (value) => set({
        error: value
    })
}));

export const viewStore = create(set => ({
    data: {
        overlay: false,
        createPost: false,
        editPost: false,
        followings: false,
        followers: false,
    },
    setViewData: (state, viewData) => set({
        data: { ...state, ...viewData }
    }),
}));

export const useChatStore = create(set => ({
    data: { activeChatId: null, messageInput: {} },

    setActiveChatId: (activeChatId) => {
        set(state => ({
            data: { ...state, activeChatId }
        }));
    },

    setMessageInput: (messageInput) => {
        set(state => ({
            data: { ...state, messageInput }
        }))
    }
}));