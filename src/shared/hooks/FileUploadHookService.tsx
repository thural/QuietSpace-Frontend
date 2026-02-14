/**
 * Enterprise File Upload Hook Service
 * 
 * Class-based service that replaces the useFileUploader hook with enterprise patterns.
 * Provides the same API as useFileUploader but follows BaseClassComponent inheritance.
 */

import { ChangeEvent } from "react";
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';
import { createFileUploadService, IUploadState, FetchCallback } from '../services/FileUploadService';

/**
 * Props interface for FileUploadHookService
 */
export interface IFileUploadHookServiceProps extends IBaseComponentProps {
  fetchCallback: FetchCallback;
}

/**
 * State interface for FileUploadHookService
 */
export interface IFileUploadHookServiceState extends IBaseComponentState {
  uploadState: IUploadState;
  subscribers: Set<(state: IUploadState) => void>;
}

/**
 * File Upload Hook Service - Class-based service that provides useFileUploader functionality
 * 
 * This service maintains the same API as the original useFileUploader hook but follows
 * enterprise class-based patterns with proper lifecycle management and error handling.
 */
export class FileUploadHookService extends BaseClassComponent<IFileUploadHookServiceProps, IFileUploadHookServiceState> {
  private fileUploadService = createFileUploadService(this.props.fetchCallback);
  private unsubscribe: (() => void) | null = null;

  protected override getInitialState(): Partial<IFileUploadHookServiceState> {
    return {
      uploadState: this.fileUploadService.getCurrentState(),
      subscribers: new Set()
    };
  }

  protected override onMount(): void {
    // Subscribe to file upload service changes
    this.unsubscribe = this.fileUploadService.subscribe((newState) => {
      this.safeSetState({
        uploadState: newState
      });
      this.notifySubscribers();
    });
  }

  protected override onUnmount(): void {
    // Cleanup subscription and service
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.fileUploadService.destroy();
  }

  /**
   * Get current upload state
   */
  public getState(): IUploadState {
    return this.state.uploadState;
  }

  /**
   * Subscribe to upload state changes
   */
  public subscribe(callback: (state: IUploadState) => void): () => void {
    this.state.subscribers.add(callback);
    return () => this.state.subscribers.delete(callback);
  }

  /**
   * Handles changes in the file input.
   *
   * This function updates the state with the selected file 
   * when a user selects a file from the file input.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The change event from the file input.
   */
  public handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.fileUploadService.handleFileChange(e);
  };

  /**
   * Initiates the file upload process.
   *
   * This function creates a FormData object containing the selected 
   * file and calls the provided fetch callback to upload the file.
   * It updates the status based on the success or failure of the upload.
   *
   * @returns {Promise<void>} - A promise that resolves when the upload process completes.
   */
  public handleFileUpload = async (): Promise<void> => {
    try {
      await this.fileUploadService.uploadFile();
    } catch (error: unknown) {
      // Handle error display
      alert(`Error uploading file: ${(error as Error).message}`);
      throw error;
    }
  };

  /**
   * Get file upload utilities (hook-style API)
   */
  public getUploadUtilities(): {
    file: File | null;
    status: "idle" | "uploading" | "error" | "success";
    response: any;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleFileUpload: () => Promise<void>;
  } {
    return {
      file: this.state.uploadState.file,
      status: this.state.uploadState.status,
      response: this.state.uploadState.response,
      handleFileChange: this.handleFileChange,
      handleFileUpload: this.handleFileUpload
    };
  }

  /**
   * Reset upload state
   */
  public reset(): void {
    this.fileUploadService.reset();
  }

  /**
   * Set file for upload
   */
  public setFile(file: File | null): void {
    this.fileUploadService.setFile(file);
  }

  /**
   * Check if ready to upload
   */
  public isReadyToUpload(): boolean {
    return this.fileUploadService.isReadyToUpload();
  }

  /**
   * Get file information
   */
  public getFileInfo(): {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  } | null {
    return this.fileUploadService.getFileInfo();
  }

  /**
   * Notify all subscribers of state changes
   */
  private notifySubscribers(): void {
    const currentState = this.getState();
    this.state.subscribers.forEach(callback => {
      try {
        callback(currentState);
      } catch (error) {
        console.error('Error in file upload hook service subscriber:', error);
      }
    });
  }

  protected override renderContent(): React.ReactNode {
    // Services don't render content
    return null;
  }
}

/**
 * Factory function to create a new FileUploadHookService instance
 */
export const createFileUploadHookService = (props: IFileUploadHookServiceProps): FileUploadHookService => {
  return new FileUploadHookService(props);
};

export default FileUploadHookService;
