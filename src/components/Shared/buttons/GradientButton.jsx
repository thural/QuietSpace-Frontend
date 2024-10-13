import { Button } from "@mantine/core"
import withForwardedRef from "../hooks/withForwardedRef"

const GradientButton = ({
    forwardedRef,
    to = "cyan",
    deg = 90,
    from = "blue",
    name = "submit",
    radius = "md",
    size = "2.5rem",
    onClick
}) => {

    return (
        <Button
            ref={forwardedRef}
            radius={radius}
            size={size}
            variant="gradient"
            gradient={{ from, to, deg }}
            onClick={onClick}
            style={{ fontSize: 'medium' }}
        >
            {name}
        </Button>
    )
}

export default withForwardedRef(GradientButton)