import DefaultContainer from "@/components/shared/DefaultContainer";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import Overlay from "@/components/shared/Overlay";
import useFeed from "@/services/hook/feed/useFeed";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import LoaderStyled from "../shared/LoaderStyled";
import CreatePostForm from "./form/CreatePostForm";
import ToggleFormSection from "./fragments/ToggleFormSection";
import InfinateScrollContainer from "@components//shared/InfinateScrollContainer";
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

    if (posts.isLoading) return <LoaderStyled />;
    if (posts.isError) return <ErrorComponent message={posts.error.message}></ErrorComponent>;

    const content = posts.data?.pages.flatMap((page) => page.content);

    return (
        <DefaultContainer>
            <ToggleFormSection user={user} handleClick={toggleOverlay} />
            <hr />
            <Overlay onClose={toggleOverlay} isOpen={isOverlayOpen}>
                <CreatePostForm toggleForm={toggleOverlay} />
            </Overlay>
            <InfinateScrollContainer
                isFetchingNextPage={posts.isFetchingNextPage}
                hasNextPage={posts.hasNextPage}
                fetchNextPage={posts.fetchNextPage}
            >
                <PostListBox posts={content} isLoading={posts.isLoading} />
            </InfinateScrollContainer>
        </DefaultContainer>
    );
}

export default withErrorBoundary(FeedContainer);