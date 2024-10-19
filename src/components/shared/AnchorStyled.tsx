import { Anchor } from "@mantine/core"
import withForwardedRef from "./hooks/withForwardedRef"

const AnchorStyled = ({
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

export default withForwardedRef(AnchorStyled)