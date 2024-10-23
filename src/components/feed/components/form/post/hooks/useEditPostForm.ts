import { ResId } from "@/api/schemas/common";
import { PagedPostresponse } from "@/api/schemas/post";
import { useEditPost } from "@/hooks/data/usePostData";
import { produceUndefinedError } from "@/utils/errorUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const useEditPostForm = (postId: ResId) => {
    const queryClient = useQueryClient();
    const posts: PagedPostresponse | undefined = queryClient.getQueryData(["posts"]);
    if (posts === undefined) throw produceUndefinedError({ posts });

    const editedPostData = posts.content.find(post => post.id === postId);

    const [postData, setPostData] = useState(editedPostData);
    const editCurrentPost = useEditPost(postId);

    const handleSubmit = (event: Event) => {
        event.preventDefault();
        editCurrentPost.mutate(postData);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    };

    return {
        postData,
        handleSubmit,
        handleChange,
    };
};

export default useEditPostForm