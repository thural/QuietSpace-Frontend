/**
 * Switch Component Interfaces
 * 
 * Type definitions for the Switch component with toggle functionality.
 */

import { BaseComponentProps } from "../../../types";

export interface ISwitchProps extends BaseComponentProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    labelPosition?: 'left' | 'right';
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}
