/**
 * Core Hooks - Enterprise Edition
 *
 * This module provides comprehensive hooks for enterprise-grade features organized by category:
 * - Query Management: Custom query hooks with caching and state management
 * - UI Integration: Theme and dependency injection hooks for React components
 * - Service Integration: Hooks for accessing core services
 * - Feature Hooks: Feature-specific hooks for authentication and WebSocket
 *
 * All hooks are now organized in a clean, modular structure with clear separation of concerns.
 */

// Query Management Hooks
export * from './query';

// UI Integration Hooks
export * from './ui';

// Service Integration Hooks
export * from './services';

// Feature Hooks
export * from './feature';

// Re-export for convenience
export type { ICacheProvider, CacheConfig, CacheStats } from '@/core/cache';
