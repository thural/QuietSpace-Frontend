import withForwardedRefAndErrBoundary from "../hooks/withForwardedRef";
import styles from "../styles/customButtonStyles";
import { GenericWrapperWithRef } from "../types/sharedComponentTypes";

const CustomButton: React.FC<GenericWrapperWithRef> = ({ forwardedRef, label, ...props }) => {
    const classes = styles()
    return (
        <button ref={forwardedRef} className={classes.wrapper} {...props}>{label}</button>
    )
}

export default withForwardedRefAndErrBoundary(CustomButton)