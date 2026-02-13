import { FlexContainer } from "@/shared/ui/components";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent } from "react";

class FlexStyled extends PureComponent<GenericWrapperWithRef> {
    override render(): React.ReactNode {
        const { forwardedRef, children, ...props } = this.props;
        return <FlexContainer {...props}>{children}</FlexContainer>
    }
}

export default withForwardedRefAndErrBoundary(FlexStyled)