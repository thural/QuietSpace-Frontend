import styles from "../styles/customButtonStyles";

const CustomButton = ({ label, ...props }) => {
    const classes = styles()
    return (
        <button className={classes.wrapper} {...props}>{label}</button>
    )
}

export default CustomButton