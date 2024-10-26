import withForwardedRef from "./hooks/withForwardedRef"
import { GenericWrapperWithRef } from "./types/sharedComponentTypes"

const NavStyled: React.FC<GenericWrapperWithRef> = ({ forwardedRef, children, ...props }) => {
    return <nav ref={forwardedRef} {...props}>{children}</nav>
}

export default withForwardedRef(NavStyled)