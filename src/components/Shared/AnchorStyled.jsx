import { Anchor } from "@mantine/core"

const AnchorStyled = ({
    fw = 400,
    fz = "1rem",
    href = "",
    target = "_blank",
    underline = "never",
    label = "blank"
}) => {
    return (
        <Anchor fw={fw} fz={fz} href={href} target={target} underline={underline}>{label}</Anchor>
    )
}

export default AnchorStyled