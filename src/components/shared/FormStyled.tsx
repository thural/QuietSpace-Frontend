import { GenericWrapperWithRef } from "@/types/sharedComponentTypes";
import withForwardedRefAndErrBoundary from "@/services/hook/shared/withForwardedRef";
import styles from "@/styles/shared/formStyles";

const FormStyled: React.FC<GenericWrapperWithRef> = ({ forwardedRef, children, ...props }) => {
    const classes = styles();

    return <form ref={forwardedRef} {...props} className={classes.form}>{children}</form>
};

export default withForwardedRefAndErrBoundary(FormStyled);