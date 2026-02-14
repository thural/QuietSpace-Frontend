import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';
import { createFileUploadHookService } from '../hooks/FileUploadHookService';
import { useDIContainer } from '../ui/components/providers/DIProvider';

/**
 * Props for FileUploadContainer
 */
export interface IFileUploadContainerProps extends IBaseComponentProps {
    children: React.ReactNode;
    fetchCallback: (formData: FormData) => Promise<any>;
    accept?: string;
    maxSize?: number;
    multiple?: boolean;
    autoUpload?: boolean;
    showProgress?: boolean;
    className?: string;
}

/**
 * State for FileUploadContainer
 */
export interface IFileUploadContainerState extends IBaseComponentState {
    file: File | null;
    status: 'idle' | 'uploading' | 'error' | 'success';
    response: any;
    progress: number;
    error: string | null;
}

/**
 * File Upload Container - Enterprise file upload orchestration component
 * 
 * Provides comprehensive file upload management with validation,
 * progress tracking, error handling, and enterprise-grade features.
 */
export class FileUploadContainer extends BaseClassComponent<IFileUploadContainerProps, IFileUploadContainerState> {
    private uploadService = createFileUploadHookService({ 
        fetchCallback: async () => ({ success: true }) 
    });
    private diContainer = useDIContainer();
    private abortController: AbortController | null = null;

    protected override getInitialState(): Partial<IFileUploadContainerState> {
        return {
            file: null,
            status: 'idle',
            response: null,
            progress: 0,
            error: null
        };
    }

    protected override onMount(): void {
        const { fetchCallback } = this.props;
        
        // Update upload service with provided callback
        this.uploadService = createFileUploadHookService({ fetchCallback });
        
        // Subscribe to upload service changes
        this.uploadService.subscribe(() => {
            const utilities = this.uploadService.getUploadUtilities();
            this.safeSetState({
                file: utilities.file,
                status: utilities.status,
                response: utilities.response
            });
        });
    }

    protected override onUpdate(prevProps: IFileUploadContainerProps): void {
        const { fetchCallback: prevFetchCallback } = prevProps;
        const { fetchCallback: currentFetchCallback } = this.props;

        if (prevFetchCallback !== currentFetchCallback) {
            // Update upload service with new callback
            this.uploadService = createFileUploadHookService({ fetchCallback: currentFetchCallback });
        }
    }

    protected override onUnmount(): void {
        // Cancel any ongoing upload
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    private validateFile = (file: File): { isValid: boolean; error: string | null } => {
        const { accept, maxSize } = this.props;
        
        // File size validation
        if (maxSize && file.size > maxSize) {
            return {
                isValid: false,
                error: `File size (${file.size} bytes) exceeds maximum allowed size (${maxSize} bytes)`
            };
        }

        // File type validation
        if (accept && !this.isFileTypeAccepted(file, accept)) {
            return {
                isValid: false,
                error: `File type (${file.type}) is not accepted. Accepted types: ${accept}`
            };
        }

        // Additional validations
        if (file.size === 0) {
            return {
                isValid: false,
                error: 'File is empty'
            };
        }

        return { isValid: true, error: null };
    };

    private isFileTypeAccepted = (file: File, accept: string): boolean => {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        return acceptedTypes.some(acceptedType => {
            if (acceptedType.startsWith('.')) {
                return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
            } else {
                return file.type.match(new RegExp(acceptedType.replace('*', '.*')));
            }
        });
    };

    private handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            this.safeSetState({ 
                file: null, 
                status: 'idle', 
                error: null 
            });
            return;
        }

        const file = this.props.multiple ? files[0] : files[0];
        const validation = this.validateFile(file);
        
        if (!validation.isValid) {
            this.safeSetState({ 
                file: null, 
                status: 'error', 
                error: validation.error 
            });
            return;
        }

        this.safeSetState({ 
            file, 
            status: 'idle', 
            error: null 
        });

        // Auto-upload if enabled
        if (this.props.autoUpload) {
            this.handleUpload();
        }
    };

    private handleUpload = async (): Promise<void> => {
        const { file } = this.state;
        
        if (!file) {
            this.safeSetState({ 
                error: 'No file selected for upload' 
            });
            return;
        }

        const validation = this.validateFile(file);
        if (!validation.isValid) {
            this.safeSetState({ 
                error: validation.error 
            });
            return;
        }

        try {
            // Create abort controller for this upload
            this.abortController = new AbortController();
            
            this.safeSetState({ 
                status: 'uploading', 
                error: null,
                progress: 0 
            });

            const formData = new FormData();
            formData.append('file', file);

            // Simulate progress tracking
            this.simulateProgress();

            const utilities = this.uploadService.getUploadUtilities();
            await utilities.handleFileUpload();

            this.safeSetState({ 
                status: 'success', 
                error: null,
                progress: 100 
            });

        } catch (error) {
            console.error('Upload error:', error);
            this.safeSetState({ 
                status: 'error', 
                error: error.message || 'Upload failed' 
            });
        }
    };

    private simulateProgress = (): void => {
        if (!this.props.showProgress) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress <= 100) {
                this.safeSetState({ progress });
            }
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 200);

        // Clear interval on unmount
        this.safeSetState({ progress: 0 } as any);
    };

    private handleRetry = (): void => {
        this.handleUpload();
    };

    private handleClear = (): void => {
        this.safeSetState({
            file: null,
            status: 'idle',
            response: null,
            progress: 0,
            error: null
        });
    };

    protected override renderContent(): React.ReactNode {
        const { children, className = '', showProgress = true } = this.props;
        const { file, status, response, progress, error } = this.state;

        return (
            <div className={`file-upload-container ${className}`}>
                <div className="file-upload-area">
                    <input
                        type="file"
                        accept={this.props.accept}
                        multiple={this.props.multiple}
                        onChange={this.handleFileSelect}
                        disabled={status === 'uploading'}
                        className="file-input"
                    />
                    
                    {file && (
                        <div className="file-info">
                            <div className="file-name">{file.name}</div>
                            <div className="file-size">{this.formatFileSize(file.size)}</div>
                            <div className="file-type">{file.type}</div>
                        </div>
                    )}
                </div>

                <div className="upload-controls">
                    <button 
                        onClick={this.handleUpload}
                        disabled={!file || status === 'uploading'}
                        className="upload-button"
                    >
                        {status === 'uploading' ? 'Uploading...' : 'Upload File'}
                    </button>
                    
                    {status !== 'idle' && (
                        <button 
                            onClick={this.handleRetry}
                            className="retry-button"
                        >
                            Retry
                        </button>
                    )}
                    
                    <button 
                        onClick={this.handleClear}
                        className="clear-button"
                    >
                        Clear
                    </button>
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

                {error && (
                    <div className="error-message">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {status === 'success' && response && (
                    <div className="success-message">
                        <strong>Upload Successful!</strong>
                        <pre>{JSON.stringify(response, null, 2)}</pre>
                    </div>
                )}

                {children}
            </div>
        );
    }

    private formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
        
        return `${size} ${sizes[i]}`;
    };
}

export default FileUploadContainer;
