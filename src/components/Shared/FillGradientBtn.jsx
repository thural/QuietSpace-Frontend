import { Button } from "@mantine/core"

const FillGradientBtn = ({
    to = "cyan", deg = 90,
    from = "blue",
    name = "submit",
    radius = "md",
    size = "md",
    onClick
}) => {

    return (
        <Button
            fullWidth
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

export default FillGradientBtn