import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import styles from "@/shared/styles/formStyles";

const FormStyled: React.FC<GenericWrapperWithRef> = ({ forwardedRef, children, ...props }) => {
    const classes = styles();

    return <form ref={forwardedRef} {...props} className={classes.form}>{children}</form>
};

export default withForwardedRefAndErrBoundary(FormStyled);