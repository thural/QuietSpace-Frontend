import { User } from "@/api/schemas/inferred/user";
import { useGetPosts } from "@/services/data/usePostData";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useFeed = () => {

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    const posts = useGetPosts();

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const toggleOverlay = () => setIsOverlayOpen(!isOverlayOpen);

    if (user === undefined) throw nullishValidationdError({ user });

    return {
        user,
        posts,
        isOverlayOpen,
        toggleOverlay
    };
};

export default useFeed