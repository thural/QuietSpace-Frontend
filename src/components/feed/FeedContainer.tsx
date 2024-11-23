import { Page } from "@/api/schemas/inferred/common";
import { Post } from "@/api/schemas/inferred/post";
import DefaultContainer from "@/components/shared/DefaultContainer";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import Overlay from "@/components/shared/Overlay";
import Typography from "@/components/shared/Typography";
import useFeed from "@/services/hook/feed/useFeed";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import CreatePostForm from "./form/CreatePostForm";
import ToggleFormSection from "./fragments/ToggleFormSection";
import PostListBox from "./post/PostList";
import DarkButton from "../shared/buttons/DarkButton ";
import LoaderStyled from "../shared/LoaderStyled";
import Conditional from "../shared/Conditional";

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

    console.log("paged data: ", posts.data?.pages);

    const pageReducer = (accumulator: Array<Post>, currentValue: Page<Post>): Array<Post> => {
        return [...accumulator, currentValue.content];
    };

    const content = posts.data?.pages.reduce(pageReducer, []);

    console.log("content: ", content);


    return (
        <DefaultContainer>
            <ToggleFormSection user={user} handleClick={toggleOverlay} />
            <hr />
            <Overlay onClose={toggleOverlay} isOpen={isOverlayOpen}>
                <CreatePostForm toggleForm={toggleOverlay} />
            </Overlay>
            <PostListBox posts={posts} />
            <DarkButton disabled={!posts.hasNextPage} name="load more" onClick={posts.fetchNextPage} />
            <Conditional isEnabled={posts.isFetchingNextPage}>
                <LoaderStyled />
            </Conditional>
        </DefaultContainer>
    );
}

export default withErrorBoundary(FeedContainer);