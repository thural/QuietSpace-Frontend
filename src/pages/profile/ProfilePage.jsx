import ProfileContainer from "../../components/Profile/ProfileContainer";
import RenderOnRole from "../../components/Misc/RenderOnRole";
import {UserRole} from "../../utils/enumClasses";


const ProfilePage = () => {
    return <RenderOnRole roles={[UserRole.USER, UserRole.ADMIN]}>
        <ProfileContainer />
    </RenderOnRole>
}

export default ProfilePage