import { Anchor } from "@mantine/core"
import withForwardedRefAndErrBoundary from "@/services/hook/shared/withForwardedRef"
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes"

const AnchorStyled: React.FC<GenericWrapperWithRef> = ({
    fw = 400,
    fz = "1rem",
    href = "",
    target = "_blank",
    underline = "never",
    label = "blank",
    forwardedRef
}) => {
    return (
        <Anchor ref={forwardedRef} fw={fw} fz={fz} href={href} target={target} underline={underline}>{label}</Anchor>
    )
}

export default withForwardedRefAndErrBoundary(AnchorStyled)