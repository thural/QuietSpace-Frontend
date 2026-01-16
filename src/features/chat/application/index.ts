/**
 * Chat Application Barrel Export.
 * 
 * Exports all application services and hooks.
 */

// Application services
export { ChatService, type IChatService } from './services/ChatService';

// Application hooks
export { useChatDI, useChatRepository, useChatService, type UseChatDIConfig } from '../di/useChatDI';
export { useReactQueryChat, type ReactQueryChatState, type ReactQueryChatActions } from './hooks/useReactQueryChatSimple';
export { useChat, type ChatState, type ChatActions } from './hooks/useChat';
