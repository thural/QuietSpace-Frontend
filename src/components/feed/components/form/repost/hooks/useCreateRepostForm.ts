import { getSignedUser } from "@/api/queries/userQueries";
import { Post, RepostBody } from "@/api/schemas/inferred/post";
import { useCreateRepost } from "@/services/data/usePostData";
import { ConsumerFn } from "@/types/genericTypes";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { useState } from "react";

const useCreateRepostForm = (toggleForm: ConsumerFn, post: Post) => {

    const signedUser = getSignedUser();


    const [repostData, setRepostData] = useState<RepostBody>({ text: "", postId: post.id });
    const handleChange = (event: React.ChangeEvent<any>) => {
        const { name, value } = event.target;
        setRepostData({ ...repostData, [name]: value });
    };


    const addRepost = useCreateRepost(toggleForm);
    const handleSubmit = () => addRepost.mutate(repostData);


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