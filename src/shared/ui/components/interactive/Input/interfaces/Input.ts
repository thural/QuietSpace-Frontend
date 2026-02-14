/**
 * Input Component Interfaces
 * 
 * Type definitions for the Input component with various input types and states.
 */

import { InteractiveProps } from "../../../types";

export interface InputProps extends InteractiveProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    name?: string;
    id?: string;
    required?: boolean;
    readOnly?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
