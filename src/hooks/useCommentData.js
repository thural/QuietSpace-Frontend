import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./zustand";
import { COMMENT_PATH } from "../constants/ApiPath";
import { fetchCommentsByPostId, fetchCreateComment, fetchDeleteComment, fetchLikeComment } from "../api/commentRequests";
import { fetchReaction } from "../api/postRequests";


export const useGetComments = (postId) => {

    const { data: authData } = useAuthStore();

    const onSuccess = (data) => {
        console.log("comments fetch success");
    }

    const onError = (error) => {
        console.log(`error on loading comments for post with id ${postId}: `, error);
    }

    return useQuery({
        queryKey: ["comments", { id: postId }],
        queryFn: async () => {
            const response = await fetchCommentsByPostId(postId, authData.accessToken);
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
    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables) => {
        console.log("added comment response data: ", data);
        queryClient.invalidateQueries(["comments"], { id: postId })
            .then(() => console.log("post comments were invalidated"));
    }

    const onError = (error, variables, context) => {
        console.log("error on adding comment: ", error.message)
    }

    return useMutation({
        mutationFn: async (commentData) => {
            const response = await fetchCreateComment(commentData, authData.accessToken);
            return await response.json();
        },
        onSuccess,
        onError,
    })
}


export const useDeleteComment = (postId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        console.log("response data on comment deletion: ", data);
        queryClient.invalidateQueries(["comments"], { id: postId })
            .then(() => console.log("post comments were invalidated"));
    }

    const onError = (error, variables, context) => {
        console.log("error on deleting comment: ", error.message);
    }

    return useMutation({
        mutationFn: async (commentId) => {
            return await fetchDeleteComment(commentId, authData.accessToken);
        },
        onSuccess,
        onError,
    })
}


export const useToggleCommentLike = (postId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        console.log("response data on like toggle: ", data);
        queryClient.invalidateQueries(["comments"], { id: postId });
    }

    const onError = (error, variables, context) => {
        console.log("error on like toggle: ", error.message)
    }

    return useMutation({
        mutationFn: async (commentId) => {
            return await fetchLikeComment(commentId, authData.accessToken);
        },
        onSuccess,
        onError,
    })
}

export const useToggleReaction = (commentId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        console.log("response data on reaction: ", data);
        queryClient.invalidateQueries(["posts"], { id: commentId })
            .then(() => console.log("post comments were invalidated"));;
    }

    const onError = (error, variables, context) => {
        console.log("error on reacting post: ", error.message);
    }

    return useMutation({
        mutationFn: async (reactionBody) => {
            console.log("REACTION BODY ON LIKE: ", reactionBody)
            return await fetchLikeComment(reactionBody, authData.accessToken);
        },
        onSuccess,
        onError
    })
}


