import { Button } from "@mantine/core"

const LightBtn = ({ name = "submit", radius = "xl", size = "sm", color = "rgba(0, 0, 0, 1)", handleClick }) => {

    return (
        <Button
            variant="light"
            color={color}
            radius={radius}
            size={size}
            onClick={handleClick}
        >
            {name}
        </Button>
    )
}

export default LightBtn