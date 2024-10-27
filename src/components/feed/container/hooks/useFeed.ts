import { User } from "@/api/schemas/inferred/user";
import { useGetPosts } from "@/services/data/usePostData";
import { viewStore } from "@/services/zustand";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useQueryClient } from "@tanstack/react-query";

export const useFeed = () => {
    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    const { data: viewData, setViewData } = viewStore();
    const { createPost: createPostView } = viewData;
    const posts = useGetPosts();

    if (user === undefined) throw nullishValidationdError({ user });

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