import withForwardedRefAndErrBoundary from "@/services/hook/shared/withForwardedRef";
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes";
import { Input } from "@mantine/core";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    inputStyled: {
        '& input': {
            width: '100%',
            padding: '10px',
            height: '1.8rem',
            backgroundColor: '#e2e8f0',
            border: '1px solid #e2e8f0',
            borderRadius: '10px'
        },
        '& input:focus': {
            outline: 'none',
            borderColor: '#a7abb1',
        },
    },
    inputUnstyled: {}
});

const InputStyled: React.FC<GenericWrapperWithRef> = ({
    isStyled = false,
    forwardedRef,
    placeholder,
    onKeyDown,
    onFocus,
    onChange,
    onBlur,
    variant,
    ...props
}) => {


    const classes = useStyles();
    const wrapperClass = isStyled ? classes.inputStyled : classes.inputUnstyled

    return (
        <div style={{ width: "100%" }} className={wrapperClass}>
            <Input
                ref={forwardedRef}
                variant="unstyled"
                placeholder={placeholder}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
                {...props}
            />
        </div>
    )
}

export default withForwardedRefAndErrBoundary(InputStyled)