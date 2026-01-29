import { ReactNode } from "react";

/**
 * Base interface for generic wrapper components
 * Provides common props for styling and layout components
 */
export interface GenericWrapper {
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
}

/**
 * Base interface for generic wrapper components with ref forwarding
 * Extends GenericWrapper to include ref forwarding capability
 */
export interface GenericWrapperWithRef extends GenericWrapper {
    forwardedRef?: React.Ref<any>;
}
