import { UserList, UserPage } from "@/api/schemas/inferred/user";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Custom hook for managing user connections and filtering user lists.
 *
 * This hook allows for filtering users based on input queries and handles
 * interactions with the user list. It extracts user data from the provided
 * infinite query result and provides functions to manage user interactions.
 *
 * @param {UseInfiniteQueryResult<InfiniteData<UserPage>>} userFetch - The infinite query result containing user data.
 * @throws {Error} Throws an error if userFetch data is undefined.
 * @returns {{
 *     queryResult: UserList,                          // The filtered list of users based on the current query.
 *     handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void, // Handler for input changes.
 *     handleItemClick: (event: React.MouseEvent) => void, // Handler for user item clicks.
 *     handleInputFocus: (event: React.FocusEvent<HTMLInputElement>) => void, // Handler for input focus events.
 *     handleInputBlur: (event: React.FocusEvent<HTMLInputElement>) => void   // Handler for input blur events.
 * }} - An object containing the current user list and handler functions.
 */
const useUserConnection = (userFetch: UseInfiniteQueryResult<InfiniteData<UserPage>>) => {
    if (userFetch.data === undefined) throw new Error("userFetch data is undefined");

    const content = userFetch.data?.pages.flatMap((page) => page.content);
    const [queryResult, setQueryResult] = useState<UserList>(content);

    /**
     * Filters the user list based on the input query.
     *
     * @param {string} value - The string value to filter users by.
     * @returns {UserList} - The filtered list of users.
     */
    const filterByQuery = (value: string): UserList => {
        return content.filter(f => (f.username.includes(value) || f.email.includes(value)));
    }

    /**
     * Handles changes to the input field for user queries.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input.
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value;
        if (value.length) {
            setQueryResult(filterByQuery(value));
        } else {
            setQueryResult(content);
        }
    }

    /**
     * Handles clicks on user connection items.
     *
     * @param {React.MouseEvent} event - The mouse event triggered by the item click.
     */
    const handleItemClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("connections item was clicked");
        // TODO: implement and call follow feature
    }

    /**
     * Handles focus events on the input field.
     *
     * @param {React.FocusEvent<HTMLInputElement>} event - The focus event triggered by the input.
     */
    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.preventDefault();
        // TODO: handle query input focus
    }

    /**
     * Handles blur events on the input field.
     *
     * @param {React.FocusEvent<HTMLInputElement>} event - The blur event triggered by the input.
     */
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

export default useUserConnection;