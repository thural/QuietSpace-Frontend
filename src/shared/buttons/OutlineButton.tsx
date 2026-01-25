import { Button } from "@/shared/ui/components"
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef"
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes"

const OutlineButton: React.FC<GenericWrapperWithRef> = ({
    forwardedRef,
    onClick,
    size = "md",
    name = "submit",
    ...props
}) => {

    return (
        <Button
            ref={forwardedRef}
            variant="secondary"
            size={size}
            onClick={onClick}
            {...props}
        >
            {name}
        </Button>
    )
}

export default withForwardedRefAndErrBoundary(OutlineButton)