import Conditional from "@/components/shared/Conditional";
import DefaultContainer from "@/components/shared/DefaultContainer";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import Typography from "@/components/shared/Typography";
import CreatePostSection from "../components/input/CreatePostSection";
import CreatePostForm from "../components/form/post/CreatePostForm";
import PostList from "../components/list/PostList";
import useFeed from "./hooks/useFeed";

function FeedContainer() {
    const { user, createPostView, posts, showCreatePostForm } = useFeed();

    if (posts.isLoading) return <FullLoadingOverlay />;
    if (posts.isError) return <Typography type="h1">{posts.error.message}</Typography>;


    return (
        <DefaultContainer>
            <CreatePostSection user={user} handleClick={showCreatePostForm} />
            <hr />
            <Conditional isEnabled={createPostView}>
                <CreatePostForm />
            </Conditional>
            <PostList posts={posts} />
        </DefaultContainer>
    );
}

export default FeedContainer;