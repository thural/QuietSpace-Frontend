import { getPostById, getPosts } from "@/api/queries/postQueries";
import { ResId } from "@/api/schemas/inferred/common";
import { PollRequest, PostResponse, PostRequest } from "@/api/schemas/inferred/post";
import { useEditPost } from "@/services/data/usePostData";
import { assertNullisValues } from "@/utils/errorUtils";
import { useState } from "react";

const useEditCommentForm = (postId: ResId) => {

    const posts = getPosts();
    if (posts === undefined) throw assertNullisValues({ posts });

    const editedPost: PostResponse | undefined = getPostById(postId);

    if (editedPost === undefined) throw assertNullisValues({ editedPostData: editedPost });

    const pollData: PollRequest = {
        options: editedPost.poll.options.map(option => option.label),
        dueDate: editedPost.poll.dueDate
    }

    const requestBody: PostRequest = {
        text: editedPost.text,
        userId: editedPost.userId,
        poll: pollData,
        viewAccess: "all"
    }

    const [postData, setPostData] = useState<PostRequest>(requestBody);
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

export default useEditCommentForm