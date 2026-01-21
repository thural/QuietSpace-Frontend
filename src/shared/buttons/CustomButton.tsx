import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import styles from "@/shared/styles/customButtonStyles";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";

const CustomButton: React.FC<GenericWrapperWithRef> = ({ forwardedRef, label, ...props }) => {
    const classes = styles()
    return (
        <button ref={forwardedRef} className={classes.wrapper} {...props}>{label}</button>
    )
}

export default withForwardedRefAndErrBoundary(CustomButton)