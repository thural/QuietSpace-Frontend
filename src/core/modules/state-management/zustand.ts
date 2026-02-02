import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthResponse } from '@features/auth/data/models/auth';

// User interface for authentication
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  permissions?: string[];
  role?: string;
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

  // Form state (kept for persistence compatibility)
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

  // Legacy compatibility actions
  setAuthData: (authData: AuthResponse) => void;
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
        const currentState = get();
        if (currentState.isAuthenticated) {
          console.warn('User is already authenticated, logging out first...');
          // Clear existing session before logging in with new credentials
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
        }

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

      // Legacy compatibility actions
      setAuthData: (authData) => set({
        data: authData,
        isAuthenticated: true,
        isLoading: false,
        isError: false,
        error: null
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




