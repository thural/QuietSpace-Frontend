import { Button } from "@mantine/core"

const GradientButton = ({
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

export default GradientButton