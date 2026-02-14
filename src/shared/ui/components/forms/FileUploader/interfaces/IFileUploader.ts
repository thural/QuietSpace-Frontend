import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * FileUploader component props interface
 */
export interface IFileUploaderProps extends IBaseComponentProps {
  /** File upload callback function */
  fetchCallback?: (file: File) => Promise<any>;
  /** Accept file types */
  accept?: string;
  /** Multiple file selection */
  multiple?: boolean;
  /** Maximum file size */
  maxSize?: number;
  /** Upload button text */
  uploadText?: string;
  /** Show file preview */
  showPreview?: boolean;
  /** Theme object for styling */
  theme?: any;
}

/**
 * FileUploader component state interface
 */
export interface IFileUploaderState extends IBaseComponentState {
  file: File | null;
  status: 'idle' | 'uploading' | 'success' | 'error';
}
