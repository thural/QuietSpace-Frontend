import { useQueryClient } from "@tanstack/react-query";
import { PostPage } from "../schemas/inferred/post";
import { ResId } from "../schemas/native/common";



const queryCLient = useQueryClient();

export const getPostsByUserId = (userId: ResId): PostPage | undefined => {
    return queryCLient.getQueryData(["posts/user", { id: userId }]);
}