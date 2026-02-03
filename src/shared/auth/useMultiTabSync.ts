import { useEffect, useRef, useCallback } from 'react';
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';

// Extend Window interface to include tabId
declare global {
  interface Window {
    tabId?: string;
  }
}

interface MultiTabSyncOptions {
  /** Channel name for broadcast communication (default: 'auth-sync') */
  channelName?: string;
  /** Enable/disable sync (default: true) */
  enabled?: boolean;
}

/**
 * Hook for synchronizing authentication state across multiple browser tabs
 * 
 * Uses BroadcastChannel API to communicate auth state changes between tabs.
 * Falls back to localStorage events for browsers without BroadcastChannel support.
 */
export const useMultiTabSync = (options: MultiTabSyncOptions = {}) => {
  const { channelName = 'auth-sync', enabled = true } = options;
  const {
    authData,
    token,
    isAuthenticated,
    setToken,
    clearAuth
  } = useFeatureAuth();

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const localStorageRef = useRef<boolean>(false);

  /** Broadcast auth event to other tabs */
  const broadcastAuthEvent = useCallback((type: string, data?: any) => {
    if (!enabled) return;

    const event = {
      type,
      data,
      timestamp: Date.now(),
      tabId: Math.random().toString(36).substr(2, 9)
    };

    // Try BroadcastChannel first
    if (broadcastChannelRef.current && 'postMessage' in broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage(event);
      } catch (error) {
        console.warn('BroadcastChannel failed, falling back to localStorage:', error);
        localStorageRef.current = true;
      }
    }

    // Fallback to localStorage events
    if (localStorageRef.current) {
      try {
        localStorage.setItem(`auth-${channelName}`, JSON.stringify(event));
        // Trigger storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
          key: `auth-${channelName}`,
          newValue: JSON.stringify(event)
        }));
      } catch (error) {
        console.error('localStorage sync failed:', error);
      }
    }
  }, [enabled, channelName]);

  /** Handle incoming auth events */
  const handleAuthEvent = useCallback((event: any) => {
    if (!enabled) return;

    let authEvent;

    // Handle BroadcastChannel message
    if (event.data && event.data.type) {
      authEvent = event.data;
    }
    // Handle localStorage event
    else if (event.key === `auth-${channelName}` && event.newValue) {
      try {
        authEvent = JSON.parse(event.newValue);
      } catch (error) {
        console.error('Failed to parse auth event:', error);
        return;
      }
    } else {
      return;
    }

    // Ignore events from current tab
    if (authEvent.tabId === window.tabId) return;

    // Process auth events
    switch (authEvent.type) {
      case 'login':
        if (authEvent.data?.token) {
          setToken(authEvent.data.token);
        }
        break;

      case 'logout':
        clearAuth();
        break;

      case 'token-refresh':
        if (authEvent.data?.accessToken) {
          setToken(authEvent.data.accessToken);
        }
        break;

      case 'session-timeout':
        clearAuth();
        break;

      default:
        console.log('Unknown auth event type:', authEvent.type);
    }
  }, [enabled, channelName, setToken, clearAuth]);

  /** Setup sync mechanisms */
  useEffect(() => {
    if (!enabled) return;

    // Generate unique tab ID
    window.tabId = Math.random().toString(36).substr(2, 9);

    // Setup BroadcastChannel
    if ('BroadcastChannel' in window) {
      try {
        broadcastChannelRef.current = new BroadcastChannel(channelName);
        broadcastChannelRef.current.onmessage = handleAuthEvent;
      } catch (error) {
        console.warn('BroadcastChannel not supported, using localStorage fallback:', error);
        localStorageRef.current = true;
      }
    } else {
      localStorageRef.current = true;
    }

    // Setup localStorage event listener
    if (localStorageRef.current) {
      const handleStorageEvent = (event: StorageEvent) => {
        handleAuthEvent(event);
      };
      window.addEventListener('storage', handleStorageEvent);

      return () => {
        window.removeEventListener('storage', handleStorageEvent);
      };
    }

    // Cleanup
    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
        broadcastChannelRef.current = null;
      }
    };
  }, [enabled, channelName, handleAuthEvent]);

  /** Sync login action */
  const syncLogin = useCallback((userData: any, userToken: string) => {
    setToken(userToken);
    broadcastAuthEvent('login', { user: userData, token: userToken });
  }, [setToken, broadcastAuthEvent]);

  /** Sync logout action */
  const syncLogout = useCallback(() => {
    clearAuth();
    broadcastAuthEvent('logout');
  }, [clearAuth, broadcastAuthEvent]);

  /** Sync token refresh */
  const syncTokenRefresh = useCallback((newTokenData: any) => {
    if (newTokenData?.accessToken) {
      setToken(newTokenData.accessToken);
    }
    broadcastAuthEvent('token-refresh', newTokenData);
  }, [setToken, broadcastAuthEvent]);

  /** Sync session timeout */
  const syncSessionTimeout = useCallback(() => {
    clearAuth();
    broadcastAuthEvent('session-timeout');
  }, [clearAuth, broadcastAuthEvent]);

  return {
    syncLogin,
    syncLogout,
    syncTokenRefresh,
    syncSessionTimeout,
    isEnabled: enabled
  };
};

/**
 * Multi-tab synchronization manager class
 */
export class MultiTabSyncManager {
  private channelName: string;
  private enabled: boolean;
  private broadcastChannel: BroadcastChannel | null = null;
  private useLocalStorage: boolean = false;
  private tabId: string;
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor(options: MultiTabSyncOptions = {}) {
    this.channelName = options.channelName || 'auth-sync';
    this.enabled = options.enabled !== false;
    this.tabId = Math.random().toString(36).substr(2, 9);
  }

  /** Initialize sync manager */
  initialize() {
    if (!this.enabled) return;

    // Setup BroadcastChannel
    if ('BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(this.channelName);
        this.broadcastChannel.onmessage = this.handleMessage.bind(this);
      } catch (error) {
        console.warn('BroadcastChannel not supported, using localStorage fallback:', error);
        this.useLocalStorage = true;
      }
    } else {
      this.useLocalStorage = true;
    }

    // Setup localStorage fallback
    if (this.useLocalStorage) {
      window.addEventListener('storage', this.handleStorageEvent.bind(this));
    }
  }

  /** Cleanup sync manager */
  destroy() {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }

    if (this.useLocalStorage) {
      window.removeEventListener('storage', this.handleStorageEvent.bind(this));
    }

    this.eventHandlers.clear();
  }

  /** Add event listener */
  on(eventType: string, handler: Function) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  /** Remove event listener */
  off(eventType: string, handler: Function) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /** Broadcast event to other tabs */
  broadcast(type: string, data?: any) {
    if (!this.enabled) return;

    const event = {
      type,
      data,
      timestamp: Date.now(),
      tabId: this.tabId
    };

    // Try BroadcastChannel first
    if (this.broadcastChannel && !this.useLocalStorage) {
      try {
        this.broadcastChannel.postMessage(event);
      } catch (error) {
        console.warn('BroadcastChannel failed, falling back to localStorage:', error);
        this.useLocalStorage = true;
      }
    }

    // Fallback to localStorage
    if (this.useLocalStorage) {
      try {
        localStorage.setItem(`auth-${this.channelName}`, JSON.stringify(event));
        window.dispatchEvent(new StorageEvent('storage', {
          key: `auth-${this.channelName}`,
          newValue: JSON.stringify(event)
        }));
      } catch (error) {
        console.error('localStorage sync failed:', error);
      }
    }
  }

  /** Handle BroadcastChannel message */
  private handleMessage(event: MessageEvent) {
    if (event.data && event.data.tabId !== this.tabId) {
      this.processEvent(event.data);
    }
  }

  /** Handle localStorage event */
  private handleStorageEvent(event: StorageEvent) {
    if (event.key === `auth-${this.channelName}` && event.newValue) {
      try {
        const authEvent = JSON.parse(event.newValue);
        if (authEvent.tabId !== this.tabId) {
          this.processEvent(authEvent);
        }
      } catch (error) {
        console.error('Failed to parse auth event:', error);
      }
    }
  }

  /** Process received event */
  private processEvent(event: any) {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event.data, event);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }
  }
}

export default useMultiTabSync;
