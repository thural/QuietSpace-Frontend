import styles from "./styles/formStyles";

const FormStyled = ({ children, ...props }) => {
    const classes = styles();
    return (
        <form {...props} className={classes.wrapper}>{children}</form>
    )
};

export default FormStyled;