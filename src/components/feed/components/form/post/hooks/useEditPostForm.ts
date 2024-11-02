import { ResId } from "@/api/schemas/inferred/common";
import { PollBody, PostBody } from "@/api/schemas/inferred/post";
import { useEditPost, useGetPostById } from "@/services/data/usePostData";
import { ConsumerFn } from "@/types/genericTypes";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useState } from "react";


const useEditPostForm = (postId: ResId, toggleForm: ConsumerFn) => {

    const { data: editedPost, isLoading, isError } = useGetPostById(postId);
    if (editedPost === undefined) throw nullishValidationdError({ editedPost });

    const pollData: PollBody | null = editedPost.poll ? {
        options: editedPost.poll.options.map(option => option.label),
        dueDate: editedPost.poll.dueDate
    } : null;

    const requestBody: PostBody = {
        text: editedPost.text,
        userId: editedPost.userId,
        poll: pollData,
        viewAccess: "all"
    }

    const [postData, setPostData] = useState<PostBody>(requestBody);
    const editCurrentPost = useEditPost(postId, toggleForm);

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
        isError,
        isLoading,
        handleSubmit,
        handleChange
    };
};

export default useEditPostForm