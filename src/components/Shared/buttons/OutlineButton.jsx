import { Button } from "@mantine/core"

const OutlineButton = ({ onClick, radius = "md", size = "2.5rem", name = "submit", ...props }) => {

    return (
        <Button
            radius={radius}
            size={size}
            variant="outline"
            onClick={onClick}
            style={{ fontSize: 'medium' }}
            {...props}
        >
            {name}
        </Button>
    )
}

export default OutlineButton