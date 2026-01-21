/**
 * Profile API Mocks.
 * 
 * Mock implementations for Profile feature API calls.
 * Provides consistent mocking for HTTP requests and responses.
 */

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import type { ResId } from '@/shared/api/models/common';
import {
  baseUserProfile,
  privateUserProfile,
  baseUserStats,
  highEngagementStats,
  baseUserConnection,
  mutualConnection
} from '../fixtures/profileFixtures';

/**
 * API base URL for profile endpoints.
 */
const API_BASE = '/api/profile';

/**
 * MSW server for API mocking.
 */
export const profileApiServer = setupServer(
  // Get user profile
  rest.get(`${API_BASE}/:userId`, (req, res, ctx) => {
    const { userId } = req.params;

    switch (userId) {
      case 'user-123':
        return res(ctx.json(baseUserProfile));
      case 'user-456':
        return res(ctx.json(privateUserProfile));
      case 'error':
        return res(
          ctx.status(500),
          ctx.json({ error: 'Internal server error' })
        );
      case 'not-found':
        return res(
          ctx.status(404),
          ctx.json({ error: 'User not found' })
        );
      default:
        return res(ctx.json(baseUserProfile));
    }
  }),

  // Get user stats
  rest.get(`${API_BASE}/:userId/stats`, (req, res, ctx) => {
    const { userId } = req.params;

    switch (userId) {
      case 'user-123':
        return res(ctx.json(baseUserStats));
      case 'user-456':
        return res(ctx.json(highEngagementStats));
      case 'error':
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to fetch stats' })
        );
      default:
        return res(ctx.json(baseUserStats));
    }
  }),

  // Get followers
  rest.get(`${API_BASE}/:userId/followers`, (req, res, ctx) => {
    const { userId } = req.params;

    switch (userId) {
      case 'user-123':
        return res(ctx.json([baseUserConnection, mutualConnection]));
      case 'user-456':
        return res(ctx.json([]));
      case 'error':
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to fetch followers' })
        );
      default:
        return res(ctx.json([baseUserConnection]));
    }
  }),

  // Get followings
  rest.get(`${API_BASE}/:userId/followings`, (req, res, ctx) => {
    const { userId } = req.params;

    switch (userId) {
      case 'user-123':
        return res(ctx.json([baseUserConnection, mutualConnection]));
      case 'user-456':
        return res(ctx.json([]));
      case 'error':
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to fetch followings' })
        );
      default:
        return res(ctx.json([baseUserConnection]));
    }
  }),

  // Follow user
  rest.post(`${API_BASE}/:userId/follow`, (req, res, ctx) => {
    const { userId } = req.params;

    switch (userId) {
      case 'user-123':
        return res(ctx.json({ success: true }));
      case 'user-456':
        return res(
          ctx.status(400),
          ctx.json({ error: 'Already following' })
        );
      case 'error':
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to follow user' })
        );
      default:
        return res(ctx.json({ success: true }));
    }
  }),

  // Unfollow user
  rest.post(`${API_BASE}/:userId/unfollow`, (req, res, ctx) => {
    const { userId } = req.params;

    switch (userId) {
      case 'user-123':
        return res(ctx.json({ success: true }));
      case 'user-456':
        return res(
          ctx.status(400),
          ctx.json({ error: 'Not following user' })
        );
      case 'error':
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to unfollow user' })
        );
      default:
        return res(ctx.json({ success: true }));
    }
  }),

  // Update profile
  rest.put(`${API_BASE}/:userId`, (req, res, ctx) => {
    const { userId } = req.params;

    switch (userId) {
      case 'user-123':
        return res(ctx.json({ ...baseUserProfile, ...req.body }));
      case 'error':
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to update profile' })
        );
      default:
        return res(ctx.json({ ...baseUserProfile, ...req.body }));
    }
  }),

  // Upload profile photo
  rest.post(`${API_BASE}/:userId/photo`, (req, res, ctx) => {
    const { userId } = req.params;

    switch (userId) {
      case 'user-123':
        return res(ctx.json({
          success: true,
          photoUrl: 'https://example.com/photos/new-profile.jpg'
        }));
      case 'error':
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to upload photo' })
        );
      default:
        return res(ctx.json({
          success: true,
          photoUrl: 'https://example.com/photos/new-profile.jpg'
        }));
    }
  }),

  // Delete profile
  rest.delete(`${API_BASE}/:userId`, (req, res, ctx) => {
    const { userId } = req.params;

    switch (userId) {
      case 'user-123':
        return res(ctx.json({ success: true }));
      case 'error':
        return res(
          ctx.status(500),
          ctx.json({ error: 'Failed to delete profile' })
        );
      default:
        return res(ctx.json({ success: true }));
    }
  }),

  // Search users
  rest.get(`${API_BASE}/search`, (req, res, ctx) => {
    const query = req.url.searchParams.get('q');

    if (!query) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Search query is required' })
      );
    }

    switch (query) {
      case 'john':
        return res(ctx.json([baseUserProfile]));
      case 'error':
        return res(
          ctx.status(500),
          ctx.json({ error: 'Search failed' })
        );
      default:
        return res(ctx.json([]));
    }
  })
);

/**
 * Mock API responses for testing.
 */
export const mockApiResponses = {
  // Success responses
  getProfile: (userId: ResId) => ({
    status: 200,
    data: userId === 'user-123' ? baseUserProfile : privateUserProfile
  }),

  getStats: (userId: ResId) => ({
    status: 200,
    data: userId === 'user-123' ? baseUserStats : highEngagementStats
  }),

  getFollowers: (userId: ResId) => ({
    status: 200,
    data: userId === 'user-123' ? [baseUserConnection, mutualConnection] : []
  }),

  getFollowings: (userId: ResId) => ({
    status: 200,
    data: userId === 'user-123' ? [baseUserConnection, mutualConnection] : []
  }),

  followUser: (userId: ResId) => ({
    status: 200,
    data: { success: true }
  }),

  unfollowUser: (userId: ResId) => ({
    status: 200,
    data: { success: true }
  }),

  // Error responses
  notFound: {
    status: 404,
    data: { error: 'User not found' }
  },

  serverError: {
    status: 500,
    data: { error: 'Internal server error' }
  },

  unauthorized: {
    status: 401,
    data: { error: 'Unauthorized' }
  },

  forbidden: {
    status: 403,
    data: { error: 'Forbidden' }
  }
};

/**
 * Mock WebSocket for real-time features.
 */
export class MockWebSocket {
  private static instance: MockWebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private connected = false;

  static getInstance() {
    if (!this.instance) {
      this.instance = new MockWebSocket();
    }
    return this.instance;
  }

  connect() {
    setTimeout(() => {
      this.connected = true;
      this.emit('open');
    }, 100);
  }

  disconnect() {
    this.connected = false;
    this.emit('close');
  }

  send(data: any) {
    if (!this.connected) {
      throw new Error('WebSocket is not connected');
    }

    // Echo the message back for testing
    setTimeout(() => {
      this.emit('message', data);
    }, 50);
  }

  on(event: string, listener: Function) {
    const listeners = this.listeners.get(event) || [];
    listeners.push(listener);
    this.listeners.set(event, listeners);
  }

  off(event: string, listener: Function) {
    const listeners = this.listeners.get(event) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(listener => listener(data));
  }

  // Static methods for testing
  static simulateMessage(data: any) {
    const instance = MockWebSocket.getInstance();
    instance.emit('message', data);
  }

  static simulateDisconnect() {
    const instance = MockWebSocket.getInstance();
    instance.disconnect();
  }

  static reset() {
    const instance = MockWebSocket.getInstance();
    instance.listeners.clear();
    instance.connected = false;
  }
}

/**
 * Mock EventSource for Server-Sent Events.
 */
export class MockEventSource {
  private listeners: Map<string, Function[]> = new Map();
  private connected = false;

  constructor(private url: string) { }

  connect() {
    setTimeout(() => {
      this.connected = true;
      this.emit('open');
    }, 100);
  }

  close() {
    this.connected = false;
    this.emit('close');
  }

  addEventListener(event: string, listener: Function) {
    const listeners = this.listeners.get(event) || [];
    listeners.push(listener);
    this.listeners.set(event, listeners);
  }

  removeEventListener(event: string, listener: Function) {
    const listeners = this.listeners.get(event) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(listener => listener(data));
  }

  // Static methods for testing
  static simulateEvent(url: string, event: string, data?: any) {
    // Find instance by URL and emit event
    // This is a simplified implementation
    console.log(`Simulating ${event} event for ${url}:`, data);
  }
}
