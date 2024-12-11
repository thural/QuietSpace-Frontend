import { fetchReaction } from "@//api/requests/postRequests";
import { ReactionRequest } from "@/api/schemas/inferred/reaction";
import { ResId } from "@/api/schemas/native/common";
import { useAuthStore } from "@/services/store/zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import usePostQueries from "@/api/queries/usePostQueries";


export const useToggleReaction = (postId: ResId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response) => {
        console.log("response data on user reaction: ", data);
        queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    }

    const onError = (error: Error) => {
        console.log("error on reacting post: ", error.message);
    }

    return useMutation({
        mutationFn: async (reactionBody: ReactionRequest): Promise<Response> => {
            return await fetchReaction(reactionBody, authData.accessToken);
        },
        onSuccess,
        onError
    })
}