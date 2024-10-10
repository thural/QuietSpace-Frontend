import { useQueryClient } from "@tanstack/react-query";
import { viewStore } from "../../../hooks/zustand";
import { useGetPosts } from "../../../hooks/usePostData";

export const usePostContainer = () => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: viewData, setViewData } = viewStore();
    const { createPost: createPostView } = viewData;
    const posts = useGetPosts();

    const showCreatePostForm = () => {
        setViewData({ createPost: true });
    };

    return {
        user,
        createPostView,
        posts,
        showCreatePostForm,
    };
};