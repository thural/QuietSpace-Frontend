import { ResId } from "@/api/schemas/native/common";
import { useGetUserById } from "@/services/data/useUserData";
import { formatPhotoData } from "@/utils/dataUtils";
import UserAvatar from "./UserAvatar";
import { toUpperFirstChar } from "@/utils/stringUtils";

/**
 * UserAvatarPhoto component.
 * 
 * This component fetches and displays a user's avatar based on their user ID. It uses a 
 * custom hook to retrieve user data and formats the user's photo for display. If the user 
 * does not have a photo, it displays the user's initials instead.
 * 
 * @param {{ userId: ResId, size?: string }} props - The component props.
 * @param {ResId} props.userId - The ID of the user whose avatar is to be displayed.
 * @param {string} [props.size="2.5rem"] - Optional size for the avatar; defaults to "2.5rem".
 * @returns {JSX.Element} - The rendered UserAvatarPhoto component.
 */
const UserAvatarPhoto: React.FC<{ userId: ResId, size?: string }> = ({ userId, size = "2.5rem" }) => {

    const { data: user } = useGetUserById(userId); // Fetch user data by ID
    const photoData = !user?.photo ? null : formatPhotoData(user.photo?.type, user.photo?.data); // Format photo data if available
    const username = !user ? "U" : toUpperFirstChar(user.username); // Get formatted username or default to "U"

    return (
        <UserAvatar
            size={size} // Set avatar size
            src={photoData} // Set avatar source
            radius="10rem" // Set border radius for the avatar
            chars={username} // Set initials to display if no photo is available
        />
    );
}

export default UserAvatarPhoto;