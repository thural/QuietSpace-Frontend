import { Button } from "@mantine/core"
import withForwardedRefAndErrBoundary from "../../../services/hook/shared/withForwardedRef"
import { GenericWrapperWithRef } from "../../../types/sharedComponentTypes"

const DarkButton: React.FC<GenericWrapperWithRef> = ({
    forwardedRef,
    name = "submit",
    variant = "dark",
    radius = "xl",
    size = "sm",
    color = "rgba(250, 250, 250, 1)",
    handleClick,
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

export default withForwardedRefAndErrBoundary(DarkButton)