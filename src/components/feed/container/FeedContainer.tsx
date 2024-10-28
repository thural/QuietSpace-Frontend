import Conditional from "@/components/shared/Conditional";
import DefaultContainer from "@/components/shared/DefaultContainer";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import Typography from "@/components/shared/Typography";
import CreatePostSection from "../components/input/CreatePostSection";
import CreatePostForm from "../components/form/post/CreatePostForm";
import PostListBox from "../components/list/PostList";
import useFeed from "./hooks/useFeed";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";

function FeedContainer() {

    let data = undefined;

    try {
        data = useFeed();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading feed data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const { user, createPostView, posts, toggleCreatePostForm } = data;

    if (posts.isLoading) return <FullLoadingOverlay />;
    if (posts.isError) return <Typography type="h1">{posts.error.message}</Typography>;


    return (
        <DefaultContainer>
            <CreatePostSection user={user} handleClick={toggleCreatePostForm} />
            <hr />
            <Conditional isEnabled={createPostView}>
                <CreatePostForm />
            </Conditional>
            <PostListBox posts={posts} />
        </DefaultContainer>
    );
}

export default withErrorBoundary(FeedContainer);