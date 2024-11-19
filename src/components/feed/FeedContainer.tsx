import DefaultContainer from "@/components/shared/DefaultContainer";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import Overlay from "@/components/shared/Overlay";
import Typography from "@/components/shared/Typography";
import useFeed from "@/services/hook/feed/useFeed";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import CreatePostForm from "./form/CreatePostForm";
import CreatePostSection from "./fragments/CreatePostSection";
import PostListBox from "./post/PostList";

const FeedContainer = () => {

    let data = undefined;

    try {
        data = useFeed();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading feed data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const { user, posts, isOverlayOpen, toggleOverlay } = data;

    if (posts.isLoading) return <FullLoadingOverlay />;
    if (posts.isError) return <Typography type="h1">{posts.error.message}</Typography>;


    return (
        <DefaultContainer>
            <CreatePostSection user={user} handleClick={toggleOverlay} />
            <hr />
            <Overlay onClose={toggleOverlay} isOpen={isOverlayOpen}>
                <CreatePostForm toggleForm={toggleOverlay} />
            </Overlay>
            <PostListBox posts={posts} />
        </DefaultContainer>
    );
}

export default withErrorBoundary(FeedContainer);