import { ResId } from "@/api/schemas/native/common";
import { useGetUserById } from "@/services/data/useUserData";
import { formatPhotoData } from "@/utils/dataUtils";
import UserAvatar from "./UserAvatar";
import { toUpperFirstChar } from "@/utils/stringUtils";

const UserAvatarPhoto: React.FC<{ userId: ResId, size?: string }> = ({ userId, size = "2.5rem" }) => {

    const { data: user } = useGetUserById(userId);
    const photoData = !user?.photo ? null : formatPhotoData(user.photo?.type, user.photo?.data);
    const username = !user ? "U" : toUpperFirstChar(user.username);

    return <UserAvatar size={size} src={photoData} radius="10rem" chars={username} />
}

export default UserAvatarPhoto