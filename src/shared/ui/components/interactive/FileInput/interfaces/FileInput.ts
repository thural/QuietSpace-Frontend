/**
 * FileInput Component Interfaces
 * 
 * Type definitions for the FileInput component with file handling.
 */

import { BaseComponentProps } from "../../../types";

export interface IFileInputProps extends BaseComponentProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  placeholder?: string;
  accept?: string;
  disabled?: boolean;
  multiple?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
