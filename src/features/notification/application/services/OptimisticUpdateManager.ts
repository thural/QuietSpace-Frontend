/**
 * Optimistic Update Manager.
 * 
 * Manages optimistic updates for notifications with rollback capabilities.
 * Provides immediate UI feedback while server operations are in progress.
 */

import type { NotificationResponse, NotificationPage } from '@/features/notification/data/models/notification';
import type { ResId } from '@/shared/api/models/common';
import type { NotificationQuery } from '../../domain/entities/INotificationRepository';
import { useNotificationUIStore } from '../stores/notificationUIStore';

/**
 * Optimistic update operation.
 */
export interface OptimisticOperation {
    id: string;
    type: 'create' | 'update' | 'delete' | 'mark_read' | 'mark_unread';
    timestamp: string;
    data: any;
    rollbackData?: any;
    status: 'pending' | 'success' | 'failed';
    error?: Error;
}

/**
 * Optimistic update context.
 */
export interface OptimisticUpdateContext {
    operation: OptimisticOperation;
    execute: () => Promise<any>;
    rollback: () => Promise<void>;
    onSuccess?: (result: any) => void;
    onError?: (error: Error) => void;
}

/**
 * Optimistic Update Manager.
 */
export class OptimisticUpdateManager {
    private operations: Map<string, OptimisticOperation> = new Map();
    private operationQueue: OptimisticUpdateContext[] = [];
    private isProcessing = false;

    /**
     * Create optimistic update for marking notification as read.
     */
    createMarkAsReadUpdate(notificationId: ResId, originalNotification: NotificationResponse): OptimisticUpdateContext {
        const operationId = `mark-read-${notificationId}-${Date.now()}`;

        const operation: OptimisticOperation = {
            id: operationId,
            type: 'mark_read',
            timestamp: new Date().toISOString(),
            data: { notificationId, isSeen: true },
            rollbackData: { notificationId, isSeen: originalNotification.isSeen },
            status: 'pending'
        };

        return {
            operation,
            execute: async () => {
                // This would call the actual repository method
                // For now, we simulate the operation
                await new Promise(resolve => setTimeout(resolve, 100));
                return { ...originalNotification, isSeen: true };
            },
            rollback: async () => {
                // Rollback the optimistic update
                const { removeOptimisticUpdate } = useNotificationUIStore.getState();
                removeOptimisticUpdate(operationId);
            }
        };
    }

    /**
     * Create optimistic update for deleting notification.
     */
    createDeleteUpdate(notificationId: ResId, originalNotification: NotificationResponse): OptimisticUpdateContext {
        const operationId = `delete-${notificationId}-${Date.now()}`;

        const operation: OptimisticOperation = {
            id: operationId,
            type: 'delete',
            timestamp: new Date().toISOString(),
            data: { notificationId },
            rollbackData: { notification: originalNotification },
            status: 'pending'
        };

        return {
            operation,
            execute: async () => {
                // This would call the actual repository method
                await new Promise(resolve => setTimeout(resolve, 100));
                return { deleted: true };
            },
            rollback: async () => {
                // Rollback the optimistic update
                const { removeOptimisticUpdate } = useNotificationUIStore.getState();
                removeOptimisticUpdate(operationId);
            }
        };
    }

    /**
     * Create optimistic update for creating notification.
     */
    createCreateUpdate(notificationData: any): OptimisticUpdateContext {
        const operationId = `create-${Date.now()}`;
        const tempId = `temp-${operationId}`;

        const operation: OptimisticOperation = {
            id: operationId,
            type: 'create',
            timestamp: new Date().toISOString(),
            data: { ...notificationData, id: tempId, isOptimistic: true },
            status: 'pending'
        };

        return {
            operation,
            execute: async () => {
                // This would call the actual repository method
                await new Promise(resolve => setTimeout(resolve, 100));
                return { ...notificationData, id: Math.floor(Math.random() * 10000) };
            },
            rollback: async () => {
                // Rollback the optimistic update
                const { removeOptimisticUpdate } = useNotificationUIStore.getState();
                removeOptimisticUpdate(operationId);
            }
        };
    }

    /**
     * Execute optimistic update with automatic rollback on failure.
     */
    async executeOptimisticUpdate(context: OptimisticUpdateContext): Promise<any> {
        const { operation, execute, rollback, onSuccess, onError } = context;

        // Store operation
        this.operations.set(operation.id, operation);

        // Add to UI store
        const { addOptimisticUpdate, addPendingOperation, removePendingOperation } = useNotificationUIStore.getState();
        addOptimisticUpdate(operation.id, operation.data);
        addPendingOperation(operation.id);

        try {
            // Execute the operation
            const result = await execute();

            // Mark as successful
            operation.status = 'success';
            this.operations.set(operation.id, operation);

            // Remove from pending operations
            removePendingOperation(operation.id);

            // Call success callback
            if (onSuccess) {
                onSuccess(result);
            }

            return result;
        } catch (error) {
            // Mark as failed
            operation.status = 'failed';
            operation.error = error as Error;
            this.operations.set(operation.id, operation);

            // Rollback the optimistic update
            await rollback();

            // Remove from pending operations
            removePendingOperation(operation.id);

            // Call error callback
            if (onError) {
                onError(error as Error);
            }

            throw error;
        }
    }

    /**
     * Get operation by ID.
     */
    getOperation(id: string): OptimisticOperation | undefined {
        return this.operations.get(id);
    }

    /**
     * Get all pending operations.
     */
    getPendingOperations(): OptimisticOperation[] {
        return Array.from(this.operations.values()).filter(op => op.status === 'pending');
    }

    /**
     * Clear completed operations.
     */
    clearCompletedOperations(): void {
        for (const [id, operation] of this.operations.entries()) {
            if (operation.status === 'success' || operation.status === 'failed') {
                this.operations.delete(id);
            }
        }
    }

    /**
     * Apply optimistic updates to notification page.
     */
    applyOptimisticUpdatesToPage(page: NotificationPage): NotificationPage {
        const { optimisticUpdates } = useNotificationUIStore.getState();

        if (optimisticUpdates.size === 0) {
            return page;
        }

        let updatedContent = [...page.content];
        const updatedNotifications = new Set<ResId>();

        // Apply optimistic updates
        for (const [operationId, update] of optimisticUpdates.entries()) {
            if (update.type === 'created' && update.data.isOptimistic) {
                // Add optimistic notification
                updatedContent.unshift(update.data);
            } else if (update.type === 'updated' || update.type === 'mark_read' || update.type === 'mark_unread') {
                // Update existing notification
                const index = updatedContent.findIndex(n => n.id === update.data.notificationId);
                if (index !== -1) {
                    updatedContent[index] = { ...updatedContent[index], ...update.data };
                    updatedNotifications.add(update.data.notificationId);
                }
            } else if (update.type === 'deleted') {
                // Remove notification
                updatedContent = updatedContent.filter(n => n.id !== update.data.notificationId);
                updatedNotifications.add(update.data.notificationId);
            }
        }

        return {
            ...page,
            content: updatedContent,
            numberOfElements: updatedContent.length,
            totalElements: page.totalElements, // This would need server sync
            empty: updatedContent.length === 0
        };
    }

    /**
     * Get notification with optimistic updates applied.
     */
    getNotificationWithOptimisticUpdates(notificationId: ResId, originalNotification: NotificationResponse): NotificationResponse {
        const { optimisticUpdates } = useNotificationUIStore.getState();

        let updatedNotification = { ...originalNotification };

        // Apply optimistic updates to this specific notification
        for (const [operationId, update] of optimisticUpdates.entries()) {
            if (update.data.notificationId === notificationId) {
                if (update.type === 'updated' || update.type === 'mark_read' || update.type === 'mark_unread') {
                    updatedNotification = { ...updatedNotification, ...update.data };
                } else if (update.type === 'deleted') {
                    // This notification was optimistically deleted
                    // Mark it as seen to hide it from UI until server sync
                    return { ...updatedNotification, isSeen: true, updateDate: new Date().toISOString() };
                }
            }
        }

        return updatedNotification;
    }
}

/**
 * Global optimistic update manager instance.
 */
export const optimisticUpdateManager = new OptimisticUpdateManager();

/**
 * Hook for using optimistic updates.
 */
export const useOptimisticUpdates = () => {
    const {
        optimisticUpdates,
        pendingOperations,
        addOptimisticUpdate,
        removeOptimisticUpdate,
        clearOptimisticUpdates
    } = useNotificationUIStore();

    return {
        // Manager
        manager: optimisticUpdateManager,

        // State
        optimisticUpdates,
        pendingOperations,

        // Actions
        addOptimisticUpdate,
        removeOptimisticUpdate,
        clearOptimisticUpdates,

        // Convenience methods
        applyToPage: (page: NotificationPage) => optimisticUpdateManager.applyOptimisticUpdatesToPage(page),
        getNotification: (notificationId: ResId, original: NotificationResponse) =>
            optimisticUpdateManager.getNotificationWithOptimisticUpdates(notificationId, original),

        // Status
        hasPendingOperations: pendingOperations.size > 0,
        hasOptimisticUpdates: optimisticUpdates.size > 0
    };
};
