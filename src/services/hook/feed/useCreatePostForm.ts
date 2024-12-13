import useUserQueries from "@/api/queries/userQueries";
import { PollRequest, PostRequest } from "@/api/schemas/inferred/post";
import { useCreatePost } from "@/services/data/usePostData";
import { ConsumerFn } from "@/types/genericTypes";
import { getOffsetDateTime } from "@/utils/dateUtils";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { useState } from "react";

/**
 * Interface representing the visibility options for a poll.
 *
 * @interface PollView
 * @property {boolean} enabled - Indicates if the poll is enabled.
 * @property {boolean} extraOption - Indicates if an extra option is available for the poll.
 */
export interface PollView {
    enabled: boolean;
    extraOption: boolean;
}

/**
 * Custom hook for managing the state and logic of a post creation form.
 *
 * This hook handles the input state for a new post, including text, title, view access,
 * photo uploads, and poll options.
 *
 * @param {ConsumerFn} toggleForm - Function to toggle the visibility of the form.
 * @returns {{
 *     postData: PostRequest,                       // The current state of the post data.
 *     pollView: PollView,                          // The current state of the poll view options.
 *     previewUrl: string | ArrayBuffer | null,     // The URL for the image preview.
 *     handleChange: (event: React.ChangeEvent<any>) => void, // Handler for input changes.
 *     handleSubmit: (event: SubmitEvent) => Promise<void>,   // Handler for form submission.
 *     handleViewSelect: (option: "friends" | "anyone") => void, // Handler for selecting view access.
 *     handleFileChange: (photoData: File | null) => void,      // Handler for file input changes.
 *     togglePoll: () => void,                                 // Function to toggle the poll view.
 *     avatarPlaceholder: string,                             // Placeholder for the user's avatar.
 *     addPost: object,                                      // Object containing the mutation function for adding a post.
 *     viewAccessOptions: string[]                            // Available options for post visibility.
 * }} - An object containing the post creation form state and handler functions.
 */
const useCreatePostForm = (toggleForm: ConsumerFn) => {
    const { getSignedUserElseThrow } = useUserQueries();
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
        setPostData((prevState) => ({ ...prevState, photoData }));
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        if (photoData) reader.readAsDataURL(photoData);
    };

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