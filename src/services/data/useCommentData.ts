import { fetchCommentsByPostId, fetchCreateComment, fetchDeleteComment, fetchLatestComment } from "@/api/requests/commentRequests";
import { CommentRequest, CommentResponse, PagedComment } from "@/api/schemas/inferred/comment";
import { ResId } from "@/api/schemas/inferred/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/zustand";
import { ConsumerFn, ProcedureFn } from "@/types/genericTypes";
import { QueryProps } from "@/types/hookPropTypes";


export const useGetComments = (postId: ResId) => {
    const { data: authData } = useAuthStore();
    return useQuery({
        queryKey: ["comments", postId],
        queryFn: async (): Promise<PagedComment> => {
            return await fetchCommentsByPostId(postId, authData.accessToken);
        },
        staleTime: 1000 * 60 * 6, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 3, // refetch data after 3 minutes on idle
    })
}


export const useGetLatestComment = (userId: ResId, postId: ResId) => {
    const { data: authData } = useAuthStore();
    return useQuery({
        queryKey: ["comments/latest", { id: postId, userId }],
        queryFn: async (): Promise<CommentResponse> => {
            return await fetchLatestComment(userId, postId, authData.accessToken);
        },
        staleTime: 1000 * 60 * 6,
        refetchInterval: 1000 * 60 * 3,
    })
}

interface usePostCommentProps extends QueryProps {
    postId: ResId,
    handleClose?: ConsumerFn,
}
export const usePostComment = ({
    postId, handleClose
}: usePostCommentProps) => {
    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: CommentResponse) => {
        console.log("added comment response data: ", data);
        queryClient.invalidateQueries({ queryKey: ["comments", postId] })
            .then(() => console.log("post comments were invalidated"));
        handleClose && handleClose();
    }

    const onError = (error: Error) => {
        console.log("error on adding comment: ", error.message)
    }

    return useMutation({
        mutationFn: async (commentData: CommentRequest): Promise<CommentResponse> => {
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
        queryClient.invalidateQueries({ queryKey: ["comments", postId] })
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


