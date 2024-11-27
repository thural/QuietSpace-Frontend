import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { PostResponse, RepostRequest } from "@/api/schemas/inferred/post";
import { useCreateRepost } from "@/services/data/usePostData";
import { ConsumerFn } from "@/types/genericTypes";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { useState } from "react";

const useCreateRepostForm = (toggleForm: ConsumerFn, post: PostResponse) => {

    const signedUser = getSignedUserElseThrow();


    const [repostData, setRepostData] = useState<RepostRequest>({ text: "", postId: post.id });
    const handleChange = (event: React.ChangeEvent<any>) => {
        const { name, value } = event.target;
        setRepostData({ ...repostData, [name]: value });
    };

    const addRepost = useCreateRepost(toggleForm);
    const handleSubmit = (e: Event) => {
        e.stopPropagation();
        addRepost.mutate(repostData);
    };


    const avatarPlaceholder = toUpperFirstChar(signedUser?.username);

    return {
        signedUser,
        avatarPlaceholder,
        repostData,
        addRepost,
        handleChange,
        handleSubmit,
    };
};

export default useCreateRepostForm;