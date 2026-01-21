/**
 * Feed State Synchronization Patterns.
 * 
 * Handles conflict resolution and state synchronization
 * between server state (React Query) and client state (Zustand).
 * Provides strategies for handling concurrent updates.
 */

import { useCallback, useEffect } from 'react';
import { useFeedUIStore } from '../stores/feedUIStore';
import { useFeedRepository } from '../../di/useFeedDI';
import { useService } from '@core/di';
import type { PostRequest, RepostRequest } from '@/features/feed/data/models/post';
import type { PostResponse } from '@/features/feed/data/models/post';

/**
 * Synchronization conflict types
 */
export interface SyncConflict {
    type: 'concurrent_edit' | 'delete_while_editing' | 'version_mismatch' | 'network_conflict';
    postId: string;
    clientVersion: number;
    serverVersion: number;
    clientData: any;
    serverData: any;
    timestamp: Date;
}

/**
 * Synchronization strategies
 */
export interface SyncStrategies {
    'last-write-wins': (client: any, server: any) => any;
    'first-write-wins': (client: any, server: any) => any;
    'merge': (client: any, server: any) => any;
    'prompt-user': (client: any, server: any) => Promise<any>;
}

/**
 * Feed synchronization hook
 */
export const useFeedStateSync = () => {
    const repository = useFeedRepository();
    const {
        optimisticUpdates,
        hasPendingOperations,
        setError,
        addOptimisticUpdate,
        removeOptimisticUpdate,
        setLastSyncTime
    } = useFeedUIStore();

    /**
     * Detect synchronization conflicts
     */
    const detectConflict = useCallback((clientData: PostResponse, serverData: PostResponse): SyncConflict | null => {
        // Check for version conflicts
        if (clientData.version && serverData.version && clientData.version !== serverData.version) {
            return {
                type: 'version_mismatch',
                postId: String(clientData.id),
                clientVersion: clientData.version,
                serverVersion: serverData.version,
                clientData,
                serverData,
                timestamp: new Date()
            };
        }

        // Check for concurrent modifications
        const clientUpdateDate = new Date(clientData.updateDate);
        const serverUpdateDate = new Date(serverData.updateDate);

        if (clientUpdateDate > serverUpdateDate) {
            return {
                type: 'concurrent_edit',
                postId: String(clientData.id),
                clientVersion: clientData.version || 0,
                serverVersion: serverData.version || 0,
                clientData,
                serverData,
                timestamp: new Date()
            };
        }

        return null;
    }, []);

    /**
     * Resolve synchronization conflict using last-write-wins strategy
     */
    const resolveConflictLastWriteWins = useCallback((conflict: SyncConflict): PostResponse => {
        return {
            ...conflict.serverData,
            // Add conflict metadata for debugging
            _conflict: {
                resolved: true,
                strategy: 'last-write-wins',
                originalClientData: conflict.clientData,
                originalServerData: conflict.serverData,
                resolvedAt: new Date().toISOString()
            }
        } as PostResponse;
    }, []);

    /**
     * Resolve synchronization conflict using merge strategy
     */
    const resolveConflictMerge = useCallback((conflict: SyncConflict): PostResponse => {
        const client = conflict.clientData;
        const server = conflict.serverData;

        // Merge text content (prefer longer, more recent)
        const mergedText = client.text.length > server.text.length ? client.text : server.text;

        // Merge title (prefer non-empty)
        const mergedTitle = client.title || server.title;

        // Merge engagement metrics (take max)
        const mergedEngagement = {
            likeCount: Math.max(client.likeCount || 0, server.likeCount || 0),
            dislikeCount: Math.max(client.dislikeCount || 0, server.dislikeCount || 0),
            commentCount: Math.max(client.commentCount || 0, server.commentCount || 0)
        };

        return {
            ...server,
            title: mergedTitle,
            text: mergedText,
            ...mergedEngagement,
            updateDate: new Date().toISOString(),
            _conflict: {
                resolved: true,
                strategy: 'merge',
                originalClientData: conflict.clientData,
                originalServerData: conflict.serverData,
                resolvedAt: new Date().toISOString()
            }
        } as PostResponse;
    }, []);

    /**
     * Prompt user to resolve conflict
     */
    const resolveConflictPromptUser = useCallback(async (conflict: SyncConflict): Promise<PostResponse> => {
        // This would typically open a modal or dialog
        // For now, we'll use the server version
        return new Promise((resolve) => {
            setTimeout(() => {
                console.warn('Conflict detected, using server version:', conflict);
                resolve(conflict.serverData);
            }, 1000);
        });
    }, []);

    /**
     * Synchronize optimistic updates with server state
     */
    const synchronizeOptimisticUpdates = useCallback(async (): Promise<void> => {
        if (!hasPendingOperations) {
            return;
        }

        const pendingUpdates = optimisticUpdates.filter(update =>
            update.type === 'create' || update.type === 'update'
        );

        for (const update of pendingUpdates) {
            try {
                if (update.type === 'create') {
                    // Verify created post exists on server
                    await repository.getPostById(update.id, 'dummy-token');
                } else if (update.type === 'update') {
                    // Verify updated post matches server
                    const serverPost = await repository.getPostById(update.id, 'dummy-token');
                    if (serverPost) {
                        const conflict = detectConflict(update.data, serverPost);
                        if (conflict) {
                            console.warn('Sync conflict detected:', conflict);
                            // Resolve conflict and update UI
                            const resolved = resolveConflictLastWriteWins(conflict);
                            addOptimisticUpdate({
                                id: update.id,
                                type: 'update',
                                timestamp: new Date(),
                                data: resolved
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to synchronize optimistic update:', error);
            }
        }

        setLastSyncTime(new Date());
    }, [repository, optimisticUpdates, hasPendingOperations, detectConflict, resolveConflictLastWriteWins, addOptimisticUpdate, setLastSyncTime]);

    /**
     * Handle server-sent updates and resolve conflicts
     */
    const handleServerUpdate = useCallback((serverUpdate: PostResponse): void => {
        // Check for conflicting optimistic updates
        const conflictingUpdate = optimisticUpdates.find(update =>
            update.id === serverUpdate.id && update.type === 'update'
        );

        if (conflictingUpdate) {
            const conflict = detectConflict(conflictingUpdate.data, serverUpdate);

            if (conflict) {
                // Resolve conflict automatically
                const resolved = resolveConflictLastWriteWins(conflict);
                addOptimisticUpdate({
                    id: String(serverUpdate.id),
                    type: 'update',
                    timestamp: new Date(),
                    data: resolved
                });

                // Remove conflict resolution after delay
                setTimeout(() => {
                    removeOptimisticUpdate(String(serverUpdate.id));
                }, 2000);
            } else {
                // No conflict, remove optimistic update
                removeOptimisticUpdate(String(serverUpdate.id));
            }
        }

        setLastSyncTime(new Date());
    }, [optimisticUpdates, detectConflict, resolveConflictLastWriteWins, removeOptimisticUpdate, setLastSyncTime]);

    /**
     * Periodic synchronization
     */
    useEffect(() => {
        const interval = setInterval(() => {
            synchronizeOptimisticUpdates();
        }, 30000); // Sync every 30 seconds

        return () => {
            clearInterval(interval);
        };
    }, [synchronizeOptimisticUpdates]);

    return {
        detectConflict,
        resolveConflictLastWriteWins,
        resolveConflictMerge,
        resolveConflictPromptUser,
        synchronizeOptimisticUpdates,
        handleServerUpdate
    };
};
