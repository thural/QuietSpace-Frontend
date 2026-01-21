import withForwardedRefAndErrBoundary from "@shared/hooks/withForwardedRef"
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes"

const NavStyled: React.FC<GenericWrapperWithRef> = ({ forwardedRef, children, ...props }) => {
    return <nav ref={forwardedRef} {...props}>{children}</nav>
}

export default withForwardedRefAndErrBoundary(NavStyled)