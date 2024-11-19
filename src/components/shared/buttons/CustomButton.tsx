import withForwardedRefAndErrBoundary from "../../../services/hook/shared/withForwardedRef";
import styles from "../../../styles/shared/customButtonStyles";
import { GenericWrapperWithRef } from "../../../types/sharedComponentTypes";

const CustomButton: React.FC<GenericWrapperWithRef> = ({ forwardedRef, label, ...props }) => {
    const classes = styles()
    return (
        <button ref={forwardedRef} className={classes.wrapper} {...props}>{label}</button>
    )
}

export default withForwardedRefAndErrBoundary(CustomButton)