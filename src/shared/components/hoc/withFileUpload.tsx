import React from 'react';
import { createFileUploadHookService } from '../../hooks/FileUploadHookService';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../base/BaseClassComponent';

/**
 * Configuration options for withFileUpload HOC
 */
export interface IWithFileUploadOptions {
    fetchCallback: (formData: FormData) => Promise<any>;
    accept?: string;
    maxSize?: number;
    multiple?: boolean;
    autoUpload?: boolean;
}

/**
 * Props injected by withFileUpload HOC
 */
export interface IWithFileUploadProps extends IBaseComponentProps {
    file: File | null;
    status: 'idle' | 'uploading' | 'error' | 'success';
    response: any;
    handleFileChange: (e: any) => void;
    handleFileUpload: () => Promise<void>;
    progress?: number;
}

/**
 * State for withFileUpload HOC
 */
interface IWithFileUploadState extends IBaseComponentState {
    file: File | null;
    status: 'idle' | 'uploading' | 'error' | 'success';
    response: any;
    progress?: number;
}

/**
 * Higher-order component that provides file upload functionality
 * 
 * Uses the existing FileUploadHookService to inject file upload capabilities
 * into any component while maintaining enterprise patterns.
 * 
 * @param options - Configuration options for file upload
 * @returns A higher-order component that injects file upload props
 */
export function withFileUpload<P extends IBaseComponentProps>(
    options: IWithFileUploadOptions
) {
    return (WrappedComponent: React.ComponentType<P & IWithFileUploadProps>) => {
        return class WithFileUpload extends BaseClassComponent<P, IWithFileUploadState> {
            private uploadService = createFileUploadHookService({ 
                fetchCallback: options.fetchCallback 
            });

            protected override getInitialState(): Partial<IWithFileUploadState> {
                return {
                    file: null,
                    status: 'idle',
                    response: null,
                    progress: 0
                };
            }

            protected override onMount(): void {
                // Subscribe to upload service changes
                this.uploadService.subscribe(() => {
                    // Update state with service state
                    const utilities = this.uploadService.getUploadUtilities();
                    this.safeSetState({
                        file: utilities.file,
                        status: utilities.status,
                        response: utilities.response
                    });
                });
            }

            private validateFile = (file: File): boolean => {
                // File size validation
                if (options.maxSize && file.size > options.maxSize) {
                    console.error(`File size exceeds maximum allowed size of ${options.maxSize} bytes`);
                    return false;
                }

                // File type validation
                if (options.accept && !this.isAcceptedFileType(file, options.accept)) {
                    console.error(`File type ${file.type} is not accepted`);
                    return false;
                }

                return true;
            };

            private isAcceptedFileType = (file: File, accept: string): boolean => {
                const acceptedTypes = accept.split(',').map(type => type.trim());
                return acceptedTypes.some(acceptedType => {
                    if (acceptedType.startsWith('.')) {
                        return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
                    } else {
                        return file.type.match(new RegExp(acceptedType.replace('*', '.*')));
                    }
                });
            };

            private handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
                const files = e.target.files;
                if (!files || files.length === 0) {
                    this.safeSetState({ file: null, status: 'idle' });
                    return;
                }

                const file = options.multiple ? files[0] : files[0];
                
                if (!this.validateFile(file)) {
                    this.safeSetState({ 
                        file: null, 
                        status: 'error' 
                    });
                    return;
                }

                this.safeSetState({ file });
                
                // Auto-upload if enabled
                if (options.autoUpload) {
                    this.handleFileUpload();
                }
            };

            private handleFileUpload = async (): Promise<void> => {
                const { file } = this.state;
                
                if (!file) {
                    console.warn('No file to upload');
                    return;
                }

                if (!this.validateFile(file)) {
                    this.safeSetState({ status: 'error' });
                    return;
                }

                try {
                    this.safeSetState({ status: 'uploading' });
                    const utilities = this.uploadService.getUploadUtilities();
                    await utilities.handleFileUpload();
                } catch (error) {
                    console.error('Upload error:', error);
                    this.safeSetState({ status: 'error' });
                }
            };

            protected override renderContent(): React.ReactNode {
                const utilities = this.uploadService.getUploadUtilities();
                const uploadProps: IWithFileUploadProps = {
                    file: utilities.file,
                    status: utilities.status,
                    response: utilities.response,
                    handleFileChange: this.handleFileChange,
                    handleFileUpload: this.handleFileUpload,
                    progress: this.state.progress
                };

                return (
                    <WrappedComponent 
                        {...this.props} 
                        {...uploadProps}
                    />
                );
            }
        };
    };
}

export default withFileUpload;
