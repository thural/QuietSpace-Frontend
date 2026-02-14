/**
 * HOC Composition Utility
 * 
 * Provides a clean way to chain multiple higher-order components
 * together in a readable and maintainable fashion.
 * 
 * @param hocs - Array of higher-order components to compose
 * @returns A composed higher-order component function
 */

type ComponentType<P = {}> = React.ComponentType<P>;

export function compose<P>(...hocs: Array<(component: ComponentType<P>) => ComponentType<P>>) {
    return (component: ComponentType<P>): ComponentType<P> => 
        hocs.reduceRight((acc, hoc) => hoc(acc), component);
}

/**
 * Alternative compose function for better TypeScript inference
 * 
 * @param hocs - Array of higher-order components to compose
 * @returns A composed higher-order component function
 */
export function composeWithTypes<P>(
    ...hocs: Array<(component: ComponentType<P>) => ComponentType<P>>
): (component: ComponentType<P>) => ComponentType<P> {
    return (component: ComponentType<P>): ComponentType<P> => 
        hocs.reduceRight((acc, hoc) => hoc(acc), component);
}

/**
 * Pipe function for left-to-right composition
 * 
 * @param fns - Array of functions to compose
 * @returns A composed function
 */
export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
    return (arg: T): T => 
        fns.reduce((acc, fn) => fn(acc), arg);
}

export default compose;
