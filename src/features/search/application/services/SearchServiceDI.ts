import 'reflect-metadata';
import * as React from 'react';
import { Injectable, Inject, useService } from '@core/di';

// Search service interfaces
interface ISearchService {
  search(query: string, options?: SearchOptions): Promise<SearchResult>;
  searchUsers(query: string, options?: SearchOptions): Promise<User[]>;
  searchPosts(query: string, options?: SearchOptions): Promise<Post[]>;
  searchHashtags(query: string, options?: SearchOptions): Promise<Hashtag[]>;
  getSearchHistory(userId: string): Promise<SearchQuery[]>;
  addToHistory(userId: string, query: string): Promise<void>;
  clearHistory(userId: string): Promise<void>;
  getTrendingHashtags(): Promise<Hashtag[]>;
  getSuggestions(query: string): Promise<string[]>;
}

interface ISearchRepository {
  searchUsers(query: string, options?: SearchOptions): Promise<User[]>;
  searchPosts(query: string, options?: SearchOptions): Promise<Post[]>;
  searchHashtags(query: string, options?: SearchOptions): Promise<Hashtag[]>;
  getSearchHistory(userId: string): Promise<SearchQuery[]>;
  addToHistory(userId: string, query: string): Promise<void>;
  clearHistory(userId: string): Promise<void>;
  getTrendingHashtags(): Promise<Hashtag[]>;
  getSuggestions(query: string): Promise<string[]>;
}

interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'popularity';
  filters?: SearchFilters;
}

interface SearchFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  contentType?: 'posts' | 'users' | 'hashtags' | 'all';
  verifiedOnly?: boolean;
  location?: string;
}

interface SearchResult {
  users: User[];
  posts: Post[];
  hashtags: Hashtag[];
  total: number;
  hasMore: boolean;
  query: string;
  timestamp: Date;
}

interface User {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  isPrivate: boolean;
}

interface Post {
  id: string;
  userId: string;
  content: string;
  media?: string[];
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: Date;
  user: User;
}

interface Hashtag {
  id: string;
  name: string;
  postsCount: number;
  trending: boolean;
  category?: string;
}

interface SearchQuery {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
}

// Mock search repository
@Injectable({ lifetime: 'singleton' })
export class SearchRepository implements ISearchRepository {
  private searchHistory = new Map<string, SearchQuery[]>();
  private trendingHashtags: Hashtag[] = [
    { id: '1', name: 'react', postsCount: 15000, trending: true, category: 'technology' },
    { id: '2', name: 'typescript', postsCount: 12000, trending: true, category: 'technology' },
    { id: '3', name: 'webdev', postsCount: 8000, trending: true, category: 'technology' },
    { id: '4', name: 'frontend', postsCount: 6000, trending: true, category: 'technology' },
    { id: '5', name: 'javascript', postsCount: 20000, trending: true, category: 'technology' }
  ];

  async searchUsers(query: string, options?: SearchOptions): Promise<User[]> {
    // Mock user search
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'john_doe',
        displayName: 'John Doe',
        bio: 'Full-stack developer',
        avatar: 'avatar1.jpg',
        verified: true,
        followersCount: 1500,
        followingCount: 800,
        isPrivate: false
      },
      {
        id: '2',
        username: 'jane_smith',
        displayName: 'Jane Smith',
        bio: 'UI/UX Designer',
        avatar: 'avatar2.jpg',
        verified: false,
        followersCount: 800,
        followingCount: 400,
        isPrivate: false
      }
    ];

    return mockUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.displayName.toLowerCase().includes(query.toLowerCase())
    ).slice(0, options?.limit || 10);
  }

  async searchPosts(query: string, options?: SearchOptions): Promise<Post[]> {
    // Mock post search
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockPosts: Post[] = [
      {
        id: '1',
        userId: '1',
        content: 'Just learned React hooks! #react #javascript',
        hashtags: ['react', 'javascript'],
        likesCount: 45,
        commentsCount: 12,
        sharesCount: 3,
        createdAt: new Date(Date.now() - 3600000),
        user: {
          id: '1',
          username: 'john_doe',
          displayName: 'John Doe',
          verified: true,
          followersCount: 1500,
          followingCount: 800,
          isPrivate: false
        }
      },
      {
        id: '2',
        userId: '2',
        content: 'Beautiful sunset today #nature #photography',
        hashtags: ['nature', 'photography'],
        likesCount: 120,
        commentsCount: 25,
        sharesCount: 8,
        createdAt: new Date(Date.now() - 7200000),
        user: {
          id: '2',
          username: 'jane_smith',
          displayName: 'Jane Smith',
          verified: false,
          followersCount: 800,
          followingCount: 400,
          isPrivate: false
        }
      }
    ];

    return mockPosts.filter(post =>
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, options?.limit || 10);
  }

  async searchHashtags(query: string, options?: SearchOptions): Promise<Hashtag[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return this.trendingHashtags.filter(hashtag =>
      hashtag.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, options?.limit || 10);
  }

  async getSearchHistory(userId: string): Promise<SearchQuery[]> {
    return this.searchHistory.get(userId) || [];
  }

  async addToHistory(userId: string, query: string): Promise<void> {
    const history = this.searchHistory.get(userId) || [];
    const newQuery: SearchQuery = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      resultCount: 0 // Would be calculated from actual search
    };
    
    // Remove duplicate queries and add new one
    const filteredHistory = history.filter(h => h.query !== query);
    this.searchHistory.set(userId, [newQuery, ...filteredHistory].slice(0, 20));
  }

  async clearHistory(userId: string): Promise<void> {
    this.searchHistory.delete(userId);
  }

  async getTrendingHashtags(): Promise<Hashtag[]> {
    return this.trendingHashtags;
  }

  async getSuggestions(query: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const suggestions = [
      'react hooks',
      'typescript tutorial',
      'web development',
      'frontend design',
      'javascript tips'
    ];

    return suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// DI-enabled Search Service
@Injectable({ lifetime: 'singleton' })
export class SearchService implements ISearchService {
  constructor(
    @Inject(SearchRepository) private searchRepository: ISearchRepository
  ) {}

  async search(query: string, options?: SearchOptions): Promise<SearchResult> {
    const [users, posts, hashtags] = await Promise.all([
      this.searchRepository.searchUsers(query, options),
      this.searchRepository.searchPosts(query, options),
      this.searchRepository.searchHashtags(query, options)
    ]);

    return {
      users,
      posts,
      hashtags,
      total: users.length + posts.length + hashtags.length,
      hasMore: false, // Would be calculated from pagination
      query,
      timestamp: new Date()
    };
  }

  async searchUsers(query: string, options?: SearchOptions): Promise<User[]> {
    return await this.searchRepository.searchUsers(query, options);
  }

  async searchPosts(query: string, options?: SearchOptions): Promise<Post[]> {
    return await this.searchRepository.searchPosts(query, options);
  }

  async searchHashtags(query: string, options?: SearchOptions): Promise<Hashtag[]> {
    return await this.searchRepository.searchHashtags(query, options);
  }

  async getSearchHistory(userId: string): Promise<SearchQuery[]> {
    return await this.searchRepository.getSearchHistory(userId);
  }

  async addToHistory(userId: string, query: string): Promise<void> {
    await this.searchRepository.addToHistory(userId, query);
  }

  async clearHistory(userId: string): Promise<void> {
    await this.searchRepository.clearHistory(userId);
  }

  async getTrendingHashtags(): Promise<Hashtag[]> {
    return await this.searchRepository.getTrendingHashtags();
  }

  async getSuggestions(query: string): Promise<string[]> {
    return await this.searchRepository.getSuggestions(query);
  }
}

// DI-enabled Search Hook
export const useSearchDI = (userId?: string) => {
  const searchService = useService(SearchService);
  const [searchResult, setSearchResult] = React.useState<SearchResult | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [hashtags, setHashtags] = React.useState<Hashtag[]>([]);
  const [searchHistory, setSearchHistory] = React.useState<SearchQuery[]>([]);
  const [trendingHashtags, setTrendingHashtags] = React.useState<Hashtag[]>([]);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const search = React.useCallback(async (query: string, options?: SearchOptions) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await searchService.search(query, options);
      setSearchResult(result);
      
      // Add to history if userId is provided
      if (userId) {
        await searchService.addToHistory(userId, query);
        await fetchSearchHistory();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [searchService, userId]);

  const searchUsers = React.useCallback(async (query: string, options?: SearchOptions) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const usersResult = await searchService.searchUsers(query, options);
      setUsers(usersResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'User search failed');
    } finally {
      setLoading(false);
    }
  }, [searchService]);

  const searchPosts = React.useCallback(async (query: string, options?: SearchOptions) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const postsResult = await searchService.searchPosts(query, options);
      setPosts(postsResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Post search failed');
    } finally {
      setLoading(false);
    }
  }, [searchService]);

  const searchHashtags = React.useCallback(async (query: string, options?: SearchOptions) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const hashtagsResult = await searchService.searchHashtags(query, options);
      setHashtags(hashtagsResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hashtag search failed');
    } finally {
      setLoading(false);
    }
  }, [searchService]);

  const fetchSearchHistory = React.useCallback(async () => {
    if (!userId) return;
    
    try {
      const history = await searchService.getSearchHistory(userId);
      setSearchHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch search history');
    }
  }, [searchService, userId]);

  const clearHistory = React.useCallback(async () => {
    if (!userId) return;
    
    try {
      await searchService.clearHistory(userId);
      setSearchHistory([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear search history');
    }
  }, [searchService, userId]);

  const fetchTrendingHashtags = React.useCallback(async () => {
    try {
      const trending = await searchService.getTrendingHashtags();
      setTrendingHashtags(trending);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending hashtags');
    }
  }, [searchService]);

  const fetchSuggestions = React.useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    
    try {
      const suggestionsResult = await searchService.getSuggestions(query);
      setSuggestions(suggestionsResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
    }
  }, [searchService]);

  // Auto-fetch trending hashtags on mount
  React.useEffect(() => {
    fetchTrendingHashtags();
  }, [fetchTrendingHashtags]);

  // Auto-fetch search history if userId is provided
  React.useEffect(() => {
    if (userId) {
      fetchSearchHistory();
    }
  }, [userId, fetchSearchHistory]);

  return {
    searchResult,
    users,
    posts,
    hashtags,
    searchHistory,
    trendingHashtags,
    suggestions,
    loading,
    error,
    search,
    searchUsers,
    searchPosts,
    searchHashtags,
    fetchSearchHistory,
    clearHistory,
    fetchTrendingHashtags,
    fetchSuggestions
  };
};
