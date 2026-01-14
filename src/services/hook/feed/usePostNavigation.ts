import useNavigation from "../shared/useNavigation";
import { ResId } from "@/api/schemas/inferred/common";

const usePostNavigation = (postId: ResId) => {
    const { navigatePath } = useNavigation();

    const handleNavigation = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        navigatePath(`/feed/${postId}`);
    };

    return { handleNavigation };
};

export default usePostNavigation;
