/**
 * API Client Configuration.
 * 
 * Centralized Axios wrapper for all HTTP requests.
 * Includes interceptors for authentication and logging.
 * 
 * DEPRECATED: This file uses direct store access and should be replaced
 * with DI-based authentication. Use createDIAuthenticatedApiClient instead.
 */

import axios from 'axios';

/**
 * Extended axios request configuration interface
 * @typedef {Object} ExtendedAxiosRequestConfig
 * @property {Object} [metadata] - Request metadata
 * @property {Date} [metadata.startTime] - Request start time
 * @property {boolean} [_retry] - Retry flag
 * @property {string} [method] - HTTP method
 * @property {string} [url] - Request URL
 * @property {Object} [headers] - Request headers
 * @property {*} [data] - Request data
 */

/**
 * Base API client with authentication and error handling
 * @deprecated Use createDIAuthenticatedApiClient from network module instead
 * @type {import('axios').AxiosInstance}
 */
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for authentication token injection
 * @deprecated This uses direct store access. Use DI-based authentication instead.
 */
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Replace with DI-based token provider
    // This is a temporary implementation for backward compatibility
    try {
      const { useAuthStore } = require('@/core/store/zustand.js');
      const { token } = useAuthStore.getState();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token from store:', error);
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling and token refresh
 * @deprecated This uses direct store access. Use DI-based authentication instead.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response time for performance monitoring
    const duration = new Date().getTime() - response.config.metadata?.startTime?.getTime();
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('[API Response Error]', error);

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // TODO: Replace with DI-based token refresh
        // This is a temporary implementation for backward compatibility
        const { data } = await apiClient.post('/auth/refresh-token');
        const newToken = data?.accessToken;

        if (newToken) {
          // Update token in store
          const { useAuthStore } = require('@/core/store/zustand.js');
          useAuthStore.getState().setAuthData({
            ...data,
            accessToken: newToken
          });

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }

      } catch (refreshError) {
        // Refresh failed - logout user
        console.error('Token refresh failed:', refreshError);

        try {
          const { useAuthStore } = require('@/core/store/zustand.js');
          useAuthStore.getState().logout();
        } catch (logoutError) {
          console.error('Failed to logout:', logoutError);
        }

        // Redirect to login page
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    // Handle other HTTP errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status, error.config.url);
    } else if (error.response?.status === 403) {
      console.error('Access forbidden:', error.config.url);
    } else if (error.response?.status === 404) {
      console.error('Resource not found:', error.config.url);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
