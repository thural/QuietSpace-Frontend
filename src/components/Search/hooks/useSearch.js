import { useEffect, useRef, useState } from "react";
import { useQueryPosts } from "../../../hooks/usePostData";
import { useQueryUsers } from "../../../hooks/useUserData";

const useSearch = () => {
    const queryInputRef = useRef();
    const [focused, setFocused] = useState(false);
    const [userQueryList, setUserQueryResult] = useState([]);
    const [postQueryResult, setPostQueryResult] = useState([]);
    const fetchUserQuery = useQueryUsers(setUserQueryResult);
    const fetchPostQuery = useQueryPosts(setPostQueryResult);

    useEffect(() => {
        fetchUserQuery.mutate(".");
    }, []);

    useEffect(() => {
        if (!userQueryList.length) setFocused(false);
    }, [userQueryList]);

    const handleInputChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        if (value.length) {
            setFocused(true);
            fetchUserQuery.mutate(value);
        } else {
            setFocused(false);
            setUserQueryResult([]);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') setFocused(false);
        if (!queryInputRef.current.value.length) return;
        if (event.key === 'Enter') fetchPostQuery.mutate(queryInputRef.current.value);
    };

    const handleInputFocus = (event) => {
        if (event.target.value.length) setFocused(true);
    };

    const handleInputBlur = () => {
        // TODO: implement logic to handle blur events
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