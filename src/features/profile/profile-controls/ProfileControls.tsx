import FlexStyled from "@/components/shared/FlexStyled";
import styles from "@/styles/profile/profileControlsStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";

const ProfileControls: React.FC<GenericWrapper> = ({ children }) => {
    const classes = styles();

    return (
        <FlexStyled className={classes.profileControlsSection}>
            {children}
        </FlexStyled>
    )
}

export default ProfileControls