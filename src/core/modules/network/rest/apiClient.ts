/**
 * API Client Configuration
 *
 * DEPRECATED: This file uses direct store access and should be replaced
 * with DI-based authentication. Use createDIAuthenticatedApiClient instead.
 * 
 * MIGRATION PATH: Replace with @/core/hooks/ui/dependency-injection hooks
 * 
 * This file will be removed in next major version.
 * Please migrate to DI-based authentication patterns.
 */

import axios from 'axios';

import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// This entire implementation is deprecated
// Migration: use useService(IAuthService) from @/core/hooks/ui/dependency-injection

// Stub implementation to maintain type safety
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add deprecation warning
apiClient.interceptors.request.use((config) => {
  console.warn('apiClient is deprecated. Use DI-based authentication from @/core/hooks/ui/dependency-injection');
  return config;
});

export default apiClient;
