/**
 * Global Authentication Store.
 * 
 * Centralized authentication state management using Zustand.
 * Handles user session, tokens, and authentication flow.
 */

import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Global authentication store
 */
export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: (user, token) => {
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
    
    // Persist to localStorage
    localStorage.setItem('auth', JSON.stringify({
      user,
      token,
      isAuthenticated: true
    }));
  },
  
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    
    // Clear localStorage
    localStorage.removeItem('auth');
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null })
}));

/**
 * Initialize auth store from localStorage
 */
export const initializeAuthStore = () => {
  try {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const { user, token, isAuthenticated } = JSON.parse(stored);
      
      useAuthStore.setState({
        user,
        token,
        isAuthenticated,
        isLoading: false,
        error: null
      });
    }
  } catch (error) {
    console.error('Failed to initialize auth store:', error);
  }
};
