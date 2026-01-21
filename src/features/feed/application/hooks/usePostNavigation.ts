import useNavigation from "../shared/useNavigation";
import { ResId } from "@/shared/api/models/common";

const usePostNavigation = (postId: ResId) => {
    const { navigatePath } = useNavigation();

    const handleNavigation = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        navigatePath(`/feed/${postId}`);
    };

    return { handleNavigation };
};

export default usePostNavigation;
