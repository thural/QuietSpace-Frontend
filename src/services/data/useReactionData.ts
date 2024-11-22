import { fetchReaction } from "@//api/requests/postRequests";
import { UserReaction } from "@/api/schemas/inferred/reaction";
import { ResId } from "@/api/schemas/native/common";
import { useAuthStore } from "@/services/store/zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useToggleReaction = (postId: ResId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response) => {
        console.log("response data on user reaction: ", data);
        queryClient.invalidateQueries({ queryKey: ["posts", { id: postId }] });
    }

    const onError = (error: Error) => {
        console.log("error on reacting post: ", error.message);
    }

    return useMutation({
        mutationFn: async (reactionBody: UserReaction): Promise<Response> => {
            return await fetchReaction(reactionBody, authData.accessToken);
        },
        onSuccess,
        onError
    })
}