import { Button } from "@mantine/core"
import withForwardedRefAndErrBoundary from "@/services/hook/shared/withForwardedRef"
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes"

const OutlineButton: React.FC<GenericWrapperWithRef> = ({
    forwardedRef,
    onClick,
    radius = "md",
    size = "2.5rem",
    name = "submit",
    ...props
}) => {

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

export default withForwardedRefAndErrBoundary(OutlineButton)