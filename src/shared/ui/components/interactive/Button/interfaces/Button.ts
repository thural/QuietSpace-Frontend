/**
 * Button Component Interfaces
 * 
 * Type definitions for the Button component with multiple variants and states.
 */

import { InteractiveProps } from "../../../types";

export interface ButtonProps extends InteractiveProps {
    type?: 'button' | 'submit' | 'reset';
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    fullWidth?: boolean;
    rounded?: boolean;
    outlined?: boolean;
    gradient?: boolean;
}
