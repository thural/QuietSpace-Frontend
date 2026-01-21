/**
 * Generic type definitions used throughout the application
 */

/**
 * A consumer function that takes no arguments and returns void
 * Commonly used for callback functions like toggleForm, handleClose, etc.
 */
export type ConsumerFn = () => void;

/**
 * A procedure function that takes no arguments and returns void
 * Alias for ConsumerFn for semantic clarity
 */
export type ProcedureFn = () => void;

/**
 * A function that takes any arguments and returns any value
 * Commonly used for event handlers and generic callbacks
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * A function that handles mouse events
 * Commonly used for onClick, onMouseOver, etc.
 */
export type MouseEventFn = (event: React.MouseEvent) => void;

/**
 * A predicate function that takes any argument and returns a boolean
 * Commonly used for filtering and conditional logic
 */
export type AnyPredicate = (value: any) => boolean;
