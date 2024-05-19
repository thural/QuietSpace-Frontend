import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    fetchCreatePost,
    fetchDeletePost,
    fetchEditPost,
    fetchPosts,
    fetchReaction,
    fetchVotePoll
} from "../api/postRequests";
import {useAuthStore, viewStore} from "./zustand";
import {POST_URL} from "../constants/ApiPath";


export const useGetPosts = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: authData } = useAuthStore();

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
    const { data: authData } = useAuthStore();
    const { setViewData } = viewStore();

    const handleSubmitSuccess = () => {
        setViewData({ createPost: false })
    }

    const handleSubmitError = () => {
    alert("error on posting, try again later");
    }


    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["posts"], { exact: true });
        setViewData({ overlay: false, createPost: false });
        handleSubmitSuccess();
        console.log("post added successfully:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on post: ", error.message);
        handleSubmitError();
    }


    return useMutation({
        mutationFn: async (postData) => {
            return await fetchCreatePost(POST_URL, postData, authData.token)
        },
        onSuccess,
        onError
    })
}


export const useToggleReaction = (postId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        console.log("response data on reaction: ", data);
        queryClient.invalidateQueries(["posts"], { id: postId });
    }

    const onError = (error, variables, context) => {
        console.log("error on reacting post: ", error.message);
    }

    return useMutation({
        mutationFn: async (reactionBody) => {
            console.log("REACTION BODY ON LIKE: ", reactionBody)
            return await fetchReaction(POST_URL, reactionBody, authData.token);
        },
        onSuccess,
        onError
    })
}


export const useEditPost = (postId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();
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
    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        console.log("response data on post delete: ", data);
        queryClient.invalidateQueries(["posts"], { exact: true });
        console.log("delete post success");
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

export const useVotePoll = () => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        console.log("response data on poll vote success: ", data);
        queryClient.invalidateQueries(["posts"], { exact: true });
    }

    const onError = (error, variables, context) => {
        console.log("error on voting poll: ", error.message);
    }

    return useMutation({
        mutationFn: async (voteData) => {
            return await fetchVotePoll(POST_URL, voteData, authData.token);
        },
        onSuccess,
        onError
    })
}