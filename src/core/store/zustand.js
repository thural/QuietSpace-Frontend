import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * User interface for authentication
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} username - Username
 * @property {string} [email] - Email address
 * @property {string} [avatar] - Avatar URL
 * @property {string} [bio] - User bio
 * @property {Array<string>} [permissions] - User permissions
 * @property {string} [role] - User role
 */

/**
 * Auth response interface
 * @typedef {Object} AuthResponse
 * @property {string} id - Response ID
 * @property {string} message - Response message
 * @property {string} accessToken - Access token
 * @property {string} userId - User ID
 */

/**
 * Active chat ID type
 * @typedef {string} ActiveChatId
 */

/**
 * Chat client methods interface
 * @typedef {Object} ChatClientMethods
 * @property {Function} sendChatMessage - Send chat message method
 * @property {Function} deleteChatMessage - Delete chat message method
 * @property {Function} setMessageSeen - Set message seen method
 * @property {boolean} isClientConnected - Client connection status
 */

/**
 * Chat store properties interface
 * @typedef {Object} ChatStoreProps
 * @property {Object} data - Chat data
 * @property {ActiveChatId} data.activeChatId - Active chat ID
 * @property {Object} data.messageInput - Message input
 * @property {ChatClientMethods} clientMethods - Client methods
 * @property {boolean} isLoading - Loading status
 * @property {boolean} isError - Error status
 * @property {Error} [error] - Error object
 * @property {Function} setActiveChatId - Set active chat ID
 * @property {Function} setMessageInput - Set message input
 * @property {Function} setClientMethods - Set client methods
 * @property {Function} setIsLoading - Set loading status
 * @property {Function} setIsError - Set error status
 * @property {Function} setError - Set error
 */

/**
 * Notification store properties interface
 * @typedef {Object} NotificationStoreProps
 * @property {Object} clientMethods - Client methods
 * @property {boolean} isLoading - Loading status
 * @property {boolean} isError - Error status
 * @property {Error} [error] - Error object
 * @property {Function} setClientMethods - Set client methods
 * @property {Function} setIsLoading - Set loading status
 * @property {Function} setIsError - Set error status
 * @property {Function} setError - Set error
 */

/**
 * Stomp store interface
 * @typedef {Object} StompStore
 * @property {Object} clientContext - Client context
 * @property {Function} setClientContext - Set client context
 * @property {Function} resetClientContext - Reset client context
 */

/**
 * View state interface
 * @typedef {Object} ViewState
 * @property {boolean} overlay - Overlay status
 * @property {boolean} createPost - Create post status
 * @property {boolean} editPost - Edit post status
 * @property {boolean} followings - Followings status
 * @property {boolean} followers - Followers status
 */

/**
 * View store properties interface
 * @typedef {Object} ViewStoreProps
 * @property {Object} data - View data
 * @property {ViewState} data.overlay - Overlay status
 * @property {Function} setViewData - Set view data
 */

// Consolidated Auth State interface
/**
 * Auth state interface
 * @typedef {Object} AuthState
 * @property {User|null} user - User data
 * @property {string|null} token - Authentication token
 * @property {boolean} isAuthenticated - Authentication status
 * @property {boolean} isLoading - Loading status
 * @property {boolean} isError - Error status
 * @property {Error|null} error - Error object
 * @property {string} currentPage - Current page
 * @property {Object} formData - Form data
 * @property {string} [formData.email] - Email
 * @property {string} [formData.password] - Password
 * @property {string} [formData.username] - Username
 * @property {string} [formData.firstname] - First name
 * @property {string} [formData.lastname] - Last name
 * @property {string} [formData.confirmPassword] - Confirm password
 * @property {string} [formData.activationCode] - Activation code
 * @property {AuthResponse} data - Legacy auth data
 * @property {boolean} isActivationStage - Activation stage status
 */

// Consolidated Auth Actions interface
/**
 * Auth actions interface
 * @typedef {Object} AuthActions
 * @property {(user: User, token: string) => void} login - Login action
 * @property {() => void} logout - Logout action
 * @property {(loading: boolean) => void} setLoading - Set loading
 * @property {(error: Error|null) => void} setError - Set error
 * @property {() => void} clearError - Clear error
 * @property {(page: string) => void} setCurrentPage - Set current page
 * @property {(data: Object) => void} setFormData - Set form data
 * @property {() => void} resetFormData - Reset form data
 * @property {(authData: AuthResponse) => void} setAuthData - Set auth data
 * @property {(value: boolean) => void} setIsActivationStage - Set activation stage
 * @property {(value: boolean) => void} setIsAuthenticated - Set authentication status
 * @property {(value: boolean) => void} setIsLoading - Set loading status
 * @property {(value: boolean) => void} setIsError - Set error status
 * @property {() => void} resetAuthData - Reset auth data
 */

/**
 * Consolidated Authentication Store
 * 
 * This store combines user session management, form state management,
 * and maintains backward compatibility with existing code.
 * 
 * @returns {Object} Auth store hook
 */
export const useAuthStore = create()(
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

/**
 * Notification store hook
 * 
 * @returns {NotificationStoreProps} Notification store hook
 */
export const useNotificationStore = create(set => ({
  clientMethods: {},
  isLoading: false,
  isError: false,
  error: null,
  setClientMethods: (methods) => set({ clientMethods: methods }),
  setIsLoading: (value) => set({ isLoading: value }),
  setIsError: (value) => set({ isError: value }),
  setError: (value) => set({ error: value })
}));

/**
 * View store hook
 * 
 * @returns {ViewStoreProps} View store hook
 */
export const viewStore = create(set => ({
  data: {
    overlay: false,
    createPost: false,
    editPost: false,
    followings: false,
    followers: false,
  },
  setViewData: (viewData) => set(state => ({
    data: { ...state.data, ...viewData }
  })),
}));

/**
 * Theme store hook
 * 
 * @returns {Object} Theme store hook
 */
export const useThemeStore = create(set => ({
  data: false,
  setThemeStore: (checked) => set({ data: checked }),
}));

/**
 * Chat store hook
 * 
 * @returns {ChatStoreProps} Chat store hook
 */
export const useChatStore = create(set => ({
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
  setActiveChatId: (activeChatId) => set(state => ({ data: { ...state.data, activeChatId } })),
  setMessageInput: (messageInput) => set(state => ({ data: { ...state.data, messageInput } })),
  setClientMethods: (methods) => set({ clientMethods: methods }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsError: (isError) => set({ isError }),
  setError: (error) => set({ error })
}));

/**
 * Stomp store hook
 * 
 * @returns {StompStore} Stomp store hook
 */
export const useStompStore = create((set) => ({
  clientContext: {},
  setClientContext: (methods) => set({
    clientContext: { ...methods }
  }),
  resetClientContext: () => set({ clientContext: {} })
}));