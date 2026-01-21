import FlexStyled from "@/shared/FlexStyled";
import styles from "./styles/profileControlsStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

const ProfileControls: React.FC<GenericWrapper> = ({ children }) => {
    const classes = styles();

    return (
        <FlexStyled className={classes.profileControlsSection}>
            {children}
        </FlexStyled>
    )
}

export default ProfileControls