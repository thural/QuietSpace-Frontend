import FlexStyled from "@/components/shared/FlexStyled";
import styles from "./styles/profileControlsStyles";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";

const ProfileControls: React.FC<GenericWrapper> = ({ children }) => {
    const classes = styles();

    return (
        <FlexStyled className={classes.profileControlsSection}>
            {children}
        </FlexStyled>
    )
}

export default ProfileControls