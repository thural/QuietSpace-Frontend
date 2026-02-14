/**
 * Image Component Interfaces
 * 
 * Type definitions for the Image component with responsive features.
 */

import { BaseComponentProps } from "../../../types";

export interface IImageProps extends BaseComponentProps {
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    radius?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    lazy?: boolean;
    theme?: any;
}
