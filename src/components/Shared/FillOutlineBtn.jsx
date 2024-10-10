import { Button } from "@mantine/core"

const FillOutlineBtn = ({ onClick, name = "submit" }) => {

    return (
        <Button
            fullWidth
            radius="md"
            variant="outline"
            onClick={onClick}
            style={{ fontSize: 'medium' }}
        >
            {name}
        </Button>
    )
}

export default FillOutlineBtn