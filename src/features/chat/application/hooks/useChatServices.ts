/**
 * Chat Services Hook
 * 
 * Provides access to chat feature services through dependency injection.
 * Centralizes service access for the chat feature.
 */

import type { ChatFeatureService } from '@/features/chat/application/services/ChatFeatureService';
import type { ChatDataService } from '@/features/chat/data/services/ChatDataService';
import { useChatDI } from '@chat/di/useChatDI';

export const useChatServices = () => {
  const diContainer = useChatDI();

  return {
    chatDataService: diContainer.getService<ChatDataService>('chatDataService'),
    chatFeatureService: diContainer.getService<ChatFeatureService>('chatFeatureService'),
    webSocketService: diContainer.getWebSocketService(),
    chatMetricsService: diContainer.getChatMetricsService(),
    chatPresenceService: diContainer.getChatPresenceService(),
    chatAnalyticsService: diContainer.getChatAnalyticsService()
  };
};
