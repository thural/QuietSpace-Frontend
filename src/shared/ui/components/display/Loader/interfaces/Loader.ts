/**
 * Loader Component Interfaces
 * 
 * Type definitions for the Loader component with animations.
 */

import { BaseComponentProps } from "../../../types";
import { ComponentSize } from "../../../types";

export interface ILoaderProps extends BaseComponentProps {
    size?: string | ComponentSize;
    color?: string;
    borderWidth?: string;
    theme?: any;
}
