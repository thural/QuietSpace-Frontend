/**
 * Chat Services Hook
 * 
 * Provides access to chat feature services through dependency injection.
 * Centralizes service access for the chat feature.
 */

import { useChatDI } from '@chat/di/useChatDI';
import type { ChatDataService } from '@/features/chat/data/services/ChatDataService';
import type { ChatFeatureService } from '@/features/chat/application/services/ChatFeatureService';
import type { WebSocketService } from '@/features/chat/data/services/WebSocketService';
import type { ChatMetricsService } from '@/features/chat/application/services/ChatMetricsService';
import type { ChatPresenceService } from '@/features/chat/application/services/ChatPresenceService';
import type { ChatAnalyticsService } from '@/features/chat/application/services/ChatAnalyticsService';

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
