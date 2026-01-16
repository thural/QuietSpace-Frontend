/**
 * Feed Application Layer Barrel Export.
 * 
 * Exports all application layer components including hooks,
 * stores, and business logic for the Feed feature.
 */

// Stores
export { useFeedUIStore, useFeedUISelectors } from './stores/feedUIStore';

// Hooks
export { useRealtimeFeedUpdates } from './hooks/useRealtimeFeedUpdates';
export { useFeedOptimisticUpdates } from './hooks/useFeedOptimisticUpdates';
export { useFeedStateSync } from './hooks/useFeedStateSync';

// Types
export type { RealtimePostUpdate, WebSocketStatus } from './hooks/useRealtimeFeedUpdates';
export type { OptimisticUpdateResult } from './hooks/useFeedOptimisticUpdates';
export type { SyncConflict, SyncStrategies } from './hooks/useFeedStateSync';
