import { PagedUserResponse, UserListResponse } from "@/api/schemas/user";
import { UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";

const useUserConnection = (userFetch: UseQueryResult<PagedUserResponse>) => {

    if (userFetch.data === undefined) throw new Error("some error...");

    const [queryResult, setQueryResult] = useState<UserListResponse>(userFetch.data.content);


    const filterByQuery = (value: string): UserListResponse => {
        return userFetch.data.content
            .filter(f => (f.username.includes(value) || f.email.includes(value)));
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value;
        if (value.length) {
            setQueryResult(filterByQuery(value));
        } else {
            setQueryResult(userFetch.data.content);
        }
    }

    const handleItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        // TODO: implement and call follow feature
    }

    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.preventDefault();
        // TODO: handle query input focus
    }

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        event.preventDefault();
        // TODO: setFocused(false);
    }


    return {
        queryResult,
        handleInputChange,
        handleItemClick,
        handleInputFocus,
        handleInputBlur
    }
}

export default useUserConnection