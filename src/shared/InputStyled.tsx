import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import { Input } from "@mantine/core";
import { createUseStyles } from "react-jss";
import { Theme } from "./types/theme";

const useStyles = createUseStyles((theme: Theme) => ({
    inputStyled: {
        '& input': {
            width: '100%',
            padding: theme.spacing(theme.spacingFactor.ms),
            height: '1.8rem',
            backgroundColor: theme.colors.backgroundSecondary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '10px'
        },
        '& input:focus': {
            outline: 'none',
            borderColor: theme.colors.borderExtra,
        },

    },
    inputUnstyled: {}
}));

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