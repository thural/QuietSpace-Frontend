import React, { forwardRef, ReactNode, ComponentType } from 'react';

interface WithForwardedRefProps {
    children?: ReactNode;       // Optional children to be rendered within the component.
    forwardedRef: React.Ref<any>; // Ref to be forwarded to the wrapped component.
    [key: string]: any;         // Allow additional props to be passed.
}

/**
 * Higher-order component that forwards refs to a wrapped component.
 *
 * This function takes a React component and returns a new component 
 * that forwards a ref as a prop named `forwardedRef`. This is useful 
 * for allowing parent components to access the ref of the wrapped 
 * component directly.
 *
 * @param {ComponentType<P>} Component - The component to be wrapped with forwarded ref functionality.
 * @returns {React.FC<Omit<P & WithForwardedRefProps, 'forwardedRef'>>} - A new component that forwards refs.
 */
const withForwardedRefAndErrBoundary = <P extends object>(Component: ComponentType<P>) => {
    return forwardRef<any, Omit<P & WithForwardedRefProps, 'forwardedRef'>>((props, ref) => (
        <Component {...props as P} forwardedRef={ref} />
    ));
};

export default withForwardedRefAndErrBoundary;