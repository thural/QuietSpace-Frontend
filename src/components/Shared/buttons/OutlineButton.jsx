import { Button } from "@mantine/core"
import withForwardedRef from "../hooks/withForwardedRef"

const OutlineButton = ({ forwardedRef, onClick, radius = "md", size = "2.5rem", name = "submit", ...props }) => {

    return (
        <Button
            ref={forwardedRef}
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

export default withForwardedRef(OutlineButton)