import { useCreatePost } from "@/hooks/data/usePostData";
import { useQueryClient } from "@tanstack/react-query";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { useState } from "react";

const useCreatePostForm = () => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const addPost = useCreatePost();

    const [postData, setPostData] = useState({
        text: "",
        userId: user.id,
        viewAccess: 'friends',
        poll: null
    });

    const [pollView, setPollView] = useState({ enabled: false, extraOption: false });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const poll = { dueDate: null, options: [] };
        Object.entries(postData).forEach(([key, value]) => {
            if (key.includes("option")) poll.options.push(value);
        });
        const requestBody = poll.options.length ? { ...postData, poll } : postData;
        addPost.mutate(requestBody);
    };

    const viewAccessOptions = ["friends", "anyone"];

    const handleViewSelect = (option) => {
        setPostData({ ...postData, viewAccess: option });
    };

    const handleReplySelect = (option) => {
        setPostData({ ...postData, replyAccess: option });
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
        handleReplySelect,
        togglePoll,
        avatarPlaceholder,
        addPost,
        viewAccessOptions,
    };
};

export default useCreatePostForm;