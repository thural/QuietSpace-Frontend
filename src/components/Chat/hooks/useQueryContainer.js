import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateChat } from "../../../hooks/useChatData";
import { useQueryUsers } from "../../../hooks/useUserData";

const useQueryContainer = () => {
    const [focused, setFocused] = useState(false);
    const [queryResult, setQueryResult] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const queryClient = useQueryClient();
    const createChatMutation = useCreateChat();
    const user = queryClient.getQueryData(["user"]);
    const makeQueryMutation = useQueryUsers(setQueryResult);

    const handleItemClick = async (event, clickedUser) => {
        event.preventDefault();
        const createdChatRequestBody = { "userIds": [user.id, clickedUser.id] };
        createChatMutation.mutate(createdChatRequestBody);
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        setFocused(true);
        if (value.length) handleQuerySubmit(value);
        else setQueryResult([]);
    };

    const handleQuerySubmit = async (value) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        makeQueryMutation.mutate(value);
        setTimeout(() => { setIsSubmitting(false); }, 1000);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') setFocused(false);
    };

    const handleInputFocus = () => {
        setFocused(true);
    };

    const handleInputBlur = () => {
        setFocused(false);
    };

    const appliedStyle = (!focused) ? { display: 'none' } : { display: 'block' };
    const inputProps = { handleInputFocus, handleInputBlur, handleKeyDown, handleInputChange };

    return {
        focused,
        queryResult,
        isSubmitting,
        handleItemClick,
        handleInputChange,
        handleQuerySubmit,
        handleKeyDown,
        handleInputFocus,
        handleInputBlur,
        appliedStyle,
        inputProps,
        makeQueryMutation,
    };
};

export default useQueryContainer;