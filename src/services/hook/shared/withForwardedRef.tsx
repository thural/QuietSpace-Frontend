import React, { forwardRef, ReactNode, ComponentType } from 'react';

interface WithForwardedRefProps {
    children?: ReactNode;
    forwardedRef: React.Ref<any>;
    [key: string]: any;
}

const withForwardedRefAndErrBoundary = <P extends object>(Component: ComponentType<P>) => {
    return forwardRef<any, Omit<P & WithForwardedRefProps, 'forwardedRef'>>((props, ref) => (
        <Component {...props as P} forwardedRef={ref} />
    ))
};

export default withForwardedRefAndErrBoundary;