import { Input } from "@mantine/core"
import withForwardedRefAndErrBoundary from "../../services/hook/shared/withForwardedRef"
import { GenericWrapperWithRef } from "../../types/sharedComponentTypes"

const InputStyled: React.FC<GenericWrapperWithRef> = ({ forwardedRef, placeholder, onKeyDown, onFocus, onChange, onBlur, variant, ...props }) => {

    return (
        <Input
            ref={forwardedRef}
            variant={variant}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onChange={onChange}
            onBlur={onBlur}
            {...props}
        />
    )
}

export default withForwardedRefAndErrBoundary(InputStyled)