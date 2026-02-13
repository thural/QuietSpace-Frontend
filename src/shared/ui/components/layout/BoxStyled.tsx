import React, { PureComponent } from 'react';
import { Container } from '@/shared/ui/components';
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from '@shared-types/sharedComponentTypes';

class BoxStyled extends PureComponent<GenericWrapperWithRef> {
    override render(): React.ReactNode {
        const { forwardedRef, children, ...props } = this.props;

        return (
            <Container {...props}>
                {children}
            </Container>
        );
    }
}

export default withForwardedRefAndErrBoundary(BoxStyled);