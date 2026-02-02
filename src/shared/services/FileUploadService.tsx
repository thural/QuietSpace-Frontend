/**
 * Enterprise File Upload Service
 * 
 * A class-based service that replaces the useFileUploader hook
 * with enterprise patterns for file upload management.
 */

import { ChangeEvent } from "react";

export type UploadStatus = "idle" | "uploading" | "error" | "success";
export type FetchCallback = (formData: FormData) => Promise<any>;

// Upload state interface
export interface IUploadState {
    file: File | null;
    status: UploadStatus;
    response: any;
}

// Service interface for type safety
export interface IFileUploadService {
    getCurrentState(): IUploadState;
    setFile(file: File | null): void;
    handleFileChange(event: ChangeEvent<HTMLInputElement>): void;
    uploadFile(): Promise<void>;
    subscribe(callback: (state: IUploadState) => void): () => void;
    unsubscribe(callback: (state: IUploadState) => void): void;
    reset(): void;
    destroy(): void;
}

// Upload subscription entry
interface UploadSubscription {
    callback: (state: IUploadState) => void;
    id: string;
}

/**
 * FileUploadService - Enterprise service for managing file uploads
 * 
 * Provides centralized file upload management with state tracking,
 * subscription notifications, and proper cleanup.
 */
class FileUploadService implements IFileUploadService {
    private state: IUploadState;
    private subscriptions: Map<string, UploadSubscription> = new Map();
    private isDestroyed: boolean = false;
    private subscriptionIdCounter: number = 0;
    private fetchCallback: FetchCallback | null = null;

    constructor(fetchCallback?: FetchCallback) {
        this.state = {
            file: null,
            status: 'idle',
            response: null
        };
        this.fetchCallback = fetchCallback || null;
    }

    /**
     * Get current upload state
     */
    public getCurrentState = (): IUploadState => {
        return { ...this.state };
    };

    /**
     * Set the file for upload
     */
    public setFile = (file: File | null): void => {
        if (this.isDestroyed) return;

        this.updateState({
            file,
            status: file ? 'idle' : 'idle',
            response: null
        });
    };

    /**
     * Handle file input change events
     */
    public handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (this.isDestroyed || !event.target.files) return;

        const selectedFile = event.target.files[0] || null;
        this.setFile(selectedFile);
    };

    /**
     * Upload the current file
     */
    public uploadFile = async (): Promise<void> => {
        if (this.isDestroyed || !this.state.file || !this.fetchCallback) {
            return;
        }

        this.updateState({
            ...this.state,
            status: 'uploading'
        });

        const formData = new FormData();
        formData.append("file", this.state.file);

        try {
            const result = await this.fetchCallback(formData);
            this.updateState({
                file: this.state.file,
                status: 'success',
                response: result
            });
        } catch (error: unknown) {
            const errorMessage = (error as Error).message;
            this.updateState({
                file: this.state.file,
                status: 'error',
                response: errorMessage
            });
            
            // Re-throw error for handling by subscribers
            throw error;
        }
    };

    /**
     * Update state and notify subscribers
     */
    private updateState = (newState: Partial<IUploadState>): void => {
        if (this.isDestroyed) return;

        this.state = { ...this.state, ...newState };
        this.notifySubscribers();
    };

    /**
     * Subscribe to upload state changes
     */
    public subscribe = (callback: (state: IUploadState) => void): (() => void) => {
        if (this.isDestroyed) {
            return () => {};
        }

        const id = `upload_subscription_${++this.subscriptionIdCounter}`;
        const subscription: UploadSubscription = {
            callback,
            id
        };

        this.subscriptions.set(id, subscription);

        // Immediately call with current state
        callback(this.getCurrentState());

        // Return unsubscribe function
        return () => {
            this.unsubscribeById(id);
        };
    };

    /**
     * Unsubscribe by ID
     */
    private unsubscribeById = (id: string): void => {
        this.subscriptions.delete(id);
    };

    /**
     * Unsubscribe by callback
     */
    public unsubscribe = (callback: (state: IUploadState) => void): void => {
        const idsToDelete: string[] = [];
        
        this.subscriptions.forEach((subscription, id) => {
            if (subscription.callback === callback) {
                idsToDelete.push(id);
            }
        });

        idsToDelete.forEach(id => this.unsubscribeById(id));
    };

    /**
     * Notify all subscribers of state changes
     */
    private notifySubscribers = (): void => {
        if (this.isDestroyed) return;

        const currentState = this.getCurrentState();
        this.subscriptions.forEach(subscription => {
            try {
                subscription.callback(currentState);
            } catch (error) {
                console.error('Error in upload subscription callback:', error);
            }
        });
    };

    /**
     * Reset the upload state
     */
    public reset = (): void => {
        this.updateState({
            file: null,
            status: 'idle',
            response: null
        });
    };

    /**
     * Set a new fetch callback
     */
    public setFetchCallback = (callback: FetchCallback): void => {
        this.fetchCallback = callback;
    };

    /**
     * Get subscription count
     */
    public getSubscriptionCount = (): number => {
        return this.subscriptions.size;
    };

    /**
     * Check if service is active
     */
    public isActive = (): boolean => {
        return !this.isDestroyed;
    };

    /**
     * Check if file is ready for upload
     */
    public isReadyToUpload = (): boolean => {
        return !this.isDestroyed && 
               this.state.file !== null && 
               this.state.status !== 'uploading' &&
               this.fetchCallback !== null;
    };

    /**
     * Get file information
     */
    public getFileInfo = (): {
        name: string;
        size: number;
        type: string;
        lastModified: number;
    } | null => {
        if (!this.state.file) return null;

        return {
            name: this.state.file.name,
            size: this.state.file.size,
            type: this.state.file.type,
            lastModified: this.state.file.lastModified
        };
    };

    /**
     * Destroy the service and clean up all resources
     */
    public destroy = (): void => {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.subscriptions.clear();
        this.fetchCallback = null;
        this.state = {
            file: null,
            status: 'idle',
            response: null
        };
    };
}

// Factory functions for service creation
export const createFileUploadService = (fetchCallback?: FetchCallback): FileUploadService => {
    return new FileUploadService(fetchCallback);
};

export const getFileUploadService = (fetchCallback?: FetchCallback): FileUploadService => {
    return new FileUploadService(fetchCallback);
};

/**
 * Hook-style wrapper for backward compatibility
 * 
 * @param fetchCallback - A callback function that accepts a FormData object and returns a Promise
 * @returns upload state and handler functions
 */
export const useFileUploadService = (fetchCallback: FetchCallback) => {
    const service = createFileUploadService(fetchCallback);
    
    return {
        getCurrentState: service.getCurrentState,
        setFile: service.setFile,
        handleFileChange: service.handleFileChange,
        uploadFile: service.uploadFile,
        subscribe: service.subscribe,
        unsubscribe: service.unsubscribe,
        reset: service.reset,
        isReadyToUpload: service.isReadyToUpload,
        getFileInfo: service.getFileInfo
    };
};

export default FileUploadService;
