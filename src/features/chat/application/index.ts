/**
 * Chat Application Barrel Export.
 * 
 * Exports all application services and hooks.
 */

// Application services
export { ChatFeatureService } from './services/ChatFeatureService';
export { ChatAnalyticsService } from './services/ChatAnalyticsService';
export { ChatMetricsService } from './services/ChatMetricsService';
export { ChatPresenceService } from './services/ChatPresenceService';

// Application hooks
export { useChatDI, useChatRepository, useChatService, type UseChatDIConfig } from '../di/useChatDI';
export { 
    useUnifiedChat, 
    useCustomChat,
    type UnifiedChatState, 
    type UnifiedChatActions,
    type UseChatOptions 
} from './hooks/useUnifiedChat';
export { useChat, type ChatState, type ChatActions } from './hooks/useChat';
export { useChatServices } from './hooks/useChatServices';
