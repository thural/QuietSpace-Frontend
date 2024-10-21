import { UserListResponse } from "@/api/schemas/user";
import { useQueryPosts } from "@/hooks/usePostData";
import { useQueryUsers } from "@/hooks/useUserData";
import { useEffect, useRef, useState } from "react";

const useSearch = () => {

    const queryInputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    const [userQueryList, setUserQueryResult] = useState<UserListResponse>([]);
    const [postQueryResult, setPostQueryResult] = useState([]);
    const fetchUserQuery = useQueryUsers(setUserQueryResult);
    const fetchPostQuery = useQueryPosts(setPostQueryResult);


    const initUserQuery = () => {
        // TODO: limit to few page requests
        fetchUserQuery.mutate(".");
    }
    useEffect(initUserQuery, []);


    const unfocusOnEmptyList = () => {
        if (!userQueryList.length) setFocused(false);
    }
    useEffect(unfocusOnEmptyList, [userQueryList]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const stringValue = event.target.value;
        if (stringValue.length) {
            setFocused(true);
            fetchUserQuery.mutate(stringValue);
        } else {
            setFocused(false);
            setUserQueryResult([]);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') setFocused(false);
        if (queryInputRef.current === null || !queryInputRef.current.value.length) return;
        if (event.key === 'Enter') fetchPostQuery.mutate(queryInputRef.current.value);
    };

    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.value.length) setFocused(true);
    };

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        // TODO: implement logic to handle input blur events
        console.log("(!) unhandled input blur event", event.target.value)
    };


    return {
        queryInputRef,
        focused,
        userQueryList,
        postQueryResult,
        handleInputChange,
        handleKeyDown,
        handleInputFocus,
        handleInputBlur,
        setUserQueryResult,
        setPostQueryResult,
        fetchPostQuery,
        fetchUserQuery
    };
};

export default useSearch;