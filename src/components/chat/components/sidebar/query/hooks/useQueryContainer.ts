import { User } from "@/api/schemas/inferred/user";
import { useQueryUsers } from "@/services/data/useUserData";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";


const useQueryContainer = () => {

    const [focused, setFocused] = useState(false);
    const [queryResult, setQueryResult] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    if (user === undefined) throw nullishValidationdError({ user });

    const makeQueryMutation = useQueryUsers(setQueryResult);

    const handleItemClick = async (event: React.MouseEvent, clickedUser: User) => {
        event.preventDefault();
        // TODO: handle new chat by pushing to ocal cache
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleKeyDown = (event: React.KeyboardEvent) => { if (event.key === 'Escape') setFocused(false) };
    const handleInputFocus = () => setFocused(true);
    const handleInputBlur = () => setFocused(false);

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