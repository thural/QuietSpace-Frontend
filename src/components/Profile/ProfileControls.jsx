import FlexStyled from "../shared/FlexStyled";
import styles from "./styles/profileContainerStyles";

const ProfileControls = ({ children }) => {
    const classes = styles();

    return (
        <FlexStyled className={classes.profileEditSection}>
            {children}
        </FlexStyled>
    )
}

export default ProfileControls