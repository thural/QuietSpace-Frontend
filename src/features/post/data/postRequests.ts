import type { AxiosInstance } from 'axios';
import type { PostList } from './models/post';
import type { JwtToken } from '@/shared/api/models/common';

/**
 * Fetch posts by query
 */
export const fetchPostQuery = async (
  apiClient: AxiosInstance,
  query: string,
  token: JwtToken
): Promise<PostList> => {
  // TODO: Implement actual post search query
  const response = await apiClient.get(`/posts/search?q=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Fetch posts by filters
 */
export const fetchPostsByFilters = async (
  apiClient: AxiosInstance,
  filters: Record<string, any>,
  token: JwtToken
): Promise<PostList> => {
  // TODO: Implement actual post search by filters
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  const response = await apiClient.get(`/posts/search?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
