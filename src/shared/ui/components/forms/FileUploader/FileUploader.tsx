import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ChangeEvent, ReactNode } from 'react';
import { formatFileSize } from "@/shared/utils/stringUtils";
import { IFileUploaderProps, IFileUploaderState } from './interfaces';
import { FileUploaderContainer, FileInfoStyles, StatusStyles } from './styles';

/**
 * Extended props interface for FileUploader component
 */
interface IFileUploaderExtendedProps extends IFileUploaderProps, IBaseComponentProps {
  /** Additional className for styling */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Extended state interface for FileUploader component
 */
interface IFileUploaderExtendedState extends IFileUploaderState, IBaseComponentState {
  /** Additional state properties if needed */
}

/**
 * Enterprise FileUploader Component
 * 
 * A file upload component with progress tracking and status feedback.
 * Follows enterprise architecture patterns with proper decoupling.
 */
export class FileUploader extends BaseClassComponent<IFileUploaderExtendedProps, IFileUploaderExtendedState> {
  static defaultProps: Partial<IFileUploaderExtendedProps> = {
    accept: '*/*',
    multiple: false,
    showPreview: true,
    uploadText: 'Upload'
  };

  protected override getInitialState(): Partial<IFileUploaderExtendedState> {
    return {
      file: null,
      status: 'idle'
    };
  }

  /**
   * Handle file change
   */
  private handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.safeSetState({ 
        file: files[0] || null,
        status: 'idle'
      });
    }
  };

  /**
   * Handle file upload
   */
  private handleFileUpload = (): void => {
    const { file } = this.state;
    const { fetchCallback } = this.props;

    if (!file || !fetchCallback) return;

    this.safeSetState({ status: 'uploading' });

    fetchCallback(file)
      .then(() => {
        this.safeSetState({ status: 'success' });
      })
      .catch(() => {
        this.safeSetState({ status: 'error' });
      });
  };

  protected override renderContent(): ReactNode {
    const {
      accept = '*/*',
      multiple = false,
      showPreview = true,
      uploadText = 'Upload',
      className,
      testId = 'file-uploader',
      theme
    } = this.props;

    const { file, status } = this.state;

    return (
      <div css={FileUploaderContainer(theme)} className={className} data-testid={testId}>
        <input
          type="file"
          onChange={this.handleFileChange}
          accept={accept}
          multiple={multiple}
          style={{ marginBottom: '12px' }}
        />
        
        <button
          onClick={this.handleFileUpload}
          disabled={!file || status === 'uploading'}
          style={{
            padding: '8px 16px',
            backgroundColor: !file || status === 'uploading' ? '#ccc' : '#007bff',
            color: !file || status === 'uploading' ? '#666' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: !file || status === 'uploading' ? 'not-allowed' : 'pointer',
            marginBottom: '12px'
          }}
        >
          {status === 'uploading' ? 'Uploading...' : uploadText}
        </button>
        
        {status !== 'idle' && (
          <div css={StatusStyles(theme, status)}>
            {status === 'uploading' && 'Uploading...'}
            {status === 'success' && 'File uploaded successfully!'}
            {status === 'error' && 'Upload failed. Please try again.'}
          </div>
        )}
        
        {showPreview && file && (
          <div css={FileInfoStyles(theme)}>
            <div>file name: {file.name}</div>
            <div>file size: {formatFileSize(file.size)}</div>
            <div>file type: {file.type}</div>
          </div>
        )}
      </div>
    );
  }
}

export default FileUploader;
