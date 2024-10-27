import DefaultContainer from "@components/shared/DefaultContainer";
import PostQuery from "../components/query/post/PostQuery"
import UserQuery from "../components/query/user/UserQuery";
import SearchBar from "../components/base/SearchBar";
import useSearch from "./hooks/useSearch";

function SearchContainer() {

    const searchMethods = useSearch();

    const resultAppliedStyle = searchMethods.focused ? { display: 'block' } : { display: 'none' };
    const searchAppliedStyle = searchMethods.focused ? { boxShadow: '0 4px 8px -4px rgba(72, 72, 72, 0.3)' } : {};

    return (
        <DefaultContainer>
            <SearchBar {...searchMethods} style={searchAppliedStyle} />
            <UserQuery {...searchMethods} style={resultAppliedStyle} />
            <PostQuery{...searchMethods} />
        </DefaultContainer>
    );
}

export default SearchContainer;