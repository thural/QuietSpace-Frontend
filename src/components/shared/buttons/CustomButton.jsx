import withForwardedRef from "../hooks/withForwardedRef";
import styles from "../styles/customButtonStyles";

const CustomButton = ({ forwardedRef, label, ...props }) => {
    const classes = styles()
    return (
        <button ref={forwardedRef} className={classes.wrapper} {...props}>{label}</button>
    )
}

export default withForwardedRef(CustomButton)