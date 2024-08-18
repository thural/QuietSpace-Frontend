import { useAuthStore } from "./zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReaction } from "../api/postRequests";


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
            return await fetchReaction(reactionBody, authData.accessToken);
        },
        onSuccess,
        onError
    })
}