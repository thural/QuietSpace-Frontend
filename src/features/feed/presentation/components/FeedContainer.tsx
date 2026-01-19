import DefaultContainer from "@/shared/DefaultContainer";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import Overlay from "@/shared/Overlay";
import useFeed from "@/services/hook/feed/useFeed";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import InfinateScrollContainer from "@/shared/InfinateScrollContainer";
import LoaderStyled from "@/shared/LoaderStyled";
import CreatePostForm from "./forms/CreatePostForm";
import ToggleFormSection from "./fragments/ToggleFormSection";
import PostListBox from "./post/PostList";

/**
 * FeedContainer component.
 * 
 * This component serves as the main container for displaying the user's feed. 
 * It fetches feed data, handles loading and error states, and manages the overlay 
 * for creating new posts. The component is designed to display a list of posts 
 * with infinite scrolling capabilities.
 * 
 * @returns {JSX.Element} - The rendered FeedContainer component, which may display 
 *                          an error message, loading indicator, or the user's feed.
 */
const FeedContainer = () => {
    let data = undefined;

    try {
        // Fetch feed data using the custom hook
        data = useFeed();
    } catch (error: unknown) {
        console.error(error);
        // Handle error during data fetching
        const errorMessage = `error loading feed data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const { user, posts, isOverlayOpen, toggleOverlay } = data;

    // Render a loading indicator if posts are loading or undefined
    if (posts.isLoading || posts === undefined) return <LoaderStyled />;

    // Render an error component if there was an error fetching posts
    if (posts.isError) return <ErrorComponent message={posts.error.message} />;

    // Flatten the pages of posts into a single array
    const content = posts.data?.pages.flatMap((page) => page.content);

    // Component for rendering the list of posts with infinite scrolling
    const PostList: React.FC<GenericWrapper> = ({ posts }) => (
        <InfinateScrollContainer
            isFetchingNextPage={posts.isFetchingNextPage}
            hasNextPage={posts.hasNextPage}
            fetchNextPage={posts.fetchNextPage}
        >
            <PostListBox posts={posts} isLoading={posts.isLoading} />
        </InfinateScrollContainer>
    );

    // Component for rendering the main content area with a toggle for creating posts
    const MainContent: React.FC<GenericWrapper> = ({ user, children }) => (
        <DefaultContainer>
            <ToggleFormSection user={user} handleClick={toggleOverlay} />
            <hr />
            <Overlay onClose={toggleOverlay} isOpen={isOverlayOpen}>
                <CreatePostForm toggleForm={toggleOverlay} />
            </Overlay>
            {children}
        </DefaultContainer>
    );

    // If posts are undefined, return the MainContent without the PostList
    if (posts === undefined) return <MainContent user={user} />;

    // Render the main content with the list of posts
    return (
        <MainContent user={user}>
            <PostList posts={content} />
        </MainContent>
    );
}

export default withErrorBoundary(FeedContainer);