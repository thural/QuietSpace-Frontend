import { useCreatePost } from "@/services/data/usePostData";
import { useQueryClient } from "@tanstack/react-query";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { useState } from "react";
import { PollBody, PostBody } from "@/api/schemas/inferred/post";
import { nullishValidationdError } from "@/utils/errorUtils";
import { User } from "@/api/schemas/inferred/user";

export interface PollView { enabled: boolean, extraOption: boolean }

const useCreatePostForm = () => {

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    if (!user) throw nullishValidationdError({ user });
    const addPost = useCreatePost();

    const viewAccessOptions = ["friends", "anyone"];

    const [postData, setPostData] = useState<PostBody>({
        text: "",
        userId: user.id,
        viewAccess: 'all',
        poll: null
    });

    const [pollView, setPollView] = useState<PollView>({ enabled: false, extraOption: false });



    const handleChange = (event: React.ChangeEvent<any>) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    };

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();

        const poll: PollBody = { dueDate: String(new Date), options: [] };

        Object.entries(postData).forEach(([key, value]: any) => {
            if (key.includes("option")) poll.options.push(value);
        });

        const requestBody: PostBody = poll.options.length ? { ...postData, poll } : postData;
        addPost.mutate(requestBody);
    };

    const handleViewSelect = (option: "friends" | "all") => {
        setPostData({ ...postData, viewAccess: option });
    };

    const togglePoll = () => {
        setPollView({ ...pollView, enabled: !pollView.enabled });
    };

    const avatarPlaceholder = toUpperFirstChar(user.username);

    return {
        postData,
        pollView,
        handleChange,
        handleSubmit,
        handleViewSelect,
        togglePoll,
        avatarPlaceholder,
        addPost,
        viewAccessOptions,
    };
};

export default useCreatePostForm;