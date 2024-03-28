import { create } from 'zustand'

export const bearStore = create((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
    updateBears: (newBears) => set({ bears: newBears }),
}))

export const authStore = create(set => ({
    data: { message: "", token: "", userId: "" },
    resetAuthData: () => set({
        data:{ message: "", token: "", userId: "" }
    }),
    setAuthData: (authData) => set({
        data:authData
    })
}))