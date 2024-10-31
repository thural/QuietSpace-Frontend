import { useQueryClient } from "@tanstack/react-query";
import { PostPage } from "../schemas/inferred/post";
import { ResId } from "../schemas/native/common";



export const getPostsByUserId = (userId: ResId): PostPage | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["posts/user", { id: userId }]);
}

export const getPosts = (): PostPage | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["posts"]);
}