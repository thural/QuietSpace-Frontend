import withForwardedRef from "../hooks/withForwardedRef"
import { Button } from "@mantine/core"

const LightButton = ({
    forwardedRef,
    name = "submit",
    radius = "xl",
    size = "sm",
    color = "rgba(0, 0, 0, 1)",
    handleClick,
    ...props
}) => {

    return (
        <Button
            ref={forwardedRef}
            variant="light"
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

export default withForwardedRef(LightButton)