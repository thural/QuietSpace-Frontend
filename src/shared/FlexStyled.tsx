import { FlexContainer } from "@/shared/ui/components";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";

const FlexStyled: React.FC<GenericWrapperWithRef> = ({ forwardedRef, children, ...props }) => {
    return <FlexContainer ref={forwardedRef} {...props}>{children}</FlexContainer>
}

export default withForwardedRefAndErrBoundary(FlexStyled)