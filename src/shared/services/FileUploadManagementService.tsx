/**
 * File Upload Management Service
 * 
 * Enterprise class-based service for file upload management.
 * Replaces hook-based services with proper enterprise patterns.
 */

// File upload state interface
export interface IUploadState {
    file: File | null;
    progress: number;
    isUploading: boolean;
    error: string | null;
    url: string | null;
    preview: string | null;
}

// Fetch callback type
export type FetchCallback = (file: File) => Promise<string>;

// File upload subscription interface
interface FileUploadSubscription {
    callback: (state: IUploadState) => void;
    id: string;
}

// File upload management interface
export interface IFileUploadManagementService {
    getCurrentState(): IUploadState;
    setFile(file: File | null): void;
    uploadFile(): Promise<void>;
    resetUpload(): void;
    subscribe(callback: (state: IUploadState) => void): () => void;
    unsubscribe(callback: (state: IUploadState) => void): void;
    destroy(): void;
}

/**
 * FileUploadManagementService - Enterprise file upload service
 * 
 * Provides centralized file upload management with subscription support
 * and enterprise-grade error handling.
 */
export class FileUploadManagementService implements IFileUploadManagementService {
    private uploadState: IUploadState;
    private subscriptions: Map<string, FileUploadSubscription> = new Map();
    private isDestroyed: boolean = false;
    private subscriptionIdCounter: number = 0;
    private fetchCallback: FetchCallback;

    constructor(fetchCallback: FetchCallback) {
        this.fetchCallback = fetchCallback;
        this.uploadState = {
            file: null,
            progress: 0,
            isUploading: false,
            error: null,
            url: null,
            preview: null
        };
    }

    /**
     * Get current upload state
     */
    public getCurrentState = (): IUploadState => {
        return { ...this.uploadState };
    };

    /**
     * Set file for upload
     */
    public setFile = async (file: File | null): Promise<void> => {
        if (this.isDestroyed) return;

        try {
            const preview = file ? await this.createPreview(file) : null;

            const newState: IUploadState = {
                ...this.uploadState,
                file,
                progress: 0,
                isUploading: false,
                error: null,
                url: null,
                preview
            };

            this.uploadState = newState;
            this.notifySubscribers();

        } catch (error) {
            console.error('Failed to set file:', error);
            this.setError('Failed to process file');
        }
    };

    /**
     * Upload the current file
     */
    public uploadFile = async (): Promise<void> => {
        if (this.isDestroyed || !this.uploadState.file || this.uploadState.isUploading) {
            return;
        }

        try {
            // Update state to uploading
            this.uploadState = {
                ...this.uploadState,
                isUploading: true,
                error: null,
                progress: 0
            };
            this.notifySubscribers();

            // Simulate upload progress
            await this.simulateUploadProgress();

            // Perform actual upload
            if (this.uploadState.file) {
                const url = await this.fetchCallback(this.uploadState.file);

                // Update state with success
                this.uploadState = {
                    ...this.uploadState,
                    isUploading: false,
                    url: url as string,
                    progress: 100
                };
                this.notifySubscribers();
            }

        } catch (error) {
            console.error('Upload failed:', error);
            this.setError(error instanceof Error ? error.message : 'Upload failed');
        }
    };

    /**
     * Reset upload state
     */
    public resetUpload = (): void => {
        if (this.isDestroyed) return;

        this.uploadState = {
            file: null,
            progress: 0,
            isUploading: false,
            error: null,
            url: null,
            preview: null
        };
        this.notifySubscribers();
    };

    /**
     * Subscribe to upload state changes
     */
    public subscribe = (callback: (state: IUploadState) => void): (() => void) => {
        if (this.isDestroyed) {
            return () => { };
        }

        const id = `upload_subscription_${++this.subscriptionIdCounter}`;
        const subscription: FileUploadSubscription = {
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
     * Create file preview
     */
    private createPreview = (file: File): Promise<string | null> => {
        return new Promise((resolve) => {
            try {
                if (!file.type.startsWith('image/')) {
                    resolve(null);
                    return;
                }

                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => resolve(null);
            } catch (error) {
                console.warn('Failed to create preview:', error);
                resolve(null);
            }
        });
    };

    /**
     * Simulate upload progress
     */
    private simulateUploadProgress = (): Promise<void> => {
        return new Promise((resolve) => {
            const duration = 2000; // 2 seconds
            const interval = 100; // Update every 100ms
            const steps = duration / interval;
            let currentStep = 0;

            const progressInterval = setInterval(() => {
                currentStep++;
                const progress = Math.min((currentStep / steps) * 100, 95); // Max 95% until complete

                this.uploadState = {
                    ...this.uploadState,
                    progress
                };
                this.notifySubscribers();

                if (currentStep >= steps) {
                    clearInterval(progressInterval);
                    resolve();
                }
            }, interval);
        });
    };

    /**
     * Set error state
     */
    private setError = (error: string): void => {
        this.uploadState = {
            ...this.uploadState,
            isUploading: false,
            error
        };
        this.notifySubscribers();
    };

    /**
     * Notify all subscribers of state change
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
     * Destroy service and clean up all resources
     */
    public destroy = (): void => {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.subscriptions.clear();
    };
}

/**
 * Factory function to create a new FileUploadManagementService instance
 */
export const createFileUploadManagementService = (fetchCallback: FetchCallback): FileUploadManagementService => {
    return new FileUploadManagementService(fetchCallback);
};

export default FileUploadManagementService;
