/**
 * Chat Data Barrel Export.
 * 
 * Exports all repositories and data layer components.
 */

// Repository implementations
export { ChatRepository } from './repositories/ChatRepository';
export { MockChatRepository } from './repositories/MockChatRepository';

// Repository types
export type { IChatRepository } from '../domain/entities/ChatRepository';
