import { create } from 'zustand'

export const bearStore = create((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
    updateBears: (newBears) => set({ bears: newBears }),
}));

export const useAuthStore = create(set => ({
    data: { message: "", accessToken: "", refreshToken: "", userId: "" },
    resetAuthData: () => set({
        data: { message: "", accessToken: "",refreshToken: "", userId: "" }
    }),
    setAuthData: (authData) => set({
        data: authData
    }),
}));

export const viewStore = create(set => ({
    data: {
        overlay: false,
        createPost: false,
        editPost: false
    },
    setViewData: (state, viewData) => set({
        data: { ...state, ...viewData }
    }),
}));

export const useChatStore = create(set => ({
    data: {activeChatId: null, messageInput:{}},

    setActiveChatId: (activeChatId) => {
        set(state => ({
            data: {...state, activeChatId}
        }));
    },

    setMessageInput: (messageInput) => {
        set(state => ({
            data: {...state, messageInput}
        }))
    }
}));