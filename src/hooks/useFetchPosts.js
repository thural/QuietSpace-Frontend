import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPosts } from "../api/postRequests";
import { authStore } from "./zustand";
import { POST_URL } from "../constants/ApiPath";


export const useFetchPosts = () => {
    
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