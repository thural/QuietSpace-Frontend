import { Button } from "@/shared/ui/components"
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef"
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes"

const DarkButton: React.FC<GenericWrapperWithRef> = ({
    forwardedRef,
    name = "submit",
    variant = "primary",
    size = "sm",
    handleClick,
    ...props
}) => {

    return (
        <Button
            ref={forwardedRef}
            variant={variant}
            size={size}
            onClick={handleClick}
            {...props}
        >
            {name}
        </Button>
    )
}

export default withForwardedRefAndErrBoundary(DarkButton)
