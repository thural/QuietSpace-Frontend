import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authStore } from "./zustand";
import { COMMENT_PATH } from "../constants/ApiPath";
import { fetchCommentsByPostId, fetchCreateComment, fetchDeleteComment, fetchLikeComment } from "../api/commentRequests";


export const useGetComments = (postId) => {

    const { data: authData } = authStore();

    const onSuccess = (data) => {
        console.log("comments fetch success");
    }

    const onError = (error) => {
        console.log(`error on loading comments for post with id ${postId}: `, error);
    }

    return useQuery({
        queryKey: ["comments", { id: postId }],
        queryFn: async () => {
            const response = await fetchCommentsByPostId(COMMENT_PATH, postId, authData.token);
            return await response.json();
        },
        onSuccess,
        onError,
        staleTime: 1000 * 60 * 6, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 3, // refetch data after 3 minutes on idle
        select: data => data.content
    })
}


export const usePostComment = (postId) => {

    const queryClient = useQueryClient();
    const { data: authData } = authStore();

    const onSuccess = (data, variables) => {
        console.log("added comment response data: ", data);
        queryClient.invalidateQueries(["comments"], { id: postId });
    }

    const onError = (error, variables, context) => {
        console.log("error on adding comment: ", error.message)
    }

    return useMutation({
        mutationFn: async (commentData) => {
            const response = await fetchCreateComment(COMMENT_PATH, commentData, authData.token);
            return await response.json();
        },
        onSuccess,
        onError,
    })
}


export const useDeleteComment = (postId) => {

    const queryClient = useQueryClient();
    const { data: authData } = authStore();

    const onSuccess = (data, variables, context) => {
        console.log("response data on comment deletion: ", data);
        queryClient.invalidateQueries(["comments"], { id: postId });
    }

    const onError = (error, variables, context) => {
        console.log("error on deleting comment: ", error.message);
    }

    return useMutation({
        mutationFn: async (commentId) => {
            const response = await fetchDeleteComment(COMMENT_PATH + `/${commentId}`, authData.token);
            return response;
        },
        onSuccess,
        onError,
    })
}


export const useToggleCommentLike = (postId) => {

    const queryClient = useQueryClient();
    const { data: authData } = authStore();

    const onSuccess = (data, variables, context) => {
        console.log("response data on like toggle: ", data);
        queryClient.invalidateQueries(["comments"], { id: postId });
    }

    const onError = (error, variables, context) => {
        console.log("error on like toggle: ", error.message)
    }

    return useMutation({
        mutationFn: async (commentId) => {
            const response = await fetchLikeComment(COMMENT_PATH, commentId, authData.token);
            return response;
        },
        onSuccess,
        onError,
    })
}


