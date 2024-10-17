import FlexStyled from "@shared/FlexStyled";
import styles from "./profileControlsStyles";

const ProfileControls = ({ children }) => {
    const classes = styles();

    return (
        <FlexStyled className={classes.profileControlsSection}>
            {children}
        </FlexStyled>
    )
}

export default ProfileControls