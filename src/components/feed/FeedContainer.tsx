import DefaultContainer from "@/components/shared/DefaultContainer";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import Overlay from "@/components/shared/Overlay";
import useFeed from "@/services/hook/feed/useFeed";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import InfinateScrollContainer from "@components//shared/InfinateScrollContainer";
import LoaderStyled from "../shared/LoaderStyled";
import CreatePostForm from "./form/CreatePostForm";
import ToggleFormSection from "./fragments/ToggleFormSection";
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

    if (posts.isLoading || posts === undefined) return <LoaderStyled />;
    if (posts.isError) return <ErrorComponent message={posts.error.message}></ErrorComponent>;

    const content = posts.data?.pages.flatMap((page) => page.content);


    const PostList: React.FC<GenericWrapper> = ({ posts }) => (
        <InfinateScrollContainer
            isFetchingNextPage={posts.isFetchingNextPage}
            hasNextPage={posts.hasNextPage}
            fetchNextPage={posts.fetchNextPage}
        >
            <PostListBox posts={posts} isLoading={posts.isLoading} />
        </InfinateScrollContainer>
    );

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

    if (posts === undefined) return <MainContent user={user} />

    return (
        <MainContent user={user}>
            <PostList posts={content} />
        </MainContent>
    );
}

export default withErrorBoundary(FeedContainer);