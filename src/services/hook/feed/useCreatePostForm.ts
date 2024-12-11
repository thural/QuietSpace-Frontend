import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { PollRequest, PostRequest } from "@/api/schemas/inferred/post";
import { useCreatePost } from "@/services/data/usePostData";
import { ConsumerFn } from "@/types/genericTypes";
import { getOffsetDateTime } from "@/utils/dateUtils";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { useState } from "react";

export interface PollView { enabled: boolean, extraOption: boolean }

const useCreatePostForm = (toggleForm: ConsumerFn) => {

    const user = getSignedUserElseThrow();
    const viewAccessOptions = ["friends", "anyone"];
    const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>(null);
    const [pollView, setPollView] = useState<PollView>({ enabled: false, extraOption: false });
    const [postData, setPostData] = useState<PostRequest>({
        text: "",
        title: "",
        userId: user.id,
        viewAccess: 'anyone',
        poll: null,
        photoData: null
    });


    const handleChange = (event: React.ChangeEvent<any>) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    };

    const handleFileChange = (photoData: File | null) => {
        setPostData((prevState) => ({ ...prevState, photoData, }));
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        if (photoData) reader.readAsDataURL(photoData);
    }

    const handleViewSelect = (option: "friends" | "anyone") => {
        setPostData({ ...postData, viewAccess: option });
    };

    const togglePoll = () => {
        setPollView({ ...pollView, enabled: !pollView.enabled });
    };


    const addPost = useCreatePost(toggleForm);
    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        const formattedDate = getOffsetDateTime(810000);
        const poll: PollRequest = { dueDate: formattedDate, options: [] };

        Object.entries(postData).forEach(([key, value]: any) => {
            if (key.includes("option")) poll.options.push(value);
        });

        const formData = new FormData();
        formData.append('userId', user.id.toString());
        formData.append('title', postData.title);
        formData.append('text', postData.text);

        if (poll.options.length) formData.append('poll', JSON.stringify(poll)); // TODO: test poll data on submit
        if (postData.photoData !== null) formData.append('photoData', postData.photoData);

        addPost.mutate(formData);
    };


    const avatarPlaceholder = toUpperFirstChar(user.username);

    return {
        postData,
        pollView,
        previewUrl,
        handleChange,
        handleSubmit,
        handleViewSelect,
        handleFileChange,
        togglePoll,
        avatarPlaceholder,
        addPost,
        viewAccessOptions,
    };
};

export default useCreatePostForm;