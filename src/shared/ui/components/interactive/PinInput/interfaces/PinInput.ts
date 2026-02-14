/**
 * PinInput Component Interfaces
 * 
 * Type definitions for the PinInput component with PIN code functionality.
 */

import { BaseComponentProps } from "../../../types";

export interface IPinInputProps extends BaseComponentProps {
    length?: number;
    value?: string;
    onChange?: (value: string) => void;
    type?: 'text' | 'number';
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}
