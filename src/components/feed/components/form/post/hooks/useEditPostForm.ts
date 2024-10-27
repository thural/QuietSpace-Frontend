import { ResId } from "@/api/schemas/inferred/common";
import { PollBody, Post, PostBody, PostPage } from "@/api/schemas/inferred/post";
import { useEditPost } from "@/services/data/usePostData";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const useEditPostForm = (postId: ResId) => {

    const queryClient = useQueryClient();
    const posts: PostPage | undefined = queryClient.getQueryData(["posts"]);

    if (posts === undefined) throw nullishValidationdError({ posts });

    const editedPost: Post | undefined = posts.content.find(post => post.id === postId);

    if (editedPost === undefined) throw nullishValidationdError({ editedPostData: editedPost });

    const pollData: PollBody = {
        options: editedPost.poll.options.map(option => option.label),
        dueDate: editedPost.poll.dueDate
    }

    const requestBody: PostBody = {
        text: editedPost.text,
        userId: editedPost.userId,
        poll: pollData,
        viewAccess: "all"
    }

    const [postData, setPostData] = useState<PostBody>(requestBody);
    const editCurrentPost = useEditPost(postId);

    const handleSubmit = (event: Event) => {
        event.preventDefault();
        editCurrentPost.mutate(postData);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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