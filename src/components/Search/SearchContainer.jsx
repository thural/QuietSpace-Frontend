import DefaultContainer from "@shared/DefaultContainer";
import React from "react";
import PostQuery from "./components/PostQuery/PostQuery";
import QueryResult from "./components/QueryResult/QueryResult";
import SearchBar from "./components/SearchBar/SearchBar";
import useSearch from "./hooks/useSearch";

function SearchContainer() {

    const {
        queryInputRef,
        focused,
        userQueryList,
        postQueryResult,
        handleInputChange,
        handleKeyDown,
        handleInputFocus,
        handleInputBlur,
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
            <QueryResult
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