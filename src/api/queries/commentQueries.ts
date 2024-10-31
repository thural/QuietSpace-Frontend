import { useQueryClient } from "@tanstack/react-query";
import { ResId } from "../schemas/native/common";
import { PagedComment } from "../schemas/inferred/comment";


export const getCommentsByPostId = (postId: ResId): PagedComment | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["comments", { id: postId }]);
}