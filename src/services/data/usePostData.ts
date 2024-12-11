import { getSignedUser } from "@/api/queries/userQueries";
import {
    fetchCreatePost,
    fetchCreateRepost,
    fetchDeletePost,
    fetchEditPost,
    fetchPostById, fetchPostQuery,
    fetchPosts,
    fetchPostsByUserId,
    fetchRepliedPostsByUserId,
    fetchSavePost,
    fetchSavedPostsByUser,
    fetchVotePoll
} from "@/api/requests/postRequests";
import { ResId } from "@/api/schemas/inferred/common";
import { PostPage, PostRequest, PostResponse, RepostRequest, VoteBody } from "@/api/schemas/inferred/post";
import { ConsumerFn } from "@/types/genericTypes";
import { buildPageParams, getNextPageParam } from "@/utils/fetchUtils";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/zustand";
import usePostQueries from "@/api/queries/usePostQueries";


export const useGetPagedPosts = () => {

    const { data: authData, isAuthenticated } = useAuthStore();

    return useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: async ({ pageParam }) => {
            const pageParams = buildPageParams(pageParam, 9);
            return await fetchPosts(authData.accessToken, pageParams);
        },
        initialPageParam: 0,
        getNextPageParam,
        enabled: isAuthenticated, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 3, // keep data fresh up to 3 minutes, it won't refetch on trigger events, default 0
        refetchInterval: 1000 * 60 * 6, // refetch data irregardless of a trigger event, default infinite, defult false
        gcTime: 1000 * 60 * 15, // clear the cache after 15 minutes of component inactivity, default 5 minutes
        refetchOnMount: false, // refetch on component mount, default true
        refetchOnWindowFocus: false, // default true
        refetchIntervalInBackground: false, // by default refetch paused for refetchInterval, dafult false
    });
}

export const useGetPostById = (postId: ResId) => {

    const { data: authData, isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ["posts", postId],
        queryFn: async (): Promise<PostResponse> => {
            return await fetchPostById(postId, authData.accessToken);
        },
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60 * 6,
        gcTime: 1000 * 60 * 15,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
    });
}

export const useGetSavedPostsByUserId = (userId: ResId) => {

    const { data: authData, isAuthenticated } = useAuthStore();

    return useInfiniteQuery({
        queryKey: ["posts", "saved", userId],
        queryFn: async ({ pageParam }): Promise<PostPage> => {
            const pageParams = buildPageParams(pageParam, 9);
            return await fetchSavedPostsByUser(authData.accessToken, pageParams);
        },
        initialPageParam: 0,
        getNextPageParam,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60 * 6,
        gcTime: 1000 * 60 * 15,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: false,
    });
}

export const useGetRepliedPostsByUserId = (userId: ResId) => {

    const { data: authData, isAuthenticated } = useAuthStore();

    return useInfiniteQuery({
        queryKey: ["posts", "replied", userId],
        queryFn: async ({ pageParam }): Promise<PostPage> => {
            const pageParams = buildPageParams(pageParam, 9);
            return await fetchRepliedPostsByUserId(userId, authData.accessToken, pageParams);
        },
        initialPageParam: 0,
        getNextPageParam,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60 * 6,
        gcTime: 1000 * 60 * 15,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: false,
    });
}


export const useGetPostsByUserId = (userId: ResId) => {

    const { data: authData, isAuthenticated } = useAuthStore();

    return useInfiniteQuery({
        queryKey: ["posts", userId],
        queryFn: async ({ pageParam }): Promise<PostPage> => {
            const pageParams = buildPageParams(pageParam, 9);
            return await fetchPostsByUserId(userId, authData.accessToken, pageParams);
        },
        initialPageParam: 0,
        getNextPageParam,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60 * 6,
        gcTime: 1000 * 60 * 15,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: false,
    });
}


export const useCreatePost = (toggleForm: ConsumerFn) => {

    const { data: authData } = useAuthStore();
    const { insertPostCache } = usePostQueries();


    const onSuccess = (data: PostResponse) => {
        console.log("post added successfully:", data);
        insertPostCache(data)
        toggleForm();
    }

    const onError = (error: Error) => {
        console.log("error on post: ", error.message);
        toggleForm();
    }

    return useMutation({
        mutationFn: async (postData: PostRequest | FormData): Promise<PostResponse> => {
            return await fetchCreatePost(postData, authData.accessToken);
        },
        onSuccess,
        onError
    })
}

export const useCreateRepost = (toggleForm: ConsumerFn) => {

    const { insertPostCache } = usePostQueries();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: PostResponse) => {
        console.log("post added successfully:", data);
        insertPostCache(data)
        toggleForm();
    }

    const onError = (error: Error) => {
        console.log("error on repost: ", error.message);
        alert("error on reposting, try again later");
    }

    return useMutation({
        mutationFn: async (repostData: RepostRequest): Promise<PostResponse> => {
            console.log("repost data on request", repostData);
            return await fetchCreateRepost(repostData, authData.accessToken);
        },
        onSuccess,
        onError
    })
}

export const useSavePost = () => {

    const { insertPostCache, getPostById } = usePostQueries();
    const user = getSignedUser();
    if (user === undefined) throw new Error("user is undefined");
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response, variables: ResId) => {
        const postId = variables;
        const userId = user.id;
        const post = getPostById(postId);
        console.assert(post !== undefined, "post cache is undefined");
        if (post !== undefined) insertPostCache(post, ["posts", userId]);
    }

    const onError = (error: Error) => {
        console.log("error on repost: ", error.message);
        alert("error on saving post, try again later");
    }

    return useMutation({
        mutationFn: async (postId: ResId): Promise<Response> => {
            return await fetchSavePost(postId, authData.accessToken);
        },
        onSuccess,
        onError
    })
}


export const useEditPost = (postId: ResId, toggleForm: ConsumerFn) => {

    const { updatePostCache } = usePostQueries();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: PostResponse, variables: PostRequest) => {
        console.log("post edit request was success");
        if (data !== undefined) updatePostCache(data);
        toggleForm();
    }

    const onError = (error: Error) => {
        console.log("error on editing post:", error.message);
    }

    return useMutation({
        mutationFn: async (postData: PostRequest) => {
            return await fetchEditPost(postData, authData.accessToken, postId);
        },
        onSuccess,
        onError
    })
}


export const useQueryPosts = (setPostQueryResult: ConsumerFn) => {

    const { data: authData } = useAuthStore();

    const onSuccess = (data: PostPage) => {
        console.log("post query result: ", data.content);
        setPostQueryResult(data.content);
    }

    const onError = (error: Error) => {
        console.log("error on querying post:", error.message);
    }

    return useMutation({
        mutationFn: async (queryText: string): Promise<PostPage> => {
            return await fetchPostQuery(queryText, authData.accessToken);
        },
        onSuccess,
        onError
    })
}


export const useDeletePost = (postId: ResId) => {

    const { deletePostCache } = usePostQueries();
    const { data: authData } = useAuthStore();

    const { postId: id } = useParams();
    const navigate = useNavigate();

    const onSuccess = (data: Response) => {
        console.log("response data on post delete: ", data);
        deletePostCache(postId);
        if (id === postId) navigate("/feed");
    }

    const onError = (error: Error) => {
        console.log("error on deleting post: ", `postId: ${postId}, error message: `, error.message);
    }

    return useMutation({
        mutationFn: async (): Promise<Response> => {
            return await fetchDeletePost(postId, authData.accessToken);
        },
        onSuccess,
        onError
    })
}


export const useVotePoll = (postId: ResId) => {

    const { updatePostCache, getPostById } = usePostQueries();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response) => {
        console.log("response data on poll vote success: ", data);
        const post = getPostById(postId);
        if (post !== undefined) updatePostCache(post)
    }

    const onError = (error: Error) => {
        console.log("error on voting poll: ", error.message);
    }

    return useMutation({
        mutationFn: async (voteData: VoteBody): Promise<Response> => {
            return await fetchVotePoll(voteData, authData.accessToken);
        },
        onSuccess,
        onError
    })
}