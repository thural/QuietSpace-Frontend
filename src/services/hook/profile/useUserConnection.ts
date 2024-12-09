import { UserList, UserPage } from "@/api/schemas/inferred/user";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useState } from "react";

const useUserConnection = (userFetch: UseInfiniteQueryResult<InfiniteData<UserPage>>) => {

    if (userFetch.data === undefined) throw new Error("userfetch data is undefined");;
    const content = userFetch.data?.pages.flatMap((page) => page.content);
    const [queryResult, setQueryResult] = useState<UserList>(content);


    const filterByQuery = (value: string): UserList => {
        return content.filter(f => (f.username.includes(value) || f.email.includes(value)));
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value;
        if (value.length) {
            setQueryResult(filterByQuery(value));
        } else {
            setQueryResult(content);
        }
    }

    const handleItemClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("connections item was clicked");
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