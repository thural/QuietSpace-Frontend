/**
 * API Client Configuration.
 * 
 * Centralized Axios wrapper for all HTTP requests.
 * Includes interceptors for authentication and logging.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/core/store/zustand';

// Extend axios config to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
  _retry?: boolean;
}

/**
 * Base API client with authentication and error handling
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for authentication token injection
 */
apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    const { token } = useAuthStore.getState();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time for performance monitoring
    const duration = new Date().getTime() - (response.config as ExtendedAxiosRequestConfig).metadata?.startTime?.getTime();
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    
    console.error('[API Response Error]', error);
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const { data } = await apiClient.post('/auth/refresh-token');
        const newToken = data.accessToken;
        
        // Update token in store
        useAuthStore.getState().setAuthData({
          ...data,
          accessToken: newToken
        });
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - logout user
        console.error('Token refresh failed:', refreshError);
        useAuthStore.getState().logout();
        
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
