/** @jsxImportSource @emotion/react */

/**
 * Enterprise File Upload Container
 * 
 * Enterprise-grade file upload container using the new FileUploadManagementService.
 * Follows class-based patterns with proper error handling.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';
import { createFileUploadManagementService, type IFileUploadManagementService } from '../services/FileUploadManagementService';

/**
 * Props for EnterpriseFileUploadContainer
 */
export interface IEnterpriseFileUploadContainerProps extends IBaseComponentProps {
    children: React.ReactNode;
    fetchCallback: (file: File) => Promise<string>;
    accept?: string;
    maxSize?: number;
    multiple?: boolean;
    autoUpload?: boolean;
    showProgress?: boolean;
    className?: string;
}

/**
 * State for EnterpriseFileUploadContainer
 */
export interface IEnterpriseFileUploadContainerState extends IBaseComponentState {
    file: File | null;
    status: 'idle' | 'uploading' | 'error' | 'success';
    response: string | null;
    progress: number;
    uploadError: string | null;
    preview: string | null;
}

/**
 * Enterprise File Upload Container - Enterprise file upload orchestration component
 * 
 * Provides comprehensive file upload management with validation,
 * progress tracking, error handling, and enterprise-grade features.
 */
export class EnterpriseFileUploadContainer extends BaseClassComponent<IEnterpriseFileUploadContainerProps, IEnterpriseFileUploadContainerState> {
    private uploadService: IFileUploadManagementService;
    private fileInputRef: React.RefObject<HTMLInputElement | null>;
    private abortController: AbortController | null = null;

    constructor(props: IEnterpriseFileUploadContainerProps) {
        super(props);
        this.uploadService = createFileUploadManagementService(props.fetchCallback);
        this.fileInputRef = React.createRef<HTMLInputElement>();
    }

    protected override getInitialState(): Partial<IEnterpriseFileUploadContainerState> {
        const initialState: Partial<IEnterpriseFileUploadContainerState> = {
            file: null,
            status: 'idle',
            response: null,
            progress: 0,
            uploadError: null,
            preview: null
        };
        this.state = {
            file: null,
            status: 'idle',
            response: null,
            progress: 0,
            uploadError: null,
            preview: null
        };
        return initialState;
    }

    protected override onMount(): void {
        // Subscribe to upload service changes
        this.uploadService.subscribe((uploadState) => {
            this.safeSetState({
                file: uploadState.file,
                status: uploadState.isUploading ? 'uploading' :
                    uploadState.error ? 'error' :
                        uploadState.url ? 'success' : 'idle',
                response: uploadState.url,
                progress: uploadState.progress,
                uploadError: uploadState.error,
                preview: uploadState.preview
            });
        });
    }

    protected override onUnmount(): void {
        // Cleanup upload service
        this.uploadService.destroy();

        // Abort any ongoing upload
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    /**
     * Handle file selection
     */
    private handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        // Additional safety check for undefined file
        if (!file) return;

        // Validate file
        if (!this.validateFile(file)) {
            return;
        }

        // Set file in service
        this.uploadService.setFile(file || null);

        // Auto-upload if enabled
        if (this.props.autoUpload) {
            this.handleUpload();
        }
    };

    /**
     * Validate file against constraints
     */
    private validateFile = (file: File): boolean => {
        const { accept, maxSize } = this.props;

        // Check file type
        if (accept && !file.type.match(new RegExp(accept.replace('*', '.*')))) {
            this.safeSetState({
                status: 'error',
                uploadError: `File type ${file.type} is not allowed`
            });
            return false;
        }

        // Check file size
        if (maxSize && file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024);
            this.safeSetState({
                status: 'error',
                uploadError: `File size ${(file.size / (1024 * 1024)).toFixed(2)}MB exceeds maximum ${maxSizeMB}MB`
            });
            return false;
        }

        return true;
    };

    /**
     * Handle file upload
     */
    private handleUpload = async (): Promise<void> => {
        if (this.state.status === 'uploading') return;

        try {
            // Create abort controller
            this.abortController = new AbortController();

            // Start upload
            await this.uploadService.uploadFile();

        } catch (error) {
            console.error('Upload failed:', error);
            this.safeSetState({
                status: 'error',
                uploadError: error instanceof Error ? error.message : 'Upload failed'
            });
        } finally {
            this.abortController = null;
        }
    };

    /**
     * Handle file removal
     */
    private handleRemoveFile = (): void => {
        this.uploadService.resetUpload();
        this.safeSetState({
            file: null,
            status: 'idle',
            response: null,
            progress: 0,
            uploadError: null,
            preview: null
        });

        // Clear file input
        if (this.fileInputRef.current) {
            this.fileInputRef.current.value = '';
        }
    };

    /**
     * Handle retry upload
     */
    private handleRetry = (): void => {
        if (this.state.file) {
            this.handleUpload();
        }
    };

    /**
     * Format file size
     */
    private formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    /**
     * Get status icon
     */
    private getStatusIcon = (): string => {
        switch (this.state.status) {
            case 'uploading':
                return '⏳';
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            default:
                return '📁';
        }
    };

    protected override renderContent(): React.ReactNode {
        const { children, className = '', showProgress = true } = this.props;
        const { file, status, progress, uploadError, preview } = this.state;

        return (
            <div className={`enterprise-file-upload-container ${className}`}>
                {children}

                <div className="file-upload-area">
                    <input
                        ref={this.fileInputRef}
                        type="file"
                        accept={this.props.accept}
                        multiple={this.props.multiple}
                        onChange={this.handleFileSelect}
                        style={{ display: 'none' }}
                    />

                    <button
                        onClick={() => this.fileInputRef.current?.click()}
                        className="file-select-button"
                        disabled={status === 'uploading'}
                    >
                        {this.getStatusIcon()} Select File
                    </button>
                </div>

                {file && (
                    <div className="file-info">
                        {preview && (
                            <div className="file-preview">
                                <img src={preview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                            </div>
                        )}

                        <div className="file-details">
                            <div className="file-name">{file.name}</div>
                            <div className="file-size">{this.formatFileSize(file.size)}</div>
                        </div>

                        <div className="file-actions">
                            {status !== 'uploading' && (
                                <button onClick={this.handleRemoveFile} className="remove-button">
                                    ❌ Remove
                                </button>
                            )}

                            {status === 'idle' && !this.props.autoUpload && (
                                <button onClick={this.handleUpload} className="upload-button">
                                    ⬆️ Upload
                                </button>
                            )}

                            {status === 'error' && (
                                <button onClick={this.handleRetry} className="retry-button">
                                    🔄 Retry
                                </button>
                            )}
                        </div>

                        {showProgress && status === 'uploading' && (
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="progress-text">{progress}%</div>
                            </div>
                        )}

                        {uploadError && (
                            <div className="error-message">
                                ⚠️ {uploadError}
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="success-message">
                                ✅ File uploaded successfully!
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default EnterpriseFileUploadContainer;
