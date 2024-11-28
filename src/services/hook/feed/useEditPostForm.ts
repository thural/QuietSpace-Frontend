import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { ResId } from "@/api/schemas/inferred/common";
import { PollRequest, PostRequest } from "@/api/schemas/inferred/post";
import { useEditPost, useGetPostById } from "@/services/data/usePostData";
import { ConsumerFn } from "@/types/genericTypes";
import { nullishValidationdError } from "@/utils/errorUtils";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { useState } from "react";


const useEditPostForm = (postId: ResId, toggleForm: ConsumerFn) => {

    const { data: editedPost, isLoading, isError } = useGetPostById(postId);
    if (editedPost === undefined) throw nullishValidationdError({ editedPost });

    const pollData: PollRequest | null = editedPost.poll ? {
        options: editedPost.poll.options.map(option => option.label),
        dueDate: editedPost.poll.dueDate
    } : null;

    const requestBody: PostRequest = {
        title: editedPost.title,
        text: editedPost.text,
        userId: editedPost.userId,
        poll: pollData,
        viewAccess: "all"
    }

    const [postData, setPostData] = useState<PostRequest>(requestBody);
    const editCurrentPost = useEditPost(postId, toggleForm);

    const handleSubmit = (event: Event) => {
        event.preventDefault();
        editCurrentPost.mutate(postData);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    };

    const signedUser = getSignedUserElseThrow();
    const avatarPlaceholder = toUpperFirstChar(signedUser.username);

    return {
        postData,
        isError,
        isLoading,
        editCurrentPost,
        handleSubmit,
        handleChange,
        signedUser,
        avatarPlaceholder
    };
};

export default useEditPostForm