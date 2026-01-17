import 'reflect-metadata';
import { Injectable, useService } from '../../../../core/di';
import { useState, useCallback } from 'react';

// Service interfaces
interface IFeedService {
  getFeed(): Promise<any>;
  getOverlayState(): { isOpen: boolean; toggle: () => void };
}

// DI-enabled Feed Service
@Injectable({ lifetime: 'singleton' })
export class FeedService implements IFeedService {
  private overlayState = { isOpen: false };

  async getFeed(): Promise<any> {
    // Mock implementation - would call repository in real app
    return { user: null, posts: [] };
  }

  getOverlayState(): { isOpen: boolean; toggle: () => void } {
    return {
      isOpen: this.overlayState.isOpen,
      toggle: () => {
        this.overlayState.isOpen = !this.overlayState.isOpen;
      }
    };
  }
}

// DI-enabled Hook
export const useFeedDI = () => {
  const feedService = useService(FeedService);
  const [posts, setPosts] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const feedData = await feedService.getFeed();
      setPosts(feedData);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  }, [feedService]);

  const overlayState = feedService.getOverlayState();

  return {
    posts,
    loading,
    fetchFeed,
    isOverlayOpen: overlayState.isOpen,
    toggleOverlay: overlayState.toggle
  };
};
