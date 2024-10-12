import { Button } from "@mantine/core"

const LightButton = ({
    name = "submit",
    radius = "xl",
    size = "sm",
    color = "rgba(0, 0, 0, 1)", handleClick,
    ...props
}) => {

    return (
        <Button
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

export default LightButton