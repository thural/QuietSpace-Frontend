import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCreatePost, fetchDeletePost, fetchEditPost, fetchLikePost, fetchPosts } from "../api/postRequests";
import { authStore, viewStore } from "./zustand";
import { COMMENT_PATH, POST_URL } from "../constants/ApiPath";
import { fetchCommentsByPostId, fetchCreateComment, fetchDeleteComment, fetchLikeComment } from "../api/commentRequests";


export const useGetPosts = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: authData } = authStore();

    return useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await fetchPosts(POST_URL, authData.token);
            return await response.json();
        },
        enabled: !!user?.id, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 3, // keep data fresh up to 3 minutes, it won't refetch on trigger events, defult 0
        refetchInterval: 1000 * 60 * 6, // refetch data irregardless of a trigger event, default infinite, defult false
        gcTime: 1000 * 60 * 15, // clear the cache after 15 minutes of component inactivity, default 5 minutes
        refetchOnMount: true, // refetch on component mount, default true
        refetchOnWindowFocus: true, // default true
        refetchIntervalInBackground: false, // by default refetch paused for refetchInterval, dault false
        select: (data) => data.content // transform received data before consumption
    });
}

export const useCreatePost = () => {

    const queryClient = useQueryClient();
    const { data: authData } = authStore();
    const { setViewData } = viewStore();


    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["posts"], { exact: true });
        setViewData({ overlay: false, createPost: false });
        console.log("post added successfully:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on post: ", error.message)
    }


    return useMutation({
        mutationFn: async (postData) => {
            const response = await fetchCreatePost(POST_URL, postData, authData.token);
            return response.json();
        },
        onSuccess,
        onError
    })
}

export const useLikePost = (postId) => {

    const queryClient = useQueryClient();
    const { data: authData } = authStore();

    const onSuccess = (data, variables, context) => {
        console.log("response data on post like: ", data);
        queryClient.invalidateQueries(["posts"], { id: postId });
    }

    const onError = (error, variables, context) => {
        console.log("error on liking post: ", error.message);
    }

    return useMutation({
        mutationFn: async () => {
            const response = await fetchLikePost(POST_URL, postId, authData.token);
            return response;
        },
        onSuccess,
        onError
    })
}

export const useEditPost = (postId) => {

    const queryClient = useQueryClient();
    const { data: authData } = authStore();
    const { setViewData } = viewStore();

    const onSuccess = () => {
        queryClient.invalidateQueries(["posts"], { exact: true });
        setViewData({ overlay: false, editPost: false })
        console.log("post edited was success");
    }

    const onError = (error, variables, context) => {
        console.log("error on editing post:", error.message);
    }

    return useMutation({
        mutationFn: async (postData) => {
            const response = await fetchEditPost(POST_URL, postData, authData.token, postId);
            return response;
        },
        onSuccess,
        onError
    })
}

export const useDeletePost = (postId) => {

    const queryClient = useQueryClient();
    const { data: authData } = authStore();

    const onSuccess = (data, variables, context) => {
        console.log("response data on post delete: ", data);
        queryClient.invalidateQueries(["posts"], { exact: true });
        console.log("delete post sucess");
    }

    const onError = (error, variables, context) => {
        console.log("error on deleting post: ", `postId: ${postId}, error message: `, error.message);
    }

    return useMutation({
        mutationFn: async () => {
            const response = await fetchDeletePost(POST_URL, postId, authData.token);
            return response;
        },
        onSuccess,
        onError
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