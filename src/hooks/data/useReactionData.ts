import { useAuthStore } from "../zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReaction } from "../../api/postRequests";
import { UserReaction } from "@/api/schemas/reaction";


export const useToggleReaction = () => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response) => {
        console.log("response data on reaction: ", data);
        queryClient.invalidateQueries({ queryKey: ["posts"], exact: true });
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