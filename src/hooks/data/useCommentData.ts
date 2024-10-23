import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../zustand";
import { fetchCommentsByPostId, fetchCreateComment, fetchDeleteComment } from "../../api/commentRequests";
import { ResId } from "@/api/schemas/common";
import { CommentBody, CommentSchema, PagedCommentResponse } from "@/api/schemas/comment";


export const useGetComments = (postId: ResId) => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["comments", { id: postId }],
        queryFn: async (): Promise<PagedCommentResponse> => {
            return await fetchCommentsByPostId(postId, authData.accessToken);
        },
        staleTime: 1000 * 60 * 6, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 3, // refetch data after 3 minutes on idle
        select: data => data.content
    })
}


export const usePostComment = (postId: ResId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: CommentSchema) => {
        console.log("added comment response data: ", data);
        queryClient.invalidateQueries({ queryKey: ["comments", { id: postId }] })
            .then(() => console.log("post comments were invalidated"));
    }

    const onError = (error: Error) => {
        console.log("error on adding comment: ", error.message)
    }

    return useMutation({
        mutationFn: async (commentData: CommentBody): Promise<CommentSchema> => {
            return await fetchCreateComment(commentData, authData.accessToken);
        },
        onSuccess,
        onError,
    })
}


export const useDeleteComment = (postId: ResId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response) => {
        console.log("response data on comment deletion: ", data);
        queryClient.invalidateQueries({ queryKey: ["comments", { id: postId }] })
            .then(() => console.log("post comments were invalidated"));
    }

    const onError = (error: Error) => {
        console.log("error on deleting comment: ", error.message);
    }

    return useMutation({
        mutationFn: async (commentId: ResId): Promise<Response> => {
            return await fetchDeleteComment(commentId, authData.accessToken);
        },
        onSuccess,
        onError,
    })
}


