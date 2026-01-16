/**
 * State Synchronization Manager.
 * 
 * Manages synchronization between client state, server state, and real-time updates.
 * Handles conflict resolution and state consistency.
 */

import type { NotificationPage, NotificationResponse } from '@api/schemas/inferred/notification';
import type { NotificationQuery } from '../../domain/entities/INotificationRepository';
import type { RealtimeNotificationEvent } from './RealtimeNotificationService';
import { useNotificationUIStore } from '../stores/notificationUIStore';

/**
 * Synchronization conflict types.
 */
export type SyncConflictType = 'update_conflict' | 'delete_conflict' | 'create_conflict';

/**
 * Synchronization conflict.
 */
export interface SyncConflict {
    type: SyncConflictType;
    clientId: string;
    serverId: string;
    clientData: any;
    serverData: any;
    timestamp: string;
    resolution?: 'client_wins' | 'server_wins' | 'merge';
}

/**
 * Synchronization strategy.
 */
export type SyncStrategy = 'client_first' | 'server_first' | 'last_write_wins' | 'manual';

/**
 * State Synchronization Manager.
 */
export class StateSynchronizationManager {
    private conflicts: Map<string, SyncConflict> = new Map();
    private syncQueue: Array<{
        type: 'merge' | 'replace' | 'conflict';
        data: any;
        timestamp: string;
    }> = [];
    private isSyncing = false;

    /**
     * Synchronize server response with client state.
     */
    synchronizeServerResponse(
        serverPage: NotificationPage,
        clientPage: NotificationPage | null,
        strategy: SyncStrategy = 'server_first'
    ): NotificationPage {
        if (!clientPage) {
            return serverPage;
        }

        const { optimisticUpdates } = useNotificationUIStore.getState();
        let synchronizedPage = { ...serverPage };

        // Apply optimistic updates that haven't been synced yet
        for (const [operationId, update] of optimisticUpdates.entries()) {
            if (update.type === 'created' && update.data.isOptimistic) {
                // Check if this optimistic creation exists on server
                const serverMatch = serverPage.content.find(n => 
                    this.isSameNotification(n, update.data)
                );

                if (!serverMatch) {
                    // Keep optimistic creation
                    synchronizedPage.content.unshift(update.data);
                }
            } else if (update.type === 'updated' || update.type === 'mark_read') {
                // Apply client updates if they're newer than server
                const serverIndex = synchronizedPage.content.findIndex(n => 
                    n.id === update.data.notificationId
                );

                if (serverIndex !== -1) {
                    const serverNotification = synchronizedPage.content[serverIndex];
                    const clientNotification = clientPage.content.find(n => 
                        n.id === update.data.notificationId
                    );

                    if (clientNotification && this.isClientNewer(clientNotification, serverNotification)) {
                        synchronizedPage.content[serverIndex] = {
                            ...serverNotification,
                            ...update.data
                        };
                    }
                }
            } else if (update.type === 'deleted') {
                // Remove if client deleted it
                synchronizedPage.content = synchronizedPage.content.filter(n => 
                    n.id !== update.data.notificationId
                );
            }
        }

        return synchronizedPage;
    }

    /**
     * Process real-time event and resolve conflicts.
     */
    processRealtimeEvent(
        event: RealtimeNotificationEvent,
        currentState: NotificationPage | null,
        strategy: SyncStrategy = 'server_first'
    ): { updatedPage: NotificationPage; conflicts: SyncConflict[] } {
        const conflicts: SyncConflict[] = [];
        let updatedPage = currentState ? { ...currentState } : {
            content: [],
            pageable: { pageNumber: 0, pageSize: 20, sort: { sorted: false, unsorted: true, empty: false }, offset: 0, paged: true, unpaged: false },
            totalPages: 0,
            totalElements: 0,
            last: true,
            first: true,
            size: 20,
            number: 0,
            sort: { sorted: false, unsorted: true, empty: false },
            numberOfElements: 0,
            empty: true
        };

        switch (event.type) {
            case 'NOTIFICATION_CREATED':
                const conflict = this.handleCreateEvent(event, updatedPage, strategy);
                if (conflict) conflicts.push(conflict);
                break;

            case 'NOTIFICATION_UPDATED':
            case 'NOTIFICATION_READ':
                const updateConflict = this.handleUpdateEvent(event, updatedPage, strategy);
                if (updateConflict) conflicts.push(updateConflict);
                break;

            case 'NOTIFICATION_DELETED':
                const deleteConflict = this.handleDeleteEvent(event, updatedPage, strategy);
                if (deleteConflict) conflicts.push(deleteConflict);
                break;
        }

        return { updatedPage, conflicts };
    }

    /**
     * Handle notification creation event.
     */
    private handleCreateEvent(
        event: RealtimeNotificationEvent,
        page: NotificationPage,
        strategy: SyncStrategy
    ): SyncConflict | null {
        const { optimisticUpdates } = useNotificationUIStore.getState();
        
        // Check for optimistic creation conflict
        for (const [operationId, update] of optimisticUpdates.entries()) {
            if (update.type === 'created' && update.data.isOptimistic) {
                if (this.isSameNotification(update.data, event.data)) {
                    // Resolve conflict
                    if (strategy === 'client_first') {
                        // Keep client version, update with server ID
                        update.data.id = event.data.id;
                        update.data.isOptimistic = false;
                        return null;
                    } else {
                        // Use server version
                        const index = page.content.findIndex(n => n.id === update.data.id);
                        if (index !== -1) {
                            page.content[index] = event.data;
                        }
                        return {
                            type: 'create_conflict',
                            clientId: update.data.id as string,
                            serverId: event.data.id as string,
                            clientData: update.data,
                            serverData: event.data,
                            timestamp: event.timestamp,
                            resolution: 'server_wins'
                        };
                    }
                }
            }
        }

        // Add new notification
        page.content.unshift(event.data);
        page.numberOfElements = page.content.length;
        page.totalElements = page.totalElements + 1;
        page.empty = false;

        return null;
    }

    /**
     * Handle notification update event.
     */
    private handleUpdateEvent(
        event: RealtimeNotificationEvent,
        page: NotificationPage,
        strategy: SyncStrategy
    ): SyncConflict | null {
        const index = page.content.findIndex(n => n.id === event.data.id);
        
        if (index === -1) {
            // Notification not found, add it
            page.content.unshift(event.data);
            return null;
        }

        const existingNotification = page.content[index];
        const { optimisticUpdates } = useNotificationUIStore.getState();

        // Check for optimistic update conflict
        const optimisticUpdate = Array.from(optimisticUpdates.values()).find(update =>
            update.data.notificationId === event.data.id &&
            (update.type === 'updated' || update.type === 'mark_read')
        );

        if (optimisticUpdate) {
            if (this.isClientNewer(optimisticUpdate.data, event.data)) {
                // Client update is newer, keep it
                page.content[index] = { ...existingNotification, ...optimisticUpdate.data };
                return null;
            } else {
                // Server update is newer
                page.content[index] = event.data;
                return {
                    type: 'update_conflict',
                    clientId: event.data.id as string,
                    serverId: event.data.id as string,
                    clientData: optimisticUpdate.data,
                    serverData: event.data,
                    timestamp: event.timestamp,
                    resolution: 'server_wins'
                };
            }
        }

        // Apply server update
        page.content[index] = event.data;
        return null;
    }

    /**
     * Handle notification deletion event.
     */
    private handleDeleteEvent(
        event: RealtimeNotificationEvent,
        page: NotificationPage,
        strategy: SyncStrategy
    ): SyncConflict | null {
        const index = page.content.findIndex(n => n.id === event.data.id);
        
        if (index === -1) {
            return null; // Already deleted
        }

        const { optimisticUpdates } = useNotificationUIStore.getState();

        // Check for optimistic delete conflict
        const optimisticDelete = Array.from(optimisticUpdates.values()).find(update =>
            update.data.notificationId === event.data.id && update.type === 'deleted'
        );

        if (optimisticDelete) {
            // Both client and server deleted, no conflict
            page.content.splice(index, 1);
            page.numberOfElements = page.content.length;
            page.totalElements = Math.max(0, page.totalElements - 1);
            page.empty = page.content.length === 0;
            return null;
        }

        // Server deleted, remove from client
        page.content.splice(index, 1);
        page.numberOfElements = page.content.length;
        page.totalElements = Math.max(0, page.totalElements - 1);
        page.empty = page.content.length === 0;

        return {
            type: 'delete_conflict',
            clientId: event.data.id as string,
            serverId: event.data.id as string,
            clientData: page.content[index],
            serverData: event.data,
            timestamp: event.timestamp,
            resolution: 'server_wins'
        };
    }

    /**
     * Check if two notifications represent the same entity.
     */
    private isSameNotification(notif1: any, notif2: any): boolean {
        return notif1.actorId === notif2.actorId && 
               notif1.contentId === notif2.contentId && 
               notif1.type === notif2.type;
    }

    /**
     * Check if client notification is newer than server notification.
     */
    private isClientNewer(clientNotif: NotificationResponse, serverNotif: NotificationResponse): boolean {
        const clientTime = new Date(clientNotif.updateDate).getTime();
        const serverTime = new Date(serverNotif.updateDate).getTime();
        return clientTime > serverTime;
    }

    /**
     * Resolve synchronization conflict.
     */
    resolveConflict(conflictId: string, resolution: 'client_wins' | 'server_wins' | 'merge'): void {
        const conflict = this.conflicts.get(conflictId);
        if (!conflict) return;

        conflict.resolution = resolution;
        this.conflicts.set(conflictId, conflict);

        // Apply resolution based on strategy
        // This would update the UI state accordingly
    }

    /**
     * Get all pending conflicts.
     */
    getPendingConflicts(): SyncConflict[] {
        return Array.from(this.conflicts.values()).filter(conflict => !conflict.resolution);
    }

    /**
     * Clear resolved conflicts.
     */
    clearResolvedConflicts(): void {
        for (const [id, conflict] of this.conflicts.entries()) {
            if (conflict.resolution) {
                this.conflicts.delete(id);
            }
        }
    }

    /**
     * Force synchronization with server.
     */
    async forceSync(repository: any, query: NotificationQuery): Promise<NotificationPage> {
        if (this.isSyncing) {
            throw new Error('Synchronization already in progress');
        }

        this.isSyncing = true;

        try {
            // Get fresh data from server
            const serverData = await repository.getNotifications(query, 'token');
            
            // Clear optimistic updates since we're forcing sync
            const { clearOptimisticUpdates } = useNotificationUIStore.getState();
            clearOptimisticUpdates();

            this.isSyncing = false;
            return serverData;
        } catch (error) {
            this.isSyncing = false;
            throw error;
        }
    }
}

/**
 * Global state synchronization manager instance.
 */
export const stateSynchronizationManager = new StateSynchronizationManager();

/**
 * Hook for using state synchronization.
 */
export const useStateSynchronization = () => {
    const { 
        optimisticUpdates, 
        pendingOperations,
        updateLastSyncTime 
    } = useNotificationUIStore();

    return {
        // Manager
        manager: stateSynchronizationManager,
        
        // State
        optimisticUpdates,
        pendingOperations,
        
        // Actions
        synchronizeServerResponse: (serverPage: NotificationPage, clientPage: NotificationPage | null, strategy?: SyncStrategy) =>
            stateSynchronizationManager.synchronizeServerResponse(serverPage, clientPage, strategy),
        
        processRealtimeEvent: (event: RealtimeNotificationEvent, currentState: NotificationPage | null, strategy?: SyncStrategy) =>
            stateSynchronizationManager.processRealtimeEvent(event, currentState, strategy),
        
        resolveConflict: (conflictId: string, resolution: 'client_wins' | 'server_wins' | 'merge') =>
            stateSynchronizationManager.resolveConflict(conflictId, resolution),
        
        forceSync: (repository: any, query: NotificationQuery) =>
            stateSynchronizationManager.forceSync(repository, query),
        
        // Status
        getPendingConflicts: () => stateSynchronizationManager.getPendingConflicts(),
        clearResolvedConflicts: () => stateSynchronizationManager.clearResolvedConflicts(),
        hasConflicts: stateSynchronizationManager.getPendingConflicts().length > 0,
        
        // Update sync time
        updateLastSyncTime
    };
};
