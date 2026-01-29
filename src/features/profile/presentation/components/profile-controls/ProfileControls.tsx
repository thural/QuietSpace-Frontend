import { ProfileControlsContainer } from "../styles/ProfileControlsStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

const ProfileControls: React.FC<GenericWrapper> = ({ children }) => {
    return (
        <ProfileControlsContainer>
            {children}
        </ProfileControlsContainer>
    )
}

export default ProfileControls