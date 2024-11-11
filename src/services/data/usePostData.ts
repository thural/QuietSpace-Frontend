import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchCreatePost,
    fetchDeletePost,
    fetchEditPost, fetchPostById, fetchPostQuery,
    fetchPosts,
    fetchPostsByUserId,
    fetchCreateRepost,
    fetchVotePoll,
    fetchSavePost,
    fetchSavedPostsByUser
} from "../../api/requests/postRequests";
import { useAuthStore } from "../store/zustand";
import { PostPage, PostBody, VoteBody, Post, RepostBody } from "@/api/schemas/inferred/post";
import { ResId } from "@/api/schemas/inferred/common";
import { ConsumerFn } from "@/types/genericTypes";
import { getSignedUser } from "@/api/queries/userQueries";
import { useNavigate, useParams } from "react-router-dom";
import { nullishValidationdError } from "@/utils/errorUtils";


export const useGetPosts = () => {

    const user = getSignedUser();
    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            return await fetchPosts(authData.accessToken);
        },
        enabled: !!user?.id, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 3, // keep data fresh up to 3 minutes, it won't refetch on trigger events, defult 0
        refetchInterval: 1000 * 60 * 6, // refetch data irregardless of a trigger event, default infinite, defult false
        gcTime: 1000 * 60 * 15, // clear the cache after 15 minutes of component inactivity, default 5 minutes
        refetchOnMount: true, // refetch on component mount, default true
        refetchOnWindowFocus: true, // default true
        refetchIntervalInBackground: false, // by default refetch paused for refetchInterval, dault false
    });
}

export const useGetPostById = (postId: ResId) => {

    const user = getSignedUser();
    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["posts", { id: postId }],
        queryFn: async (): Promise<Post> => {
            return await fetchPostById(postId, authData.accessToken);
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60 * 6,
        gcTime: 1000 * 60 * 15,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: false,
    });
}

export const useGetSavedPostsByUserId = (userId: ResId) => {

    const user = getSignedUser();
    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["posts/saved", { id: userId }],
        queryFn: async (): Promise<PostPage> => {
            return await fetchSavedPostsByUser(authData.accessToken);
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60 * 6,
        gcTime: 1000 * 60 * 15,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: false,
    });
}


export const useGetPostsByUserId = (userId: ResId) => {

    const user = getSignedUser();
    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["posts/user", { id: userId }],
        queryFn: async (): Promise<PostPage> => {
            return await fetchPostsByUserId(userId, authData.accessToken);
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60 * 6,
        gcTime: 1000 * 60 * 15,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: false,
    });
}


export const useCreatePost = (toggleForm: ConsumerFn) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();


    const onSuccess = (data: Response) => {
        console.log("post added successfully:", data);
        queryClient.invalidateQueries({ queryKey: ["posts"], exact: true });
        toggleForm();
    }

    const onError = (error: Error) => {
        console.log("error on post: ", error.message);
        toggleForm();
    }

    return useMutation({
        mutationFn: async (postData: PostBody): Promise<Post> => {
            return await fetchCreatePost(postData, authData.accessToken);
        },
        onSuccess,
        onError
    })
}

export const useCreateRepost = (toggleForm: ConsumerFn) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response) => {
        console.log("post added successfully:", data);
        queryClient.invalidateQueries({ queryKey: ["posts"], exact: true });
        toggleForm();
    }

    const onError = (error: Error) => {
        console.log("error on repost: ", error.message);
        alert("error on reposting, try again later");
    }

    return useMutation({
        mutationFn: async (repostData: RepostBody): Promise<Post> => {
            console.log("repost data on request", repostData);
            return await fetchCreateRepost(repostData, authData.accessToken);
        },
        onSuccess,
        onError
    })
}

export const useSavePost = () => {

    const queryClient = useQueryClient();
    const user = getSignedUser();
    if (user === undefined) throw nullishValidationdError({ user });
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response) => {
        console.log("post saved successfully:", data);
        queryClient.invalidateQueries({ queryKey: ["posts/saved", { id: user.id }] });
    }

    const onError = (error: Error) => {
        console.log("error on repost: ", error.message);
        console.log("access token on saving post: ", authData.accessToken);
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

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["posts", { id: postId }] });
        console.log("post edit was success");
        toggleForm();
    }

    const onError = (error: Error) => {
        console.log("error on editing post:", error.message);
    }

    return useMutation({
        mutationFn: async (postData: PostBody) => {
            return await fetchEditPost(postData, authData.accessToken, postId);
        },
        onSuccess,
        onError
    })
}


export const useQueryPosts = (setPostQueryResult: ConsumerFn) => {

    const { data: authData } = useAuthStore();

    const onSuccess = (data: PostPage) => {
        console.log("post query result: ", data["content"]);
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

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const { postId: id } = useParams();
    const navigate = useNavigate();

    const onSuccess = (data: Response) => {
        console.log("response data on post delete: ", data);
        queryClient.invalidateQueries({ queryKey: ["posts"], exact: true });
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

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response) => {
        console.log("response data on poll vote success: ", data);
        queryClient.invalidateQueries({ queryKey: ["posts", { id: postId }] });
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