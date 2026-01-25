import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import { Input } from "@/shared/ui/components";

const InputStyled: React.FC<GenericWrapperWithRef> = ({
    isStyled = false,
    forwardedRef,
    placeholder,
    onKeyDown,
    onFocus,
    onChange,
    onBlur,
    variant = "outlined",
    ...props
}) => {

    return (
        <Input
            ref={forwardedRef}
            variant={isStyled ? "outlined" : "unstyled"}
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