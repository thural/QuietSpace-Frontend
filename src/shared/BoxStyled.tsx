import React from 'react';
import { Box } from '@mantine/core';
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from '@shared-types/sharedComponentTypes';

const BoxStyled: React.FC<GenericWrapperWithRef> = ({ forwardedRef, children, ...props }) => {
    return (
        <Box ref={forwardedRef} {...props}>
            {children}
        </Box>
    );
};

export default withForwardedRefAndErrBoundary(BoxStyled);