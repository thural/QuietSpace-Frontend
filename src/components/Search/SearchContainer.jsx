import React from "react";
import DefaultContainer from "../Shared/DefaultContainer";
import PostQuery from "./PostQuery";
import SearchBar from "./SearchBar";
import UserQuery from "./UserQuery";
import useSearch from "./hooks/useSearch";
import styles from "./styles/searchContainerStyles";

function SearchContainer() {
    const classes = styles();
    const {
        queryInputRef,
        focused,
        userQueryList,
        postQueryResult,
        handleInputChange,
        handleKeyDown,
        handleInputFocus,
        handleInputBlur,
        handleItemClick,
        fetchPostQuery,
        fetchUserQuery
    } = useSearch();

    const resultAppliedStyle = focused ? { display: 'block' } : { display: 'none' };
    const searchAppliedStyle = focused ? { boxShadow: '0 4px 8px -4px rgba(72, 72, 72, 0.3)' } : {};

    return (
        <DefaultContainer>
            <SearchBar
                handleInputChange={handleInputChange}
                handleInputFocus={handleInputFocus}
                handleInputBlur={handleInputBlur}
                handleKeyDown={handleKeyDown}
                queryInputRef={queryInputRef}
                style={searchAppliedStyle}
            />
            <UserQuery
                handleItemClick={handleItemClick}
                fetchUserQuery={fetchUserQuery}
                userQueryList={userQueryList}
                style={resultAppliedStyle}
            />
            <PostQuery
                fetchPostQuery={fetchPostQuery}
                postQueryResult={postQueryResult}
            />
        </DefaultContainer>
    );
}

export default SearchContainer;