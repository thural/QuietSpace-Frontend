import { Button } from "@mantine/core"

const DarkButton = ({
    name = "submit",
    variant = "dark",
    radius = "xl",
    size = "sm",
    color = "rgba(250, 250, 250, 1)", handleClick,
    ...props
}) => {

    return (
        <Button
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

export default DarkButton