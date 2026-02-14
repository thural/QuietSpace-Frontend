/**
 * Avatar Component Interfaces
 * 
 * Type definitions for the Avatar component with various shapes and sizes.
 */

import { BaseComponentProps } from "../../../types";
import { ComponentSize } from "../../../types";
import { RefObject, ReactNode } from 'react';

export interface IAvatarProps extends Omit<BaseComponentProps, 'ref' | 'id'> {
    src?: string;
    alt?: string;
    size?: string | number | ComponentSize;
    radius?: string;
    color?: string;
    variant?: 'circle' | 'square' | 'rounded';
    children?: ReactNode;
    ref?: RefObject<HTMLDivElement>;
    id?: string;
    theme?: any;
}
