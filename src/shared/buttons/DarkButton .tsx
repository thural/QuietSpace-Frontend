import { Button } from "@/shared/ui/components"
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef"
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes"

const DarkButton: React.FC<GenericWrapperWithRef> = ({
    forwardedRef,
    name = "submit",
    variant = "filled",
    radius = "xl",
    size = "sm",
    color = "rgba(0, 0, 0, 1)",
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