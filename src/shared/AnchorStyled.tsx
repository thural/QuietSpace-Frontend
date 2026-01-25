import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef"
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes"

const AnchorStyled: React.FC<GenericWrapperWithRef> = ({
    href = "",
    target = "_blank",
    label = "blank",
    forwardedRef,
    style,
    ...props
}) => {
    return (
        <a
            ref={forwardedRef}
            href={href}
            target={target}
            style={{
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                ...style
            }}
            {...props}
        >
            {label}
        </a>
    )
}

export default withForwardedRefAndErrBoundary(AnchorStyled)