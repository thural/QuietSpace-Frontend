import withForwardedRef from "./hooks/withForwardedRef"

const NavStyled = ({ forwardedRef, children, ...props }) => {
    return <nav ref={forwardedRef} {...props}>{children}</nav>
}

export default withForwardedRef(NavStyled)