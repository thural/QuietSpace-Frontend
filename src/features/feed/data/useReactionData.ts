import { fetchReaction } from "@features/feed/data/postRequests";
import { ReactionRequest } from "./models/reaction";
import { ResId } from "../../../shared/api/models/common";
import { useAuthStore } from "@/core/store/zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import usePostQueries from "@features/feed/data/usePostQueries";


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