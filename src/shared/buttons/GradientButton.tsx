import { Button } from "@/shared/ui/components"
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef"
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes"

const GradientButton: React.FC<GenericWrapperWithRef> = ({
    forwardedRef,
    name = "submit",
    size = "md",
    variant = "primary",
    onClick
}) => {

    return (
        <Button
            ref={forwardedRef}
            variant={variant}
            size={size}
            onClick={onClick}
        >
            {name}
        </Button>
    )
}

export default withForwardedRefAndErrBoundary(GradientButton)