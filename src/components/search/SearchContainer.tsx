import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import DefaultContainer from "@components/shared/DefaultContainer";
import SearchBar from "./base/SearchBar";
import PostQuery from "./query/PostQuery";
import UserQuery from "./query/UserQuery";
import useSearch from "@/services/hook/search/useSearch";

/**
 * SearchContainer component.
 * 
 * This component manages the search functionality of the application. It utilizes a custom hook to fetch
 * search-related data and renders a search bar along with user and post query results. It handles errors
 * that may occur during the data fetching process.
 * 
 * @returns {JSX.Element} - The rendered SearchContainer component wrapped in error boundary handling.
 */
function SearchContainer() {
    let searchMethods = undefined;

    // Attempt to fetch search-related methods using a custom hook
    try {
        searchMethods = useSearch(); // Fetch search methods
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `could not load search data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />; // Display error component if fetching fails
    }

    // Apply conditional styles based on the search input focus state
    const resultAppliedStyle = searchMethods.focused ? { display: 'block' } : { display: 'none' };
    const searchAppliedStyle = searchMethods.focused ? { boxShadow: '0 4px 8px -4px rgba(72, 72, 72, 0.3)' } : {};

    return (
        <DefaultContainer>
            <SearchBar {...searchMethods} style={searchAppliedStyle} /> {/* Render search bar */}
            <UserQuery {...searchMethods} style={resultAppliedStyle} /> {/* Render user query results */}
            <PostQuery {...searchMethods} /> {/* Render post query results */}
        </DefaultContainer>
    );
}

export default withErrorBoundary(SearchContainer);