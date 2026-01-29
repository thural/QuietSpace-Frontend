import React from 'react';
import { Container } from '@/shared/ui/components';
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from '@shared-types/sharedComponentTypes';

const BoxStyled: React.FC<GenericWrapperWithRef> = ({ forwardedRef, children, ...props }) => {
    return (
        <Container ref={forwardedRef} {...props}>
            {children}
        </Container>
    );
};

export default withForwardedRefAndErrBoundary(BoxStyled);