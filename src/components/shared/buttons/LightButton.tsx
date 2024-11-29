import withForwardedRefAndErrBoundary from "@/services/hook/shared/withForwardedRef"
import { Button } from "@mantine/core"
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes"

const LightButton: React.FC<GenericWrapperWithRef> = ({
    forwardedRef,
    name = "submit",
    radius = "xl",
    size = "sm",
    color = "rgba(0, 0, 0, 1)",
    variant = "light",
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

export default withForwardedRefAndErrBoundary(LightButton)