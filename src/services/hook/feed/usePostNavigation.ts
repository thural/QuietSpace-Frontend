import useNavigation from "../shared/useNavigation";

const usePostNavigation = (postId: string) => {
    const { navigatePath } = useNavigation();

    const handleNavigation = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        navigatePath(`/feed/${postId}`);
    };

    return { handleNavigation };
};

export default usePostNavigation;
