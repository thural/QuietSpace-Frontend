/**
 * Common API Types
 * 
 * Shared types used across the application for API responses and requests.
 * These types provide consistency and type safety for all API interactions.
 */

/**
 * Resource ID type - represents a unique identifier for any resource
 * Can be a string (UUID, slug) or number (auto-increment ID)
 */
export type ResId = string | number;

/**
 * JWT Token type - represents an authentication token
 */
export type JwtToken = string;

/**
 * API Response wrapper for successful responses
 */
export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * API Response wrapper for error responses
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Generic API Response type that can be either success or error
 */
export type ApiResult<T = any> = ApiResponse<T> | ApiError;

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  content: T[];
  meta: PaginationMeta;
}

/**
 * Common API query parameters
 */
export interface ApiQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}
