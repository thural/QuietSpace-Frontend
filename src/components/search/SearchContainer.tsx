import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import DefaultContainer from "@components/shared/DefaultContainer";
import SearchBar from "./base/SearchBar";
import PostQuery from "./query/PostQuery";
import UserQuery from "./query/UserQuery";
import useSearch from "@/services/hook/search/useSearch";

function SearchContainer() {

    let searchMethods = undefined;


    try {
        searchMethods = useSearch();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `could not load search data: ${(error as Error).message}`
        return <ErrorComponent message={errorMessage} />;
    }


    const resultAppliedStyle = searchMethods.focused ? { display: 'block' } : { display: 'none' };
    const searchAppliedStyle = searchMethods.focused ? { boxShadow: '0 4px 8px -4px rgba(72, 72, 72, 0.3)' } : {};

    return (
        <DefaultContainer>
            <SearchBar {...searchMethods} style={searchAppliedStyle} />
            <UserQuery {...searchMethods} style={resultAppliedStyle} />
            <PostQuery {...searchMethods} />
        </DefaultContainer>
    );
}

export default withErrorBoundary(SearchContainer);