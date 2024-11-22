import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { PollBody, PostBody } from "@/api/schemas/inferred/post";
import { useCreatePost } from "@/services/data/usePostData";
import { ConsumerFn } from "@/types/genericTypes";
import { getOffsetDateTime } from "@/utils/dateUtils";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { useState } from "react";

export interface PollView { enabled: boolean, extraOption: boolean }

const useCreatePostForm = (toggleForm: ConsumerFn) => {

    const user = getSignedUserElseThrow();
    const viewAccessOptions = ["friends", "anyone"];

    const [postData, setPostData] = useState<PostBody>({
        text: "",
        title: "",
        userId: user.id,
        viewAccess: 'all',
        poll: null
    });

    const [pollView, setPollView] = useState<PollView>({ enabled: false, extraOption: false });

    const handleChange = (event: React.ChangeEvent<any>) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    };

    const handleViewSelect = (option: "friends" | "all") => {
        setPostData({ ...postData, viewAccess: option });
    };

    const togglePoll = () => {
        setPollView({ ...pollView, enabled: !pollView.enabled });
    };

    const addPost = useCreatePost(toggleForm);
    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        const formattedDate = getOffsetDateTime(810000);
        const poll: PollBody = { dueDate: formattedDate, options: [] };

        Object.entries(postData).forEach(([key, value]: any) => {
            if (key.includes("option")) poll.options.push(value);
        });

        const requestBody: PostBody = poll.options.length ? { ...postData, poll } : postData;
        addPost.mutate(requestBody);
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