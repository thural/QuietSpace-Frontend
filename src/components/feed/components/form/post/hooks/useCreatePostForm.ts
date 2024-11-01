import { useCreatePost } from "@/services/data/usePostData";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { useState } from "react";
import { PollBody, PostBody } from "@/api/schemas/inferred/post";
import { nullishValidationdError } from "@/utils/errorUtils";
import { getSignedUser } from "@/api/queries/userQueries";
import { format } from 'date-fns'

export interface PollView { enabled: boolean, extraOption: boolean }

const useCreatePostForm = () => {

    const user = getSignedUser();
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

        const now = 81000 + +new Date();
        const formattedDate = format(now, "yyyy-MM-dd'T'HH:mm:ssXXX");

        const poll: PollBody = { dueDate: formattedDate, options: [] };

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