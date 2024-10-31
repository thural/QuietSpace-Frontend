import { useQueryClient } from "@tanstack/react-query";
import { Post, PostPage } from "../schemas/inferred/post";
import { ResId } from "../schemas/native/common";



export const getPostsByUserId = (userId: ResId): PostPage | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["posts/user", { id: userId }]);
}

export const getPosts = (): PostPage | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["posts"]);
}

export const getPostById = (postId: ResId): Post | undefined => {
    return getPosts()?.content.find(p => p.id === postId);
}