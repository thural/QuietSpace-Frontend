import withForwardedRef from "./hooks/withForwardedRef";
import styles from "./styles/formStyles";

const FormStyled = ({ forwardedRef, children, ...props }) => {
    const classes = styles();
    return (
        <form ref={forwardedRef} {...props} className={classes.wrapper}>{children}</form>
    )
};

export default withForwardedRef(FormStyled);