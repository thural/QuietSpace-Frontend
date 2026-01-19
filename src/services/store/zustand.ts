import { AuthResponse } from '../../api/schemas/inferred/auth';
import type { JwtToken } from '../../api/schemas/inferred/common';
import { UseAuthStoreProps } from '../../types/authStoreTypes';
import { ActiveChatId, ChatClientMethods, ChatStoreProps } from '../../types/chatStoreTypes';
import { NotificationStoreProps } from '../../types/notificationStore';
import { StompStore } from '../../types/stompStoreTypes';
import { ViewState, ViewStoreProps } from '../../types/viewStoreTypes';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User interface for authentication
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

// Consolidated Auth State interface
export interface AuthState {
  // User and session data
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Form state for auth flows
  currentPage: 'LOGIN' | 'SIGNUP' | 'ACTIVATION';
  formData: {
    email?: string;
    password?: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    confirmPassword?: string;
    activationCode?: string;
  };
  
  // Legacy compatibility
  data: AuthResponse | { id: string; message: string; accessToken: string; userId: string };
  isActivationStage: boolean;
}


// Consolidated Auth Actions interface
export interface AuthActions {
  // Authentication actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  clearError: () => void;
  
  // Form state actions
  setCurrentPage: (page: 'LOGIN' | 'SIGNUP' | 'ACTIVATION') => void;
  setFormData: (data: Partial<AuthState['formData']>) => void;
  resetFormData: () => void;
  
  // Legacy compatibility actions
  setAuthData: (authData: AuthResponse) => void;
  setIsActivationStage: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setIsError: (value: boolean) => void;
  resetAuthData: () => void;
}

/**
 * Consolidated Authentication Store
 * 
 * This store combines user session management, form state management,
 * and maintains backward compatibility with existing code.
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isError: false,
      error: null,
      
      // Form state
      currentPage: 'LOGIN',
      formData: {},
      
      // Legacy compatibility
      data: { id: '', message: '', accessToken: '', userId: '' },
      isActivationStage: false,
      
      // Authentication actions
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          isError: false
        });
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isError: false,
          currentPage: 'LOGIN',
          formData: {}
        });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error, isError: !!error }),
      
      clearError: () => set({ error: null, isError: false }),
      
      // Form state actions
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setFormData: (data) => set((state) => ({ 
        formData: { ...state.formData, ...data } 
      })),
      
      resetFormData: () => set({ formData: {} }),
      
      // Legacy compatibility actions
      setAuthData: (authData) => set({ 
        data: authData,
        isAuthenticated: true,
        isLoading: false,
        isError: false,
        error: null
      }),
      
      setIsActivationStage: (value) => set({ isActivationStage: value }),
      
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      
      setIsLoading: (value) => set({ isLoading: value }),
      
      setIsError: (value) => set({ isError: value }),
      
      resetAuthData: () => set({
        data: { id: '', message: '', accessToken: '', userId: '' }
      })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        currentPage: state.currentPage,
        formData: state.formData
      })
    }
  )
);


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