/**
 * Badge Component Interfaces
 * 
 * Type definitions for the Badge component with various variants and sizes.
 */

import { BaseComponentProps } from "../../../types";
import { ComponentSize } from "../../../types";
import { ReactNode } from 'react';

export interface IBadgeProps extends BaseComponentProps {
    children: ReactNode;
    variant?: 'filled' | 'outline' | 'light';
    color?: string;
    size?: ComponentSize;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
    theme?: any;
}
