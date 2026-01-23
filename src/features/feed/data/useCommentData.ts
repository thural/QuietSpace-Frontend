import {
    fetchCommentsByPostId,
    fetchCreateComment,
    fetchDeleteComment,
    fetchLatestComment
} from "@features/feed/data/commentRequests";
import {CommentRequest, CommentResponse, PagedComment} from "@/features/feed/data/models/comment";
import {ResId} from "@/shared/api/models/common";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useAuthStore} from "@/core/store/zustand";
import {ConsumerFn} from "@/shared/types/genericTypes";
import {QueryProps} from "@/types/hookPropTypes";
import useCommentCache from "@features/feed/data/useCommentCache"


export const useGetComments = (postId: ResId) => {
    const { data: authData } = useAuthStore();
    return useQuery({
        queryKey: ["posts", postId, "comments"],
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
        queryKey: ["posts", postId, "comments", "latest"],
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
    const { data: authData } = useAuthStore();

    const onSuccess = (data: CommentResponse) => {
        console.log("added comment response data: ", data);
        const { insertCommentCache } = useCommentCache();
        insertCommentCache(data, ["posts", postId, "comments"]);
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


export const useDeleteComment = () => {

    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response, variables: ResId) => {
        const commentId = variables;
        console.log("response data on comment deletion: ", data);
        const { deleteCommentCache } = useCommentCache();
        deleteCommentCache(commentId)
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


