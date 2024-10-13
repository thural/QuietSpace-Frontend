import { Button } from "@mantine/core"
import withForwardedRef from "../hooks/withForwardedRef"

const DarkButton = ({
    forwardedRef,
    name = "submit",
    variant = "dark",
    radius = "xl",
    size = "sm",
    color = "rgba(250, 250, 250, 1)", handleClick,
    ...props
}) => {

    return (
        <Button
            ref={forwardedRef}
            variant={variant}
            color={color}
            radius={radius}
            size={size}
            onClick={handleClick}
            {...props}
        >
            {name}
        </Button>
    )
}

export default withForwardedRef(DarkButton)