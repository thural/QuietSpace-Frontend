import { useGetPosts } from "@/hooks/usePostData";
import { viewStore } from "@/hooks/zustand";
import { useQueryClient } from "@tanstack/react-query";

export const useFeed = () => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: viewData, setViewData } = viewStore();
    const { createPost: createPostView } = viewData;
    const posts = useGetPosts();

    const toggleCreatePostForm = () => {
        setViewData(viewData, { createPost: true });
    };

    return {
        user,
        createPostView,
        posts,
        toggleCreatePostForm,
    };
};

export default useFeed